package id.maun.bank.repository;

import id.maun.bank.model.SimBankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SimBankAccountRepository extends JpaRepository<SimBankAccount, Long> {
    Optional<SimBankAccount> findByAccountNumber(String accountNumber);
}
