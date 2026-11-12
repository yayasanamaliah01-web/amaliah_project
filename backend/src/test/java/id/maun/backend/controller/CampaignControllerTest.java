package id.maun.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import id.maun.backend.dto.CampaignDto;
import id.maun.backend.exception.GlobalExceptionHandler;
import id.maun.backend.exception.ResourceNotFoundException;
import id.maun.backend.service.CampaignService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@DisplayName("CampaignController Unit Tests")
class CampaignControllerTest {

    @Mock
    private CampaignService campaignService;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private CampaignDto.CampaignResponse sampleResponse;

    @BeforeEach
    void setUp() {
        CampaignController campaignController = new CampaignController(campaignService);
        mockMvc = MockMvcBuilders.standaloneSetup(campaignController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        sampleResponse = CampaignDto.CampaignResponse.builder()
                .id(1L)
                .title("Renovasi Pesantren")
                .slug("renovasi-pesantren")
                .category("Pendidikan")
                .targetAmount(new BigDecimal("100000000"))
                .collectedAmount(new BigDecimal("25000000"))
                .progressPercentage(25.0)
                .status("ACTIVE")
                .build();
    }

    @Test
    @DisplayName("GET /api/v1/campaigns: Should return list of campaigns")
    void shouldGetAllCampaigns() throws Exception {
        when(campaignService.getAllCampaigns(null, null)).thenReturn(List.of(sampleResponse));

        mockMvc.perform(get("/api/v1/campaigns"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1))
                .andExpect(jsonPath("$[0].title").value("Renovasi Pesantren"))
                .andExpect(jsonPath("$[0].progressPercentage").value(25.0));
    }

    @Test
    @DisplayName("GET /api/v1/campaigns/{id}: Should return campaign when found")
    void shouldGetCampaignById() throws Exception {
        when(campaignService.getCampaignById(1L)).thenReturn(sampleResponse);

        mockMvc.perform(get("/api/v1/campaigns/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Renovasi Pesantren"));
    }

    @Test
    @DisplayName("GET /api/v1/campaigns/{id}: Should return 404 when campaign not found")
    void shouldReturn404WhenNotFound() throws Exception {
        when(campaignService.getCampaignById(999L))
                .thenThrow(new ResourceNotFoundException("Program donasi tidak ditemukan"));

        mockMvc.perform(get("/api/v1/campaigns/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Program donasi tidak ditemukan"));
    }

    @Test
    @DisplayName("POST /api/v1/campaigns: Should create and return new campaign")
    void shouldCreateCampaign() throws Exception {
        CampaignDto.CreateCampaignRequest request = CampaignDto.CreateCampaignRequest.builder()
                .title("Renovasi Pesantren")
                .category("Pendidikan")
                .targetAmount(new BigDecimal("100000000"))
                .build();

        when(campaignService.createCampaign(any(CampaignDto.CreateCampaignRequest.class))).thenReturn(sampleResponse);

        mockMvc.perform(post("/api/v1/campaigns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Renovasi Pesantren"));
    }

    @Test
    @DisplayName("DELETE /api/v1/campaigns/{id}: Should return 200 when deleted successfully")
    void shouldDeleteCampaign() throws Exception {
        doNothing().when(campaignService).deleteCampaign(1L);

        mockMvc.perform(delete("/api/v1/campaigns/1"))
                .andExpect(status().isOk());

        verify(campaignService).deleteCampaign(1L);
    }
}

