package id.maun.bank.repository;

import id.maun.bank.model.SimVirtualAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SimVirtualAccountRepository extends JpaRepository<SimVirtualAccount, Long> {
    Optional<SimVirtualAccount> findByVaNumber(String vaNumber);
    Optional<SimVirtualAccount> findByOrderId(String orderId);
}
