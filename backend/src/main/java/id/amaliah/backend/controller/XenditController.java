package id.amaliah.backend.controller;

import id.amaliah.backend.service.DonationService;
import id.amaliah.backend.service.XenditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Controller untuk menangani Webhook resmi Xendit dan Simulasi Pembayaran Sandbox.
 */
@RestController
@RequestMapping("/api/v1/xendit")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Xendit Payment Gateway", description = "Endpoints Webhook dan Simulasi Sandbox Pembayaran Xendit")
public class XenditController {

    private final XenditService xenditService;
    private final DonationService donationService;

    /**
     * Webhook Notifikasi QRIS Payment Xendit
     */
    @PostMapping("/callback/qr")
    @Operation(summary = "Webhook QRIS Payment Xendit")
    public ResponseEntity<?> handleQrCallback(
            @RequestHeader(value = "x-callback-token", required = false) String callbackToken,
            @RequestBody Map<String, Object> payload
    ) {
        log.info("Received Xendit QRIS Callback: {}", payload);

        if (!xenditService.verifyCallbackToken(callbackToken)) {
            log.warn("Invalid Xendit callback token received: {}", callbackToken);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid callback token"));
        }

        try {
            // Xendit QR callback structure may vary: direct or nested under 'data'
            Map<String, Object> data = payload;
            if (payload.containsKey("data") && payload.get("data") instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> nested = (Map<String, Object>) payload.get("data");
                data = nested;
            }

            String externalId = (String) data.getOrDefault("reference_id", data.get("external_id"));
            String qrId = (String) data.getOrDefault("id", data.get("qr_id"));

            BigDecimal amount = BigDecimal.ZERO;
            if (data.containsKey("amount")) {
                amount = new BigDecimal(data.get("amount").toString());
            }

            if (externalId != null) {
                boolean success = donationService.processXenditPayment(externalId, amount, "QRIS", qrId);
                if (success) {
                    return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "QR payment processed"));
                }
            }

            return ResponseEntity.badRequest().body(Map.of("status", "FAILED", "message", "Unable to process QR payment"));
        } catch (Exception e) {
            log.error("Error processing Xendit QR callback: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Webhook Notifikasi Virtual Account Xendit
     */
    @PostMapping("/callback/va")
    @Operation(summary = "Webhook Virtual Account Payment Xendit")
    public ResponseEntity<?> handleVaCallback(
            @RequestHeader(value = "x-callback-token", required = false) String callbackToken,
            @RequestBody Map<String, Object> payload
    ) {
        log.info("Received Xendit VA Callback: {}", payload);

        if (!xenditService.verifyCallbackToken(callbackToken)) {
            log.warn("Invalid Xendit callback token received: {}", callbackToken);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid callback token"));
        }

        try {
            String externalId = (String) payload.get("external_id");
            String vaId = (String) payload.get("id");
            String bankCode = (String) payload.getOrDefault("bank_code", "VA");

            BigDecimal amount = BigDecimal.ZERO;
            if (payload.containsKey("amount")) {
                amount = new BigDecimal(payload.get("amount").toString());
            }

            if (externalId != null) {
                boolean success = donationService.processXenditPayment(externalId, amount, "VA_" + bankCode, vaId);
                if (success) {
                    return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "VA payment processed"));
                }
            }

            return ResponseEntity.badRequest().body(Map.of("status", "FAILED", "message", "Unable to process VA payment"));
        } catch (Exception e) {
            log.error("Error processing Xendit VA callback: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Webhook Notifikasi Invoice Xendit
     */
    @PostMapping("/callback/invoice")
    @Operation(summary = "Webhook Invoice Payment Xendit")
    public ResponseEntity<?> handleInvoiceCallback(
            @RequestHeader(value = "x-callback-token", required = false) String callbackToken,
            @RequestBody Map<String, Object> payload
    ) {
        log.info("Received Xendit Invoice Callback: {}", payload);

        if (!xenditService.verifyCallbackToken(callbackToken)) {
            log.warn("Invalid Xendit callback token received: {}", callbackToken);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid callback token"));
        }

        try {
            String status = (String) payload.get("status");
            if (!"PAID".equalsIgnoreCase(status) && !"SETTLED".equalsIgnoreCase(status)) {
                log.info("Xendit invoice status is not paid: {}", status);
                return ResponseEntity.ok(Map.of("status", "IGNORED", "message", "Invoice not paid yet"));
            }

            String externalId = (String) payload.get("external_id");
            String invoiceId = (String) payload.get("id");
            String paymentMethod = (String) payload.getOrDefault("payment_method", "INVOICE");

            BigDecimal amount = BigDecimal.ZERO;
            if (payload.containsKey("paid_amount")) {
                amount = new BigDecimal(payload.get("paid_amount").toString());
            } else if (payload.containsKey("amount")) {
                amount = new BigDecimal(payload.get("amount").toString());
            }

            if (externalId != null) {
                boolean success = donationService.processXenditPayment(externalId, amount, paymentMethod, invoiceId);
                if (success) {
                    return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Invoice payment processed"));
                }
            }

            return ResponseEntity.badRequest().body(Map.of("status", "FAILED", "message", "Unable to process invoice"));
        } catch (Exception e) {
            log.error("Error processing Xendit Invoice callback: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Simulasi Pembayaran QRIS Sandbox (Untuk Uji Coba Developer & QA)
     */
    @PostMapping("/simulate/qr-payment")
    @Operation(summary = "Simulasi Pembayaran QRIS Sandbox Xendit")
    public ResponseEntity<?> simulateQrPayment(@RequestBody Map<String, Object> req) {
        String transactionId = (String) req.get("transactionId");
        if (transactionId == null || transactionId.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "transactionId wajib diisi"));
        }

        BigDecimal amount = BigDecimal.valueOf(50000);
        if (req.containsKey("amount")) {
            amount = new BigDecimal(req.get("amount").toString());
        }

        // 1. Trigger simulasi ke API Xendit Sandbox (jika terkoneksi)
        xenditService.simulateQrisPayment(transactionId, amount);

        // 2. Langsung proses update status donasi lokal & mutasi bank
        boolean success = donationService.processXenditPayment(
                transactionId,
                amount,
                "QRIS",
                "SIM-QR-" + System.currentTimeMillis()
        );

        if (success) {
            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "message", "Simulasi pembayaran QRIS berhasil untuk transaksi " + transactionId,
                    "transactionId", transactionId,
                    "amount", amount
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "FAILED",
                    "message", "Gagal memproses simulasi untuk transaksi " + transactionId
            ));
        }
    }

    /**
     * Simulasi Pembayaran Virtual Account Sandbox (Untuk Uji Coba Developer & QA)
     */
    @PostMapping("/simulate/va-payment")
    @Operation(summary = "Simulasi Pembayaran Virtual Account Sandbox Xendit")
    public ResponseEntity<?> simulateVaPayment(@RequestBody Map<String, Object> req) {
        String transactionId = (String) req.get("transactionId");
        if (transactionId == null || transactionId.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "transactionId wajib diisi"));
        }

        BigDecimal amount = BigDecimal.valueOf(50000);
        if (req.containsKey("amount")) {
            amount = new BigDecimal(req.get("amount").toString());
        }

        // 1. Trigger simulasi ke API Xendit Sandbox (jika terkoneksi)
        xenditService.simulateVaPayment(transactionId, amount);

        // 2. Langsung proses update status donasi lokal & mutasi bank
        boolean success = donationService.processXenditPayment(
                transactionId,
                amount,
                "VIRTUAL_ACCOUNT",
                "SIM-VA-" + System.currentTimeMillis()
        );

        if (success) {
            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "message", "Simulasi pembayaran Virtual Account berhasil untuk transaksi " + transactionId,
                    "transactionId", transactionId,
                    "amount", amount
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "FAILED",
                    "message", "Gagal memproses simulasi untuk transaksi " + transactionId
            ));
        }
    }
}

