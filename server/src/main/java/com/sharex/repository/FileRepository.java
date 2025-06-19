package com.sharex.repository;

import com.sharex.model.FileData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<FileData, String> {
    
    @Query("SELECT f FROM FileData f WHERE f.userId = :userId")
    List<FileData> findByUserId(@Param("userId") String userId);
    
    @Query("SELECT f.fileId, f.originalFileName, f.userId, f.passwordHash, " +
           "f.downloadLimit, f.downloadCount, f.expiryDate, f.createdAt " +
           "FROM FileData f WHERE f.userId = :userId")
    List<Object[]> findByUserIdWithoutContent(@Param("userId") String userId);
    
    @Query("SELECT COUNT(f) FROM FileData f WHERE f.userId = :userId")
    long countByUserId(@Param("userId") String userId);
} 
