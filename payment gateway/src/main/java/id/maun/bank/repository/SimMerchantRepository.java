package id.maun.bank.repository;

import id.maun.bank.model.SimMerchant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SimMerchantRepository extends JpaRepository<SimMerchant, Long> {
    Optional<SimMerchant> findByMerchantId(String merchantId);
    Optional<SimMerchant> findByApiKeyAndApiSecret(String apiKey, String apiSecret);
}
