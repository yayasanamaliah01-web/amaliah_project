package id.amaliah.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "campaigns")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String category; // e.g. "Pendidikan", "Kesehatan", "Bencana", "Kemanusiaan", "Infrastruktur"

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal targetAmount;

    @Builder.Default
    @Column(precision = 19, scale = 2)
    private BigDecimal collectedAmount = BigDecimal.ZERO;

    @Builder.Default
    private Integer donorCount = 0;

    private Integer remainingDays;

    private String image;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private Boolean isUrgent = false;

    @Builder.Default
    private Boolean isVerified = true;

    private String location;

    private String organizer; // e.g. "Amaliah Foundation"

    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, PAUSED

    @Version
    private Long version;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
