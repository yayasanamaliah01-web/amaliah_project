package id.maun.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "lpj_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lpj {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String lpjNumber; // e.g. "LPJ-2026-001"

    @Column(nullable = false)
    private Long campaignId;

    private String campaignTitle;

    private Long disbursementId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal totalSpent;

    @Column(precision = 19, scale = 2)
    private BigDecimal remainingFunds;

    private Integer beneficiaryCount;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String documentationUrls; // Comma-separated or JSON array of image URLs

    @Column(columnDefinition = "TEXT")
    private String breakdownItemsJson; // JSON array of detailed expenditure items

    private String preparedBy;

    private String verifiedBy;

    @Builder.Default
    private String status = "PUBLISHED"; // DRAFT, REVIEW, PUBLISHED

    @Builder.Default
    private LocalDateTime reportDate = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
