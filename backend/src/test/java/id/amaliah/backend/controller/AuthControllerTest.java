package id.amaliah.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import id.amaliah.backend.dto.AuthDto;
import id.amaliah.backend.exception.BadRequestException;
import id.amaliah.backend.exception.GlobalExceptionHandler;
import id.amaliah.backend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthController Unit Tests")
class AuthControllerTest {

    @Mock
    private AuthService authService;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        AuthController authController = new AuthController(authService);
        mockMvc = MockMvcBuilders.standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("POST /api/v1/auth/register: Should return 200 and token on valid registration")
    void shouldRegisterSuccessfully() throws Exception {
        AuthDto.RegisterRequest request = AuthDto.RegisterRequest.builder()
                .name("Ahmad Donatur")
                .email("ahmad@example.com")
                .password("secret123")
                .phone("08123456789")
                .role("DONATUR")
                .build();

        AuthDto.AuthResponse mockResponse = AuthDto.AuthResponse.builder()
                .token("jwt-sample-token")
                .tokenType("Bearer")
                .id(1L)
                .name("Ahmad Donatur")
                .email("ahmad@example.com")
                .role("DONATUR")
                .build();

        when(authService.register(any(AuthDto.RegisterRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-sample-token"))
                .andExpect(jsonPath("$.email").value("ahmad@example.com"))
                .andExpect(jsonPath("$.role").value("DONATUR"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/register: Should return 400 when email already exists")
    void shouldReturnBadRequestWhenEmailExists() throws Exception {
        AuthDto.RegisterRequest request = AuthDto.RegisterRequest.builder()
                .name("Ahmad Donatur")
                .email("ahmad@example.com")
                .password("secret123")
                .build();

        when(authService.register(any(AuthDto.RegisterRequest.class)))
                .thenThrow(new BadRequestException("Email sudah terdaftar: ahmad@example.com"));

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email sudah terdaftar: ahmad@example.com"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/login: Should return 200 and token on valid credentials")
    void shouldLoginSuccessfully() throws Exception {
        AuthDto.LoginRequest request = AuthDto.LoginRequest.builder()
                .email("ahmad@example.com")
                .password("secret123")
                .build();

        AuthDto.AuthResponse mockResponse = AuthDto.AuthResponse.builder()
                .token("jwt-login-token")
                .tokenType("Bearer")
                .id(1L)
                .name("Ahmad Donatur")
                .email("ahmad@example.com")
                .role("DONATUR")
                .build();

        when(authService.login(any(AuthDto.LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-login-token"))
                .andExpect(jsonPath("$.email").value("ahmad@example.com"));
    }
}

