package com.sharex.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sharex.dto.LoginRequest;
import com.sharex.dto.RegisterRequest;
import com.sharex.model.UserData;
import com.sharex.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void register_ShouldReturnSuccess_WhenValidRequest() throws Exception {
        // Given
        RegisterRequest request = new RegisterRequest("testuser", "test@example.com", "password");
        UserData user = new UserData();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        
        when(userService.createUser(anyString(), anyString(), anyString())).thenReturn(user);

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully"));
    }

    @Test
    void register_ShouldReturnBadRequest_WhenUserExists() throws Exception {
        // Given
        RegisterRequest request = new RegisterRequest("existinguser", "test@example.com", "password");
        
        when(userService.createUser(anyString(), anyString(), anyString()))
                .thenThrow(new RuntimeException("Username already exists"));

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    void login_ShouldReturnSuccess_WhenValidCredentials() throws Exception {
        // Given
        LoginRequest request = new LoginRequest("testuser", "password");
        UserData user = new UserData();
        user.setId(1L);
        user.setUsername("testuser");
        user.setPasswordHash("hashedpassword");
        
        when(userService.findUserByUsername(anyString())).thenReturn(Optional.of(user));
        when(userService.verifyPassword(anyString(), anyString())).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login successful"));
    }

    @Test
    void login_ShouldReturnUnauthorized_WhenInvalidCredentials() throws Exception {
        // Given
        LoginRequest request = new LoginRequest("testuser", "wrongpassword");
        
        when(userService.findUserByUsername(anyString())).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").exists());
    }
} 