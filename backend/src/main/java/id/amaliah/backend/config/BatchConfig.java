package id.amaliah.backend.config;

import id.amaliah.backend.model.Donation;

import id.amaliah.backend.repository.DonationRepository;
import id.amaliah.backend.service.BankIntegrationService;
import id.amaliah.backend.service.DonationService;
import id.amaliah.backend.service.SseNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.LocalDateTime;
import java.util.*;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class BatchConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final DonationRepository donationRepository;
    private final DonationService donationService;
    private final BankIntegrationService bankIntegrationService;
    private final SseNotificationService sseNotificationService;

    @Bean
    public Job reconciliationJob() {
        return new JobBuilder("reconciliationJob", jobRepository)
                .start(reconciliationStep())
                .build();
    }

    @Bean
    public Step reconciliationStep() {
        return new StepBuilder("reconciliationStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("Starting Spring Batch automated donation reconciliation job...");

                    // 1. Fetch expired PENDING donations
                    List<Donation> pendingDonations = donationRepository.findAll().stream()
                            .filter(d -> "PENDING".equalsIgnoreCase(d.getStatus()))
                            .toList();

                    log.info("Found {} pending donations to reconcile", pendingDonations.size());

                    // 2. Fetch recent bank statement
                    List<Map<String, Object>> statementData = bankIntegrationService.getBankStatement(null, null);

                    int autoConfirmed = 0;
                    int autoExpired = 0;

                    for (Donation donation : pendingDonations) {
                        // Check if bank statement contains matching partnerReferenceNo or transactionId
                        Optional<Map<String, Object>> matchedMutation = statementData.stream()
                                .filter(item -> {
                                    String partnerRef = (String) item.get("partnerReferenceNo");
                                    String txnId = (String) item.get("transactionId");
                                    return donation.getTransactionId().equalsIgnoreCase(partnerRef) ||
                                           donation.getTransactionId().equalsIgnoreCase(txnId);
                                })
                                .findFirst();

                        if (matchedMutation.isPresent()) {
                            Map<String, Object> callbackPayload = new HashMap<>();
                            callbackPayload.put("transactionId", matchedMutation.get().get("transactionId"));
                            callbackPayload.put("paymentType", donation.getPaymentMethod());
                            callbackPayload.put("additionalInfo", Map.of("orderId", donation.getTransactionId()));
                            callbackPayload.put("amount", Map.of("value", donation.getAmount().toPlainString()));

                            donationService.processPaymentCallback(callbackPayload);
                            autoConfirmed++;
                            log.info("Batch Reconciled: Marked donation {} as SUCCESS from bank statement", donation.getTransactionId());
                        } else if (donation.getExpiresAt() != null && donation.getExpiresAt().isBefore(LocalDateTime.now())) {
                            donation.setStatus("EXPIRED");
                            donationRepository.save(donation);
                            autoExpired++;
                            log.info("Batch Reconciled: Marked donation {} as EXPIRED", donation.getTransactionId());
                        }
                    }

                    log.info("Reconciliation Batch complete. Confirmed: {}, Expired: {}", autoConfirmed, autoExpired);

                    // Broadcast SSE Notification summary
                    Map<String, Object> summary = Map.of(
                            "type", "BATCH_RECONCILIATION_COMPLETE",
                            "autoConfirmed", autoConfirmed,
                            "autoExpired", autoExpired,
                            "timestamp", LocalDateTime.now().toString()
                    );
                    sseNotificationService.broadcast("BATCH_RECONCILIATION_COMPLETE", summary);

                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }
}
