package com.yourorg.proctor.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exams")
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "course_id")
    private Long courseId;
    
    private String title;
    
    @Column(name = "start_time")
    private LocalDateTime startTime;
    
    @Column(name = "duration_min")
    private Integer durationMin;
    
    @Column(name = "max_marks")
    private Integer maxMarks;
    
    @Column(name = "proctoring_settings_json")
    private String proctoringSettingsJson;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public Exam() {}
    
    public Exam(Long courseId, String title, LocalDateTime startTime, Integer durationMin, Integer maxMarks, String proctoringSettingsJson) {
        this.courseId = courseId;
        this.title = title;
        this.startTime = startTime;
        this.durationMin = durationMin;
        this.maxMarks = maxMarks;
        this.proctoringSettingsJson = proctoringSettingsJson;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getCourseId() {
        return courseId;
    }
    
    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public LocalDateTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
    
    public Integer getDurationMin() {
        return durationMin;
    }
    
    public void setDurationMin(Integer durationMin) {
        this.durationMin = durationMin;
    }
    
    public Integer getMaxMarks() {
        return maxMarks;
    }
    
    public void setMaxMarks(Integer maxMarks) {
        this.maxMarks = maxMarks;
    }
    
    public String getProctoringSettingsJson() {
        return proctoringSettingsJson;
    }
    
    public void setProctoringSettingsJson(String proctoringSettingsJson) {
        this.proctoringSettingsJson = proctoringSettingsJson;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}