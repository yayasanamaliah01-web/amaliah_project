package id.amaliah.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class TransparencyDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PublicSummary {
        private BigDecimal totalDonationsCollected;
        private BigDecimal totalFundsDisbursed;
        private BigDecimal currentLiveBankBalance;
        private Long totalDonors;
        private Long totalCampaigns;
        private Long totalDisbursements;
        private Long totalLpjPublished;
        private String bankAccountNumber;
        private String bankAccountName;
        private String bankName;
        private LocalDateTime lastBankSync;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CampaignTransparencyDetail {
        private CampaignDto.CampaignResponse campaign;
        private BigDecimal totalCollected;
        private BigDecimal totalDisbursed;
        private BigDecimal remainingBalance;
        private List<DonationDto.DonationResponse> recentDonations;
        private List<DisbursementDto.DisbursementResponse> disbursements;
        private List<LpjDto.LpjResponse> lpjReports;
        private List<ActivityLogDto> activityLogs;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ActivityLogDto {
        private Long id;
        private String actionType;
        private String title;
        private String description;
        private BigDecimal amount;
        private Long campaignId;
        private String campaignTitle;
        private String actorName;
        private String iconType;
        private LocalDateTime timestamp;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BankMutationDto {
        private Long id;
        private String transactionId;
        private String type; // CREDIT / DEBIT
        private BigDecimal amount;
        private String description;
        private String reference;
        private BigDecimal balanceAfter;
        private String category;
        private String campaignTitle;
        private LocalDateTime timestamp;
    }
}
