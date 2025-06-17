package com.sharex.service;

import com.sharex.dto.FileMetadataResponse;
import com.sharex.dto.UserFileResponse;
import com.sharex.model.FileData;
import com.sharex.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String uploadFile(MultipartFile file, String userId, String password, 
                           Integer downloadLimit, LocalDateTime expiryDate) throws IOException {
        String fileId = UUID.randomUUID().toString();
        byte[] content = file.getBytes();
        
        FileData fileData = new FileData(fileId, file.getOriginalFilename(), content, userId);
        
        if (password != null && !password.trim().isEmpty()) {
            fileData.setPasswordHash(passwordEncoder.encode(password));
        }
        
        if (downloadLimit != null && downloadLimit > 0) {
            fileData.setDownloadLimit(downloadLimit);
        }
        
        if (expiryDate != null) {
            fileData.setExpiryDate(expiryDate);
        }

        fileRepository.save(fileData);
        return fileId;
    }

    public Optional<FileData> getFile(String fileId) {
        return fileRepository.findById(fileId);
    }

    public boolean validateFileAccess(FileData fileData, String password) {
        if (fileData.getExpiryDate() != null && fileData.getExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }

        if (fileData.getDownloadLimit() != null && 
            fileData.getDownloadCount() >= fileData.getDownloadLimit()) {
            return false;
        }

        if (fileData.getPasswordHash() != null) {
            if (password == null || !passwordEncoder.matches(password, fileData.getPasswordHash())) {
                return false;
            }
        }

        return true;
    }

    public void incrementDownloadCount(String fileId) {
        Optional<FileData> fileOpt = fileRepository.findById(fileId);
        if (fileOpt.isPresent()) {
            FileData fileData = fileOpt.get();
            fileData.setDownloadCount(fileData.getDownloadCount() + 1);
            fileRepository.save(fileData);
        }
    }

    public List<FileData> getUserFiles(String userId) {
        return fileRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<UserFileResponse> getUserFilesForProfile(String userId) {
        List<Object[]> files = fileRepository.findByUserIdWithoutContent(userId);
        return files.stream()
                .map(row -> new UserFileResponse(
                    (String) row[0],
                    (String) row[1],
                    row[3] != null,
                    (Integer) row[4],
                    (Integer) row[5],
                    (LocalDateTime) row[6],
                    (LocalDateTime) row[7]
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUserFileCount(String userId) {
        return fileRepository.countByUserId(userId);
    }

    public FileMetadataResponse getFileMetadata(String fileId) {
        Optional<FileData> fileOpt = fileRepository.findById(fileId);
        if (fileOpt.isEmpty()) {
            return null;
        }

        FileData fileData = fileOpt.get();
        long fileSize = fileData.getContent() != null ? fileData.getContent().length : 0;
        boolean hasPassword = fileData.getPasswordHash() != null;

        return new FileMetadataResponse(
            fileData.getFileId(),
            fileData.getOriginalFileName(),
            fileSize,
            fileData.getUserId(),
            hasPassword,
            fileData.getDownloadLimit(),
            fileData.getDownloadCount(),
            fileData.getExpiryDate(),
            fileData.getCreatedAt()
        );
    }
} 