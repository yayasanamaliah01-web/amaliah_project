package id.amaliah.backend.service;

import id.amaliah.backend.dto.AuthDto;
import id.amaliah.backend.exception.BadRequestException;
import id.amaliah.backend.exception.ResourceNotFoundException;
import id.amaliah.backend.model.Role;
import id.amaliah.backend.model.User;
import id.amaliah.backend.repository.UserRepository;
import id.amaliah.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RestTemplate restTemplate;
    private final EmailService emailService;

    @Value("${google.oauth.client-id:}")
    private String googleClientId;

    @Value("${google.oauth.client-secret:}")
    private String googleClientSecret;

    public String getGoogleClientId() {
        return googleClientId;
    }

    @Transactional
    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email sudah terdaftar: " + request.getEmail());
        }

        Role role = Role.DONATUR;
        if (request.getRole() != null) {
            try {
                role = Role.valueOf(request.getRole().toUpperCase());
            } catch (Exception ignored) {
                log.warn("Role {} tidak valid, menggunakan default DONATUR", request.getRole());
            }
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(role)
                .build();

        user = userRepository.save(user);

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole().name());
        extraClaims.put("name", user.getName());
        String token = jwtService.generateToken(extraClaims, user);

        log.info("User registered successfully: {} with role: {}", user.getEmail(), user.getRole());

        return AuthDto.AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .phone(user.getPhone())
                .build();
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Pengguna tidak ditemukan dengan email: " + request.getEmail()));

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole().name());
        extraClaims.put("name", user.getName());
        String token = jwtService.generateToken(extraClaims, user);

        log.info("User logged in successfully: {}", user.getEmail());

        return AuthDto.AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .phone(user.getPhone())
                .build();
    }

    @Transactional
    public AuthDto.AuthResponse googleLogin(AuthDto.GoogleAuthRequest request) {
        String idToken = request.getCredential();

        // If authorization code is provided instead of id_token, exchange it with Google
        if (!StringUtils.hasText(idToken) && StringUtils.hasText(request.getCode())) {
            idToken = exchangeGoogleCodeForIdToken(request.getCode(), request.getRedirectUri());
        }

        if (!StringUtils.hasText(idToken)) {
            throw new BadRequestException("Token atau kode otorisasi Google wajib diisi");
        }

        // Verify ID Token with Google TokenInfo API
        String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
        Map<String, Object> tokenInfo;
        try {
            tokenInfo = restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            log.error("Gagal memverifikasi Google Token: {}", e.getMessage());
            throw new BadRequestException("Token Google tidak valid atau sudah kadaluarsa");
        }

        if (tokenInfo == null || !tokenInfo.containsKey("email")) {
            throw new BadRequestException("Gagal mengambil data akun Google");
        }

        String aud = (String) tokenInfo.get("aud");
        if (aud != null && StringUtils.hasText(googleClientId) && !aud.equals(googleClientId)) {
            log.warn("Audience mismatch: expected {} but got {}", googleClientId, aud);
            throw new BadRequestException("Audience Google token tidak valid");
        }

        String email = (String) tokenInfo.get("email");
        String rawName = (String) tokenInfo.get("name");
        final String displayName = StringUtils.hasText(rawName) ? rawName : email.split("@")[0];

        // Find or create user
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            log.info("Mendaftarkan user baru via Google OAuth: {}", email);
            User newUser = User.builder()
                    .name(displayName)
                    .email(email)
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .role(Role.DONATUR)
                    .phone(null)
                    .build();
            return userRepository.save(newUser);
        });

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole().name());
        extraClaims.put("name", user.getName());
        String token = jwtService.generateToken(extraClaims, user);

        log.info("User logged in via Google OAuth successfully: {}", user.getEmail());

        return AuthDto.AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .phone(user.getPhone())
                .build();
    }

    private String exchangeGoogleCodeForIdToken(String code, String redirectUri) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("code", code);
            body.add("client_id", googleClientId);
            body.add("client_secret", googleClientSecret);
            body.add("redirect_uri", StringUtils.hasText(redirectUri) ? redirectUri : "https://amaliah.my.id/auth/google/callback");
            body.add("grant_type", "authorization_code");

            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);
            Map<String, Object> response = restTemplate.postForObject("https://oauth2.googleapis.com/token", entity, Map.class);
            if (response != null && response.containsKey("id_token")) {
                return (String) response.get("id_token");
            }
        } catch (Exception e) {
            log.error("Gagal menukar Google Auth Code: {}", e.getMessage());
            throw new BadRequestException("Gagal menukar kode otorisasi Google: " + e.getMessage());
        }
        return null;
    }

    @Transactional
    public AuthDto.MessageResponse forgotPassword(AuthDto.ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            // For security, don't disclose whether email is registered or not
            return AuthDto.MessageResponse.builder()
                    .success(true)
                    .message("Jika email terdaftar, kode verifikasi reset password telah dikirim ke email Anda.")
                    .build();
        }

        User user = userOpt.get();
        // Generate secure 6-digit OTP code
        String resetToken = String.format("%06d", new java.security.SecureRandom().nextInt(1_000_000));
        user.setResetPasswordToken(resetToken);
        user.setResetPasswordExpiry(java.time.LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), resetToken);

        return AuthDto.MessageResponse.builder()
                .success(true)
                .message("Kode verifikasi reset password (OTP 6 digit) telah dikirim ke email Anda. Silakan cek kotak masuk atau folder spam.")
                .build();
    }

    @Transactional
    public AuthDto.MessageResponse resetPassword(AuthDto.ResetPasswordRequest request) {
        String token = request.getToken().trim();
        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new BadRequestException("Kode verifikasi salah atau tidak ditemukan"));

        if (user.getResetPasswordExpiry() == null || user.getResetPasswordExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new BadRequestException("Kode verifikasi sudah kadaluarsa (melebihi 15 menit). Silakan minta kode baru.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiry(null);
        userRepository.save(user);

        emailService.sendPasswordChangedNotice(user.getEmail(), user.getName());

        return AuthDto.MessageResponse.builder()
                .success(true)
                .message("Password berhasil direset! Silakan masuk dengan kata sandi baru Anda.")
                .build();
    }
}
