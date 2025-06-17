package com.sharex.service;

import com.sharex.dto.LoginRequest;
import com.sharex.dto.RegisterRequest;
import com.sharex.model.UserData;
import com.sharex.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserData register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        String userId = UUID.randomUUID().toString();
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        UserData user = new UserData(userId, request.getUsername(), request.getEmail(), hashedPassword);
        return userRepository.save(user);
    }

    public UserData login(LoginRequest request) {
        Optional<UserData> userOpt = userRepository.findByUsername(request.getUsername());
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid username or password");
        }

        UserData user = userOpt.get();
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid username or password");
        }

        return user;
    }

    public Optional<UserData> findByUserId(String userId) {
        return userRepository.findById(userId);
    }

    public Optional<UserData> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
} 
