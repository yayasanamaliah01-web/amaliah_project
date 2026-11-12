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

public class CampaignDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateCampaignRequest {
        @NotBlank(message = "Judul program wajib diisi")
        private String title;

        private String slug;

        @NotBlank(message = "Kategori program wajib diisi")
        private String category;

        @NotNull(message = "Target donasi wajib diisi")
        @DecimalMin(value = "10000", message = "Target donasi minimal Rp 10.000")
        private BigDecimal targetAmount;

        private Integer remainingDays;
        private String image;
        private String description;
        private Boolean isUrgent;
        private String location;
        private String organizer;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CampaignResponse {
        private Long id;
        private String title;
        private String slug;
        private String category;
        private BigDecimal targetAmount;
        private BigDecimal collectedAmount;
        private Integer donorCount;
        private Integer remainingDays;
        private String image;
        private String description;
        private Boolean isUrgent;
        private Boolean isVerified;
        private String location;
        private String organizer;
        private String status;
        private Double progressPercentage;
        private LocalDateTime createdAt;
    }
}
