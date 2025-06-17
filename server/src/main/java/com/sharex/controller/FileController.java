package com.sharex.controller;

import com.sharex.dto.FileMetadataResponse;
import com.sharex.dto.UserFileResponse;
import com.sharex.model.FileData;
import com.sharex.service.FileService;
import com.sharex.service.SessionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileService fileService;

    @Autowired
    private SessionService sessionService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "downloadLimit", required = false) Integer downloadLimit,
            @RequestParam(value = "expiryDate", required = false) String expiryDateStr,
            HttpServletRequest request) {

        try {
            if (!sessionService.isUserAuthenticated(request)) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }

            String userId = sessionService.getCurrentUserId(request);

            LocalDateTime expiryDate = null;
            if (expiryDateStr != null && !expiryDateStr.trim().isEmpty()) {
                expiryDate = LocalDateTime.parse(expiryDateStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            }

            String fileId = fileService.uploadFile(file, userId, password, downloadLimit, expiryDate);
            return ResponseEntity.ok(Map.of("fileId", fileId, "message", "File uploaded successfully"));

        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid request: " + e.getMessage()));
        }
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<?> downloadFile(
            @PathVariable String fileId,
            @RequestParam(value = "password", required = false) String password) {

        Optional<FileData> fileOpt = fileService.getFile(fileId);
        if (fileOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        FileData fileData = fileOpt.get();
        if (!fileService.validateFileAccess(fileData, password)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        fileService.incrementDownloadCount(fileId);

        ByteArrayResource resource = new ByteArrayResource(fileData.getContent());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                       "attachment; filename=\"" + fileData.getOriginalFileName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(fileData.getContent().length)
                .body(resource);
    }

    @GetMapping("/{fileId}/metadata")
    public ResponseEntity<?> getFileMetadata(@PathVariable String fileId) {
        FileMetadataResponse metadata = fileService.getFileMetadata(fileId);
        if (metadata == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(metadata);
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserFiles(HttpServletRequest request) {
        try {
            System.out.println("DEBUG: getUserFiles called");
            if (!sessionService.isUserAuthenticated(request)) {
                System.out.println("DEBUG: User not authenticated");
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }

            String userId = sessionService.getCurrentUserId(request);
            System.out.println("DEBUG: User ID: " + userId);
            List<UserFileResponse> files = fileService.getUserFilesForProfile(userId);
            System.out.println("DEBUG: Files retrieved: " + files.size());
            return ResponseEntity.ok(files);

        } catch (Exception e) {
            System.out.println("DEBUG: Exception in getUserFiles: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to get user files"));
        }
    }
} 