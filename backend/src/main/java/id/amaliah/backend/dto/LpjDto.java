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

public class LpjDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateLpjRequest {
        @NotNull(message = "ID program/campaign wajib diisi")
        private Long campaignId;

        private Long disbursementId;

        @NotBlank(message = "Judul LPJ wajib diisi")
        private String title;

        private String summary;

        @NotNull(message = "Total dana terpakai wajib diisi")
        @DecimalMin(value = "0", message = "Total dana terpakai tidak boleh negatif")
        private BigDecimal totalSpent;

        private BigDecimal remainingFunds;
        private Integer beneficiaryCount;
        private String location;
        private String documentationUrls;
        private String breakdownItemsJson;
        private String preparedBy;
        private String verifiedBy;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LpjResponse {
        private Long id;
        private String lpjNumber;
        private Long campaignId;
        private String campaignTitle;
        private Long disbursementId;
        private String title;
        private String summary;
        private BigDecimal totalSpent;
        private BigDecimal remainingFunds;
        private Integer beneficiaryCount;
        private String location;
        private String documentationUrls;
        private String breakdownItemsJson;
        private String preparedBy;
        private String verifiedBy;
        private String status;
        private LocalDateTime reportDate;
        private LocalDateTime createdAt;
    }
}
