package id.maun.bank.repository;

import id.maun.bank.model.SimQrisPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SimQrisPaymentRepository extends JpaRepository<SimQrisPayment, Long> {
    Optional<SimQrisPayment> findByQrisId(String qrisId);
    Optional<SimQrisPayment> findByOrderId(String orderId);
}
