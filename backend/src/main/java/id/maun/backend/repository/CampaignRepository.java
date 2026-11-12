package id.maun.backend.repository;

import id.maun.backend.model.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    Optional<Campaign> findBySlug(String slug);
    List<Campaign> findByCategoryIgnoreCase(String category);
    List<Campaign> findByStatus(String status);
    List<Campaign> findByIsUrgentTrue();

    @Query("SELECT COALESCE(SUM(c.collectedAmount), 0) FROM Campaign c")
    BigDecimal sumTotalCollected();

    @Query("SELECT COALESCE(SUM(c.targetAmount), 0) FROM Campaign c")
    BigDecimal sumTotalTarget();

    @Query("SELECT COALESCE(SUM(c.donorCount), 0) FROM Campaign c")
    Long sumTotalDonors();

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.OPTIMISTIC_FORCE_INCREMENT)
    @Query("SELECT c FROM Campaign c WHERE c.id = :id")
    Optional<Campaign> findByIdWithOptimisticLock(Long id);

    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE Campaign c SET c.collectedAmount = c.collectedAmount + :amount, c.donorCount = c.donorCount + 1, c.updatedAt = CURRENT_TIMESTAMP WHERE c.id = :id")
    int incrementCollectedAmount(Long id, BigDecimal amount);
}
