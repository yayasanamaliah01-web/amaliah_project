package id.amaliah.backend.service;

import id.amaliah.backend.dto.CampaignDto;
import id.amaliah.backend.dto.TransparencyDto;
import id.amaliah.backend.model.ActivityLog;
import id.amaliah.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TransparencyService Unit Tests")
class TransparencyServiceTest {

    @Mock
    private CampaignRepository campaignRepository;

    @Mock
    private DonationRepository donationRepository;

    @Mock
    private DisbursementRepository disbursementRepository;

    @Mock
    private LpjRepository lpjRepository;

    @Mock
    private BankMutationRepository bankMutationRepository;

    @Mock
    private ActivityLogRepository activityLogRepository;

    @Mock
    private CampaignService campaignService;

    @Mock
    private DonationService donationService;

    @Mock
    private DisbursementService disbursementService;

    @Mock
    private LpjService lpjService;

    private BankIntegrationService bankIntegrationService;
    private TransparencyService transparencyService;

    static class FakeBankIntegrationService extends BankIntegrationService {
        public FakeBankIntegrationService() {
            super(null);
        }

        @Override
        public BigDecimal inquireBalance() {
            return new BigDecimal("125000000");
        }
    }

    @BeforeEach
    void setUp() {
        bankIntegrationService = new FakeBankIntegrationService();

        transparencyService = new TransparencyService(
                campaignRepository,
                donationRepository,
                disbursementRepository,
                lpjRepository,
                bankMutationRepository,
                activityLogRepository,
                bankIntegrationService,
                campaignService,
                donationService,
                disbursementService,
                lpjService
        );
    }

    @Test
    @DisplayName("getPublicSummary: Should return aggregated metrics and bank balance")
    void shouldReturnPublicSummary() {
        when(donationRepository.sumTotalSuccessfulDonations()).thenReturn(new BigDecimal("150000000"));
        when(disbursementRepository.sumTotalDisbursed()).thenReturn(new BigDecimal("25000000"));
        when(donationRepository.count()).thenReturn(150L);
        when(campaignRepository.count()).thenReturn(5L);
        when(disbursementRepository.count()).thenReturn(12L);
        when(lpjRepository.count()).thenReturn(4L);

        TransparencyDto.PublicSummary summary = transparencyService.getPublicSummary();

        assertNotNull(summary);
        assertEquals(new BigDecimal("150000000"), summary.getTotalDonationsCollected());
        assertEquals(new BigDecimal("25000000"), summary.getTotalFundsDisbursed());
        assertEquals(new BigDecimal("125000000"), summary.getCurrentLiveBankBalance());
        assertEquals(150L, summary.getTotalDonors());
        assertEquals(5L, summary.getTotalCampaigns());
        assertEquals(12L, summary.getTotalDisbursements());
        assertEquals(4L, summary.getTotalLpjPublished());
        assertEquals("7711223344", summary.getBankAccountNumber());
    }

    @Test
    @DisplayName("getCampaignTransparency: Should calculate correct remaining balance and include logs")
    void shouldReturnCampaignTransparencyDetail() {
        Long campaignId = 1L;

        CampaignDto.CampaignResponse mockCampaign = CampaignDto.CampaignResponse.builder()
                .id(campaignId)
                .title("Renovasi Asrama Santri")
                .targetAmount(new BigDecimal("100000000"))
                .build();

        ActivityLog log = ActivityLog.builder()
                .id(1L)
                .actionType("DONASI_MASUK")
                .title("Donasi Masuk Rp 500,000")
                .amount(new BigDecimal("500000"))
                .campaignId(campaignId)
                .timestamp(LocalDateTime.now())
                .build();

        when(campaignService.getCampaignById(campaignId)).thenReturn(mockCampaign);
        when(donationService.getCampaignDonations(campaignId)).thenReturn(List.of());
        when(disbursementService.getCampaignDisbursements(campaignId)).thenReturn(List.of());
        when(lpjService.getCampaignLpjReports(campaignId)).thenReturn(List.of());
        when(donationRepository.sumSuccessfulDonationsByCampaignId(campaignId)).thenReturn(new BigDecimal("70000000"));
        when(disbursementRepository.sumDisbursedByCampaignId(campaignId)).thenReturn(new BigDecimal("20000000"));
        when(activityLogRepository.findByCampaignIdOrderByTimestampDesc(campaignId)).thenReturn(List.of(log));

        TransparencyDto.CampaignTransparencyDetail detail = transparencyService.getCampaignTransparency(campaignId);

        assertNotNull(detail);
        assertEquals(new BigDecimal("70000000"), detail.getTotalCollected());
        assertEquals(new BigDecimal("20000000"), detail.getTotalDisbursed());
        assertEquals(new BigDecimal("50000000"), detail.getRemainingBalance());
        assertEquals(1, detail.getActivityLogs().size());
        assertEquals("DONASI_MASUK", detail.getActivityLogs().get(0).getActionType());
    }
}

