package id.maun.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DonationDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateDonationRequest {
        @NotNull(message = "ID program/campaign wajib diisi")
        private Long campaignId;

        @NotBlank(message = "Nama donatur wajib diisi")
        private String donorName;

        private String donorEmail;
        private String donorPhone;
        private Boolean isAnonymous;

        @NotNull(message = "Nominal donasi wajib diisi")
        @DecimalMin(value = "1000", message = "Nominal donasi minimal Rp 1.000")
        private BigDecimal amount;

        private String doa;
        private String paymentMethod; // "QRIS" or "VIRTUAL_ACCOUNT"
        private String paymentChannel; // "BSI", "BCA", "MANDIRI", "GOPAY", "OVO"
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DonationResponse {
        private Long id;
        private String transactionId;
        private Long campaignId;
        private String campaignTitle;
        private String donorName;
        private String donorEmail;
        private Boolean isAnonymous;
        private BigDecimal amount;
        private String doa;
        private String paymentMethod;
        private String paymentChannel;
        private String status;
        private String qrisString;
        private String qrCodeUrl;
        private String vaNumber;
        private LocalDateTime paidAt;
        private LocalDateTime expiresAt;
        private LocalDateTime createdAt;
    }
}
