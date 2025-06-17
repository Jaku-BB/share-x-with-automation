package com.sharex.service;

import com.sharex.model.UserData;
import com.sharex.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private UserData testUser;

    @BeforeEach
    void setUp() {
        testUser = new UserData();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPasswordHash("hashedpassword");
    }

    @Test
    void createUser_ShouldReturnUser_WhenValidData() {
        // Given
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedpassword");
        when(userRepository.save(any(UserData.class))).thenReturn(testUser);

        // When
        UserData result = userService.createUser("testuser", "test@example.com", "password");

        // Then
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        assertEquals("test@example.com", result.getEmail());
        verify(userRepository).save(any(UserData.class));
    }

    @Test
    void createUser_ShouldThrowException_WhenUsernameExists() {
        // Given
        when(userRepository.existsByUsername(anyString())).thenReturn(true);

        // When & Then
        assertThrows(RuntimeException.class, () -> 
            userService.createUser("testuser", "test@example.com", "password"));
        
        verify(userRepository, never()).save(any(UserData.class));
    }

    @Test
    void findUserByUsername_ShouldReturnUser_WhenExists() {
        // Given
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));

        // When
        Optional<UserData> result = userService.findUserByUsername("testuser");

        // Then
        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getUsername());
    }

    @Test
    void findUserByUsername_ShouldReturnEmpty_WhenNotExists() {
        // Given
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());

        // When
        Optional<UserData> result = userService.findUserByUsername("nonexistent");

        // Then
        assertFalse(result.isPresent());
    }
} 