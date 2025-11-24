package com.yourorg.proctor.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exam_sessions")
public class ExamSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "exam_id")
    private Long examId;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "start_time")
    private LocalDateTime startTime;
    
    @Column(name = "end_time")
    private LocalDateTime endTime;
    
    private String status;
    
    @Column(name = "final_score")
    private Double finalScore;
    
    @Column(name = "suspicion_score")
    private Double suspicionScore;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public ExamSession() {}
    
    public ExamSession(Long examId, Long userId, LocalDateTime startTime, String status) {
        this.examId = examId;
        this.userId = userId;
        this.startTime = startTime;
        this.status = status;
        this.suspicionScore = 0.0;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getExamId() {
        return examId;
    }
    
    public void setExamId(Long examId) {
        this.examId = examId;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public LocalDateTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
    
    public LocalDateTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Double getFinalScore() {
        return finalScore;
    }
    
    public void setFinalScore(Double finalScore) {
        this.finalScore = finalScore;
    }
    
    public Double getSuspicionScore() {
        return suspicionScore;
    }
    
    public void setSuspicionScore(Double suspicionScore) {
        this.suspicionScore = suspicionScore;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}