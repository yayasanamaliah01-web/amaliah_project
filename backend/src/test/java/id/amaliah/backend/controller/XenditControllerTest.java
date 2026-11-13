package id.amaliah.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import id.amaliah.backend.service.DonationService;
import id.amaliah.backend.service.XenditService;
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
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@DisplayName("XenditController Unit Tests")
class XenditControllerTest {

    @Mock
    private XenditService xenditService;

    @Mock
    private DonationService donationService;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        XenditController controller = new XenditController(xenditService, donationService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("POST /api/v1/xendit/callback/qr: Should return 200 on valid QR callback")
    void shouldHandleQrCallbackSuccessfully() throws Exception {
        when(xenditService.verifyCallbackToken(any())).thenReturn(true);
        when(donationService.processXenditPayment(eq("DON-123"), any(BigDecimal.class), eq("QRIS"), any()))
                .thenReturn(true);

        Map<String, Object> payload = Map.of(
                "reference_id", "DON-123",
                "amount", 50000,
                "id", "qr_test_01"
        );

        mockMvc.perform(post("/api/v1/xendit/callback/qr")
                        .header("x-callback-token", "valid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"));
    }

    @Test
    @DisplayName("POST /api/v1/xendit/callback/va: Should return 200 on valid VA callback")
    void shouldHandleVaCallbackSuccessfully() throws Exception {
        when(xenditService.verifyCallbackToken(any())).thenReturn(true);
        when(donationService.processXenditPayment(eq("DON-456"), any(BigDecimal.class), eq("VA_BSI"), any()))
                .thenReturn(true);

        Map<String, Object> payload = Map.of(
                "external_id", "DON-456",
                "bank_code", "BSI",
                "amount", 100000,
                "id", "va_test_01"
        );

        mockMvc.perform(post("/api/v1/xendit/callback/va")
                        .header("x-callback-token", "valid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"));
    }

    @Test
    @DisplayName("POST /api/v1/xendit/simulate/qr-payment: Should execute QR simulation successfully")
    void shouldSimulateQrPayment() throws Exception {
        when(donationService.processXenditPayment(eq("DON-SIM-01"), any(BigDecimal.class), eq("QRIS"), any()))
                .thenReturn(true);

        Map<String, Object> req = Map.of(
                "transactionId", "DON-SIM-01",
                "amount", 50000
        );

        mockMvc.perform(post("/api/v1/xendit/simulate/qr-payment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.transactionId").value("DON-SIM-01"));
    }

    @Test
    @DisplayName("POST /api/v1/xendit/simulate/va-payment: Should execute VA simulation successfully")
    void shouldSimulateVaPayment() throws Exception {
        when(donationService.processXenditPayment(eq("DON-SIM-02"), any(BigDecimal.class), eq("VIRTUAL_ACCOUNT"), any()))
                .thenReturn(true);

        Map<String, Object> req = Map.of(
                "transactionId", "DON-SIM-02",
                "amount", 150000
        );

        mockMvc.perform(post("/api/v1/xendit/simulate/va-payment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.transactionId").value("DON-SIM-02"));
    }
}

