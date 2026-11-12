package id.maun.backend.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void shouldHandleResourceNotFoundException() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/v1/campaigns/999");

        ResourceNotFoundException ex = new ResourceNotFoundException("Campaign not found");
        ResponseEntity<ErrorResponse> response = handler.handleResourceNotFoundException(ex, request);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Campaign not found", response.getBody().getMessage());
        assertEquals("/api/v1/campaigns/999", response.getBody().getPath());
        assertEquals(404, response.getBody().getStatus());
    }

    @Test
    void shouldHandleBadRequestException() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/v1/auth/register");

        BadRequestException ex = new BadRequestException("Email already registered");
        ResponseEntity<ErrorResponse> response = handler.handleBadRequestException(ex, request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Email already registered", response.getBody().getMessage());
        assertEquals("/api/v1/auth/register", response.getBody().getPath());
        assertEquals(400, response.getBody().getStatus());
    }
}
