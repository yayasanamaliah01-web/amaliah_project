package id.amaliah.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DisbursementDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateDisbursementRequest {
        @NotNull(message = "ID campaign wajib diisi")
        private Long campaignId;

        @NotBlank(message = "Judul pencairan wajib diisi")
        private String title;

        @NotNull(message = "Nominal pencairan wajib diisi")
        @DecimalMin(value = "1000", message = "Nominal pencairan minimal Rp 1.000")
        private BigDecimal amount;

        private String category;

        @NotBlank(message = "Nama penerima manfaat wajib diisi")
        private String beneficiaryName;

        private String beneficiaryAccount;
        private String beneficiaryBank;
        private String notes;
        private String receiptUrl;
        private Boolean executeBankTransfer; // If true, call bank API to execute actual transfer
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DisbursementResponse {
        private Long id;
        private String disbursementNumber;
        private Long campaignId;
        private String campaignTitle;
        private String title;
        private BigDecimal amount;
        private String category;
        private String beneficiaryName;
        private String beneficiaryAccount;
        private String beneficiaryBank;
        private String status;
        private String approvedBy;
        private String notes;
        private String receiptUrl;
        private String bankTransactionId;
        private LocalDateTime disbursementDate;
        private LocalDateTime createdAt;
    }
}
