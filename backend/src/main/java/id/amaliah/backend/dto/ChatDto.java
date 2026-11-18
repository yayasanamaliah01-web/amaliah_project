package id.amaliah.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

public class ChatDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SendMessageRequest {
        private String senderName;
        private String senderEmail;
        private String senderRole; // "USER" or "ADMIN"
        private String content;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MessageResponse {
        private Long id;
        private String sessionId;
        private String senderName;
        private String senderEmail;
        private String senderRole;
        private String content;
        private Boolean isRead;
        private LocalDateTime timestamp;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ConversationSummary {
        private String sessionId;
        private String donorName;
        private String donorEmail;
        private String lastMessage;
        private LocalDateTime lastTimestamp;
        private Long unreadCount;
        private Boolean isOnline;
    }
}
