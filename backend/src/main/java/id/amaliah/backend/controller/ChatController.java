package id.amaliah.backend.controller;

import id.amaliah.backend.dto.ChatDto;
import id.amaliah.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/chats")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/conversations")
    public ResponseEntity<List<ChatDto.ConversationSummary>> getAllConversations() {
        return ResponseEntity.ok(chatService.getAllConversations());
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<List<ChatDto.MessageResponse>> getMessages(
            @PathVariable String sessionId,
            @RequestParam(required = false, defaultValue = "USER") String role
    ) {
        List<ChatDto.MessageResponse> messages = chatService.getMessages(sessionId);
        chatService.markAsRead(sessionId, role);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{sessionId}/messages")
    public ResponseEntity<ChatDto.MessageResponse> sendMessage(
            @PathVariable String sessionId,
            @RequestBody ChatDto.SendMessageRequest req
    ) {
        return ResponseEntity.ok(chatService.sendMessage(sessionId, req));
    }

    @PutMapping("/{sessionId}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable String sessionId,
            @RequestParam(required = false, defaultValue = "ADMIN") String role
    ) {
        chatService.markAsRead(sessionId, role);
        return ResponseEntity.ok(Map.of("success", true, "sessionId", sessionId));
    }
}
