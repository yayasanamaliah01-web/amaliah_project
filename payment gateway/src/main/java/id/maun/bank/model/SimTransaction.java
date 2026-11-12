package id.maun.bank.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sim_transactions")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SimTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountNumber;

    @Column(unique = true)
    private String transactionId;

    private String type; // CREDIT, DEBIT

    @Column(nullable = false)
    private BigDecimal amount;

    private String description;

    private String reference;

    private BigDecimal balanceAfter;

    private String status; // SUCCESS, PENDING, FAILED

    private LocalDateTime timestamp;

    @PrePersist
    void prePersist() {
        if (timestamp == null) timestamp = LocalDateTime.now();
        if (status == null) status = "SUCCESS";
    }
}
