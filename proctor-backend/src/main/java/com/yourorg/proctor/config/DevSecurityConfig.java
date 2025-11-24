package com.yourorg.proctor.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@Profile("dev") // Only active in dev profile
public class DevSecurityConfig {

    @Bean
    public SecurityFilterChain devSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // public auth, actuator and H2 console
                .requestMatchers("/api/auth/**", "/h2-console/**", "/actuator/**").permitAll()
                // allow public access to root and common static asset paths for dev preview
                .requestMatchers(HttpMethod.GET, "/", "/index.html", "/favicon.ico", "/**/*.js", "/**/*.css", "/**/*.html", "/assets/**", "/static/**", "/public/**").permitAll()
                .anyRequest().authenticated()
            )
            // allow frames for H2 console
            .headers(headers -> headers.frameOptions().disable());

        return http.build();
    }
}