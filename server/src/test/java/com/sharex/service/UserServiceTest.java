package com.sharex.service;

import com.sharex.dto.RegisterRequest;
import com.sharex.model.UserData;
import com.sharex.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private UserData testUser;

    @BeforeEach
    void setUp() {
        testUser = new UserData();
        testUser.setUserId("test-id");
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPasswordHash("hashedpassword");
        testUser.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void registerShouldReturnUserWhenValidData() {
        // Given
        RegisterRequest request = new RegisterRequest("newuser", "new@example.com", "password");

        when(userRepository.findByUsername("newuser")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("new@example.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(UserData.class))).thenReturn(testUser);

        // When
        UserData result = userService.register(request);

        // Then
        assertNotNull(result);
        verify(userRepository).save(any(UserData.class));
    }

    @Test
    void registerShouldThrowExceptionWhenUsernameExists() {
        // Given
        RegisterRequest request = new RegisterRequest("existinguser", "email@test.com", "password");
        when(userRepository.findByUsername("existinguser")).thenReturn(Optional.of(testUser));

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            userService.register(request);
        });
        verify(userRepository, never()).save(any(UserData.class));
    }

    @Test
    void findByUsernameShouldReturnUserWhenExists() {
        // Given
        String username = "testuser";
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));

        // When
        Optional<UserData> result = userService.findByUsername(username);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testUser.getUsername(), result.get().getUsername());
    }

    @Test
    void findByUsernameShouldReturnEmptyWhenNotExists() {
        // Given
        String username = "nonexistent";
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // When
        Optional<UserData> result = userService.findByUsername(username);

        // Then
        assertTrue(result.isEmpty());
    }
} 
