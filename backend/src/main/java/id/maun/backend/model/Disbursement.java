package id.maun.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "disbursements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Disbursement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String disbursementNumber; // e.g. "DISB-2026-001"

    @Column(nullable = false)
    private Long campaignId;

    private String campaignTitle;

    @Column(nullable = false)
    private String title; // Purpose/title of disbursement

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private String category; // e.g. "Logistik & Sembako", "Operasional Medis", "Bahan Bangunan", "Santunan Tunai"

    private String beneficiaryName;

    private String beneficiaryAccount;

    private String beneficiaryBank;

    @Builder.Default
    private String status = "COMPLETED"; // PENDING, APPROVED, COMPLETED, REJECTED

    private String approvedBy;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private String receiptUrl;

    private String bankTransactionId;

    @Builder.Default
    private LocalDateTime disbursementDate = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
