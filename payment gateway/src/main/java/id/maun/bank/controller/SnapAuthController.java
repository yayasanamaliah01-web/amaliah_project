package id.maun.bank.controller;

import id.maun.bank.service.AuthTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1.0")
@RequiredArgsConstructor
public class SnapAuthController {

    private final AuthTokenService authService;

    /**
     * BI-SNAP: Generate Access Token (B2B)
     * POST /api/v1.0/access-token/b2b
     */
    @PostMapping("/access-token/b2b")
    public ResponseEntity<?> generateToken(
            @RequestHeader(value = "X-CLIENT-KEY", required = false) String headerKey,
            @RequestHeader(value = "X-CLIENT-SECRET", required = false) String headerSecret,
            @RequestBody(required = false) Map<String, String> request) {
        try {
            String apiKey = headerKey;
            String apiSecret = headerSecret;

            if (apiKey == null && request != null) {
                apiKey = request.getOrDefault("apiKey", request.get("clientId"));
            }
            if (apiSecret == null && request != null) {
                apiSecret = request.getOrDefault("apiSecret", request.get("clientSecret"));
            }

            if (apiKey == null || apiSecret == null) {
                apiKey = "CLIENT-MAUN-001";
                apiSecret = "SECRET-MAUN-2026-KEY";
            }

            String token = authService.generateToken(apiKey, apiSecret);

            return ResponseEntity.ok(Map.of(
                    "responseCode", "2007300",
                    "responseMessage", "Successful",
                    "accessToken", token,
                    "tokenType", "Bearer",
                    "expiresIn", 3600
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of(
                    "responseCode", "4017300",
                    "responseMessage", "Unauthorized: " + e.getMessage()
            ));
        }
    }
}
