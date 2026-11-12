package id.maun.bank.service;

import id.maun.bank.model.SimMerchant;
import id.maun.bank.model.SimVirtualAccount;
import id.maun.bank.repository.SimMerchantRepository;
import id.maun.bank.repository.SimVirtualAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class VirtualAccountService {

    private final SimVirtualAccountRepository vaRepo;
    private final SimMerchantRepository merchantRepo;
    private final AccountService accountService;
    private final CallbackService callbackService;

    @Transactional
    public SimVirtualAccount createVa(String merchantId, String orderId,
                                       BigDecimal amount, String bankCode, String callbackUrl) {
        SimMerchant merchant = merchantRepo.findByMerchantId(merchantId)
                .orElseThrow(() -> new RuntimeException("Merchant not found: " + merchantId));

        // Generate VA number: prefix + random digits (like real bank VA)
        String vaNumber = "9090" + merchant.getAccountNumber().substring(0, 6)
                + String.format("%04d", (int)(Math.random() * 10000));

        String effectiveCallback = (callbackUrl != null && !callbackUrl.isBlank())
                ? callbackUrl : merchant.getCallbackUrl();

        SimVirtualAccount va = SimVirtualAccount.builder()
                .vaNumber(vaNumber)
                .merchantId(merchantId)
                .orderId(orderId)
                .amount(amount)
                .bankCode(bankCode != null ? bankCode : "BSI")
                .status("PENDING")
                .callbackUrl(effectiveCallback)
                .accountNumber(merchant.getAccountNumber())
                .expiredAt(LocalDateTime.now().plusHours(24))
                .build();

        log.info("Created VA {} for order {} amount {}", vaNumber, orderId, amount);
        return vaRepo.save(va);
    }

    public SimVirtualAccount getVaStatus(String vaNumber) {
        return vaRepo.findByVaNumber(vaNumber)
                .orElseThrow(() -> new RuntimeException("VA not found: " + vaNumber));
    }

    public SimVirtualAccount getVaByOrderId(String orderId) {
        return vaRepo.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("VA not found for order: " + orderId));
    }

    @Transactional
    public SimVirtualAccount simulatePayment(String vaNumber) {
        SimVirtualAccount va = getVaStatus(vaNumber);

        if (!"PENDING".equals(va.getStatus())) {
            throw new RuntimeException("VA is not in PENDING status: " + va.getStatus());
        }

        if (va.getExpiredAt().isBefore(LocalDateTime.now())) {
            va.setStatus("EXPIRED");
            vaRepo.save(va);
            throw new RuntimeException("VA has expired");
        }

        // Process payment
        va.setStatus("PAID");
        va.setPaidAt(LocalDateTime.now());
        vaRepo.save(va);

        // Credit merchant account
        accountService.creditAccount(
                va.getAccountNumber(),
                va.getAmount(),
                "Transfer VA " + va.getVaNumber() + " - " + va.getOrderId(),
                va.getVaNumber()
        );

        // Send callback
        callbackService.sendPaymentCallback(
                va.getCallbackUrl(),
                "VIRTUAL_ACCOUNT",
                va.getOrderId(),
                va.getVaNumber(),
                va.getAmount(),
                va.getMerchantId()
        );

        log.info("VA {} PAID for order {} amount {}", vaNumber, va.getOrderId(), va.getAmount());
        return va;
    }
}
