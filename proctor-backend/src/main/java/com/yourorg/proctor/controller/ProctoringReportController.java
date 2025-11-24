package com.yourorg.proctor.controller;

import com.yourorg.proctor.model.ProctoringReport;
import com.yourorg.proctor.repository.ProctoringReportRepository;
import com.yourorg.proctor.repository.ExamSessionRepository;
import com.yourorg.proctor.repository.EventLogRepository;
import com.yourorg.proctor.model.ExamSession;
import com.yourorg.proctor.model.EventLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@RestController
@RequestMapping("/api/proctoring-reports")
@CrossOrigin
public class ProctoringReportController {
    
    @Autowired
    private ProctoringReportRepository proctoringReportRepository;
    
    @Autowired
    private ExamSessionRepository examSessionRepository;
    
    @Autowired
    private EventLogRepository eventLogRepository;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @PostMapping
    public ResponseEntity<?> createProctoringReport(@RequestBody Map<String, Object> request) {
        try {
            Long sessionId = Long.valueOf(request.get("sessionId").toString());
            
            // Get exam session
            ExamSession session = examSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Exam session not found"));
            
            // Get all events for this session
            List<EventLog> events = eventLogRepository.findBySessionId(sessionId);
            
            // Calculate statistics
            Double maxSuspicionScore = events.stream()
                .filter(e -> "HIGH".equals(e.getSeverity()) || "CRITICAL".equals(e.getSeverity()))
                .mapToDouble(e -> {
                    switch (e.getSeverity()) {
                        case "CRITICAL": return 20.0;
                        case "HIGH": return 15.0;
                        default: return 5.0;
                    }
                })
                .sum();
            
            Double totalSuspicionScore = events.stream()
                .mapToDouble(e -> {
                    switch (e.getSeverity()) {
                        case "CRITICAL": return 20.0;
                        case "HIGH": return 15.0;
                        case "MEDIUM": return 10.0;
                        case "LOW": return 5.0;
                        default: return 1.0;
                    }
                })
                .sum();
            
            // Create summary
            ObjectNode summary = objectMapper.createObjectNode();
            summary.put("totalEvents", events.size());
            summary.put("criticalEvents", events.stream().filter(e -> "CRITICAL".equals(e.getSeverity())).count());
            summary.put("highEvents", events.stream().filter(e -> "HIGH".equals(e.getSeverity())).count());
            summary.put("mediumEvents", events.stream().filter(e -> "MEDIUM".equals(e.getSeverity())).count());
            summary.put("lowEvents", events.stream().filter(e -> "LOW".equals(e.getSeverity())).count());
            
            // Group events by type
            Map<String, Long> eventTypeCount = events.stream()
                .collect(Collectors.groupingBy(EventLog::getEventType, Collectors.counting()));
            
            ObjectNode eventTypes = objectMapper.createObjectNode();
            eventTypeCount.forEach((key, value) -> eventTypes.put(key, value));
            summary.set("eventTypes", eventTypes);
            
            // Create report
            ProctoringReport report = new ProctoringReport(
                sessionId,
                session.getUserId(),
                session.getExamId(),
                totalSuspicionScore,
                maxSuspicionScore,
                objectMapper.writeValueAsString(events),
                objectMapper.writeValueAsString(summary)
            );
            
            ProctoringReport saved = proctoringReportRepository.save(report);
            
            Map<String, Object> response = new HashMap<>();
            response.put("report", saved);
            response.put("message", "Proctoring report generated successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create proctoring report: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<?> getProctoringReportsBySession(@PathVariable Long sessionId) {
        try {
            List<ProctoringReport> reports = proctoringReportRepository.findBySessionId(sessionId);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch proctoring reports: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getProctoringReportsByStudent(@PathVariable Long studentId) {
        try {
            List<ProctoringReport> reports = proctoringReportRepository.findByStudentId(studentId);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch proctoring reports: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/exam/{examId}")
    public ResponseEntity<?> getProctoringReportsByExam(@PathVariable Long examId) {
        try {
            List<ProctoringReport> reports = proctoringReportRepository.findByExamId(examId);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch proctoring reports: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getProctoringReport(@PathVariable Long id) {
        try {
            ProctoringReport report = proctoringReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proctoring report not found"));
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch proctoring report: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}