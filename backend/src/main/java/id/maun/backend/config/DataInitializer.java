package id.maun.backend.config;

import id.maun.backend.model.*;
import id.maun.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CampaignRepository campaignRepository;
    private final DonationRepository donationRepository;
    private final DisbursementRepository disbursementRepository;
    private final LpjRepository lpjRepository;
    private final BankMutationRepository mutationRepository;
    private final ActivityLogRepository activityLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initUsers();
        initCampaigns();
        initDonations();
        initDisbursements();
        initLpj();
        initBankMutations();
        initActivityLogs();
        log.info("MAUN Backend default seed data initialized successfully!");
    }

    private void initUsers() {
        upsertUser("Admin Pesantren Amaliah", "admin@amaliah.id", "admin123", "081234567890", Role.ADMIN);
        upsertUser("Ustadz Ahmad Fauzi (Bendahara)", "bendahara@amaliah.id", "bendahara123", "081234567891", Role.BENDAHARA);
        upsertUser("Ustadz M. Syarif (Pengurus Asrama)", "relawan@amaliah.id", "relawan123", "081234567892", Role.RELAWAN);
        upsertUser("H. Budi Pratama (Wali Santri)", "donatur@example.com", "donatur123", "081234567893", Role.DONATUR);
        upsertUser("Ahmad Donatur", "ahmad@example.com", "user123", "081234567894", Role.DONATUR);
        log.info("Seeded & synchronized demo users for Pesantren Amaliah");
    }

    private void upsertUser(String name, String email, String rawPassword, String phone, Role role) {
        userRepository.findByEmail(email).ifPresentOrElse(
                user -> {
                    user.setName(name);
                    user.setPassword(passwordEncoder.encode(rawPassword));
                    user.setRole(role);
                    user.setIsActive(true);
                    userRepository.save(user);
                },
                () -> {
                    userRepository.save(User.builder()
                            .name(name)
                            .email(email)
                            .password(passwordEncoder.encode(rawPassword))
                            .phone(phone)
                            .role(role)
                            .isActive(true)
                            .build());
                }
        );
    }

    private void initCampaigns() {
        if (campaignRepository.count() == 0) {
            campaignRepository.saveAll(List.of(
                    Campaign.builder()
                            .title("Operasional Dapur & Sedekah Beras Santri")
                            .slug("operasional-dapur-sedekah-beras-santri")
                            .category("Dapur & Beras Santri")
                            .targetAmount(new BigDecimal("50000000.00"))
                            .collectedAmount(new BigDecimal("42500000.00"))
                            .donorCount(560)
                            .remainingDays(8)
                            .image("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=60")
                            .description("Pemenuhan kebutuhan pangan pokok beras 1.5 ton/bulan dan lauk pauk bernutrisi harian bagi seluruh santri dan asatidz Pesantren Amaliah.")
                            .isUrgent(true)
                            .isVerified(true)
                            .location("Dapur Santri Amaliah")
                            .organizer("Dapur Berkah Amaliah")
                            .status("ACTIVE")
                            .build(),
                    Campaign.builder()
                            .title("Kafalah & Tunjangan Bulanan Asatidz Pembina Santri")
                            .slug("kafalah-tunjangan-bulanan-asatidz")
                            .category("Bisyarah Guru & Ustadz")
                            .targetAmount(new BigDecimal("50000000.00"))
                            .collectedAmount(new BigDecimal("35000000.00"))
                            .donorCount(390)
                            .remainingDays(16)
                            .image("https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=60")
                            .description("Penyaluran bisyarah dan tunjangan kehormatan bulanan bagi 15 ustadz pengajar tahfidz dan diniyah yang membina para santri.")
                            .isUrgent(false)
                            .isVerified(true)
                            .location("Pesantren Amaliah")
                            .organizer("Yayasan Pesantren Amaliah")
                            .status("ACTIVE")
                            .build(),
                    Campaign.builder()
                            .title("Operasional Listrik PLN, Pompa Air & Pemeliharaan Asrama")
                            .slug("operasional-listrik-pompa-air-pemeliharaan-asrama")
                            .category("Listrik, Air & Sarana")
                            .targetAmount(new BigDecimal("30000000.00"))
                            .collectedAmount(new BigDecimal("19200000.00"))
                            .donorCount(240)
                            .remainingDays(21)
                            .image("https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=60")
                            .description("Biaya utilitas rutin bulanan listrik pesantren, pemeliharaan pompa air bersih, dan kelayakan fasilitas asrama santri.")
                            .isUrgent(false)
                            .isVerified(true)
                            .location("Komplek Pesantren Amaliah")
                            .organizer("Pengelola Sarpras Pesantren")
                            .status("ACTIVE")
                            .build()
            ));
            log.info("Seeded 3 operational campaigns for Pesantren Amaliah");
        }
    }

    private void initDonations() {
        if (donationRepository.count() == 0) {
            donationRepository.saveAll(List.of(
                    Donation.builder()
                            .transactionId("DON-17112001-A101")
                            .campaignId(1L)
                            .campaignTitle("Bantuan Kemanusiaan Korban Gempa Sumbar")
                            .donorName("Hamba Allah")
                            .isAnonymous(true)
                            .amount(new BigDecimal("2500000.00"))
                            .doa("Semoga para korban diberikan ketabahan dan kekuatan menghadapi ujian ini.")
                            .paymentMethod("QRIS")
                            .paymentChannel("BSI")
                            .status("SUCCESS")
                            .bankTransactionId("TXN-BSI-9901")
                            .paidAt(LocalDateTime.now().minusHours(3))
                            .build(),
                    Donation.builder()
                            .transactionId("DON-17112002-A102")
                            .campaignId(1L)
                            .campaignTitle("Bantuan Kemanusiaan Korban Gempa Sumbar")
                            .donorName("H. Hendra Wijaya")
                            .isAnonymous(false)
                            .amount(new BigDecimal("10000000.00"))
                            .doa("Bismillah titip infak untuk saudara kita di Pasaman Barat.")
                            .paymentMethod("VIRTUAL_ACCOUNT")
                            .paymentChannel("BSI")
                            .status("SUCCESS")
                            .bankTransactionId("TXN-BSI-9902")
                            .paidAt(LocalDateTime.now().minusHours(8))
                            .build(),
                    Donation.builder()
                            .transactionId("DON-17112003-A103")
                            .campaignId(3L)
                            .campaignTitle("Operasi Jantung Balita Afnan (1.5 Tahun)")
                            .donorName("dr. Siti Aminah")
                            .isAnonymous(false)
                            .amount(new BigDecimal("5000000.00"))
                            .doa("Syafakallah dek Afnan, lekas sembuh dan bisa ceria kembali.")
                            .paymentMethod("QRIS")
                            .paymentChannel("BCA")
                            .status("SUCCESS")
                            .bankTransactionId("TXN-BSI-9903")
                            .paidAt(LocalDateTime.now().minusDays(1))
                            .build(),
                    Donation.builder()
                            .transactionId("DON-17112004-A104")
                            .campaignId(2L)
                            .campaignTitle("Renovasi Asrama Santri Penghafal Al-Qur'an")
                            .donorName("Keluarga Bpk. Subroto")
                            .isAnonymous(false)
                            .amount(new BigDecimal("1500000.00"))
                            .doa("Semoga menjadi amal jariyah bagi keluarga kami.")
                            .paymentMethod("QRIS")
                            .paymentChannel("GOPAY")
                            .status("SUCCESS")
                            .bankTransactionId("TXN-BSI-9904")
                            .paidAt(LocalDateTime.now().minusDays(2))
                            .build()
            ));
            log.info("Seeded initial donations");
        }
    }

    private void initDisbursements() {
        if (disbursementRepository.count() == 0) {
            disbursementRepository.saveAll(List.of(
                    Disbursement.builder()
                            .disbursementNumber("DISB-2026-001")
                            .campaignId(1L)
                            .campaignTitle("Bantuan Kemanusiaan Korban Gempa Sumbar")
                            .title("Pengadaan 500 Paket Sembako & Selimut Tahap 1")
                            .amount(new BigDecimal("75000000.00"))
                            .category("Logistik & Sembako")
                            .beneficiaryName("Posko Tanggap Bencana Pasaman Barat")
                            .beneficiaryAccount("1122334455")
                            .beneficiaryBank("BSI")
                            .status("COMPLETED")
                            .approvedBy("Ahmad Fauzi (Bendahara)")
                            .notes("Penyaluran langsung ke lokasi pengungsian Nagari Kajai, Pasaman Barat.")
                            .bankTransactionId("TXN-OUT-8001")
                            .disbursementDate(LocalDateTime.now().minusDays(5))
                            .build(),
                    Disbursement.builder()
                            .disbursementNumber("DISB-2026-002")
                            .campaignId(1L)
                            .campaignTitle("Bantuan Kemanusiaan Korban Gempa Sumbar")
                            .title("Sewa Alat Berat & Pembersihan Puing Bangunan")
                            .amount(new BigDecimal("50000000.00"))
                            .category("Infrastruktur Darurat")
                            .beneficiaryName("CV Karya Mandiri Utama")
                            .beneficiaryAccount("5566778899")
                            .beneficiaryBank("MANDIRI")
                            .status("COMPLETED")
                            .approvedBy("Ahmad Fauzi (Bendahara)")
                            .notes("Pembersihan reruntuhan fasilitas umum dan jalan desa.")
                            .bankTransactionId("TXN-OUT-8002")
                            .disbursementDate(LocalDateTime.now().minusDays(3))
                            .build(),
                    Disbursement.builder()
                            .disbursementNumber("DISB-2026-003")
                            .campaignId(3L)
                            .campaignTitle("Operasi Jantung Balita Afnan (1.5 Tahun)")
                            .title("Pembayaran DP Tindakan Operasi Jantung RSUP Kariadi")
                            .amount(new BigDecimal("45000000.00"))
                            .category("Medis & Tindakan")
                            .beneficiaryName("RSUP Dr. Kariadi Semarang")
                            .beneficiaryAccount("0099887766")
                            .beneficiaryBank("BNI")
                            .status("COMPLETED")
                            .approvedBy("Ahmad Fauzi (Bendahara)")
                            .notes("Biaya administrasi dan tindakan bedah katerisasi jantung.")
                            .bankTransactionId("TXN-OUT-8003")
                            .disbursementDate(LocalDateTime.now().minusDays(2))
                            .build(),
                    Disbursement.builder()
                            .disbursementNumber("DISB-2026-004")
                            .campaignId(4L)
                            .campaignTitle("Sumur Wakaf Air Bersih untuk Dusun Terpencil")
                            .title("Pengeboran Sumur Artesis 80m & Instalasi Toren")
                            .amount(new BigDecimal("45000000.00"))
                            .category("Konstruksi & Material")
                            .beneficiaryName("Kelompok Tirta Rahayu Gunungkidul")
                            .beneficiaryAccount("7788990011")
                            .beneficiaryBank("BSI")
                            .status("COMPLETED")
                            .approvedBy("Ahmad Fauzi (Bendahara)")
                            .notes("Pekerjaan selesai 100%, debit air mencapai 2.5 liter/detik.")
                            .bankTransactionId("TXN-OUT-8004")
                            .disbursementDate(LocalDateTime.now().minusDays(10))
                            .build()
            ));
            log.info("Seeded disbursements");
        }
    }

    private void initLpj() {
        if (lpjRepository.count() == 0) {
            String itemsPasamanJson = """
                    [
                      {"item": "Beras Premium 5kg @ Rp 75.000 x 500 sak", "amount": 37500000},
                      {"item": "Minyak Goreng 2L @ Rp 35.000 x 500 pouch", "amount": 17500000},
                      {"item": "Selimut Tebal Wool @ Rp 30.000 x 500 pcs", "amount": 15000000},
                      {"item": "Biaya Sewa Truk Logistik Semarang - Padang - Pasaman", "amount": 5000000}
                    ]
                    """;

            String itemsSumurJson = """
                    [
                      {"item": "Jasa Pengeboran Sumur Dalam 80 Meter", "amount": 22000000},
                      {"item": "Pompa Submersible Grundfos 1.5 HP & Aksesoris", "amount": 9500000},
                      {"item": "Toren Penampungan Air 2x 2000 Liter & Menara Besi", "amount": 8000000},
                      {"item": "Pipa HDPE Distribusi 600m & 4 Kran Umum", "amount": 5500000}
                    ]
                    """;

            lpjRepository.saveAll(List.of(
                    Lpj.builder()
                            .lpjNumber("LPJ-2026-001")
                            .campaignId(1L)
                            .campaignTitle("Bantuan Kemanusiaan Korban Gempa Sumbar")
                            .disbursementId(1L)
                            .title("LPJ Tahap 1: Penyaluran 500 Paket Logistik Pasaman Barat")
                            .summary("Telah disalurkan bantuan sembako dan selimut kepada 500 kepala keluarga di posko pengungsian Nagari Kajai, Kab. Pasaman Barat. Distribusi berjalan lancar didampingi oleh BPBD setempat.")
                            .totalSpent(new BigDecimal("75000000.00"))
                            .remainingFunds(BigDecimal.ZERO)
                            .beneficiaryCount(500)
                            .location("Nagari Kajai, Pasaman Barat, Sumbar")
                            .documentationUrls("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800,https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800")
                            .breakdownItemsJson(itemsPasamanJson)
                            .preparedBy("Siti Rahma (Koordinator Relawan)")
                            .verifiedBy("Ahmad Fauzi (Bendahara MAUN)")
                            .status("PUBLISHED")
                            .reportDate(LocalDateTime.now().minusDays(4))
                            .build(),
                    Lpj.builder()
                            .lpjNumber("LPJ-2026-002")
                            .campaignId(4L)
                            .campaignTitle("Sumur Wakaf Air Bersih untuk Dusun Terpencil")
                            .disbursementId(4L)
                            .title("LPJ Selesai: Serah Terima Sumur Wakaf Air Bersih")
                            .summary("Pembangunan sumur bor artesis kedalaman 80 meter beserta menara toren penampungan 4.000 liter telah selesai 100%. Air jernih dan layak konsumsi mengalir ke 4 titik kran umum melayani 350 KK.")
                            .totalSpent(new BigDecimal("45000000.00"))
                            .remainingFunds(BigDecimal.ZERO)
                            .beneficiaryCount(350)
                            .location("Dusun Girisekar, Gunungkidul")
                            .documentationUrls("https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800")
                            .breakdownItemsJson(itemsSumurJson)
                            .preparedBy("Siti Rahma (Koordinator Relawan)")
                            .verifiedBy("Ahmad Fauzi (Bendahara MAUN)")
                            .status("PUBLISHED")
                            .reportDate(LocalDateTime.now().minusDays(8))
                            .build()
            ));
            log.info("Seeded LPJ reports");
        }
    }

    private void initBankMutations() {
        if (mutationRepository.count() == 0) {
            mutationRepository.saveAll(List.of(
                    BankMutation.builder()
                            .transactionId("TXN-BSI-9901")
                            .accountNumber("7711223344")
                            .type("CREDIT")
                            .amount(new BigDecimal("2500000.00"))
                            .description("QRIS QRIS_MAUN_GEMPASUMBAR_01 - BSI")
                            .reference("DON-17112001-A101")
                            .balanceAfter(new BigDecimal("154500000.00"))
                            .category("DONASI_QRIS")
                            .relatedCampaignId(1L)
                            .relatedCampaignTitle("Bantuan Kemanusiaan Korban Gempa Sumbar")
                            .isReconciled(true)
                            .transactionTimestamp(LocalDateTime.now().minusHours(3))
                            .build(),
                    BankMutation.builder()
                            .transactionId("TXN-BSI-9902")
                            .accountNumber("7711223344")
                            .type("CREDIT")
                            .amount(new BigDecimal("10000000.00"))
                            .description("TRF VA 998812345678 - H Hendra Wijaya")
                            .reference("DON-17112002-A102")
                            .balanceAfter(new BigDecimal("152000000.00"))
                            .category("DONASI_VA")
                            .relatedCampaignId(1L)
                            .relatedCampaignTitle("Bantuan Kemanusiaan Korban Gempa Sumbar")
                            .isReconciled(true)
                            .transactionTimestamp(LocalDateTime.now().minusHours(8))
                            .build(),
                    BankMutation.builder()
                            .transactionId("TXN-OUT-8001")
                            .accountNumber("7711223344")
                            .type("DEBIT")
                            .amount(new BigDecimal("75000000.00"))
                            .description("Pencairan: Pengadaan 500 Paket Sembako Gempa Sumbar (DISB-2026-001)")
                            .reference("DISB-2026-001")
                            .balanceAfter(new BigDecimal("142000000.00"))
                            .category("PENCAIRAN_DANA")
                            .relatedCampaignId(1L)
                            .relatedCampaignTitle("Bantuan Kemanusiaan Korban Gempa Sumbar")
                            .isReconciled(true)
                            .transactionTimestamp(LocalDateTime.now().minusDays(5))
                            .build(),
                    BankMutation.builder()
                            .transactionId("TXN-OUT-8003")
                            .accountNumber("7711223344")
                            .type("DEBIT")
                            .amount(new BigDecimal("45000000.00"))
                            .description("Pencairan: Tindakan Operasi Jantung RS Kariadi (DISB-2026-003)")
                            .reference("DISB-2026-003")
                            .balanceAfter(new BigDecimal("217000000.00"))
                            .category("PENCAIRAN_DANA")
                            .relatedCampaignId(3L)
                            .relatedCampaignTitle("Operasi Jantung Balita Afnan (1.5 Tahun)")
                            .isReconciled(true)
                            .transactionTimestamp(LocalDateTime.now().minusDays(2))
                            .build()
            ));
            log.info("Seeded bank mutations");
        }
    }

    private void initActivityLogs() {
        if (activityLogRepository.count() == 0) {
            activityLogRepository.saveAll(List.of(
                    ActivityLog.builder()
                            .actionType("DONASI_MASUK")
                            .title("Donasi Masuk Rp 2.500.000")
                            .description("Donasi dari Hamba Allah untuk program: Bantuan Kemanusiaan Korban Gempa Sumbar")
                            .amount(new BigDecimal("2500000.00"))
                            .campaignId(1L)
                            .campaignTitle("Bantuan Kemanusiaan Korban Gempa Sumbar")
                            .actorName("Hamba Allah")
                            .iconType("arrow-down-left")
                            .timestamp(LocalDateTime.now().minusHours(3))
                            .build(),
                    ActivityLog.builder()
                            .actionType("DONASI_MASUK")
                            .title("Donasi Masuk Rp 10.000.000")
                            .description("Donasi dari H. Hendra Wijaya untuk program: Bantuan Kemanusiaan Korban Gempa Sumbar")
                            .amount(new BigDecimal("10000000.00"))
                            .campaignId(1L)
                            .campaignTitle("Bantuan Kemanusiaan Korban Gempa Sumbar")
                            .actorName("H. Hendra Wijaya")
                            .iconType("arrow-down-left")
                            .timestamp(LocalDateTime.now().minusHours(8))
                            .build(),
                    ActivityLog.builder()
                            .actionType("PENCAIRAN_DANA")
                            .title("Pencairan Dana Rp 45.000.000")
                            .description("Penyaluran untuk: Pembayaran DP Tindakan Operasi Jantung RSUP Kariadi (Operasi Jantung Balita Afnan)")
                            .amount(new BigDecimal("45000000.00"))
                            .campaignId(3L)
                            .campaignTitle("Operasi Jantung Balita Afnan (1.5 Tahun)")
                            .actorName("Ahmad Fauzi (Bendahara)")
                            .iconType("arrow-up-right")
                            .timestamp(LocalDateTime.now().minusDays(2))
                            .build(),
                    ActivityLog.builder()
                            .actionType("LPJ_DITERBITKAN")
                            .title("LPJ Diterbitkan: Penyaluran 500 Paket Logistik Pasaman Barat")
                            .description("Laporan pertanggungjawaban penyaluran dana untuk Bantuan Kemanusiaan Korban Gempa Sumbar telah diverifikasi dan dipublikasikan.")
                            .amount(new BigDecimal("75000000.00"))
                            .campaignId(1L)
                            .campaignTitle("Bantuan Kemanusiaan Korban Gempa Sumbar")
                            .actorName("Siti Rahma (Koordinator Relawan)")
                            .iconType("file-text")
                            .timestamp(LocalDateTime.now().minusDays(4))
                            .build()
            ));
            log.info("Seeded activity logs");
        }
    }
}
