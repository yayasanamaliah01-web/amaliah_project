package id.amaliah.backend.service;

import id.amaliah.backend.dto.DonationDto;
import id.amaliah.backend.exception.ResourceNotFoundException;
import id.amaliah.backend.model.ActivityLog;
import id.amaliah.backend.model.BankMutation;
import id.amaliah.backend.model.Campaign;
import id.amaliah.backend.model.Donation;
import id.amaliah.backend.repository.ActivityLogRepository;
import id.amaliah.backend.repository.BankMutationRepository;
import id.amaliah.backend.repository.CampaignRepository;
import id.amaliah.backend.repository.DonationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DonationService Unit Tests")
class DonationServiceTest {

    @Mock
    private DonationRepository donationRepository;

    @Mock
    private CampaignRepository campaignRepository;

    @Mock
    private BankMutationRepository bankMutationRepository;

    @Mock
    private ActivityLogRepository activityLogRepository;

    private BankIntegrationService bankIntegrationService;
    private SseNotificationService sseNotificationService;
    private DonationService donationService;

    private Campaign campaign;
    private Donation donation;

    // Test double for BankIntegrationService
    static class FakeBankIntegrationService extends BankIntegrationService {
        public FakeBankIntegrationService() {
            super(null);
        }

        @Override
        public Map<String, Object> generateQris(BigDecimal amount, String orderId) {
            Map<String, Object> map = new HashMap<>();
            map.put("qrContent", "00020101021226...TESTQRIS");
            map.put("qrImageUrl", "https://api.bank.test/qris/img-123.png");
            return map;
        }

        @Override
        public Map<String, Object> createVirtualAccount(String vaNumber, BigDecimal amount, String customerName, String orderId) {
            Map<String, Object> map = new HashMap<>();
            map.put("virtualAccountNo", vaNumber);
            return map;
        }
    }

    @BeforeEach
    void setUp() {
        bankIntegrationService = new FakeBankIntegrationService();
        sseNotificationService = new SseNotificationService();

        donationService = new DonationService(
                donationRepository,
                campaignRepository,
                bankMutationRepository,
                activityLogRepository,
                bankIntegrationService,
                sseNotificationService
        );

        campaign = Campaign.builder()
                .id(1L)
                .title("Bantuan Pangan Santri")
                .targetAmount(new BigDecimal("50000000"))
                .collectedAmount(new BigDecimal("10000000"))
                .donorCount(10)
                .build();

        donation = Donation.builder()
                .id(1L)
                .transactionId("DON-1234567890-ABCD")
                .campaignId(1L)
                .campaignTitle("Bantuan Pangan Santri")
                .donorName("Budi Santoso")
                .donorEmail("budi@example.com")
                .amount(new BigDecimal("100000"))
                .isAnonymous(false)
                .paymentMethod("QRIS")
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("createDonation: Should create donation with QRIS details when method is QRIS")
    void shouldCreateDonationWithQris() {
        when(campaignRepository.findById(1L)).thenReturn(Optional.of(campaign));
        when(donationRepository.save(any(Donation.class))).thenAnswer(inv -> {
            Donation d = inv.getArgument(0);
            d.setId(10L);
            return d;
        });

        DonationDto.CreateDonationRequest request = DonationDto.CreateDonationRequest.builder()
                .campaignId(1L)
                .donorName("Budi Santoso")
                .donorEmail("budi@example.com")
                .amount(new BigDecimal("100000"))
                .paymentMethod("QRIS")
                .isAnonymous(false)
                .build();

        DonationDto.DonationResponse response = donationService.createDonation(request);

        assertNotNull(response);
        assertEquals("Bantuan Pangan Santri", response.getCampaignTitle());
        assertEquals(new BigDecimal("100000"), response.getAmount());
        assertEquals("PENDING", response.getStatus());
        assertEquals("00020101021226...TESTQRIS", response.getQrisString());
        assertEquals("https://api.bank.test/qris/img-123.png", response.getQrCodeUrl());

        verify(campaignRepository).findById(1L);
        verify(donationRepository).save(any(Donation.class));
    }

    @Test
    @DisplayName("createDonation: Should create donation with Virtual Account when method is VA")
    void shouldCreateDonationWithVirtualAccount() {
        when(campaignRepository.findById(1L)).thenReturn(Optional.of(campaign));
        when(donationRepository.save(any(Donation.class))).thenAnswer(inv -> {
            Donation d = inv.getArgument(0);
            d.setId(11L);
            return d;
        });

        DonationDto.CreateDonationRequest request = DonationDto.CreateDonationRequest.builder()
                .campaignId(1L)
                .donorName("Ahmad")
                .donorEmail("ahmad@example.com")
                .amount(new BigDecimal("250000"))
                .paymentMethod("VA")
                .paymentChannel("BSI")
                .isAnonymous(false)
                .build();

        DonationDto.DonationResponse response = donationService.createDonation(request);

        assertNotNull(response);
        assertNotNull(response.getVaNumber());
        assertTrue(response.getVaNumber().startsWith("9988"));
    }

    @Test
    @DisplayName("createDonation: Should throw ResourceNotFoundException when campaign does not exist")
    void shouldThrowWhenCampaignNotFound() {
        when(campaignRepository.findById(999L)).thenReturn(Optional.empty());

        DonationDto.CreateDonationRequest request = DonationDto.CreateDonationRequest.builder()
                .campaignId(999L)
                .amount(new BigDecimal("100000"))
                .build();

        assertThrows(ResourceNotFoundException.class, () -> donationService.createDonation(request));
    }

    @Test
    @DisplayName("getDonation: Should return donation by transactionId")
    void shouldReturnDonationByTransactionId() {
        when(donationRepository.findByTransactionId("DON-1234567890-ABCD")).thenReturn(Optional.of(donation));

        DonationDto.DonationResponse response = donationService.getDonation("DON-1234567890-ABCD");

        assertNotNull(response);
        assertEquals("DON-1234567890-ABCD", response.getTransactionId());
        assertEquals("Budi Santoso", response.getDonorName());
    }

    @Test
    @DisplayName("getDonation: Anonymous donor name should be masked as 'Hamba Allah'")
    void shouldMaskAnonymousDonorName() {
        donation.setIsAnonymous(true);
        when(donationRepository.findByTransactionId("DON-1234567890-ABCD")).thenReturn(Optional.of(donation));

        DonationDto.DonationResponse response = donationService.getDonation("DON-1234567890-ABCD");

        assertEquals("Hamba Allah", response.getDonorName());
    }

    @Test
    @DisplayName("processPaymentCallback: Should successfully process valid bank payment callback")
    void shouldProcessPaymentCallbackSuccessfully() {
        when(donationRepository.findByTransactionId("DON-1234567890-ABCD")).thenReturn(Optional.of(donation));
        when(campaignRepository.findById(1L)).thenReturn(Optional.of(campaign));

        Map<String, Object> payload = new HashMap<>();
        payload.put("transactionId", "BANK-TXN-001");
        payload.put("paymentType", "QRIS");
        payload.put("additionalInfo", Map.of("orderId", "DON-1234567890-ABCD"));
        payload.put("amount", Map.of("value", "100000.00"));

        boolean success = donationService.processPaymentCallback(payload);

        assertTrue(success);
        assertEquals("SUCCESS", donation.getStatus());
        assertEquals("BANK-TXN-001", donation.getBankTransactionId());

        verify(donationRepository).save(donation);
        verify(campaignRepository).incrementCollectedAmount(eq(1L), eq(new BigDecimal("100000.00")));
        verify(bankMutationRepository).save(any(BankMutation.class));
        verify(activityLogRepository).save(any(ActivityLog.class));
    }

    @Test
    @DisplayName("processPaymentCallback: Should be idempotent and return true if already SUCCESS")
    void shouldBeIdempotentIfAlreadySuccess() {
        donation.setStatus("SUCCESS");
        when(donationRepository.findByTransactionId("DON-1234567890-ABCD")).thenReturn(Optional.of(donation));

        Map<String, Object> payload = new HashMap<>();
        payload.put("additionalInfo", Map.of("orderId", "DON-1234567890-ABCD"));
        payload.put("amount", Map.of("value", "100000.00"));

        boolean success = donationService.processPaymentCallback(payload);

        assertTrue(success);
        verify(campaignRepository, never()).incrementCollectedAmount(any(), any());
    }

    @Test
    @DisplayName("processPaymentCallback: Should return false when orderId is missing")
    void shouldReturnFalseWhenOrderIdMissing() {
        Map<String, Object> payload = new HashMap<>();
        payload.put("amount", Map.of("value", "100000.00"));

        boolean success = donationService.processPaymentCallback(payload);

        assertFalse(success);
    }
}

