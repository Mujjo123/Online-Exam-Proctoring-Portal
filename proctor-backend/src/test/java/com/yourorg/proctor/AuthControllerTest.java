package com.yourorg.proctor;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yourorg.proctor.model.User;
import com.yourorg.proctor.security.JwtUtil;
import com.yourorg.proctor.service.UserService;

@WebMvcTest(controllers = com.yourorg.proctor.controller.AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private AuthenticationManager authenticationManager;

    @Test
    public void testRegisterUser() throws Exception {
        // Create a user
        User user = new User("John Doe", "john@example.com", "password123", "STUDENT", "photo.jpg");
        user.setId(1L);

        // Mock service methods
        when(userService.getUserByEmail("john@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userService.saveUser(any(User.class))).thenReturn(user);
        when(jwtUtil.generateToken("john@example.com")).thenReturn("jwtToken");

        // Perform the request with CSRF disabled
        mockMvc.perform(post("/api/auth/register")
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwtToken"))
                .andExpect(jsonPath("$.user.name").value("John Doe"));

        // Verify the service methods were called
        verify(userService, times(1)).getUserByEmail("john@example.com");
        verify(passwordEncoder, times(1)).encode("password123");
        verify(userService, times(1)).saveUser(any(User.class));
        verify(jwtUtil, times(1)).generateToken("john@example.com");
    }

    @Test
    public void testRegisterUserAlreadyExists() throws Exception {
        // Create a user
        User user = new User("John Doe", "john@example.com", "password123", "STUDENT", "photo.jpg");

        // Mock service methods
        when(userService.getUserByEmail("john@example.com")).thenReturn(Optional.of(user));

        // Perform the request with CSRF disabled
        mockMvc.perform(post("/api/auth/register")
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("User already exists with this email"));

        // Verify the service method was called
        verify(userService, times(1)).getUserByEmail("john@example.com");
        // Verify other methods were not called
        verify(passwordEncoder, never()).encode(anyString());
        verify(userService, never()).saveUser(any(User.class));
        verify(jwtUtil, never()).generateToken(anyString());
    }
}