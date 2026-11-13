package id.amaliah.backend.service;

import id.amaliah.backend.dto.CampaignDto;
import id.amaliah.backend.exception.ResourceNotFoundException;
import id.amaliah.backend.model.Campaign;
import id.amaliah.backend.repository.CampaignRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CampaignService Unit Tests")
class CampaignServiceTest {

    @Mock
    private CampaignRepository campaignRepository;

    @InjectMocks
    private CampaignService campaignService;

    private Campaign campaign;
    private CampaignDto.CreateCampaignRequest createRequest;

    @BeforeEach
    void setUp() {
        campaign = Campaign.builder()
                .id(1L)
                .title("Renovasi Asrama Santri")
                .slug("renovasi-asrama-santri")
                .category("Pendidikan")
                .targetAmount(new BigDecimal("100000000"))
                .collectedAmount(new BigDecimal("50000000"))
                .donorCount(25)
                .remainingDays(15)
                .image("https://example.com/image.jpg")
                .description("Bantuan renovasi asrama santri dhuafa")
                .isUrgent(true)
                .isVerified(true)
                .location("Semarang")
                .organizer("Amaliah Foundation")
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        createRequest = CampaignDto.CreateCampaignRequest.builder()
                .title("Pembangunan Masjid Santri")
                .category("Infrastruktur")
                .targetAmount(new BigDecimal("200000000"))
                .remainingDays(60)
                .image("https://example.com/masjid.jpg")
                .description("Pembangunan ruang sholat santri")
                .isUrgent(false)
                .location("Semarang")
                .organizer("Pesantren Amaliah")
                .build();
    }

    @Test
    @DisplayName("getAllCampaigns: Should return all campaigns when no filter provided")
    void shouldReturnAllCampaignsWithoutFilters() {
        when(campaignRepository.findAll()).thenReturn(List.of(campaign));

        List<CampaignDto.CampaignResponse> results = campaignService.getAllCampaigns(null, null);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("Renovasi Asrama Santri", results.get(0).getTitle());
        assertEquals(50.0, results.get(0).getProgressPercentage());
        verify(campaignRepository).findAll();
    }

    @Test
    @DisplayName("getAllCampaigns: Should filter by category")
    void shouldFilterByCategory() {
        when(campaignRepository.findByCategoryIgnoreCase("Pendidikan")).thenReturn(List.of(campaign));

        List<CampaignDto.CampaignResponse> results = campaignService.getAllCampaigns("Pendidikan", null);

        assertEquals(1, results.size());
        verify(campaignRepository).findByCategoryIgnoreCase("Pendidikan");
        verify(campaignRepository, never()).findAll();
    }

    @Test
    @DisplayName("getAllCampaigns: Should filter by status")
    void shouldFilterByStatus() {
        when(campaignRepository.findByStatus("ACTIVE")).thenReturn(List.of(campaign));

        List<CampaignDto.CampaignResponse> results = campaignService.getAllCampaigns(null, "ACTIVE");

        assertEquals(1, results.size());
        verify(campaignRepository).findByStatus("ACTIVE");
    }

    @Test
    @DisplayName("getCampaignById: Should return campaign when found")
    void shouldReturnCampaignWhenIdExists() {
        when(campaignRepository.findById(1L)).thenReturn(Optional.of(campaign));

        CampaignDto.CampaignResponse result = campaignService.getCampaignById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Renovasi Asrama Santri", result.getTitle());
    }

    @Test
    @DisplayName("getCampaignById: Should throw ResourceNotFoundException when not found")
    void shouldThrowWhenCampaignIdNotFound() {
        when(campaignRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> campaignService.getCampaignById(999L));
    }

    @Test
    @DisplayName("getCampaignBySlug: Should return campaign when slug found")
    void shouldReturnCampaignWhenSlugExists() {
        when(campaignRepository.findBySlug("renovasi-asrama-santri")).thenReturn(Optional.of(campaign));

        CampaignDto.CampaignResponse result = campaignService.getCampaignBySlug("renovasi-asrama-santri");

        assertNotNull(result);
        assertEquals("renovasi-asrama-santri", result.getSlug());
    }

    @Test
    @DisplayName("createCampaign: Should auto generate slug if not provided")
    void shouldCreateCampaignWithAutoGeneratedSlug() {
        when(campaignRepository.save(any(Campaign.class))).thenAnswer(invocation -> {
            Campaign c = invocation.getArgument(0);
            c.setId(2L);
            return c;
        });

        CampaignDto.CampaignResponse created = campaignService.createCampaign(createRequest);

        assertNotNull(created);
        assertEquals("pembangunan-masjid-santri", created.getSlug());
        assertEquals(BigDecimal.ZERO, created.getCollectedAmount());
        assertEquals(0, created.getDonorCount());
        assertEquals("ACTIVE", created.getStatus());
        verify(campaignRepository).save(any(Campaign.class));
    }

    @Test
    @DisplayName("createCampaign: Should use custom slug when provided")
    void shouldCreateCampaignWithCustomSlug() {
        createRequest.setSlug("custom-slug-masjid");
        when(campaignRepository.save(any(Campaign.class))).thenAnswer(invocation -> {
            Campaign c = invocation.getArgument(0);
            c.setId(2L);
            return c;
        });

        CampaignDto.CampaignResponse created = campaignService.createCampaign(createRequest);

        assertEquals("custom-slug-masjid", created.getSlug());
    }

    @Test
    @DisplayName("updateCampaign: Should successfully update existing campaign")
    void shouldUpdateExistingCampaign() {
        when(campaignRepository.findById(1L)).thenReturn(Optional.of(campaign));
        when(campaignRepository.save(any(Campaign.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CampaignDto.CreateCampaignRequest updateRequest = CampaignDto.CreateCampaignRequest.builder()
                .title("Renovasi Total Asrama Santri")
                .targetAmount(new BigDecimal("150000000"))
                .build();

        CampaignDto.CampaignResponse updated = campaignService.updateCampaign(1L, updateRequest);

        assertEquals("Renovasi Total Asrama Santri", updated.getTitle());
        assertEquals(new BigDecimal("150000000"), updated.getTargetAmount());
        verify(campaignRepository).save(campaign);
    }

    @Test
    @DisplayName("updateCampaign: Should throw ResourceNotFoundException when ID does not exist")
    void shouldThrowWhenUpdatingNonExistentCampaign() {
        when(campaignRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                campaignService.updateCampaign(999L, createRequest));
    }

    @Test
    @DisplayName("deleteCampaign: Should delete campaign when ID exists")
    void shouldDeleteCampaignSuccessfully() {
        when(campaignRepository.existsById(1L)).thenReturn(true);

        assertDoesNotThrow(() -> campaignService.deleteCampaign(1L));

        verify(campaignRepository).deleteById(1L);
    }

    @Test
    @DisplayName("deleteCampaign: Should throw ResourceNotFoundException when ID does not exist")
    void shouldThrowWhenDeletingNonExistentCampaign() {
        when(campaignRepository.existsById(999L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> campaignService.deleteCampaign(999L));
        verify(campaignRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("toResponse: Progress percentage should handle 0 targetAmount safely")
    void shouldHandleZeroTargetAmountSafely() {
        campaign.setTargetAmount(BigDecimal.ZERO);
        campaign.setCollectedAmount(BigDecimal.ZERO);

        CampaignDto.CampaignResponse res = campaignService.toResponse(campaign);

        assertEquals(0.0, res.getProgressPercentage());
    }
}

