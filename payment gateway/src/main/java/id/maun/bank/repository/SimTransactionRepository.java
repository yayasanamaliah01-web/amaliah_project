package id.maun.bank.repository;

import id.maun.bank.model.SimTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SimTransactionRepository extends JpaRepository<SimTransaction, Long> {
    List<SimTransaction> findByAccountNumberOrderByTimestampDesc(String accountNumber);
    List<SimTransaction> findByAccountNumberAndTimestampBetweenOrderByTimestampDesc(
            String accountNumber, LocalDateTime from, LocalDateTime to);
    Optional<SimTransaction> findByTransactionId(String transactionId);
}
