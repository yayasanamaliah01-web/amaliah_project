package id.maun.bank.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import id.maun.bank.model.SimMerchant;
import id.maun.bank.model.SimQrisPayment;
import id.maun.bank.repository.SimMerchantRepository;
import id.maun.bank.repository.SimQrisPaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class QrisService {

    private final SimQrisPaymentRepository qrisRepo;
    private final SimMerchantRepository merchantRepo;
    private final AccountService accountService;
    private final CallbackService callbackService;

    @Transactional
    public SimQrisPayment generateQris(String merchantId, String orderId, BigDecimal amount, String callbackUrl) {
        SimMerchant merchant = merchantRepo.findByMerchantId(merchantId)
                .orElseThrow(() -> new RuntimeException("Merchant not found: " + merchantId));

        String qrisId = "QRIS-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        // EMVCo QRIS format (simplified)
        String qrisData = String.format(
                "00020101021226380014ID.CO.BSI.SIM0116%s0208%s5204539953033605405%s5802ID5913%s6007SEMARANG6304",
                merchant.getMerchantId(), orderId, amount.toPlainString(), merchant.getMerchantName()
        );

        // Generate QR code image as Base64
        String qrisImageUrl = generateQrCodeBase64(qrisData);

        String effectiveCallback = (callbackUrl != null && !callbackUrl.isBlank())
                ? callbackUrl : merchant.getCallbackUrl();

        SimQrisPayment payment = SimQrisPayment.builder()
                .qrisId(qrisId)
                .merchantId(merchantId)
                .orderId(orderId)
                .amount(amount)
                .qrisImageUrl(qrisImageUrl)
                .qrisRawData(qrisData)
                .status("PENDING")
                .callbackUrl(effectiveCallback)
                .accountNumber(merchant.getAccountNumber())
                .expiredAt(LocalDateTime.now().plusMinutes(30))
                .build();

        log.info("Generated QRIS {} for order {} amount {}", qrisId, orderId, amount);
        return qrisRepo.save(payment);
    }

    public SimQrisPayment getQrisStatus(String qrisId) {
        return qrisRepo.findByQrisId(qrisId)
                .orElseThrow(() -> new RuntimeException("QRIS not found: " + qrisId));
    }

    public SimQrisPayment getQrisByOrderId(String orderId) {
        return qrisRepo.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("QRIS not found for order: " + orderId));
    }

    @Transactional
    public SimQrisPayment simulatePayment(String qrisId) {
        SimQrisPayment payment = getQrisStatus(qrisId);

        if (!"PENDING".equals(payment.getStatus())) {
            throw new RuntimeException("QRIS is not in PENDING status: " + payment.getStatus());
        }

        if (payment.getExpiredAt().isBefore(LocalDateTime.now())) {
            payment.setStatus("EXPIRED");
            qrisRepo.save(payment);
            throw new RuntimeException("QRIS has expired");
        }

        // Process payment
        payment.setStatus("PAID");
        payment.setPaidAt(LocalDateTime.now());
        qrisRepo.save(payment);

        // Credit the merchant account
        accountService.creditAccount(
                payment.getAccountNumber(),
                payment.getAmount(),
                "Pembayaran QRIS - " + payment.getOrderId(),
                payment.getQrisId()
        );

        // Send callback notification
        callbackService.sendPaymentCallback(
                payment.getCallbackUrl(),
                "QRIS",
                payment.getOrderId(),
                payment.getQrisId(),
                payment.getAmount(),
                payment.getMerchantId()
        );

        log.info("QRIS {} PAID for order {} amount {}", qrisId, payment.getOrderId(), payment.getAmount());
        return payment;
    }

    private String generateQrCodeBase64(String data) {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.MARGIN, 2);
            BitMatrix matrix = writer.encode(data, BarcodeFormat.QR_CODE, 400, 400, hints);
            BufferedImage image = MatrixToImageWriter.toBufferedImage(matrix);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "PNG", baos);
            String base64 = Base64.getEncoder().encodeToString(baos.toByteArray());
            return "data:image/png;base64," + base64;
        } catch (WriterException | IOException e) {
            log.error("Failed to generate QR code: {}", e.getMessage());
            return "QR_GENERATION_FAILED";
        }
    }
}
