package id.amaliah.backend.controller;

import id.amaliah.backend.service.DonationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Endpoint penerima webhook / callback notifikasi pembayaran dari Bank API
 */
@RestController
@RequestMapping("/api/v1/bank-callback")
@RequiredArgsConstructor
@Slf4j
public class PaymentCallbackController {

    private final DonationService donationService;

    @PostMapping("/notify")
    public ResponseEntity<?> handleBankPaymentNotification(@RequestBody Map<String, Object> payload) {
        log.info("Received bank notification webhook: {}", payload);
        boolean success = donationService.processPaymentCallback(payload);

        if (success) {
            return ResponseEntity.ok(Map.of(
                    "responseCode", "2002500",
                    "responseMessage", "Callback processed successfully"
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                    "responseCode", "4002500",
                    "responseMessage", "Failed to process callback"
            ));
        }
    }
}
