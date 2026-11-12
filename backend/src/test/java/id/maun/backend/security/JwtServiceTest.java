package id.maun.backend.security;

import id.maun.backend.model.Role;
import id.maun.backend.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("JwtService Unit Tests")
class JwtServiceTest {

    private JwtService jwtService;
    private User testUser;
    private final String secretKey = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", secretKey);
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 86400000L); // 24 hours

        testUser = User.builder()
                .id(1L)
                .name("Test Donatur")
                .email("donatur@test.com")
                .password("password123")
                .role(Role.DONATUR)
                .isActive(true)
                .build();
    }

    @Test
    @DisplayName("Should successfully generate token and extract username")
    void shouldGenerateTokenAndExtractUsername() {
        String token = jwtService.generateToken(testUser);

        assertNotNull(token);
        assertFalse(token.isBlank());

        String username = jwtService.extractUsername(token);
        assertEquals(testUser.getEmail(), username);
    }

    @Test
    @DisplayName("Should successfully generate token with extra claims and validate")
    void shouldGenerateTokenWithExtraClaimsAndValidate() {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", testUser.getRole().name());
        extraClaims.put("name", testUser.getName());

        String token = jwtService.generateToken(extraClaims, testUser);

        assertNotNull(token);
        assertTrue(jwtService.isTokenValid(token, testUser));

        String extractedRole = jwtService.extractClaim(token, claims -> claims.get("role", String.class));
        String extractedName = jwtService.extractClaim(token, claims -> claims.get("name", String.class));

        assertEquals("DONATUR", extractedRole);
        assertEquals("Test Donatur", extractedName);
    }

    @Test
    @DisplayName("Should return false when token does not match user")
    void shouldReturnFalseWhenUserDoesNotMatch() {
        String token = jwtService.generateToken(testUser);

        User anotherUser = User.builder()
                .id(2L)
                .name("Another User")
                .email("another@test.com")
                .role(Role.ADMIN)
                .build();

        assertFalse(jwtService.isTokenValid(token, anotherUser));
    }
}

