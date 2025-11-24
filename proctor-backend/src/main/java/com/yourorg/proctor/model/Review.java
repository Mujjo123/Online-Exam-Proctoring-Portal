package com.yourorg.proctor.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "session_id")
    private Long sessionId;
    
    @Column(name = "reviewer_id")
    private Long reviewerId;
    
    private String verdict;
    private String comments;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public Review() {}
    
    public Review(Long sessionId, Long reviewerId, String verdict, String comments) {
        this.sessionId = sessionId;
        this.reviewerId = reviewerId;
        this.verdict = verdict;
        this.comments = comments;
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
    
    public Long getReviewerId() {
        return reviewerId;
    }
    
    public void setReviewerId(Long reviewerId) {
        this.reviewerId = reviewerId;
    }
    
    public String getVerdict() {
        return verdict;
    }
    
    public void setVerdict(String verdict) {
        this.verdict = verdict;
    }
    
    public String getComments() {
        return comments;
    }
    
    public void setComments(String comments) {
        this.comments = comments;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}