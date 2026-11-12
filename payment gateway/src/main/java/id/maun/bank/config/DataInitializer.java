package id.maun.bank.config;

import id.maun.bank.model.SimBankAccount;
import id.maun.bank.model.SimMerchant;
import id.maun.bank.repository.SimBankAccountRepository;
import id.maun.bank.repository.SimMerchantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final SimBankAccountRepository accountRepo;
    private final SimMerchantRepository merchantRepo;

    @Override
    public void run(String... args) {
        // Seed default MAUN Foundation bank account
        if (accountRepo.findByAccountNumber("7711223344").isEmpty()) {
            SimBankAccount maunAccount = SimBankAccount.builder()
                    .accountNumber("7711223344")
                    .accountName("Yayasan Semarang Infak (MAUN)")
                    .accountType("TABUNGAN_BISNIS")
                    .balance(new BigDecimal("154500000.00")) // 154.5 million baseline
                    .isActive(true)
                    .build();
            accountRepo.save(maunAccount);
            log.info("Initialized default MAUN bank account: 7711223344");
        }

        // Seed default merchant credentials for BI-SNAP API access
        if (merchantRepo.findByMerchantId("MCH-MAUN-001").isEmpty()) {
            SimMerchant merchant = SimMerchant.builder()
                    .merchantId("MCH-MAUN-001")
                    .merchantName("Yayasan Semarang Infak")
                    .apiKey("CLIENT-MAUN-001")
                    .apiSecret("SECRET-MAUN-2026-KEY")
                    .accountNumber("7711223344")
                    .callbackUrl("http://localhost:8081/api/v1/bank-callback/notify")
                    .isActive(true)
                    .build();
            merchantRepo.save(merchant);
            log.info("Initialized default merchant client: MCH-MAUN-001");
        }
    }
}
