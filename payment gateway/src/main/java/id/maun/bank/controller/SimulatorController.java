package id.maun.bank.controller;

import id.maun.bank.model.SimBankAccount;
import id.maun.bank.repository.SimQrisPaymentRepository;
import id.maun.bank.repository.SimVirtualAccountRepository;
import id.maun.bank.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Simulator Control Panel — endpoints khusus untuk mengelola simulator.
 * Tidak ada di bank asli, hanya untuk development/testing.
 */
@RestController
@RequestMapping("/sim")
@RequiredArgsConstructor
public class SimulatorController {

    private final AccountService accountService;
    private final SimQrisPaymentRepository qrisRepo;
    private final SimVirtualAccountRepository vaRepo;

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard() {
        var accounts = accountService.getAllAccounts();
        long totalQris = qrisRepo.count();
        long totalVa = vaRepo.count();

        return ResponseEntity.ok(Map.of(
                "status", "Bank Simulator is RUNNING",
                "bankName", "BSI Simulator (Bank Syariah Indonesia)",
                "totalAccounts", accounts.size(),
                "totalQrisTransactions", totalQris,
                "totalVaTransactions", totalVa,
                "accounts", accounts.stream().map(a -> Map.of(
                        "accountNumber", a.getAccountNumber(),
                        "accountName", a.getAccountName(),
                        "balance", a.getBalance().toPlainString(),
                        "type", a.getAccountType()
                )).toList()
        ));
    }

    @PostMapping("/accounts")
    public ResponseEntity<?> createAccount(@RequestBody Map<String, String> request) {
        SimBankAccount account = accountService.createAccount(
                request.get("accountNumber"),
                request.get("accountName"),
                request.getOrDefault("accountType", "TABUNGAN"),
                request.containsKey("balance") ? new BigDecimal(request.get("balance")) : BigDecimal.ZERO
        );
        return ResponseEntity.ok(Map.of(
                "message", "Account created",
                "accountNumber", account.getAccountNumber(),
                "balance", account.getBalance().toPlainString()
        ));
    }

    @PostMapping("/accounts/{accountNumber}/deposit")
    public ResponseEntity<?> deposit(
            @PathVariable String accountNumber,
            @RequestBody Map<String, String> request) {
        BigDecimal amount = new BigDecimal(request.get("amount"));
        String description = request.getOrDefault("description", "Manual deposit");
        var txn = accountService.creditAccount(accountNumber, amount, description, "SIM-DEPOSIT");
        return ResponseEntity.ok(Map.of(
                "message", "Deposit successful",
                "transactionId", txn.getTransactionId(),
                "amount", txn.getAmount().toPlainString(),
                "balanceAfter", txn.getBalanceAfter().toPlainString()
        ));
    }
}
