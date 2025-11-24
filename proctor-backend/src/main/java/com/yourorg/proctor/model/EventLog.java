package com.yourorg.proctor.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_logs")
public class EventLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "session_id")
    private Long sessionId;
    
    private LocalDateTime timestamp;
    
    @Column(name = "event_type")
    private String eventType;
    
    @Column(name = "detail_json")
    private String detailJson;
    
    private String severity;
    
    // Constructors
    public EventLog() {}
    
    public EventLog(Long sessionId, String eventType, String detailJson, String severity) {
        this.sessionId = sessionId;
        this.timestamp = LocalDateTime.now();
        this.eventType = eventType;
        this.detailJson = detailJson;
        this.severity = severity;
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
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public String getEventType() {
        return eventType;
    }
    
    public void setEventType(String eventType) {
        this.eventType = eventType;
    }
    
    public String getDetailJson() {
        return detailJson;
    }
    
    public void setDetailJson(String detailJson) {
        this.detailJson = detailJson;
    }
    
    public String getSeverity() {
        return severity;
    }
    
    public void setSeverity(String severity) {
        this.severity = severity;
    }
}