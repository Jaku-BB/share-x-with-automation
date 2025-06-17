package com.sharex.controller;

import com.sharex.dto.LoginRequest;
import com.sharex.dto.RegisterRequest;
import com.sharex.model.UserData;
import com.sharex.service.FileService;
import com.sharex.service.SessionService;
import com.sharex.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private FileService fileService;

    @Autowired
    private SessionService sessionService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        try {
            UserData user = userService.register(request);
            sessionService.createUserSession(httpRequest, user.getUserId(), user.getUsername());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("userId", user.getUserId());
            response.put("username", user.getUsername());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        try {
            UserData user = userService.login(request);
            sessionService.createUserSession(httpRequest, user.getUserId(), user.getUsername());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("userId", user.getUserId());
            response.put("username", user.getUsername());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            sessionService.invalidateSession(request);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Logout successful");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to logout");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        try {
            if (!sessionService.isUserAuthenticated(request)) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }

            String userId = sessionService.getCurrentUserId(request);
            Optional<UserData> userOpt = userService.findByUserId(userId);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            UserData user = userOpt.get();
            long fileCount = fileService.getUserFileCount(user.getUserId());

            Map<String, Object> profile = new HashMap<>();
            profile.put("userId", user.getUserId());
            profile.put("username", user.getUsername());
            profile.put("email", user.getEmail());
            profile.put("createdAt", user.getCreatedAt());
            profile.put("fileCount", fileCount);

            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get profile");
            return ResponseEntity.badRequest().body(error);
        }
    }
} 
