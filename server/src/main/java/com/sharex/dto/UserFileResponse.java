package com.sharex.dto;

import java.time.LocalDateTime;

public class UserFileResponse {
    
    private String fileId;
    private String originalFileName;
    private boolean isPasswordProtected;
    private Integer downloadLimit;
    private Integer downloadCount;
    private LocalDateTime expiryDate;
    private LocalDateTime createdAt;

    public UserFileResponse() {}

    public UserFileResponse(String fileId, String originalFileName, boolean isPasswordProtected,
                           Integer downloadLimit, Integer downloadCount, 
                           LocalDateTime expiryDate, LocalDateTime createdAt) {
        this.fileId = fileId;
        this.originalFileName = originalFileName;
        this.isPasswordProtected = isPasswordProtected;
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

    public boolean isPasswordProtected() {
        return isPasswordProtected;
    }

    public void setPasswordProtected(boolean passwordProtected) {
        isPasswordProtected = passwordProtected;
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