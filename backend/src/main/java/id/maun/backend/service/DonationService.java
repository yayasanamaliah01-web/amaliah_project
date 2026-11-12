package id.maun.backend.service;

import id.maun.backend.dto.DonationDto;
import id.maun.backend.exception.ResourceNotFoundException;
import id.maun.backend.model.ActivityLog;
import id.maun.backend.model.BankMutation;
import id.maun.backend.model.Campaign;
import id.maun.backend.model.Donation;
import id.maun.backend.repository.ActivityLogRepository;
import id.maun.backend.repository.BankMutationRepository;
import id.maun.backend.repository.CampaignRepository;
import id.maun.backend.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DonationService {

    private final DonationRepository donationRepository;
    private final CampaignRepository campaignRepository;
    private final BankMutationRepository bankMutationRepository;
    private final ActivityLogRepository activityLogRepository;
    private final BankIntegrationService bankIntegrationService;
    private final SseNotificationService sseNotificationService;

    @Transactional
    public DonationDto.DonationResponse createDonation(DonationDto.CreateDonationRequest request) {
        Campaign campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new ResourceNotFoundException("Program donasi tidak ditemukan dengan ID: " + request.getCampaignId()));

        String trxId = "DON-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        String method = request.getPaymentMethod() != null ? request.getPaymentMethod().toUpperCase() : "QRIS";

        Donation donation = Donation.builder()
                .transactionId(trxId)
                .campaignId(campaign.getId())
                .campaignTitle(campaign.getTitle())
                .donorName(request.getDonorName())
                .donorEmail(request.getDonorEmail())
                .donorPhone(request.getDonorPhone())
                .isAnonymous(Boolean.TRUE.equals(request.getIsAnonymous()))
                .amount(request.getAmount())
                .doa(request.getDoa())
                .paymentMethod(method)
                .paymentChannel(request.getPaymentChannel() != null ? request.getPaymentChannel() : "BSI")
                .status("PENDING")
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .createdAt(LocalDateTime.now())
                .build();

        if ("QRIS".equalsIgnoreCase(method)) {
            Map<String, Object> qrisData = bankIntegrationService.generateQris(request.getAmount(), trxId);
            donation.setQrisString((String) qrisData.get("qrContent"));
            donation.setQrCodeUrl((String) qrisData.get("qrImageUrl"));
        } else {
            // Virtual Account
            String vaNumber = "9988" + (System.currentTimeMillis() % 10000000000L);
            Map<String, Object> vaData = bankIntegrationService.createVirtualAccount(
                    vaNumber, request.getAmount(), request.getDonorName(), trxId);
            donation.setVaNumber((String) vaData.get("virtualAccountNo"));
        }

        Donation saved = donationRepository.save(donation);
        log.info("Created donation {} for amount {} via {}", trxId, request.getAmount(), method);

        return toResponse(saved);
    }

    public DonationDto.DonationResponse getDonation(String transactionId) {
        Donation donation = donationRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Donasi tidak ditemukan dengan kode transaksi: " + transactionId));
        return toResponse(donation);
    }

    public List<DonationDto.DonationResponse> getCampaignDonations(Long campaignId) {
        return donationRepository.findByCampaignIdAndStatusOrderByCreatedAtDesc(campaignId, "SUCCESS")
                .stream().map(this::toResponse).toList();
    }

    public List<DonationDto.DonationResponse> getRecentSuccessfulDonations() {
        return donationRepository.findTop10ByStatusOrderByCreatedAtDesc("SUCCESS")
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public boolean processPaymentCallback(Map<String, Object> payload) {
        try {
            log.info("Processing bank payment callback: {}", payload);
            String bankTxnId = (String) payload.get("transactionId");
            String paymentType = (String) payload.get("paymentType");

            @SuppressWarnings("unchecked")
            Map<String, Object> additionalInfo = (Map<String, Object>) payload.get("additionalInfo");
            String orderId = additionalInfo != null ? (String) additionalInfo.get("orderId") : null;

            @SuppressWarnings("unchecked")
            Map<String, Object> amountMap = (Map<String, Object>) payload.get("amount");
            BigDecimal amount = amountMap != null ? new BigDecimal((String) amountMap.get("value")) : BigDecimal.ZERO;

            if (orderId == null) {
                log.error("Payment callback missing orderId");
                return false;
            }

            Donation donation = donationRepository.findByTransactionId(orderId)
                    .orElse(null);

            if (donation == null) {
                log.warn("Donation not found for orderId: {}", orderId);
                return false;
            }

            if ("SUCCESS".equals(donation.getStatus())) {
                log.info("Donation {} already marked as SUCCESS", orderId);
                return true;
            }

            donation.setStatus("SUCCESS");
            donation.setPaidAt(LocalDateTime.now());
            donation.setBankTransactionId(bankTxnId);
            donationRepository.save(donation);

            // Update Campaign funds atomically & safely
            campaignRepository.incrementCollectedAmount(donation.getCampaignId(), amount);
            Campaign campaign = campaignRepository.findById(donation.getCampaignId()).orElse(null);

            // Record Bank Mutation (CREDIT / Uang Masuk)
            BankMutation mutation = BankMutation.builder()
                    .transactionId(bankTxnId != null ? bankTxnId : "TXN-" + System.currentTimeMillis())
                    .accountNumber("7711223344")
                    .type("CREDIT")
                    .amount(amount)
                    .description("Donasi Masuk via " + paymentType + " - " + donation.getDonorName())
                    .reference(orderId)
                    .category("DONASI_" + (paymentType != null ? paymentType : "QRIS"))
                    .relatedCampaignId(donation.getCampaignId())
                    .relatedCampaignTitle(donation.getCampaignTitle())
                    .isReconciled(true)
                    .transactionTimestamp(LocalDateTime.now())
                    .build();
            bankMutationRepository.save(mutation);

            // Record Activity Log for public transparency feed
            String actor = Boolean.TRUE.equals(donation.getIsAnonymous()) ? "Hamba Allah" : donation.getDonorName();
            ActivityLog logEntry = ActivityLog.builder()
                    .actionType("DONASI_MASUK")
                    .title("Donasi Masuk Rp " + String.format("%,d", amount.longValue()))
                    .description("Donasi dari " + actor + " untuk program: " + (campaign != null ? campaign.getTitle() : ""))
                    .amount(amount)
                    .campaignId(donation.getCampaignId())
                    .campaignTitle(donation.getCampaignTitle())
                    .actorName(actor)
                    .iconType("arrow-down-left")
                    .timestamp(LocalDateTime.now())
                    .build();
            activityLogRepository.save(logEntry);

            // Broadcast real-time SSE event to all connected clients
            Map<String, Object> eventData = Map.of(
                    "type", "DONATION_SUCCESS",
                    "orderId", orderId,
                    "amount", amount,
                    "campaignId", donation.getCampaignId(),
                    "campaignTitle", donation.getCampaignTitle() != null ? donation.getCampaignTitle() : "",
                    "donorName", actor,
                    "timestamp", LocalDateTime.now().toString()
            );
            sseNotificationService.broadcast("DONATION_SUCCESS", eventData);

            log.info("Donation {} successfully processed and updated campaign balance", orderId);
            return true;

        } catch (Exception e) {
            log.error("Error processing bank payment callback: {}", e.getMessage(), e);
            return false;
        }
    }

    public DonationDto.DonationResponse toResponse(Donation donation) {
        return DonationDto.DonationResponse.builder()
                .id(donation.getId())
                .transactionId(donation.getTransactionId())
                .campaignId(donation.getCampaignId())
                .campaignTitle(donation.getCampaignTitle())
                .donorName(Boolean.TRUE.equals(donation.getIsAnonymous()) ? "Hamba Allah" : donation.getDonorName())
                .donorEmail(donation.getDonorEmail())
                .isAnonymous(donation.getIsAnonymous())
                .amount(donation.getAmount())
                .doa(donation.getDoa())
                .paymentMethod(donation.getPaymentMethod())
                .paymentChannel(donation.getPaymentChannel())
                .status(donation.getStatus())
                .qrisString(donation.getQrisString())
                .qrCodeUrl(donation.getQrCodeUrl())
                .vaNumber(donation.getVaNumber())
                .paidAt(donation.getPaidAt())
                .expiresAt(donation.getExpiresAt())
                .createdAt(donation.getCreatedAt())
                .build();
    }
}
