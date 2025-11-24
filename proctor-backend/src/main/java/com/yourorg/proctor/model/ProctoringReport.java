package com.yourorg.proctor.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "proctoring_reports")
public class ProctoringReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "session_id")
    private Long sessionId;
    
    @Column(name = "student_id")
    private Long studentId;
    
    @Column(name = "exam_id")
    private Long examId;
    
    @Column(name = "total_suspicion_score")
    private Double totalSuspicionScore;
    
    @Column(name = "max_suspicion_score")
    private Double maxSuspicionScore;
    
    @Column(name = "suspicion_events_json")
    private String suspicionEventsJson;
    
    @Column(name = "summary_json")
    private String summaryJson;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public ProctoringReport() {}
    
    public ProctoringReport(Long sessionId, Long studentId, Long examId, 
                           Double totalSuspicionScore, Double maxSuspicionScore, 
                           String suspicionEventsJson, String summaryJson) {
        this.sessionId = sessionId;
        this.studentId = studentId;
        this.examId = examId;
        this.totalSuspicionScore = totalSuspicionScore;
        this.maxSuspicionScore = maxSuspicionScore;
        this.suspicionEventsJson = suspicionEventsJson;
        this.summaryJson = summaryJson;
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
    
    public Long getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
    
    public Long getExamId() {
        return examId;
    }
    
    public void setExamId(Long examId) {
        this.examId = examId;
    }
    
    public Double getTotalSuspicionScore() {
        return totalSuspicionScore;
    }
    
    public void setTotalSuspicionScore(Double totalSuspicionScore) {
        this.totalSuspicionScore = totalSuspicionScore;
    }
    
    public Double getMaxSuspicionScore() {
        return maxSuspicionScore;
    }
    
    public void setMaxSuspicionScore(Double maxSuspicionScore) {
        this.maxSuspicionScore = maxSuspicionScore;
    }
    
    public String getSuspicionEventsJson() {
        return suspicionEventsJson;
    }
    
    public void setSuspicionEventsJson(String suspicionEventsJson) {
        this.suspicionEventsJson = suspicionEventsJson;
    }
    
    public String getSummaryJson() {
        return summaryJson;
    }
    
    public void setSummaryJson(String summaryJson) {
        this.summaryJson = summaryJson;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}