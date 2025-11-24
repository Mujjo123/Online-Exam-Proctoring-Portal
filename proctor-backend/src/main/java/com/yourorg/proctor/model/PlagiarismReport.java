package com.yourorg.proctor.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "plagiarism_reports")
public class PlagiarismReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "session_id")
    private Long sessionId;
    
    @Column(name = "similarity_score")
    private Double similarityScore;
    
    @Column(name = "matched_sources_json")
    private String matchedSourcesJson;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public PlagiarismReport() {}
    
    public PlagiarismReport(Long sessionId, Double similarityScore, String matchedSourcesJson) {
        this.sessionId = sessionId;
        this.similarityScore = similarityScore;
        this.matchedSourcesJson = matchedSourcesJson;
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
    
    public Double getSimilarityScore() {
        return similarityScore;
    }
    
    public void setSimilarityScore(Double similarityScore) {
        this.similarityScore = similarityScore;
    }
    
    public String getMatchedSourcesJson() {
        return matchedSourcesJson;
    }
    
    public void setMatchedSourcesJson(String matchedSourcesJson) {
        this.matchedSourcesJson = matchedSourcesJson;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}