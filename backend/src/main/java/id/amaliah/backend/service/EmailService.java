package id.amaliah.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
public class EmailService {

    private final RestTemplate restTemplate;
    private final String resendApiKey;
    private final String resendFromEmail;
    private final String resendApiUrl;

    public EmailService(
            RestTemplate restTemplate,
            @Value("${resend.api-key:}") String resendApiKey,
            @Value("${resend.from-email:Yayasan Amaliah <onboarding@resend.dev>}") String resendFromEmail,
            @Value("${resend.api-url:https://api.resend.com/emails}") String resendApiUrl
    ) {
        this.restTemplate = restTemplate;
        this.resendApiKey = resendApiKey;
        this.resendFromEmail = resendFromEmail;
        this.resendApiUrl = resendApiUrl;
    }

    public boolean sendEmail(String toEmail, String subject, String htmlContent) {
        if (!StringUtils.hasText(resendApiKey)) {
            log.warn("Resend API Key belum diatur. Email ke {} dibatalkan (simulasi log): {}", toEmail, subject);
            return false;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(resendApiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("from", resendFromEmail);
            body.put("to", Collections.singletonList(toEmail));
            body.put("subject", subject);
            body.put("html", htmlContent);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(resendApiUrl, HttpMethod.POST, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Email berhasil dikirim ke {} via Resend. Respon ID: {}", toEmail, response.getBody() != null ? response.getBody().get("id") : "OK");
                return true;
            } else {
                log.error("Gagal mengirim email via Resend ke {}: Status {}", toEmail, response.getStatusCode());
                return false;
            }
        } catch (Exception e) {
            log.error("Error saat mengirim email via Resend ke {}: {}", toEmail, e.getMessage());
            return false;
        }
    }

    public void sendPasswordResetEmail(String toEmail, String recipientName, String resetToken) {
        String subject = "🔑 Kode Verifikasi Reset Password - Yayasan Amaliah";
        String html = """
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"></head>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 24px; margin: 0;">
              <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
                <div style="background: linear-gradient(135deg, #059669 0%%, #047857 100%%); padding: 28px 24px; text-align: center; color: white;">
                  <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">Yayasan Pesantren Amaliah</h1>
                  <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">Lembaga Filantropi & ZISWAF Semarang</p>
                </div>
                <div style="padding: 28px 24px;">
                  <p style="font-size: 14px; color: #334155; margin-top: 0;">Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
                  <p style="font-size: 14px; color: #475569; line-height: 1.6;">
                    Yth. <strong>%s</strong>,<br>
                    Kami menerima permintaan untuk mereset kata sandi akun Anda di Portal Amaliah.
                  </p>
                  <div style="background-color: #f1f5f9; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; border: 1px dashed #cbd5e1;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Kode Verifikasi Reset</p>
                    <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #047857; font-family: monospace;">%s</div>
                    <p style="margin: 8px 0 0 0; font-size: 11px; color: #94a3b8;">Kode ini berlaku selama <strong>15 menit</strong>.</p>
                  </div>
                  <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
                    Masukkan kode di atas pada formulir reset password untuk membuat kata sandi baru Anda. Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini. Akun Anda tetap aman.
                  </p>
                  <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
                    Wassalamu'alaikum Warahmatullahi Wabarakatuh,<br>
                    <strong>Tim Pengurus Yayasan Pesantren Amaliah</strong>
                  </div>
                </div>
              </div>
            </body>
            </html>
            """.formatted(recipientName, resetToken);

        sendEmail(toEmail, subject, html);
    }

    public void sendPasswordChangedNotice(String toEmail, String recipientName) {
        String subject = "🔒 Notifikasi: Password Akun Amaliah Berhasil Diperbarui";
        String html = """
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"></head>
            <body style="font-family: sans-serif; background-color: #f8fafc; padding: 24px;">
              <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 14px; padding: 24px; border: 1px solid #e2e8f0;">
                <h2 style="color: #047857; margin-top: 0;">Password Berhasil Diubah</h2>
                <p style="font-size: 14px; color: #475569;">Yth. <strong>%s</strong>,</p>
                <p style="font-size: 14px; color: #475569;">Kata sandi akun Anda di Portal Yayasan Amaliah telah berhasil diperbarui pada %s.</p>
                <p style="font-size: 13px; color: #64748b;">Jika Anda tidak melakukan perubahan ini, segera hubungi sekretariat kami di info@amaliah.my.id.</p>
              </div>
            </body>
            </html>
            """.formatted(recipientName, LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm:ss")));

        sendEmail(toEmail, subject, html);
    }

    public void sendDonationReceiptEmail(String toEmail, String donorName, String transactionId, String campaignTitle, BigDecimal amount, String paymentMethod) {
        Locale idLocale = new Locale("id", "ID");
        NumberFormat rupiahFormat = NumberFormat.getCurrencyInstance(idLocale);
        rupiahFormat.setMaximumFractionDigits(0);
        String formattedAmount = rupiahFormat.format(amount);

        String subject = "🧾 Bukti Tanda Terima Donasi: " + transactionId + " - Yayasan Amaliah";
        String html = """
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"></head>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 24px; margin: 0;">
              <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
                <div style="background: linear-gradient(135deg, #059669 0%%, #047857 100%%); padding: 24px; text-align: center; color: white;">
                  <h2 style="margin: 0; font-size: 20px;">BUKTI TANDA TERIMA DONASI</h2>
                  <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Yayasan Pesantren Amaliah Semarang</p>
                </div>
                <div style="padding: 24px;">
                  <p style="font-size: 14px; color: #334155; margin-top: 0;">
                    <em>Jazakumullahu Khairan Katsiran</em>, Yth. <strong>%s</strong>.<br>
                    Donasi dan sedekah Anda telah kami terima dengan rincian sebagai berikut:
                  </p>
                  <table style="width: 100%%; font-size: 13px; color: #475569; border-collapse: collapse; margin: 18px 0;">
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 8px 0; color: #64748b;">No. Transaksi</td>
                      <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #0f172a;">%s</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 8px 0; color: #64748b;">Program Kebaikan</td>
                      <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #0f172a;">%s</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 8px 0; color: #64748b;">Metode Pembayaran</td>
                      <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #0f172a;">%s</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 8px 0; color: #64748b;">Tanggal & Waktu</td>
                      <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #0f172a;">%s</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; font-size: 15px; font-weight: 700; color: #047857;">Total Donasi</td>
                      <td style="padding: 12px 0; font-size: 18px; font-weight: 800; text-align: right; color: #047857;">%s</td>
                    </tr>
                  </table>
                  <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 16px; border-radius: 0 8px 8px 0; margin-top: 16px;">
                    <p style="margin: 0; font-size: 12px; color: #065f46; font-style: italic;">
                      "Semoga Allah memberikan pahala atas apa yang telah engkau berikan, menjadikannya penyuci bagimu, dan memberkahi harta yang masih ada padamu. Aamiin ya Rabbal 'Alamin."
                    </p>
                  </div>
                  <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
                    Bukti elektronik ini sah diterbitkan oleh Sistem Keuangan Yayasan Pesantren Amaliah.<br>
                    Website: <a href="https://amaliah.my.id" style="color: #047857;">https://amaliah.my.id</a>
                  </div>
                </div>
              </div>
            </body>
            </html>
            """.formatted(
                donorName,
                transactionId,
                campaignTitle,
                paymentMethod,
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm")),
                formattedAmount
            );

        sendEmail(toEmail, subject, html);
    }
}
