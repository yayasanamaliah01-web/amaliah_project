package id.maun.backend.repository;

import id.maun.backend.model.Lpj;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LpjRepository extends JpaRepository<Lpj, Long> {
    Optional<Lpj> findByLpjNumber(String lpjNumber);
    List<Lpj> findByCampaignIdOrderByReportDateDesc(Long campaignId);
    List<Lpj> findByStatusOrderByReportDateDesc(String status);
    Optional<Lpj> findByDisbursementId(Long disbursementId);
}
