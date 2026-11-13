package id.amaliah.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@Slf4j
public class SseNotificationService {

    // Thread-safe list of active SSE emitters
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    /**
     * Register a new client for Server-Sent Events stream.
     * Timeout set to 30 minutes (1,800,000 ms).
     */
    public SseEmitter registerClient() {
        SseEmitter emitter = new SseEmitter(1800000L);

        emitters.add(emitter);

        emitter.onCompletion(() -> {
            log.debug("SSE client connection completed.");
            emitters.remove(emitter);
        });

        emitter.onTimeout(() -> {
            log.debug("SSE client connection timed out.");
            emitters.remove(emitter);
        });

        emitter.onError((ex) -> {
            log.debug("SSE client connection error: {}", ex.getMessage());
            emitters.remove(emitter);
        });

        // Send initial connected event
        try {
            emitter.send(SseEmitter.event()
                    .name("CONNECTED")
                    .data("{\"status\":\"CONNECTED\",\"message\":\"Live stream established with Amaliah Platform\"}"));
        } catch (IOException e) {
            emitters.remove(emitter);
        }

        log.info("New SSE client connected. Total active clients: {}", emitters.size());
        return emitter;
    }

    /**
     * Broadcast an event to all connected clients.
     * Lightweight push: Zero polling overhead on the database or network.
     */
    public void broadcast(String eventName, Object data) {
        log.info("Broadcasting SSE event: '{}' to {} connected client(s)", eventName, emitters.size());

        List<SseEmitter> deadEmitters = new CopyOnWriteArrayList<>();

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name(eventName)
                        .data(data));
            } catch (Exception ex) {
                deadEmitters.add(emitter);
            }
        }

        emitters.removeAll(deadEmitters);
    }

    /**
     * Keep-alive heartbeat every 25 seconds to keep HTTP connections open through firewalls/proxies.
     */
    @Scheduled(fixedRate = 25000)
    public void sendHeartbeat() {
        if (!emitters.isEmpty()) {
            broadcast("HEARTBEAT", "{\"timestamp\":" + System.currentTimeMillis() + "}");
        }
    }

    public int getActiveClientCount() {
        return emitters.size();
    }
}
