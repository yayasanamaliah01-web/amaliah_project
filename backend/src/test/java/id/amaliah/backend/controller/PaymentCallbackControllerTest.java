package id.amaliah.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
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

import java.util.Map;

import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@DisplayName("PaymentCallbackController Unit Tests")
class PaymentCallbackControllerTest {

    @Mock
    private DonationService donationService;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        PaymentCallbackController controller = new PaymentCallbackController(donationService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("POST /api/v1/bank-callback/notify: Should return 200 and responseCode 2002500 on success")
    void shouldReturn200OnSuccessfulCallback() throws Exception {
        when(donationService.processPaymentCallback(anyMap())).thenReturn(true);

        Map<String, Object> payload = Map.of(
                "transactionId", "BNK-001",
                "paymentType", "QRIS"
        );

        mockMvc.perform(post("/api/v1/bank-callback/notify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.responseCode").value("2002500"))
                .andExpect(jsonPath("$.responseMessage").value("Callback processed successfully"));
    }

    @Test
    @DisplayName("POST /api/v1/bank-callback/notify: Should return 400 and responseCode 4002500 on failure")
    void shouldReturn400OnFailedCallback() throws Exception {
        when(donationService.processPaymentCallback(anyMap())).thenReturn(false);

        Map<String, Object> payload = Map.of(
                "transactionId", "BNK-002"
        );

        mockMvc.perform(post("/api/v1/bank-callback/notify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.responseCode").value("4002500"))
                .andExpect(jsonPath("$.responseMessage").value("Failed to process callback"));
    }
}

