package id.maun.backend.service;

import id.maun.backend.dto.DisbursementDto;
import id.maun.backend.exception.ResourceNotFoundException;
import id.maun.backend.model.ActivityLog;
import id.maun.backend.model.BankMutation;
import id.maun.backend.model.Campaign;
import id.maun.backend.model.Disbursement;
import id.maun.backend.repository.ActivityLogRepository;
import id.maun.backend.repository.BankMutationRepository;
import id.maun.backend.repository.CampaignRepository;
import id.maun.backend.repository.DisbursementRepository;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DisbursementService Unit Tests")
class DisbursementServiceTest {

    @Mock
    private DisbursementRepository disbursementRepository;

    @Mock
    private CampaignRepository campaignRepository;

    @Mock
    private BankMutationRepository bankMutationRepository;

    @Mock
    private ActivityLogRepository activityLogRepository;

    private BankIntegrationService bankIntegrationService;
    private SseNotificationService sseNotificationService;
    private DisbursementService disbursementService;

    private Campaign campaign;
    private Disbursement disbursement;

    static class FakeBankIntegrationService extends BankIntegrationService {
        public FakeBankIntegrationService() {
            super(null);
        }

        @Override
        public Map<String, Object> executeDisbursementTransfer(BigDecimal amount, String toAccount, String toBank, String remark, String ref) {
            Map<String, Object> result = new HashMap<>();
            result.put("referenceNo", "TXN-TRANSFER-999");
            result.put("status", "SUCCESS");
            return result;
        }
    }

    @BeforeEach
    void setUp() {
        bankIntegrationService = new FakeBankIntegrationService();
        sseNotificationService = new SseNotificationService();

        disbursementService = new DisbursementService(
                disbursementRepository,
                campaignRepository,
                bankMutationRepository,
                activityLogRepository,
                bankIntegrationService,
                sseNotificationService
        );

        campaign = Campaign.builder()
                .id(1L)
                .title("Operasional Santri Dhuafa")
                .targetAmount(new BigDecimal("50000000"))
                .collectedAmount(new BigDecimal("30000000"))
                .build();

        disbursement = Disbursement.builder()
                .id(1L)
                .disbursementNumber("DISB-2026-001")
                .campaignId(1L)
                .campaignTitle("Operasional Santri Dhuafa")
                .title("Pembelian Beras 500kg")
                .amount(new BigDecimal("7500000"))
                .beneficiaryName("Toko Sumber Pangan")
                .beneficiaryAccount("1234567890")
                .beneficiaryBank("BSI")
                .status("COMPLETED")
                .approvedBy("Bendahara MAUN")
                .disbursementDate(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("createDisbursement: Should execute bank transfer when flag is TRUE")
    void shouldCreateDisbursementWithBankTransfer() {
        when(campaignRepository.findById(1L)).thenReturn(Optional.of(campaign));
        when(disbursementRepository.save(any(Disbursement.class))).thenAnswer(inv -> {
            Disbursement d = inv.getArgument(0);
            d.setId(5L);
            return d;
        });

        DisbursementDto.CreateDisbursementRequest request = DisbursementDto.CreateDisbursementRequest.builder()
                .campaignId(1L)
                .title("Pembelian Beras 500kg")
                .amount(new BigDecimal("7500000"))
                .beneficiaryName("Toko Sumber Pangan")
                .beneficiaryAccount("1234567890")
                .beneficiaryBank("BSI")
                .executeBankTransfer(true)
                .build();

        DisbursementDto.DisbursementResponse response = disbursementService.createDisbursement(request, "Ustadz Fauzi");

        assertNotNull(response);
        assertEquals("Pembelian Beras 500kg", response.getTitle());
        assertEquals(new BigDecimal("7500000"), response.getAmount());
        assertEquals("COMPLETED", response.getStatus());
        assertEquals("TXN-TRANSFER-999", response.getBankTransactionId());
        assertEquals("Ustadz Fauzi", response.getApprovedBy());

        verify(disbursementRepository).save(any(Disbursement.class));
        verify(bankMutationRepository).save(any(BankMutation.class));
        verify(activityLogRepository).save(any(ActivityLog.class));
    }

    @Test
    @DisplayName("createDisbursement: Should not execute bank transfer when flag is FALSE")
    void shouldCreateDisbursementWithoutBankTransfer() {
        when(campaignRepository.findById(1L)).thenReturn(Optional.of(campaign));
        when(disbursementRepository.save(any(Disbursement.class))).thenAnswer(inv -> {
            Disbursement d = inv.getArgument(0);
            d.setId(6L);
            return d;
        });

        DisbursementDto.CreateDisbursementRequest request = DisbursementDto.CreateDisbursementRequest.builder()
                .campaignId(1L)
                .title("Bantuan Tunai Santri")
                .amount(new BigDecimal("1000000"))
                .executeBankTransfer(false)
                .build();

        DisbursementDto.DisbursementResponse response = disbursementService.createDisbursement(request, null);

        assertNotNull(response);
        assertNull(response.getBankTransactionId());
        assertEquals("Bendahara MAUN", response.getApprovedBy());
    }

    @Test
    @DisplayName("createDisbursement: Should throw ResourceNotFoundException when campaign does not exist")
    void shouldThrowWhenCampaignNotFound() {
        when(campaignRepository.findById(999L)).thenReturn(Optional.empty());

        DisbursementDto.CreateDisbursementRequest request = DisbursementDto.CreateDisbursementRequest.builder()
                .campaignId(999L)
                .amount(new BigDecimal("1000000"))
                .build();

        assertThrows(ResourceNotFoundException.class, () ->
                disbursementService.createDisbursement(request, "Admin"));
    }

    @Test
    @DisplayName("getCampaignDisbursements: Should return disbursements for specific campaign")
    void shouldReturnCampaignDisbursements() {
        when(disbursementRepository.findByCampaignIdOrderByDisbursementDateDesc(1L))
                .thenReturn(List.of(disbursement));

        List<DisbursementDto.DisbursementResponse> results = disbursementService.getCampaignDisbursements(1L);

        assertEquals(1, results.size());
        assertEquals("DISB-2026-001", results.get(0).getDisbursementNumber());
    }
}

