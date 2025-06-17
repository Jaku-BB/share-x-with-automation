package com.sharex.dto;

import java.time.LocalDateTime;

public class FileMetadataResponse {
    
    private String fileId;
    private String originalFileName;
    private long fileSize;
    private String userId;
    private boolean hasPassword;
    private Integer downloadLimit;
    private Integer downloadCount;
    private LocalDateTime expiryDate;
    private LocalDateTime createdAt;

    public FileMetadataResponse() {}

    public FileMetadataResponse(String fileId, String originalFileName, long fileSize, 
                               String userId, boolean hasPassword, Integer downloadLimit, 
                               Integer downloadCount, LocalDateTime expiryDate, LocalDateTime createdAt) {
        this.fileId = fileId;
        this.originalFileName = originalFileName;
        this.fileSize = fileSize;
        this.userId = userId;
        this.hasPassword = hasPassword;
        this.downloadLimit = downloadLimit;
        this.downloadCount = downloadCount;
        this.expiryDate = expiryDate;
        this.createdAt = createdAt;
    }

    public String getFileId() {
        return fileId;
    }

    public void setFileId(String fileId) {
        this.fileId = fileId;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public long getFileSize() {
        return fileSize;
    }

    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public boolean isHasPassword() {
        return hasPassword;
    }

    public void setHasPassword(boolean hasPassword) {
        this.hasPassword = hasPassword;
    }

    public Integer getDownloadLimit() {
        return downloadLimit;
    }

    public void setDownloadLimit(Integer downloadLimit) {
        this.downloadLimit = downloadLimit;
    }

    public Integer getDownloadCount() {
        return downloadCount;
    }

    public void setDownloadCount(Integer downloadCount) {
        this.downloadCount = downloadCount;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
} 
