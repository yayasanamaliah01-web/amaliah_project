package id.amaliah.backend.service;

import id.amaliah.backend.dto.AuthDto;
import id.amaliah.backend.exception.BadRequestException;
import id.amaliah.backend.exception.ResourceNotFoundException;
import id.amaliah.backend.model.Role;
import id.amaliah.backend.model.User;
import id.amaliah.backend.repository.UserRepository;
import id.amaliah.backend.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private RestTemplate restTemplate;

    private JwtService jwtService;
    private AuthService authService;

    private AuthDto.RegisterRequest registerRequest;
    private AuthDto.LoginRequest loginRequest;
    private User user;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 86400000L);

        authService = new AuthService(userRepository, passwordEncoder, jwtService, authenticationManager, restTemplate);
        ReflectionTestUtils.setField(authService, "googleClientId", "test-client-id");
        ReflectionTestUtils.setField(authService, "googleClientSecret", "test-client-secret");

        registerRequest = AuthDto.RegisterRequest.builder()
                .name("Ahmad Donatur")
                .email("ahmad@example.com")
                .password("secret123")
                .phone("08123456789")
                .role("DONATUR")
                .build();

        loginRequest = AuthDto.LoginRequest.builder()
                .email("ahmad@example.com")
                .password("secret123")
                .build();

        user = User.builder()
                .id(1L)
                .name("Ahmad Donatur")
                .email("ahmad@example.com")
                .password("encoded_secret123")
                .phone("08123456789")
                .role(Role.DONATUR)
                .isActive(true)
                .build();
    }

    @Test
    @DisplayName("Register: Should successfully register a new user")
    void shouldRegisterNewUserSuccessfully() {
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encoded_secret123");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(1L);
            return u;
        });

        AuthDto.AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals("Ahmad Donatur", response.getName());
        assertEquals("ahmad@example.com", response.getEmail());
        assertEquals("DONATUR", response.getRole());

        // Validate the JWT token that was actually produced
        assertEquals("ahmad@example.com", jwtService.extractUsername(response.getToken()));

        verify(userRepository).existsByEmail("ahmad@example.com");
        verify(passwordEncoder).encode("secret123");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Register: Should throw BadRequestException when email already exists")
    void shouldThrowBadRequestExceptionWhenEmailAlreadyExists() {
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        BadRequestException exception = assertThrows(BadRequestException.class, () ->
                authService.register(registerRequest));

        assertTrue(exception.getMessage().contains("Email sudah terdaftar"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Register: Should fallback to DONATUR role when role name is invalid")
    void shouldFallbackToDonaturRoleWhenRoleIsInvalid() {
        registerRequest.setRole("INVALID_ROLE_XYZ");
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(2L);
            return u;
        });

        AuthDto.AuthResponse response = authService.register(registerRequest);

        assertEquals("DONATUR", response.getRole());
    }

    @Test
    @DisplayName("Login: Should authenticate and return token when credentials are valid")
    void shouldLoginSuccessfully() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(user));

        AuthDto.AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("ahmad@example.com", response.getEmail());
        assertEquals("DONATUR", response.getRole());
        assertEquals("ahmad@example.com", jwtService.extractUsername(response.getToken()));

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository).findByEmail("ahmad@example.com");
    }

    @Test
    @DisplayName("Login: Should throw exception when authentication fails")
    void shouldThrowExceptionWhenPasswordIsIncorrect() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(loginRequest));
        verify(userRepository, never()).findByEmail(any());
    }

    @Test
    @DisplayName("Login: Should throw ResourceNotFoundException when user not found after auth")
    void shouldThrowResourceNotFoundExceptionWhenUserNotFound() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> authService.login(loginRequest));
    }
}
