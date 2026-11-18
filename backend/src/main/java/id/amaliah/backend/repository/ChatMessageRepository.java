package id.amaliah.backend.repository;

import id.amaliah.backend.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findBySessionIdOrderByTimestampAsc(String sessionId);

    @Query("SELECT DISTINCT m.sessionId FROM ChatMessage m ORDER BY m.sessionId")
    List<String> findDistinctSessionIds();

    long countBySessionIdAndIsReadFalseAndSenderRole(String sessionId, String senderRole);
}
