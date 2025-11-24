package com.yourorg.proctor.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "exam_id")
    private Long examId;
    
    private String type;
    private String questionText;
    
    @Column(name = "options_json")
    private String optionsJson;
    
    @Column(name = "answer_key")
    private String answerKey;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public Question() {}
    
    public Question(Long examId, String type, String questionText, String optionsJson, String answerKey) {
        this.examId = examId;
        this.type = type;
        this.questionText = questionText;
        this.optionsJson = optionsJson;
        this.answerKey = answerKey;
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
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getQuestionText() {
        return questionText;
    }
    
    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }
    
    public String getOptionsJson() {
        return optionsJson;
    }
    
    public void setOptionsJson(String optionsJson) {
        this.optionsJson = optionsJson;
    }
    
    public String getAnswerKey() {
        return answerKey;
    }
    
    public void setAnswerKey(String answerKey) {
        this.answerKey = answerKey;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}