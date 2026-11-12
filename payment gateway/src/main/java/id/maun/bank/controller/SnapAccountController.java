package id.maun.bank.controller;

import id.maun.bank.model.SimBankAccount;
import id.maun.bank.model.SimTransaction;
import id.maun.bank.service.AccountService;
import id.maun.bank.service.AuthTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class SnapAccountController {

    private final AccountService accountService;
    private final AuthTokenService authService;

    /**
     * BI-SNAP: Balance Inquiry
     * POST /api/v1.0/balance-inquiry
     */
    @PostMapping("/api/v1.0/balance-inquiry")
    public ResponseEntity<?> balanceInquiry(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> request) {
        try {
            authService.validateToken(token);
            String accountNumber = request.get("accountNo");
            SimBankAccount account = accountService.getAccount(accountNumber);

            return ResponseEntity.ok(Map.of(
                    "responseCode", "2001100",
                    "responseMessage", "Successful",
                    "accountNo", account.getAccountNumber(),
                    "accountName", account.getAccountName(),
                    "accountType", account.getAccountType(),
                    "balance", Map.of("value", account.getBalance().toPlainString(), "currency", "IDR"),
                    "availableBalance", Map.of("value", account.getBalance().toPlainString(), "currency", "IDR")
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "responseCode", "4001100",
                    "responseMessage", e.getMessage()
            ));
        }
    }

    /**
     * BI-SNAP: Bank Statement (Mutation List)
     * POST /api/v1.0/bank-statement
     */
    @PostMapping("/api/v1.0/bank-statement")
    public ResponseEntity<?> bankStatement(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> request) {
        try {
            authService.validateToken(token);
            String accountNumber = request.get("accountNo");
            String fromDate = request.get("fromDate");
            String toDate = request.get("toDate");

            LocalDateTime from = fromDate != null ? LocalDate.parse(fromDate).atStartOfDay() : null;
            LocalDateTime to = toDate != null ? LocalDate.parse(toDate).atTime(23, 59, 59) : null;

            List<SimTransaction> mutations = accountService.getMutations(accountNumber, from, to);

            List<Map<String, Object>> data = mutations.stream().map(m -> Map.<String, Object>of(
                    "transactionId", m.getTransactionId(),
                    "date", m.getTimestamp().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                    "description", m.getDescription(),
                    "type", m.getType(),
                    "amount", Map.of("value", m.getAmount().toPlainString(), "currency", "IDR"),
                    "balanceAfter", Map.of("value", m.getBalanceAfter().toPlainString(), "currency", "IDR"),
                    "reference", m.getReference() != null ? m.getReference() : "",
                    "status", m.getStatus()
            )).collect(Collectors.toList());

            return ResponseEntity.ok(Map.of(
                    "responseCode", "2001400",
                    "responseMessage", "Successful",
                    "accountNo", accountNumber,
                    "totalRecords", data.size(),
                    "detailData", data
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "responseCode", "4001400",
                    "responseMessage", e.getMessage()
            ));
        }
    }
}
