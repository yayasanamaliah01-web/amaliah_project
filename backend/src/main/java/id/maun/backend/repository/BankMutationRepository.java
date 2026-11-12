package id.maun.backend.repository;

import id.maun.backend.model.BankMutation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BankMutationRepository extends JpaRepository<BankMutation, Long> {
    Optional<BankMutation> findByTransactionId(String transactionId);
    List<BankMutation> findByAccountNumberOrderByTransactionTimestampDesc(String accountNumber);
    List<BankMutation> findByAccountNumberAndTransactionTimestampBetweenOrderByTransactionTimestampDesc(
            String accountNumber, LocalDateTime from, LocalDateTime to);
    List<BankMutation> findTop20ByOrderByTransactionTimestampDesc();

    @Query("SELECT COALESCE(SUM(m.amount), 0) FROM BankMutation m WHERE m.type = 'CREDIT'")
    BigDecimal sumTotalCredit();

    @Query("SELECT COALESCE(SUM(m.amount), 0) FROM BankMutation m WHERE m.type = 'DEBIT'")
    BigDecimal sumTotalDebit();
}
