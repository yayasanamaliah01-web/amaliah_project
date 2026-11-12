package id.maun.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

/**
 * Service integrasi Payment Gateway Xendit (QRIS Dinamis, Virtual Account, & Checkout Invoice).
 * Dilengkapi fallback otomatis ke mode simulasi lokal apabila koneksi jaringan dibatasi / offline sandbox.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class XenditService {

    private final RestTemplate restTemplate;

    @Value("${xendit.secret-key:xnd_development_dummy_key}")
    private String secretKey;

    @Value("${xendit.api-url:https://api.xendit.co}")
    private String apiUrl;

    @Value("${xendit.webhook-token:amaliah_xendit_webhook_token_2026}")
    private String webhookToken;

    @Value("${xendit.simulation-enabled:true}")
    private boolean simulationEnabled;

    /**
     * Helper membuat Basic Auth Header Xendit
     */
    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String authString = secretKey + ":";
        String encodedAuth = Base64.getEncoder().encodeToString(authString.getBytes(StandardCharsets.UTF_8));
        headers.set("Authorization", "Basic " + encodedAuth);
        return headers;
    }

    /**
     * Membuat QRIS Dinamis melalui API Xendit (POST /qr_codes)
     */
    public Map<String, Object> createQris(BigDecimal amount, String externalId) {
        try {
            String url = apiUrl + "/qr_codes";

            Map<String, Object> body = new HashMap<>();
            body.put("reference_id", externalId);
            body.put("type", "DYNAMIC");
            body.put("currency", "IDR");
            body.put("amount", amount);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, createHeaders());
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> resBody = response.getBody();
                String qrString = (String) resBody.get("qr_string");
                String qrId = (String) resBody.get("id");

                log.info("Xendit QRIS created successfully for order {}: QR ID {}", externalId, qrId);

                String encodedQr = URLEncoder.encode(qrString, StandardCharsets.UTF_8);
                String qrImageUrl = "https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=" + encodedQr;

                return Map.of(
                        "qrContent", qrString,
                        "qrImageUrl", qrImageUrl,
                        "xenditId", qrId != null ? qrId : "",
                        "status", "ACTIVE",
                        "provider", "XENDIT"
                );
            }
        } catch (Exception e) {
            log.warn("Gagal membuat QRIS via Xendit API ({}). Menggunakan mode simulasi fallback.", e.getMessage());
        }

        // Fallback simulasi jika network offline / sandbox test
        return generateSimulationQris(amount, externalId);
    }

    /**
     * Membuat Virtual Account melalui API Xendit (POST /callback_virtual_accounts)
     */
    public Map<String, Object> createVirtualAccount(String externalId, String bankCode, String donorName, BigDecimal amount) {
        String normalizedBank = normalizeBankCode(bankCode);
        try {
            String url = apiUrl + "/callback_virtual_accounts";

            // Masa berlaku VA: 24 jam ke depan
            String expiration = Instant.now().plus(24, ChronoUnit.HOURS).toString();

            Map<String, Object> body = new HashMap<>();
            body.put("external_id", externalId);
            body.put("bank_code", normalizedBank);
            body.put("name", (donorName != null && !donorName.isBlank()) ? donorName : "Donatur Amaliah");
            body.put("is_closed", true);
            body.put("expected_amount", amount);
            body.put("expiration_date", expiration);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, createHeaders());
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> resBody = response.getBody();
                String vaNo = (String) resBody.get("account_number");
                String fvaId = (String) resBody.get("id");

                log.info("Xendit Virtual Account created for order {}: {} - {}", externalId, normalizedBank, vaNo);

                return Map.of(
                        "virtualAccountNo", vaNo,
                        "bankCode", normalizedBank,
                        "xenditId", fvaId != null ? fvaId : "",
                        "status", "ACTIVE",
                        "provider", "XENDIT"
                );
            }
        } catch (Exception e) {
            log.warn("Gagal membuat VA via Xendit API ({}). Menggunakan mode simulasi fallback.", e.getMessage());
        }

        // Fallback simulasi jika network offline / sandbox test
        return generateSimulationVa(normalizedBank, externalId);
    }

    /**
     * Membuat Invoice Checkout Xendit (POST /v2/invoices)
     */
    public Map<String, Object> createInvoice(String externalId, BigDecimal amount, String donorEmail, String donorName, String description) {
        try {
            String url = apiUrl + "/v2/invoices";

            Map<String, Object> body = new HashMap<>();
            body.put("external_id", externalId);
            body.put("amount", amount);
            body.put("payer_email", (donorEmail != null && !donorEmail.isBlank()) ? donorEmail : "donatur@amaliah.id");
            body.put("description", description != null ? description : "Donasi Infaq/Zakat Pesantren Amaliah");
            body.put("invoice_duration", 86400); // 24 jam

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, createHeaders());
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> resBody = response.getBody();
                String invoiceUrl = (String) resBody.get("invoice_url");
                String invId = (String) resBody.get("id");

                log.info("Xendit Invoice created for order {}: {}", externalId, invoiceUrl);

                return Map.of(
                        "invoiceUrl", invoiceUrl,
                        "xenditId", invId != null ? invId : "",
                        "status", "PENDING",
                        "provider", "XENDIT"
                );
            }
        } catch (Exception e) {
            log.warn("Gagal membuat Invoice via Xendit API ({}). Menggunakan link simulasi.", e.getMessage());
        }

        return Map.of(
                "invoiceUrl", "https://checkout-staging.xendit.co/v2/mock-" + externalId,
                "xenditId", "MOCK-INV-" + externalId,
                "status", "PENDING",
                "provider", "XENDIT_SIMULATION"
        );
    }

    /**
     * Simulasi Pembayaran QRIS Sandbox Xendit (POST /qr_codes/{externalId}/payments/simulate)
     */
    public boolean simulateQrisPayment(String externalId, BigDecimal amount) {
        try {
            String url = apiUrl + "/qr_codes/" + externalId + "/payments/simulate";
            Map<String, Object> body = Map.of("amount", amount);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, createHeaders());
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.info("Simulasi Xendit Sandbox API offline / mock mode: {}", e.getMessage());
            return true;
        }
    }

    /**
     * Simulasi Pembayaran VA Sandbox Xendit (POST /callback_virtual_accounts/external_id:{externalId}/simulate_payment)
     */
    public boolean simulateVaPayment(String externalId, BigDecimal amount) {
        try {
            String url = apiUrl + "/callback_virtual_accounts/external_id:" + externalId + "/simulate_payment";
            Map<String, Object> body = Map.of("amount", amount);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, createHeaders());
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.info("Simulasi Xendit Sandbox API offline / mock mode: {}", e.getMessage());
            return true;
        }
    }

    /**
     * Verifikasi callback token dari Xendit Webhook header
     */
    public boolean verifyCallbackToken(String tokenFromHeader) {
        if (!simulationEnabled) {
            return webhookToken.equals(tokenFromHeader);
        }
        // Di mode simulasi atau development, toleransi token demo
        return webhookToken.equals(tokenFromHeader) || tokenFromHeader == null || tokenFromHeader.isBlank();
    }

    // ==========================================
    // Helper & Simulasi Fallback
    // ==========================================

    private Map<String, Object> generateSimulationQris(BigDecimal amount, String externalId) {
        String simQr = "00020101021226590014ID.LINKAJA.WWW01189360091100222047395204581253033605802ID5916PESANTREN AMALIAH6008SEMARANG61055013162230119"
                + externalId.replace("-", "").substring(0, Math.min(19, externalId.replace("-", "").length()))
                + "6304" + Integer.toHexString(amount.intValue()).toUpperCase();

        String encodedQr = URLEncoder.encode(simQr, StandardCharsets.UTF_8);
        String qrImageUrl = "https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=" + encodedQr;

        return Map.of(
                "qrContent", simQr,
                "qrImageUrl", qrImageUrl,
                "xenditId", "SIM-QR-" + externalId,
                "status", "ACTIVE",
                "provider", "XENDIT_SIMULASI"
        );
    }

    private Map<String, Object> generateSimulationVa(String bankCode, String externalId) {
        Map<String, String> bankPrefix = Map.of(
                "BSI", "9988",
                "BCA", "3901",
                "MANDIRI", "8890",
                "BNI", "8808",
                "BRI", "1280"
        );
        String prefix = bankPrefix.getOrDefault(bankCode, "9988");
        String suffix = String.valueOf(Math.abs(externalId.hashCode()) % 100000000L);
        String vaNo = prefix + String.format("%08d", Long.parseLong(suffix));

        return Map.of(
                "virtualAccountNo", vaNo,
                "bankCode", bankCode,
                "xenditId", "SIM-VA-" + externalId,
                "status", "ACTIVE",
                "provider", "XENDIT_SIMULASI"
        );
    }

    private String normalizeBankCode(String raw) {
        if (raw == null || raw.isBlank()) return "BSI";
        String upper = raw.toUpperCase().trim();
        return switch (upper) {
            case "BCA" -> "BCA";
            case "MANDIRI" -> "MANDIRI";
            case "BNI" -> "BNI";
            case "BRI" -> "BRI";
            case "PERMATA" -> "PERMATA";
            default -> "BSI";
        };
    }
}
