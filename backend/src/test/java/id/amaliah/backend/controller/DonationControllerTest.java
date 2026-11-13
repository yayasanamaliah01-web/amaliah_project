package id.amaliah.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import id.amaliah.backend.dto.DonationDto;
import id.amaliah.backend.exception.GlobalExceptionHandler;
import id.amaliah.backend.exception.ResourceNotFoundException;
import id.amaliah.backend.service.DonationService;
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
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@DisplayName("DonationController Unit Tests")
class DonationControllerTest {

    @Mock
    private DonationService donationService;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private DonationDto.DonationResponse donationResponse;

    @BeforeEach
    void setUp() {
        DonationController donationController = new DonationController(donationService);
        mockMvc = MockMvcBuilders.standaloneSetup(donationController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        donationResponse = DonationDto.DonationResponse.builder()
                .id(1L)
                .transactionId("DON-12345-ABC")
                .campaignId(1L)
                .campaignTitle("Bantuan Pangan Santri")
                .donorName("Budi Santoso")
                .amount(new BigDecimal("100000"))
                .paymentMethod("QRIS")
                .status("PENDING")
                .qrisString("00020101021226...")
                .build();
    }

    @Test
    @DisplayName("POST /api/v1/donations: Should create donation and return 200 with payment data")
    void shouldCreateDonation() throws Exception {
        DonationDto.CreateDonationRequest request = DonationDto.CreateDonationRequest.builder()
                .campaignId(1L)
                .donorName("Budi Santoso")
                .donorEmail("budi@example.com")
                .amount(new BigDecimal("100000"))
                .paymentMethod("QRIS")
                .build();

        when(donationService.createDonation(any(DonationDto.CreateDonationRequest.class))).thenReturn(donationResponse);

        mockMvc.perform(post("/api/v1/donations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transactionId").value("DON-12345-ABC"))
                .andExpect(jsonPath("$.amount").value(100000))
                .andExpect(jsonPath("$.qrisString").value("00020101021226..."));
    }

    @Test
    @DisplayName("GET /api/v1/donations/{transactionId}: Should return donation by transaction ID")
    void shouldGetDonationByTxnId() throws Exception {
        when(donationService.getDonation("DON-12345-ABC")).thenReturn(donationResponse);

        mockMvc.perform(get("/api/v1/donations/DON-12345-ABC"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transactionId").value("DON-12345-ABC"))
                .andExpect(jsonPath("$.donorName").value("Budi Santoso"));
    }

    @Test
    @DisplayName("GET /api/v1/donations/{transactionId}: Should return 404 when transaction not found")
    void shouldReturn404WhenNotFound() throws Exception {
        when(donationService.getDonation("INVALID-TXN"))
                .thenThrow(new ResourceNotFoundException("Donasi tidak ditemukan"));

        mockMvc.perform(get("/api/v1/donations/INVALID-TXN"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Donasi tidak ditemukan"));
    }

    @Test
    @DisplayName("GET /api/v1/donations/recent: Should return list of recent donations")
    void shouldGetRecentDonations() throws Exception {
        when(donationService.getRecentSuccessfulDonations()).thenReturn(List.of(donationResponse));

        mockMvc.perform(get("/api/v1/donations/recent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1))
                .andExpect(jsonPath("$[0].transactionId").value("DON-12345-ABC"));
    }
}

