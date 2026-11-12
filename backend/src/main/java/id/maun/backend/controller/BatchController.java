package id.maun.backend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/batch")
@RequiredArgsConstructor
@Slf4j
public class BatchController {

    private final JobLauncher jobLauncher;
    private final Job reconciliationJob;

    @PostMapping("/reconcile")
    public ResponseEntity<?> triggerManualReconciliation() {
        try {
            log.info("Manual trigger of Spring Batch Reconciliation Job requested...");
            JobParameters params = new JobParametersBuilder()
                    .addLong("time", System.currentTimeMillis())
                    .toJobParameters();

            var execution = jobLauncher.run(reconciliationJob, params);

            return ResponseEntity.ok(Map.of(
                    "status", execution.getStatus().toString(),
                    "exitCode", execution.getExitStatus().getExitCode(),
                    "jobId", execution.getJobId(),
                    "startTime", execution.getStartTime() != null ? execution.getStartTime().toString() : LocalDateTime.now().toString(),
                    "message", "Spring Batch reconciliation job executed successfully"
            ));
        } catch (Exception e) {
            log.error("Failed to execute manual batch reconciliation: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "Failed to launch batch job",
                    "details", e.getMessage()
            ));
        }
    }
}
