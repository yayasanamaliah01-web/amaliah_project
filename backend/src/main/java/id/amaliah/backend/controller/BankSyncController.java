package id.amaliah.backend.controller;

import id.amaliah.backend.service.BankSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/bank-sync")
@RequiredArgsConstructor
public class BankSyncController {

    private final BankSyncService bankSyncService;

    @PostMapping("/trigger")
    public ResponseEntity<?> triggerManualSync() {
        int count = bankSyncService.syncBankMutations();
        BigDecimal liveBalance = bankSyncService.getLiveBankBalance();
        return ResponseEntity.ok(Map.of(
                "message", "Bank synchronization completed",
                "syncedMutationsCount", count,
                "currentLiveBalance", liveBalance.toPlainString()
        ));
    }

    @GetMapping("/live-balance")
    public ResponseEntity<?> getLiveBalance() {
        BigDecimal liveBalance = bankSyncService.getLiveBankBalance();
        return ResponseEntity.ok(Map.of(
                "accountNumber", "7711223344",
                "accountName", "Yayasan Semarang Infak",
                "bank", "Bank Syariah Indonesia (BSI)",
                "liveBalance", liveBalance.toPlainString()
        ));
    }
}
