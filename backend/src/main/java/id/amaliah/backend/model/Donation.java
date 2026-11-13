package id.amaliah.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String transactionId; // e.g. "DON-1711234567-ABCD"

    @Column(nullable = false)
    private Long campaignId;

    private String campaignTitle;

    @Column(nullable = false)
    private String donorName;

    private String donorEmail;

    private String donorPhone;

    @Builder.Default
    private Boolean isAnonymous = false;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(columnDefinition = "TEXT")
    private String doa; // Prayer/message from donor

    private String paymentMethod; // "QRIS", "VIRTUAL_ACCOUNT", "TRANSFER_BANK"

    private String paymentChannel; // "BSI", "BCA", "MANDIRI", "GOPAY", "OVO", "SHOPEEPAY"

    @Builder.Default
    private String status = "PENDING"; // PENDING, SUCCESS, EXPIRED, FAILED

    private String bankTransactionId;

    @Column(columnDefinition = "TEXT")
    private String qrisString;

    @Column(columnDefinition = "TEXT")
    private String qrCodeUrl;

    private String vaNumber;

    @Column(columnDefinition = "TEXT")
    private String paymentUrl;

    private LocalDateTime paidAt;

    private LocalDateTime expiresAt;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
