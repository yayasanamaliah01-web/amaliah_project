package id.maun.backend.batch;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReconciliationScheduler {

    private final JobLauncher jobLauncher;
    private final Job reconciliationJob;

    /**
     * Run reconciliation job automatically every night at 01:00 AM (or every hour for dev)
     */
    @Scheduled(cron = "${batch.reconciliation.cron:0 0 1 * * *}")
    public void runReconciliationJob() {
        try {
            log.info("Triggering scheduled Batch Reconciliation Job...");
            JobParameters params = new JobParametersBuilder()
                    .addLong("time", System.currentTimeMillis())
                    .toJobParameters();
            jobLauncher.run(reconciliationJob, params);
        } catch (Exception e) {
            log.error("Failed to run scheduled Batch Reconciliation Job: {}", e.getMessage(), e);
        }
    }
}
