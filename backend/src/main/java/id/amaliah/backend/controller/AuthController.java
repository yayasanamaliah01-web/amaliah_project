package id.amaliah.backend.controller;

import id.amaliah.backend.dto.AuthDto;
import id.amaliah.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthDto.AuthResponse> register(@Valid @RequestBody AuthDto.RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> login(@Valid @RequestBody AuthDto.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthDto.AuthResponse> googleLogin(@RequestBody AuthDto.GoogleAuthRequest request) {
        return ResponseEntity.ok(authService.googleLogin(request));
    }

    @GetMapping("/google/client-id")
    public ResponseEntity<java.util.Map<String, String>> getGoogleClientId() {
        return ResponseEntity.ok(java.util.Map.of("clientId", authService.getGoogleClientId()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<AuthDto.MessageResponse> forgotPassword(@Valid @RequestBody AuthDto.ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<AuthDto.MessageResponse> resetPassword(@Valid @RequestBody AuthDto.ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }
}
