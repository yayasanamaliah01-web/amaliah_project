package id.amaliah.backend.service;

import id.amaliah.backend.dto.ChatDto;
import id.amaliah.backend.model.ChatMessage;
import id.amaliah.backend.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;

    public List<ChatDto.MessageResponse> getMessages(String sessionId) {
        List<ChatMessage> list = chatMessageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
        if (list.isEmpty()) {
            // Berikan sambutan hangat dari Pesantren Amaliah jika sesi baru
            ChatMessage welcome = ChatMessage.builder()
                    .sessionId(sessionId)
                    .senderName("Ustadz Pengurus (Admin Amaliah)")
                    .senderEmail("admin@amaliah.id")
                    .senderRole("ADMIN")
                    .content("Assalamu'alaikum Warahmatullahi Wabarakatuh. Ahlan wa sahlan di Layanan Konsultasi & Layanan Donatur Yayasan Pesantren Amaliah Semarang. Ada yang bisa kami bantu seputar ZISWAF, konfirmasi transfer, atau program santri?")
                    .isRead(true)
                    .timestamp(LocalDateTime.now().minusMinutes(2))
                    .build();
            chatMessageRepository.save(welcome);
            list = Collections.singletonList(welcome);
        }

        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public ChatDto.MessageResponse sendMessage(String sessionId, ChatDto.SendMessageRequest req) {
        String role = StringUtils.hasText(req.getSenderRole()) ? req.getSenderRole().toUpperCase() : "USER";
        String name = StringUtils.hasText(req.getSenderName()) ? req.getSenderName() : (role.equals("ADMIN") ? "Admin Pesantren" : "Donatur");

        ChatMessage message = ChatMessage.builder()
                .sessionId(sessionId)
                .senderName(name)
                .senderEmail(req.getSenderEmail())
                .senderRole(role)
                .content(req.getContent())
                .isRead(false)
                .timestamp(LocalDateTime.now())
                .build();

        ChatMessage saved = chatMessageRepository.save(message);
        log.info("Chat message saved in session {}: [{}] {}", sessionId, role, req.getContent());

        return mapToResponse(saved);
    }

    @Transactional
    public void markAsRead(String sessionId, String readerRole) {
        List<ChatMessage> messages = chatMessageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
        for (ChatMessage m : messages) {
            // Jika dibaca oleh admin, tandai pesan USER sebagai read. Jika dibaca user, tandai pesan ADMIN sebagai read.
            if ("ADMIN".equalsIgnoreCase(readerRole) && !"ADMIN".equalsIgnoreCase(m.getSenderRole())) {
                m.setIsRead(true);
            } else if ("USER".equalsIgnoreCase(readerRole) && "ADMIN".equalsIgnoreCase(m.getSenderRole())) {
                m.setIsRead(true);
            }
        }
        chatMessageRepository.saveAll(messages);
    }

    public List<ChatDto.ConversationSummary> getAllConversations() {
        List<String> sessionIds = chatMessageRepository.findDistinctSessionIds();

        // Jika belum ada chat donatur, inisialisasi thread sampel agar dashboard WhatsApp langsung hidup
        if (sessionIds.isEmpty()) {
            initSampleConversations();
            sessionIds = chatMessageRepository.findDistinctSessionIds();
        }

        List<ChatDto.ConversationSummary> summaries = new ArrayList<>();
        for (String sId : sessionIds) {
            List<ChatMessage> msgs = chatMessageRepository.findBySessionIdOrderByTimestampAsc(sId);
            if (msgs.isEmpty()) continue;

            ChatMessage lastMsg = msgs.get(msgs.size() - 1);
            
            // Ambil nama donatur dari pesan non-admin terakhir atau fallback
            String donorName = "Donatur";
            String donorEmail = "";
            for (ChatMessage m : msgs) {
                if (!"ADMIN".equalsIgnoreCase(m.getSenderRole()) && StringUtils.hasText(m.getSenderName())) {
                    donorName = m.getSenderName();
                    donorEmail = m.getSenderEmail() != null ? m.getSenderEmail() : "";
                }
            }

            long unread = chatMessageRepository.countBySessionIdAndIsReadFalseAndSenderRole(sId, "USER");

            summaries.add(ChatDto.ConversationSummary.builder()
                    .sessionId(sId)
                    .donorName(donorName)
                    .donorEmail(donorEmail)
                    .lastMessage(lastMsg.getContent())
                    .lastTimestamp(lastMsg.getTimestamp())
                    .unreadCount(unread)
                    .isOnline(true)
                    .build());
        }

        // Urutkan percakapan dari yang paling baru di atas (ala WhatsApp)
        summaries.sort((a, b) -> {
            if (a.getLastTimestamp() == null || b.getLastTimestamp() == null) return 0;
            return b.getLastTimestamp().compareTo(a.getLastTimestamp());
        });

        return summaries;
    }

    private void initSampleConversations() {
        String s1 = "donor-budi-pratama";
        chatMessageRepository.save(ChatMessage.builder()
                .sessionId(s1)
                .senderName("H. Budi Pratama (Wali Santri)")
                .senderEmail("budi.pratama@gmail.com")
                .senderRole("USER")
                .content("Assalamu'alaikum Ustadz, mau konfirmasi zakat mal atas nama keluarga sebesar Rp 5.000.000 via BSI apakah sudah tercatat?")
                .isRead(false)
                .timestamp(LocalDateTime.now().minusHours(1))
                .build());

        String s2 = "donor-siti-rahma";
        chatMessageRepository.save(ChatMessage.builder()
                .sessionId(s2)
                .senderName("Hj. Siti Rahmawati")
                .senderEmail("siti.rahma@yahoo.com")
                .senderRole("USER")
                .content("Bismillah, untuk sedekah beras santri apakah bisa dikirim dalam bentuk fisik ke pondok atau transfer saja?")
                .isRead(false)
                .timestamp(LocalDateTime.now().minusHours(3))
                .build());

        String s3 = "donor-ahmad-fauzi";
        chatMessageRepository.save(ChatMessage.builder()
                .sessionId(s3)
                .senderName("Ahmad Fauzan")
                .senderEmail("ahmad.fauzan@gmail.com")
                .senderRole("USER")
                .content("Apakah ada laporan LPJ penyaluran kafalah ustadz bulan ini? Mau saya tunjukkan ke komunitas.")
                .isRead(true)
                .timestamp(LocalDateTime.now().minusHours(6))
                .build());
        chatMessageRepository.save(ChatMessage.builder()
                .sessionId(s3)
                .senderName("Admin Pesantren Amaliah")
                .senderEmail("admin@amaliah.id")
                .senderRole("ADMIN")
                .content("Wa'alaikumsalam Bpk Ahmad. Laporan LPJ kafalah asatidz sudah terbit dan dapat diunduh di menu Transparansi publik kami. Syukran jazila.")
                .isRead(true)
                .timestamp(LocalDateTime.now().minusHours(5))
                .build());
    }

    private ChatDto.MessageResponse mapToResponse(ChatMessage m) {
        return ChatDto.MessageResponse.builder()
                .id(m.getId())
                .sessionId(m.getSessionId())
                .senderName(m.getSenderName())
                .senderEmail(m.getSenderEmail())
                .senderRole(m.getSenderRole())
                .content(m.getContent())
                .isRead(m.getIsRead())
                .timestamp(m.getTimestamp())
                .build();
    }
}
