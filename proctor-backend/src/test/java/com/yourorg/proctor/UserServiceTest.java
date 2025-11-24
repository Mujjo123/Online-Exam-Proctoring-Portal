package com.yourorg.proctor;

import com.yourorg.proctor.model.User;
import com.yourorg.proctor.repository.UserRepository;
import com.yourorg.proctor.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @MockBean
    private UserRepository userRepository;

    @Test
    public void testSaveUser() {
        // Create a user
        User user = new User("John Doe", "john@example.com", "password123", "STUDENT", "photo.jpg");
        
        // Mock the repository save method
        when(userRepository.save(user)).thenReturn(user);
        
        // Test the service method
        User savedUser = userService.saveUser(user);
        
        // Verify the result
        assertNotNull(savedUser);
        assertEquals("John Doe", savedUser.getName());
        assertEquals("john@example.com", savedUser.getEmail());
        
        // Verify the repository method was called
        verify(userRepository, times(1)).save(user);
    }

    @Test
    public void testGetUserById() {
        // Create a user
        User user = new User("John Doe", "john@example.com", "password123", "STUDENT", "photo.jpg");
        user.setId(1L);
        
        // Mock the repository findById method
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        // Test the service method
        Optional<User> foundUser = userService.getUserById(1L);
        
        // Verify the result
        assertTrue(foundUser.isPresent());
        assertEquals("John Doe", foundUser.get().getName());
        assertEquals("john@example.com", foundUser.get().getEmail());
        
        // Verify the repository method was called
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    public void testGetUserByEmail() {
        // Create a user
        User user = new User("John Doe", "john@example.com", "password123", "STUDENT", "photo.jpg");
        
        // Mock the repository findByEmail method
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        
        // Test the service method
        Optional<User> foundUser = userService.getUserByEmail("john@example.com");
        
        // Verify the result
        assertTrue(foundUser.isPresent());
        assertEquals("John Doe", foundUser.get().getName());
        assertEquals("john@example.com", foundUser.get().getEmail());
        
        // Verify the repository method was called
        verify(userRepository, times(1)).findByEmail("john@example.com");
    }
}