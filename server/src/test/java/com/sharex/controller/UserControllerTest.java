package com.sharex.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sharex.dto.LoginRequest;
import com.sharex.dto.RegisterRequest;
import com.sharex.model.UserData;
import com.sharex.service.FileService;
import com.sharex.service.SessionService;
import com.sharex.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
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
    private FileService fileService;
    
    @MockBean
    private SessionService sessionService;
    
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    public void registerShouldReturnSuccessWhenValidRequest() throws Exception {
        RegisterRequest request = new RegisterRequest("testuser", "test@example.com", "password123");
        UserData user = new UserData("123", "testuser", "test@example.com", "hashedpassword");
        
        when(userService.register(any(RegisterRequest.class))).thenReturn(user);
        doNothing().when(sessionService).createUserSession(any(), anyString(), anyString());

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.userId").value("123"))
                .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    @WithMockUser
    public void registerShouldReturnBadRequestWhenUserExists() throws Exception {
        RegisterRequest request = new RegisterRequest("testuser", "test@example.com", "password123");
        
        when(userService.register(any(RegisterRequest.class)))
            .thenThrow(new RuntimeException("User already exists"));

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("User already exists"));
    }

    @Test
    @WithMockUser
    public void loginShouldReturnSuccessWhenValidCredentials() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "password123");
        UserData user = new UserData("123", "testuser", "test@example.com", "hashedpassword");
        
        when(userService.login(any(LoginRequest.class))).thenReturn(user);
        doNothing().when(sessionService).createUserSession(any(), anyString(), anyString());

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.userId").value("123"))
                .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    @WithMockUser
    public void loginShouldReturnBadRequestWhenInvalidCredentials() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "wrongpassword");
        
        when(userService.login(any(LoginRequest.class)))
            .thenThrow(new RuntimeException("Invalid username or password"));

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Invalid username or password"));
    }
} 
