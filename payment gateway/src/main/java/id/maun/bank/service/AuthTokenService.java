package id.maun.bank.service;

import id.maun.bank.model.SimMerchant;
import id.maun.bank.repository.SimMerchantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthTokenService {

    private final SimMerchantRepository merchantRepo;

    // Simple in-memory token store
    private final Map<String, TokenInfo> tokenStore = new ConcurrentHashMap<>();

    public record TokenInfo(String merchantId, LocalDateTime expiresAt) {}

    public String generateToken(String apiKey, String apiSecret) {
        SimMerchant merchant = merchantRepo.findByApiKeyAndApiSecret(apiKey, apiSecret)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        String token = "BSI-" + UUID.randomUUID().toString().replace("-", "");
        tokenStore.put(token, new TokenInfo(merchant.getMerchantId(), LocalDateTime.now().plusHours(1)));
        return token;
    }

    public String validateToken(String bearerToken) {
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid token format");
        }
        String token = bearerToken.substring(7);
        TokenInfo info = tokenStore.get(token);
        if (info == null || info.expiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired or invalid");
        }
        return info.merchantId();
    }
}
