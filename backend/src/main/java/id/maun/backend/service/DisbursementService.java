package id.maun.backend.service;

import id.maun.backend.dto.DisbursementDto;
import id.maun.backend.exception.ResourceNotFoundException;
import id.maun.backend.model.ActivityLog;
import id.maun.backend.model.BankMutation;
import id.maun.backend.model.Campaign;
import id.maun.backend.model.Disbursement;
import id.maun.backend.repository.ActivityLogRepository;
import id.maun.backend.repository.BankMutationRepository;
import id.maun.backend.repository.CampaignRepository;
import id.maun.backend.repository.DisbursementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DisbursementService {

    private final DisbursementRepository disbursementRepository;
    private final CampaignRepository campaignRepository;
    private final BankMutationRepository bankMutationRepository;
    private final ActivityLogRepository activityLogRepository;
    private final BankIntegrationService bankIntegrationService;
    private final SseNotificationService sseNotificationService;

    @Transactional
    public DisbursementDto.DisbursementResponse createDisbursement(DisbursementDto.CreateDisbursementRequest request, String approverName) {
        Campaign campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new ResourceNotFoundException("Program donasi tidak ditemukan dengan ID: " + request.getCampaignId()));

        String disbNumber = "DISB-" + LocalDateTime.now().getYear() + "-" + (System.currentTimeMillis() % 100000);

        String bankTxnId = null;
        if (Boolean.TRUE.equals(request.getExecuteBankTransfer())) {
            Map<String, Object> transferResult = bankIntegrationService.executeDisbursementTransfer(
                    request.getAmount(),
                    request.getBeneficiaryAccount() != null ? request.getBeneficiaryAccount() : "1234567890",
                    request.getBeneficiaryBank() != null ? request.getBeneficiaryBank() : "BSI",
                    "Pencairan Dana " + campaign.getTitle() + " - " + request.getTitle(),
                    disbNumber
            );
            bankTxnId = (String) transferResult.getOrDefault("referenceNo", "TXN-" + System.currentTimeMillis());
        }

        Disbursement disbursement = Disbursement.builder()
                .disbursementNumber(disbNumber)
                .campaignId(campaign.getId())
                .campaignTitle(campaign.getTitle())
                .title(request.getTitle())
                .amount(request.getAmount())
                .category(request.getCategory() != null ? request.getCategory() : "Operasional & Bantuan")
                .beneficiaryName(request.getBeneficiaryName())
                .beneficiaryAccount(request.getBeneficiaryAccount())
                .beneficiaryBank(request.getBeneficiaryBank())
                .status("COMPLETED")
                .approvedBy(approverName != null ? approverName : "Bendahara MAUN")
                .notes(request.getNotes())
                .receiptUrl(request.getReceiptUrl())
                .bankTransactionId(bankTxnId)
                .disbursementDate(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();

        Disbursement saved = disbursementRepository.save(disbursement);

        // Record Bank Mutation (DEBIT / Uang Keluar)
        BankMutation mutation = BankMutation.builder()
                .transactionId(bankTxnId != null ? bankTxnId : "TXN-OUT-" + System.currentTimeMillis())
                .accountNumber("7711223344")
                .type("DEBIT")
                .amount(request.getAmount())
                .description("Pencairan: " + request.getTitle() + " (" + campaign.getTitle() + ")")
                .reference(disbNumber)
                .category("PENCAIRAN_DANA")
                .relatedCampaignId(campaign.getId())
                .relatedCampaignTitle(campaign.getTitle())
                .isReconciled(true)
                .transactionTimestamp(LocalDateTime.now())
                .build();
        bankMutationRepository.save(mutation);

        // Record Activity Log
        ActivityLog logEntry = ActivityLog.builder()
                .actionType("PENCAIRAN_DANA")
                .title("Pencairan Dana Rp " + String.format("%,d", request.getAmount().longValue()))
                .description("Penyaluran untuk: " + request.getTitle() + " (" + campaign.getTitle() + ")")
                .amount(request.getAmount())
                .campaignId(campaign.getId())
                .campaignTitle(campaign.getTitle())
                .actorName(disbursement.getApprovedBy())
                .iconType("arrow-up-right")
                .timestamp(LocalDateTime.now())
                .build();
        activityLogRepository.save(logEntry);

        // Broadcast real-time SSE event to all connected clients
        Map<String, Object> eventData = Map.of(
                "type", "DISBURSEMENT_SUCCESS",
                "disbursementNumber", disbNumber,
                "amount", request.getAmount(),
                "campaignId", campaign.getId(),
                "campaignTitle", campaign.getTitle(),
                "title", request.getTitle(),
                "timestamp", LocalDateTime.now().toString()
        );
        sseNotificationService.broadcast("DISBURSEMENT_SUCCESS", eventData);

        log.info("Recorded fund disbursement {} for amount {}", disbNumber, request.getAmount());
        return toResponse(saved);
    }

    public List<DisbursementDto.DisbursementResponse> getAllDisbursements() {
        return disbursementRepository.findAllByOrderByDisbursementDateDesc()
                .stream().map(this::toResponse).toList();
    }

    public List<DisbursementDto.DisbursementResponse> getCampaignDisbursements(Long campaignId) {
        return disbursementRepository.findByCampaignIdOrderByDisbursementDateDesc(campaignId)
                .stream().map(this::toResponse).toList();
    }

    public DisbursementDto.DisbursementResponse getDisbursementById(Long id) {
        Disbursement disbursement = disbursementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pencairan tidak ditemukan dengan ID: " + id));
        return toResponse(disbursement);
    }

    public DisbursementDto.DisbursementResponse toResponse(Disbursement d) {
        return DisbursementDto.DisbursementResponse.builder()
                .id(d.getId())
                .disbursementNumber(d.getDisbursementNumber())
                .campaignId(d.getCampaignId())
                .campaignTitle(d.getCampaignTitle())
                .title(d.getTitle())
                .amount(d.getAmount())
                .category(d.getCategory())
                .beneficiaryName(d.getBeneficiaryName())
                .beneficiaryAccount(d.getBeneficiaryAccount())
                .beneficiaryBank(d.getBeneficiaryBank())
                .status(d.getStatus())
                .approvedBy(d.getApprovedBy())
                .notes(d.getNotes())
                .receiptUrl(d.getReceiptUrl())
                .bankTransactionId(d.getBankTransactionId())
                .disbursementDate(d.getDisbursementDate())
                .createdAt(d.getCreatedAt())
                .build();
    }
}
