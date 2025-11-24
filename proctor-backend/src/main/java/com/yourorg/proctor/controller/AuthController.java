package com.yourorg.proctor.controller;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yourorg.proctor.model.User;
import com.yourorg.proctor.security.JwtUtil;
import com.yourorg.proctor.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    // In-memory reset token storage for development/testing
    private final ConcurrentHashMap<String, Long> resetTokenExpiry = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, String> resetTokenToEmail = new ConcurrentHashMap<>();
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // Check if user already exists
        if (userService.getUserByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("User already exists with this email");
        }
        
        // Encode password
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        
        // Save user
        User savedUser = userService.saveUser(user);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail());
        
        // Return response
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", savedUser);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Missing email or password");
        }

        var userOpt = userService.getUserByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(403).body("Invalid credentials");
        }
        User user = userOpt.get();

        if (user.getPasswordHash() == null || !passwordEncoder.matches(password, user.getPasswordHash())) {
            return ResponseEntity.status(403).body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(email);
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> body) {
        String idToken = body.get("idToken");
        if (idToken == null || idToken.isEmpty()) {
            return ResponseEntity.badRequest().body("Missing idToken");
        }

        try {
            // Verify token with Google's tokeninfo endpoint
            String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
            ResponseEntity<String> resp = restTemplate.exchange(url, HttpMethod.GET, null, String.class);
            if (!resp.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.badRequest().body("Invalid Google ID token");
            }

            // parse payload
            Map<String,Object> payload = objectMapper.readValue(resp.getBody(), Map.class);
            String email = (String) payload.get("email");
            String name = (String) payload.get("name");
            String picture = (String) payload.get("picture");

            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body("Google token did not contain email");
            }

            // create or get user
            User user = userService.getUserByEmail(email).orElseGet(() -> {
                User u = new User();
                u.setName(name != null ? name : email);
                u.setEmail(email);
                u.setPasswordHash("");
                u.setRole("STUDENT");
                u.setRegPhotoUrl(picture);
                return userService.saveUser(u);
            });

            String token = jwtUtil.generateToken(email);
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Failed to verify Google token");
        }
    }

    @PostMapping("/forgot")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Missing email");
        }

        var userOpt = userService.getUserByEmail(email);
        if (userOpt.isEmpty()) {
            // Don't reveal existence in production; respond success for dev flow
            return ResponseEntity.ok(Map.of("message", "If the email exists, a reset token was sent"));
        }

        String token = UUID.randomUUID().toString();
        Instant expiry = Instant.now().plus(Duration.ofHours(1));
        resetTokenToEmail.put(token, email);
        resetTokenExpiry.put(token, expiry.getEpochSecond());

        // In production we'd email the token; for development, return it in the response
        return ResponseEntity.ok(Map.of("message", "Reset token generated (dev)", "token", token));
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Missing token or newPassword");
        }

        Long exp = resetTokenExpiry.get(token);
        String email = resetTokenToEmail.get(token);
        if (exp == null || email == null) {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }

        if (Instant.now().getEpochSecond() > exp) {
            resetTokenExpiry.remove(token);
            resetTokenToEmail.remove(token);
            return ResponseEntity.badRequest().body("Token expired");
        }

        var userOpt = userService.getUserByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userService.saveUser(user);

        resetTokenExpiry.remove(token);
        resetTokenToEmail.remove(token);

        return ResponseEntity.ok(Map.of("message", "Password reset successful"));
    }
}