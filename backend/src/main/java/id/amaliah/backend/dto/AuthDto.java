package id.amaliah.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoginRequest {
        @NotBlank(message = "Email wajib diisi")
        @Email(message = "Format email tidak valid")
        private String email;

        @NotBlank(message = "Password wajib diisi")
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RegisterRequest {
        @NotBlank(message = "Nama wajib diisi")
        private String name;

        @NotBlank(message = "Email wajib diisi")
        @Email(message = "Format email tidak valid")
        private String email;

        @NotBlank(message = "Password wajib diisi")
        @Size(min = 6, message = "Password minimal 6 karakter")
        private String password;

        private String phone;
        private String role; // Optional, default DONATUR
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GoogleAuthRequest {
        private String credential; // Google ID Token (GIS)
        private String code;       // Google Auth Code
        private String redirectUri;// Client redirect URI for code flow
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ForgotPasswordRequest {
        @NotBlank(message = "Email wajib diisi")
        @Email(message = "Format email tidak valid")
        private String email;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResetPasswordRequest {
        @NotBlank(message = "Kode OTP / token reset wajib diisi")
        private String token;

        @NotBlank(message = "Password baru wajib diisi")
        @Size(min = 6, message = "Password baru minimal 6 karakter")
        private String newPassword;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MessageResponse {
        private String message;
        private boolean success;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuthResponse {
        private String token;
        private String tokenType;
        private Long id;
        private String name;
        private String email;
        private String role;
        private String phone;
    }
}
