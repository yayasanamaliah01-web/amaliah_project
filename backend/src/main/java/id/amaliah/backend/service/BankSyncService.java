package id.amaliah.backend.service;

import id.amaliah.backend.model.BankMutation;
import id.amaliah.backend.repository.BankMutationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class BankSyncService {

    private final BankIntegrationService bankIntegrationService;
    private final BankMutationRepository mutationRepository;
    private final SseNotificationService sseNotificationService;

    @Value("${bank.api.account-number:7711223344}")
    private String accountNumber;

    /**
     * Sinkronisasi mutasi rekening bank secara terjadwal atau on-demand
     */
    @Transactional
    public int syncBankMutations() {
        log.info("Starting bank mutations synchronization for account {}", accountNumber);
        List<Map<String, Object>> statementData = bankIntegrationService.getBankStatement(null, null);

        int syncedCount = 0;
        for (Map<String, Object> item : statementData) {
            String txnId = (String) item.get("transactionId");
            if (txnId == null) continue;

            if (mutationRepository.findByTransactionId(txnId).isEmpty()) {
                @SuppressWarnings("unchecked")
                Map<String, Object> amountMap = (Map<String, Object>) item.get("amount");
                BigDecimal amount = amountMap != null ? new BigDecimal((String) amountMap.get("value")) : BigDecimal.ZERO;
                String type = (String) item.get("type");
                String desc = (String) item.get("description");
                String dateStr = (String) item.get("dateTime");

                LocalDateTime timestamp = LocalDateTime.now();
                if (dateStr != null) {
                    try {
                        timestamp = LocalDateTime.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                    } catch (Exception ignored) {}
                }

                BankMutation mutation = BankMutation.builder()
                        .transactionId(txnId)
                        .accountNumber(accountNumber)
                        .type(type)
                        .amount(amount)
                        .description(desc)
                        .reference((String) item.get("partnerReferenceNo"))
                        .balanceAfter(null)
                        .category("CREDIT".equals(type) ? "DONASI_MASUK" : "PENCAIRAN_DANA")
                        .isReconciled(true)
                        .transactionTimestamp(timestamp)
                        .syncedAt(LocalDateTime.now())
                        .build();

                mutationRepository.save(mutation);
                syncedCount++;
            }
        }

        log.info("Bank synchronization completed. {} new mutations imported.", syncedCount);

        // Broadcast real-time SSE event to all connected clients
        Map<String, Object> eventData = Map.of(
                "type", "BANK_SYNCED",
                "syncedCount", syncedCount,
                "timestamp", LocalDateTime.now().toString()
        );
        sseNotificationService.broadcast("BANK_SYNCED", eventData);

        return syncedCount;
    }

    public BigDecimal getLiveBankBalance() {
        return bankIntegrationService.inquireBalance();
    }
}
