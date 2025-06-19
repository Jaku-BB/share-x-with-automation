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

    public FileMetadataResponse() { }

    // Constructor with essential parameters only
    public FileMetadataResponse(String fileId, String originalFileName, long fileSize) {
        this.fileId = fileId;
        this.originalFileName = originalFileName;
        this.fileSize = fileSize;
    }

    // Builder method for full initialization
    public static FileMetadataResponse builder() {
        return new FileMetadataResponse();
    }

    public FileMetadataResponse fileId(String id) {
        this.fileId = id;
        return this;
    }

    public FileMetadataResponse originalFileName(String fileName) {
        this.originalFileName = fileName;
        return this;
    }

    public FileMetadataResponse fileSize(long size) {
        this.fileSize = size;
        return this;
    }

    public FileMetadataResponse userId(String id) {
        this.userId = id;
        return this;
    }

    public FileMetadataResponse hasPassword(boolean password) {
        this.hasPassword = password;
        return this;
    }

    public FileMetadataResponse downloadLimit(Integer limit) {
        this.downloadLimit = limit;
        return this;
    }

    public FileMetadataResponse downloadCount(Integer count) {
        this.downloadCount = count;
        return this;
    }

    public FileMetadataResponse expiryDate(LocalDateTime date) {
        this.expiryDate = date;
        return this;
    }

    public FileMetadataResponse createdAt(LocalDateTime date) {
        this.createdAt = date;
        return this;
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
