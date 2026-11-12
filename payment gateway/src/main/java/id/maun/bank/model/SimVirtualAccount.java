package id.maun.bank.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sim_virtual_accounts")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SimVirtualAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String vaNumber;

    private String merchantId;

    private String orderId;

    @Column(nullable = false)
    private BigDecimal amount;

    private String bankCode;

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
        if (expiredAt == null) expiredAt = createdAt.plusHours(24);
    }
}
