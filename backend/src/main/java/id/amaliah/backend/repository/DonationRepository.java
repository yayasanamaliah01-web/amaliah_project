package id.amaliah.backend.repository;

import id.amaliah.backend.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    Optional<Donation> findByTransactionId(String transactionId);
    List<Donation> findByCampaignIdOrderByCreatedAtDesc(Long campaignId);
    List<Donation> findByCampaignIdAndStatusOrderByCreatedAtDesc(Long campaignId, String status);
    List<Donation> findByStatusOrderByCreatedAtDesc(String status);
    List<Donation> findTop10ByStatusOrderByCreatedAtDesc(String status);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.status = 'SUCCESS'")
    BigDecimal sumTotalSuccessfulDonations();

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.campaignId = :campaignId AND d.status = 'SUCCESS'")
    BigDecimal sumSuccessfulDonationsByCampaignId(Long campaignId);

    @Query("SELECT COUNT(d) FROM Donation d WHERE d.campaignId = :campaignId AND d.status = 'SUCCESS'")
    Integer countSuccessfulDonationsByCampaignId(Long campaignId);
}
