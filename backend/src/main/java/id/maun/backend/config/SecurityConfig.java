package id.maun.backend.config;

import id.maun.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // 1. Endpoints otentikasi & webhook perbankan / payment gateway (selalu terbuka)
                        .requestMatchers(
                                "/api/v1/auth/**",
                                "/api/v1/bank-callback/**",
                                "/api/v1/xendit/**",
                                "/api/v1/stream/**",
                                "/actuator/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/webjars/**",
                                "/h2-console/**",
                                "/error"
                        ).permitAll()

                        // 2. Transparansi publik (read-only)
                        .requestMatchers(HttpMethod.GET, "/api/v1/transparency/**").permitAll()

                        // 3. Donasi (publik dapat membuat donasi dan mengecek status donasi)
                        .requestMatchers(HttpMethod.POST, "/api/v1/donations/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/donations/**").permitAll()

                        // 4. Program / Campaigns (publik dapat melihat, admin/bendahara dapat mengelola)
                        .requestMatchers(HttpMethod.GET, "/api/v1/campaigns/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/campaigns").hasAnyRole("ADMIN", "BENDAHARA")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/campaigns/**").hasAnyRole("ADMIN", "BENDAHARA")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/campaigns/**").hasRole("ADMIN")

                        // 5. Penyaluran / Disbursements (publik dapat melihat, admin/bendahara dapat mencairkan)
                        .requestMatchers(HttpMethod.GET, "/api/v1/disbursements/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/disbursements").hasAnyRole("ADMIN", "BENDAHARA")

                        // 6. LPJ (publik dapat melihat, admin/bendahara/relawan dapat membuat laporan)
                        .requestMatchers(HttpMethod.GET, "/api/v1/lpj/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/lpj").hasAnyRole("ADMIN", "BENDAHARA", "RELAWAN")

                        // 7. Utilitas demo/sinkronisasi bank & batch (terbuka untuk keperluan simulasi)
                        .requestMatchers("/api/v1/bank-sync/**", "/api/v1/batch/**").permitAll()

                        // Semua endpoint lainnya wajib login
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .headers(headers -> headers.frameOptions(frame -> frame.disable())); // For H2 console

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
