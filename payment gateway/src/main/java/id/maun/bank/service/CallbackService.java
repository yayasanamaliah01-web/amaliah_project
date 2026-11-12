package id.maun.bank.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CallbackService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Async
    public void sendPaymentCallback(String callbackUrl, String paymentType,
                                     String orderId, String transactionId,
                                     BigDecimal amount, String merchantId) {
        if (callbackUrl == null || callbackUrl.isBlank()) {
            log.warn("No callback URL configured for order {}", orderId);
            return;
        }

        try {
            // Simulate slight delay like real bank
            Thread.sleep(500);

            Map<String, Object> amountMap = new HashMap<>();
            amountMap.put("value", amount.toPlainString());
            amountMap.put("currency", "IDR");

            Map<String, Object> additionalInfo = new HashMap<>();
            additionalInfo.put("orderId", orderId);
            additionalInfo.put("merchantId", merchantId);

            Map<String, Object> payload = new HashMap<>();
            payload.put("partnerServiceId", "BSI-SIM");
            payload.put("transactionId", transactionId);
            payload.put("paymentType", paymentType);
            payload.put("amount", amountMap);
            payload.put("additionalInfo", additionalInfo);
            payload.put("transactionDate", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            payload.put("responseCode", "2002500");
            payload.put("responseMessage", "Successful");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            log.info("Sending payment callback to {} for order {}", callbackUrl, orderId);
            ResponseEntity<String> response = restTemplate.postForEntity(callbackUrl, request, String.class);
            log.info("Callback response: {} {}", response.getStatusCode(), response.getBody());

        } catch (Exception e) {
            log.error("Failed to send callback to {} for order {}: {}", callbackUrl, orderId, e.getMessage());
        }
    }
}
