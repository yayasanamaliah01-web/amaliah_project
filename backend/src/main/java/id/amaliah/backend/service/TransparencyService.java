package id.amaliah.backend.service;

import id.amaliah.backend.dto.TransparencyDto;
import id.amaliah.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TransparencyService {

    private final CampaignRepository campaignRepository;
    private final DonationRepository donationRepository;
    private final DisbursementRepository disbursementRepository;
    private final LpjRepository lpjRepository;
    private final BankMutationRepository bankMutationRepository;
    private final ActivityLogRepository activityLogRepository;
    private final BankIntegrationService bankIntegrationService;
    private final CampaignService campaignService;
    private final DonationService donationService;
    private final DisbursementService disbursementService;
    private final LpjService lpjService;

    public TransparencyDto.PublicSummary getPublicSummary() {
        BigDecimal totalDonations = donationRepository.sumTotalSuccessfulDonations();
        BigDecimal totalDisbursed = disbursementRepository.sumTotalDisbursed();
        BigDecimal liveBalance = bankIntegrationService.inquireBalance();

        long totalDonors = donationRepository.count();
        long totalCampaigns = campaignRepository.count();
        long totalDisbursements = disbursementRepository.count();
        long totalLpj = lpjRepository.count();

        return TransparencyDto.PublicSummary.builder()
                .totalDonationsCollected(totalDonations)
                .totalFundsDisbursed(totalDisbursed)
                .currentLiveBankBalance(liveBalance)
                .totalDonors(totalDonors)
                .totalCampaigns(totalCampaigns)
                .totalDisbursements(totalDisbursements)
                .totalLpjPublished(totalLpj)
                .bankAccountNumber("7711223344")
                .bankAccountName("Yayasan Semarang Infak")
                .bankName("Bank Syariah Indonesia (BSI)")
                .lastBankSync(LocalDateTime.now())
                .build();
    }

    public TransparencyDto.CampaignTransparencyDetail getCampaignTransparency(Long campaignId) {
        var campaign = campaignService.getCampaignById(campaignId);
        var donations = donationService.getCampaignDonations(campaignId);
        var disbursements = disbursementService.getCampaignDisbursements(campaignId);
        var lpjReports = lpjService.getCampaignLpjReports(campaignId);

        BigDecimal totalCollected = donationRepository.sumSuccessfulDonationsByCampaignId(campaignId);
        BigDecimal totalDisbursed = disbursementRepository.sumDisbursedByCampaignId(campaignId);
        BigDecimal remainingBalance = totalCollected.subtract(totalDisbursed);

        var activities = activityLogRepository.findByCampaignIdOrderByTimestampDesc(campaignId).stream()
                .map(a -> TransparencyDto.ActivityLogDto.builder()
                        .id(a.getId())
                        .actionType(a.getActionType())
                        .title(a.getTitle())
                        .description(a.getDescription())
                        .amount(a.getAmount())
                        .campaignId(a.getCampaignId())
                        .campaignTitle(a.getCampaignTitle())
                        .actorName(a.getActorName())
                        .iconType(a.getIconType())
                        .timestamp(a.getTimestamp())
                        .build())
                .toList();

        return TransparencyDto.CampaignTransparencyDetail.builder()
                .campaign(campaign)
                .totalCollected(totalCollected)
                .totalDisbursed(totalDisbursed)
                .remainingBalance(remainingBalance)
                .recentDonations(donations)
                .disbursements(disbursements)
                .lpjReports(lpjReports)
                .activityLogs(activities)
                .build();
    }

    public List<TransparencyDto.ActivityLogDto> getRecentActivities() {
        return activityLogRepository.findTop20ByOrderByTimestampDesc().stream()
                .map(a -> TransparencyDto.ActivityLogDto.builder()
                        .id(a.getId())
                        .actionType(a.getActionType())
                        .title(a.getTitle())
                        .description(a.getDescription())
                        .amount(a.getAmount())
                        .campaignId(a.getCampaignId())
                        .campaignTitle(a.getCampaignTitle())
                        .actorName(a.getActorName())
                        .iconType(a.getIconType())
                        .timestamp(a.getTimestamp())
                        .build())
                .toList();
    }

    public List<TransparencyDto.BankMutationDto> getRecentBankMutations() {
        return bankMutationRepository.findTop20ByOrderByTransactionTimestampDesc().stream()
                .map(m -> TransparencyDto.BankMutationDto.builder()
                        .id(m.getId())
                        .transactionId(m.getTransactionId())
                        .type(m.getType())
                        .amount(m.getAmount())
                        .description(m.getDescription())
                        .reference(m.getReference())
                        .balanceAfter(m.getBalanceAfter())
                        .category(m.getCategory())
                        .campaignTitle(m.getRelatedCampaignTitle())
                        .timestamp(m.getTransactionTimestamp())
                        .build())
                .toList();
    }
}
