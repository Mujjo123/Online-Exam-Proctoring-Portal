package com.yourorg.proctor.controller;

import com.yourorg.proctor.model.ExamSession;
import com.yourorg.proctor.repository.ExamSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/exam-sessions")
@CrossOrigin
public class ExamSessionController {
    
    @Autowired
    private ExamSessionRepository examSessionRepository;
    
    @Autowired
    private WebSocketController webSocketController;
    
    @PostMapping
    public ResponseEntity<?> createExamSession(@RequestBody Map<String, Object> request) {
        try {
            Long examId = Long.valueOf(request.get("examId").toString());
            Long userId = Long.valueOf(request.get("userId").toString());
            
            ExamSession session = new ExamSession(
                examId, 
                userId, 
                LocalDateTime.now(), 
                "IN_PROGRESS"
            );
            
            ExamSession saved = examSessionRepository.save(session);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", saved.getId());
            response.put("examId", saved.getExamId());
            response.put("userId", saved.getUserId());
            response.put("startTime", saved.getStartTime());
            response.put("status", saved.getStatus());
            response.put("suspicionScore", saved.getSuspicionScore());
            response.put("message", "Exam session started successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create exam session: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getExamSession(@PathVariable Long id) {
        try {
            Optional<ExamSession> sessionOpt = examSessionRepository.findById(id);
            if (sessionOpt.isPresent()) {
                return ResponseEntity.ok(sessionOpt.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Exam session not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch exam session: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateExamSession(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        try {
            Optional<ExamSession> sessionOpt = examSessionRepository.findById(id);
            if (sessionOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Exam session not found");
                return ResponseEntity.notFound().build();
            }
            
            ExamSession session = sessionOpt.get();
            
            // Update suspicion score
            if (updates.containsKey("suspicionScore")) {
                Double score = Double.valueOf(updates.get("suspicionScore").toString());
                session.setSuspicionScore(score);
                
                // Send real-time update via WebSocket
                webSocketController.sendSuspicionUpdateToSession(id, score);
            }
            
            // Update status
            if (updates.containsKey("status")) {
                session.setStatus(updates.get("status").toString());
            }
            
            // Update end time
            if (updates.containsKey("endTime") || updates.containsKey("status")) {
                String status = updates.getOrDefault("status", session.getStatus()).toString();
                if ("COMPLETED".equals(status) || "SUBMITTED".equals(status)) {
                    session.setEndTime(LocalDateTime.now());
                }
            }
            
            ExamSession updated = examSessionRepository.save(session);
            
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update exam session: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getExamSessionsByUser(@PathVariable Long userId) {
        try {
            List<ExamSession> sessions = examSessionRepository.findByUserId(userId);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch exam sessions: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/exam/{examId}")
    public ResponseEntity<?> getExamSessionsByExam(@PathVariable Long examId) {
        try {
            List<ExamSession> sessions = examSessionRepository.findByExamId(examId);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch exam sessions: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}