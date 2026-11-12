package id.maun.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bank_mutations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankMutation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String transactionId; // From bank system

    @Column(nullable = false)
    private String accountNumber;

    @Column(nullable = false)
    private String type; // CREDIT (Uang Masuk), DEBIT (Uang Keluar)

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    private String description;

    private String reference;

    @Column(precision = 19, scale = 2)
    private BigDecimal balanceAfter;

    private String category; // "DONASI_QRIS", "DONASI_VA", "PENCAIRAN_DANA", "OPERASIONAL", "BIAYA_ADMIN"

    private Long relatedCampaignId;

    private String relatedCampaignTitle;

    @Builder.Default
    private Boolean isReconciled = false;

    private LocalDateTime transactionTimestamp;

    @Builder.Default
    private LocalDateTime syncedAt = LocalDateTime.now();
}
