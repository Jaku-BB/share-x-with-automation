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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registerShouldReturnSuccessWhenValidRequest() throws Exception {
        // Given
        RegisterRequest request = new RegisterRequest("testuser", "test@example.com", "password123");
        UserData user = new UserData();
        user.setUserId("user-id");
        user.setUsername("testuser");
        user.setEmail("test@example.com");

        when(userService.register(request)).thenReturn(user);

        // When & Then
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    void registerShouldReturnBadRequestWhenUserExists() throws Exception {
        // Given
        RegisterRequest request = new RegisterRequest("existinguser", "existing@example.com", "password123");

        when(userService.register(request))
                .thenThrow(new RuntimeException("User already exists"));

        // When & Then
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void loginShouldReturnSuccessWhenValidCredentials() throws Exception {
        // Given
        LoginRequest request = new LoginRequest("testuser", "password123");
        UserData user = new UserData();
        user.setUserId("user-id");
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPasswordHash("hashedpassword");

        when(userService.login(request)).thenReturn(user);

        // When & Then
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    void loginShouldReturnUnauthorizedWhenInvalidCredentials() throws Exception {
        // Given
        LoginRequest request = new LoginRequest("testuser", "wrongpassword");

        when(userService.login(request)).thenThrow(new RuntimeException("Invalid username or password"));

        // When & Then
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }
} 
