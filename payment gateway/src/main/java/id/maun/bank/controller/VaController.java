package id.maun.bank.controller;

import id.maun.bank.model.SimVirtualAccount;
import id.maun.bank.service.AuthTokenService;
import id.maun.bank.service.VirtualAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class VaController {

    private final VirtualAccountService vaService;
    private final AuthTokenService authService;

    /**
     * BI-SNAP: Create Virtual Account
     * POST /api/v1.0/transfer-va/create-va
     */
    @PostMapping("/api/v1.0/transfer-va/create-va")
    public ResponseEntity<?> createVa(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> request) {
        try {
            String merchantId = authService.validateToken(token);

            String orderId = (String) request.get("orderId");
            @SuppressWarnings("unchecked")
            Map<String, String> amountMap = (Map<String, String>) request.get("amount");
            BigDecimal amount = new BigDecimal(amountMap.get("value"));
            String bankCode = (String) request.get("bankCode");
            String callbackUrl = (String) request.get("callbackUrl");

            SimVirtualAccount va = vaService.createVa(merchantId, orderId, amount, bankCode, callbackUrl);

            return ResponseEntity.ok(Map.of(
                    "responseCode", "2002700",
                    "responseMessage", "Successful",
                    "vaNumber", va.getVaNumber(),
                    "orderId", va.getOrderId(),
                    "bankCode", va.getBankCode(),
                    "amount", Map.of("value", va.getAmount().toPlainString(), "currency", "IDR"),
                    "expiredAt", va.getExpiredAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                    "status", va.getStatus()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "responseCode", "4002700",
                    "responseMessage", e.getMessage()
            ));
        }
    }

    /**
     * BI-SNAP: Inquiry VA Status
     * POST /api/v1.0/transfer-va/inquiry-va
     */
    @PostMapping("/api/v1.0/transfer-va/inquiry-va")
    public ResponseEntity<?> inquiryVa(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> request) {
        try {
            authService.validateToken(token);
            String orderId = request.get("orderId");
            SimVirtualAccount va = vaService.getVaByOrderId(orderId);

            return ResponseEntity.ok(Map.of(
                    "responseCode", "2002700",
                    "responseMessage", "Successful",
                    "vaNumber", va.getVaNumber(),
                    "orderId", va.getOrderId(),
                    "status", va.getStatus(),
                    "amount", Map.of("value", va.getAmount().toPlainString(), "currency", "IDR"),
                    "paidAt", va.getPaidAt() != null ? va.getPaidAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : ""
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "responseCode", "4002700",
                    "responseMessage", e.getMessage()
            ));
        }
    }

    /**
     * SIMULATOR ONLY: Simulate transfer to VA
     * POST /sim/va/{vaNumber}/pay
     */
    @PostMapping("/sim/va/{vaNumber}/pay")
    public ResponseEntity<?> simulateVaPayment(@PathVariable String vaNumber) {
        try {
            SimVirtualAccount va = vaService.simulatePayment(vaNumber);
            return ResponseEntity.ok(Map.of(
                    "message", "Transfer successful",
                    "vaNumber", va.getVaNumber(),
                    "orderId", va.getOrderId(),
                    "status", va.getStatus(),
                    "amount", va.getAmount().toPlainString(),
                    "paidAt", va.getPaidAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
