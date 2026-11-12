package id.maun.bank.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sim_bank_accounts")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SimBankAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String accountNumber;

    private String accountName;

    @Column(nullable = false)
    private BigDecimal balance;

    private String accountType; // GIRO, TABUNGAN

    private boolean isActive;

    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        isActive = true;
    }
}
