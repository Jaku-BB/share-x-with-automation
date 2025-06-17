package com.sharex.repository;

import com.sharex.model.UserData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserData, String> {
    
    Optional<UserData> findByUsername(String username);
    
    Optional<UserData> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
} 
