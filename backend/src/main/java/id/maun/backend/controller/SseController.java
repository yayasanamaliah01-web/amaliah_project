package id.maun.backend.controller;

import id.maun.backend.service.SseNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/v1/stream")
@RequiredArgsConstructor
public class SseController {

    private final SseNotificationService sseNotificationService;

    /**
     * Connect to the live Server-Sent Events stream.
     * Standard HTTP/1.1 or HTTP/2 stream, native browser EventSource support, zero client library required.
     */
    @GetMapping(value = "/live", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamLiveUpdates() {
        return sseNotificationService.registerClient();
    }
}
