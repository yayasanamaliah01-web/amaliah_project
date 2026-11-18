package id.amaliah.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String sessionId; // e.g. "guest-123" or "donor-7" or email

    private String senderName;

    private String senderEmail;

    @Column(nullable = false)
    private String senderRole; // "USER", "ADMIN", or "BOT"

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Builder.Default
    private Boolean isRead = false;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
