package id.amaliah.backend.repository;

import id.amaliah.backend.model.Disbursement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface DisbursementRepository extends JpaRepository<Disbursement, Long> {
    Optional<Disbursement> findByDisbursementNumber(String disbursementNumber);
    List<Disbursement> findByCampaignIdOrderByDisbursementDateDesc(Long campaignId);
    List<Disbursement> findAllByOrderByDisbursementDateDesc();

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Disbursement d WHERE d.status = 'COMPLETED'")
    BigDecimal sumTotalDisbursed();

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Disbursement d WHERE d.campaignId = :campaignId AND d.status = 'COMPLETED'")
    BigDecimal sumDisbursedByCampaignId(Long campaignId);
}
