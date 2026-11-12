package id.maun.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String actionType; // "DONASI_MASUK", "PENCAIRAN_DANA", "LPJ_DITERBITKAN", "KAMPANYE_DIBUAT", "SINKRONISASI_BANK"

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private BigDecimal amount;

    private Long campaignId;

    private String campaignTitle;

    private String actorName; // "Hamba Allah", "Ahmad Fauzi", "Admin MAUN", "Sistem Bank"

    private String iconType; // "arrow-down-left", "arrow-up-right", "file-text", "check-circle"

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
