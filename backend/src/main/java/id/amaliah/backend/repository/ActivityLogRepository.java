package id.amaliah.backend.repository;

import id.amaliah.backend.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findTop20ByOrderByTimestampDesc();
    List<ActivityLog> findByCampaignIdOrderByTimestampDesc(Long campaignId);
    List<ActivityLog> findByActionTypeOrderByTimestampDesc(String actionType);
}
