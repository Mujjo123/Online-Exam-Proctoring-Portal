package com.yourorg.proctor.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recordings")
public class Recording {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "session_id")
    private Long sessionId;
    
    private String type; // video or audio
    
    @Column(name = "s3_url")
    private String s3Url;
    
    @Column(name = "start_ts")
    private LocalDateTime startTs;
    
    @Column(name = "end_ts")
    private LocalDateTime endTs;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public Recording() {}
    
    public Recording(Long sessionId, String type, String s3Url, LocalDateTime startTs, LocalDateTime endTs) {
        this.sessionId = sessionId;
        this.type = type;
        this.s3Url = s3Url;
        this.startTs = startTs;
        this.endTs = endTs;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getSessionId() {
        return sessionId;
    }
    
    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getS3Url() {
        return s3Url;
    }
    
    public void setS3Url(String s3Url) {
        this.s3Url = s3Url;
    }
    
    public LocalDateTime getStartTs() {
        return startTs;
    }
    
    public void setStartTs(LocalDateTime startTs) {
        this.startTs = startTs;
    }
    
    public LocalDateTime getEndTs() {
        return endTs;
    }
    
    public void setEndTs(LocalDateTime endTs) {
        this.endTs = endTs;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}