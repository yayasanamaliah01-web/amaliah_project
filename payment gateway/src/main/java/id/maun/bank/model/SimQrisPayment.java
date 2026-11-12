package id.maun.bank.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sim_qris_payments")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SimQrisPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String qrisId;

    private String merchantId;

    private String orderId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(length = 2000)
    private String qrisImageUrl;

    @Column(length = 2000)
    private String qrisRawData;

    private String status; // PENDING, PAID, EXPIRED

    private String callbackUrl;

    private String accountNumber; // rekening tujuan

    private LocalDateTime paidAt;

    private LocalDateTime expiredAt;

    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = "PENDING";
        if (expiredAt == null) expiredAt = createdAt.plusMinutes(30);
    }
}
