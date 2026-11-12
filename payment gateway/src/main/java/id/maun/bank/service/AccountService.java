package id.maun.bank.service;

import id.maun.bank.model.*;
import id.maun.bank.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountService {

    private final SimBankAccountRepository accountRepo;
    private final SimTransactionRepository transactionRepo;

    public SimBankAccount getAccount(String accountNumber) {
        return accountRepo.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found: " + accountNumber));
    }

    public BigDecimal getBalance(String accountNumber) {
        return getAccount(accountNumber).getBalance();
    }

    public List<SimTransaction> getMutations(String accountNumber, LocalDateTime from, LocalDateTime to) {
        if (from != null && to != null) {
            return transactionRepo.findByAccountNumberAndTimestampBetweenOrderByTimestampDesc(
                    accountNumber, from, to);
        }
        return transactionRepo.findByAccountNumberOrderByTimestampDesc(accountNumber);
    }

    @Transactional
    public SimTransaction creditAccount(String accountNumber, BigDecimal amount,
                                         String description, String reference) {
        SimBankAccount account = getAccount(accountNumber);
        account.setBalance(account.getBalance().add(amount));
        accountRepo.save(account);

        String txnId = "TXN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        SimTransaction txn = SimTransaction.builder()
                .accountNumber(accountNumber)
                .transactionId(txnId)
                .type("CREDIT")
                .amount(amount)
                .description(description)
                .reference(reference)
                .balanceAfter(account.getBalance())
                .status("SUCCESS")
                .timestamp(LocalDateTime.now())
                .build();

        log.info("CREDIT {} to account {} | Balance: {}", amount, accountNumber, account.getBalance());
        return transactionRepo.save(txn);
    }

    @Transactional
    public SimTransaction debitAccount(String accountNumber, BigDecimal amount,
                                        String description, String reference) {
        SimBankAccount account = getAccount(accountNumber);
        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }
        account.setBalance(account.getBalance().subtract(amount));
        accountRepo.save(account);

        String txnId = "TXN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        SimTransaction txn = SimTransaction.builder()
                .accountNumber(accountNumber)
                .transactionId(txnId)
                .type("DEBIT")
                .amount(amount)
                .description(description)
                .reference(reference)
                .balanceAfter(account.getBalance())
                .status("SUCCESS")
                .timestamp(LocalDateTime.now())
                .build();

        log.info("DEBIT {} from account {} | Balance: {}", amount, accountNumber, account.getBalance());
        return transactionRepo.save(txn);
    }

    public SimBankAccount createAccount(String accountNumber, String accountName,
                                         String accountType, BigDecimal initialBalance) {
        SimBankAccount account = SimBankAccount.builder()
                .accountNumber(accountNumber)
                .accountName(accountName)
                .accountType(accountType)
                .balance(initialBalance != null ? initialBalance : BigDecimal.ZERO)
                .isActive(true)
                .build();
        return accountRepo.save(account);
    }

    public List<SimBankAccount> getAllAccounts() {
        return accountRepo.findAll();
    }
}
