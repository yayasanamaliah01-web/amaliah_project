package id.maun.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("XenditService Unit Tests")
class XenditServiceTest {

    @Mock
    private RestTemplate restTemplate;

    private XenditService xenditService;

    @BeforeEach
    void setUp() {
        xenditService = new XenditService(restTemplate);
        ReflectionTestUtils.setField(xenditService, "secretKey", "xnd_development_testkey123");
        ReflectionTestUtils.setField(xenditService, "apiUrl", "https://api.xendit.co");
        ReflectionTestUtils.setField(xenditService, "webhookToken", "test_webhook_token_2026");
        ReflectionTestUtils.setField(xenditService, "simulationEnabled", true);
    }

    @Test
    @DisplayName("createQris: Fallback simulation returns valid QR string and image URL")
    void shouldGenerateSimulationQrisWhenOffline() {
        Map<String, Object> result = xenditService.createQris(new BigDecimal("50000"), "DON-TEST-123");

        assertNotNull(result);
        assertTrue(result.containsKey("qrContent"));
        assertTrue(result.containsKey("qrImageUrl"));
        assertEquals("ACTIVE", result.get("status"));
        assertTrue(result.get("qrContent").toString().startsWith("00020101"));
        assertTrue(result.get("qrImageUrl").toString().contains("api.qrserver.com"));
    }

    @Test
    @DisplayName("createVirtualAccount: Generates correct VA prefix based on bank code")
    void shouldGenerateSimulationVaWithCorrectBankPrefix() {
        Map<String, Object> bsiVa = xenditService.createVirtualAccount("DON-VA-1", "BSI", "Donatur", new BigDecimal("100000"));
        Map<String, Object> bcaVa = xenditService.createVirtualAccount("DON-VA-2", "BCA", "Donatur", new BigDecimal("100000"));
        Map<String, Object> mandiriVa = xenditService.createVirtualAccount("DON-VA-3", "MANDIRI", "Donatur", new BigDecimal("100000"));

        assertNotNull(bsiVa.get("virtualAccountNo"));
        assertTrue(bsiVa.get("virtualAccountNo").toString().startsWith("9988"));

        assertNotNull(bcaVa.get("virtualAccountNo"));
        assertTrue(bcaVa.get("virtualAccountNo").toString().startsWith("3901"));

        assertNotNull(mandiriVa.get("virtualAccountNo"));
        assertTrue(mandiriVa.get("virtualAccountNo").toString().startsWith("8890"));
    }

    @Test
    @DisplayName("createInvoice: Generates checkout invoice URL")
    void shouldGenerateSimulationInvoiceUrl() {
        Map<String, Object> invoice = xenditService.createInvoice(
                "DON-INV-99",
                new BigDecimal("75000"),
                "hamba@allah.org",
                "Hamba Allah",
                "Infaq Subuh"
        );

        assertNotNull(invoice);
        assertTrue(invoice.containsKey("invoiceUrl"));
        assertTrue(invoice.get("invoiceUrl").toString().contains("checkout"));
    }

    @Test
    @DisplayName("verifyCallbackToken: Validates correct webhook token")
    void shouldVerifyCallbackToken() {
        assertTrue(xenditService.verifyCallbackToken("test_webhook_token_2026"));

        // When simulation is enabled, blank/null or demo token is tolerated
        assertTrue(xenditService.verifyCallbackToken(null));

        // When simulation is disabled, only exact token matches
        ReflectionTestUtils.setField(xenditService, "simulationEnabled", false);
        assertTrue(xenditService.verifyCallbackToken("test_webhook_token_2026"));
        assertFalse(xenditService.verifyCallbackToken("wrong_token"));
        assertFalse(xenditService.verifyCallbackToken(null));
    }

    @Test
    @DisplayName("simulateQrisPayment & simulateVaPayment: Return true without throwing")
    void shouldHandleSimulateEndpointsGracefully() {
        boolean qrisOk = xenditService.simulateQrisPayment("DON-SIM-1", new BigDecimal("50000"));
        boolean vaOk = xenditService.simulateVaPayment("DON-SIM-2", new BigDecimal("100000"));

        assertTrue(qrisOk);
        assertTrue(vaOk);
    }
}

