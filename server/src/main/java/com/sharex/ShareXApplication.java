package com.sharex;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public final class ShareXApplication {
    
    private ShareXApplication() {
        // Private constructor to hide implicit public one
    }
    
    public static void main(String[] args) {
        SpringApplication.run(ShareXApplication.class, args);
    }
} 
