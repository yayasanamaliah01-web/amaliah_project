package id.maun.bank.controller;

import id.maun.bank.model.SimQrisPayment;
import id.maun.bank.service.AuthTokenService;
import id.maun.bank.service.QrisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class QrisController {

    private final QrisService qrisService;
    private final AuthTokenService authService;

    /**
     * BI-SNAP: Generate Dynamic QRIS (QR MPM)
     * POST /api/v1.0/qr/qr-mpm-generate
     */
    @PostMapping("/api/v1.0/qr/qr-mpm-generate")
    public ResponseEntity<?> generateQris(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> request) {
        try {
            String merchantId = authService.validateToken(token);
            String orderId = (String) request.get("orderId");
            if (orderId == null) {
                orderId = (String) request.get("partnerReferenceNo");
            }
            if (orderId == null) {
                orderId = "ORD-" + System.currentTimeMillis();
            }

            @SuppressWarnings("unchecked")
            Map<String, String> amountMap = (Map<String, String>) request.get("amount");
            BigDecimal amount = new BigDecimal(amountMap.get("value"));
            String callbackUrl = (String) request.get("callbackUrl");

            SimQrisPayment qris = qrisService.generateQris(merchantId, orderId, amount, callbackUrl);

            return ResponseEntity.ok(Map.of(
                    "responseCode", "2004700",
                    "responseMessage", "Successful",
                    "qrisId", qris.getQrisId(),
                    "partnerReferenceNo", qris.getOrderId(),
                    "orderId", qris.getOrderId(),
                    "qrContent", qris.getQrisRawData(),
                    "qrImageUrl", qris.getQrisImageUrl(),
                    "qrisUrl", qris.getQrisImageUrl(),
                    "amount", Map.of("value", qris.getAmount().toPlainString(), "currency", "IDR"),
                    "status", qris.getStatus()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "responseCode", "4004700",
                    "responseMessage", e.getMessage()
            ));
        }
    }

    /**
     * BI-SNAP: Query QRIS Payment Status
     * POST /api/v1.0/qr/qr-mpm-query
     */
    @PostMapping("/api/v1.0/qr/qr-mpm-query")
    public ResponseEntity<?> queryQris(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> request) {
        try {
            authService.validateToken(token);
            String orderId = request.get("orderId");
            SimQrisPayment qris = qrisService.getQrisByOrderId(orderId);

            return ResponseEntity.ok(Map.of(
                    "responseCode", "2004700",
                    "responseMessage", "Successful",
                    "qrisId", qris.getQrisId(),
                    "orderId", qris.getOrderId(),
                    "status", qris.getStatus(),
                    "amount", Map.of("value", qris.getAmount().toPlainString(), "currency", "IDR"),
                    "paidAt", qris.getPaidAt() != null ? qris.getPaidAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : ""
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "responseCode", "4004700",
                    "responseMessage", e.getMessage()
            ));
        }
    }

    /**
     * SIMULATOR ONLY: Simulate user scanning and paying QRIS
     * POST /sim/qris/{qrisId}/pay
     */
    @PostMapping("/sim/qris/{qrisId}/pay")
    public ResponseEntity<?> simulateQrisPayment(@PathVariable String qrisId) {
        try {
            SimQrisPayment qris = qrisService.simulatePayment(qrisId);
            return ResponseEntity.ok(Map.of(
                    "message", "Payment successful",
                    "qrisId", qris.getQrisId(),
                    "orderId", qris.getOrderId(),
                    "status", qris.getStatus(),
                    "amount", qris.getAmount().toPlainString(),
                    "paidAt", qris.getPaidAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * SIMULATOR ONLY: Simulate QRIS payment by order ID or reference
     * POST /sim/pay-qris
     */
    @PostMapping("/sim/pay-qris")
    public ResponseEntity<?> simulatePayQrisByOrder(@RequestBody Map<String, Object> request) {
        try {
            String orderId = (String) request.getOrDefault("orderId", request.get("referenceNo"));
            SimQrisPayment qris = qrisService.getQrisByOrderId(orderId);
            SimQrisPayment paid = qrisService.simulatePayment(qris.getQrisId());
            return ResponseEntity.ok(Map.of(
                    "message", "Payment successful",
                    "qrisId", paid.getQrisId(),
                    "orderId", paid.getOrderId(),
                    "status", paid.getStatus(),
                    "amount", paid.getAmount().toPlainString(),
                    "paidAt", paid.getPaidAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }
}
