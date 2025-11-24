package com.yourorg.proctor.controller;

import com.yourorg.proctor.model.Exam;
import com.yourorg.proctor.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin
public class ExamController {
    
    @Autowired
    private ExamRepository examRepository;
    
    @GetMapping
    public ResponseEntity<?> getAllExams() {
        try {
            List<Exam> exams = examRepository.findAll();
            return ResponseEntity.ok(exams);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch exams: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getExam(@PathVariable Long id) {
        try {
            Optional<Exam> examOpt = examRepository.findById(id);
            if (examOpt.isPresent()) {
                return ResponseEntity.ok(examOpt.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Exam not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch exam: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createExam(@RequestBody Map<String, Object> request) {
        try {
            Exam exam = new Exam();
            
            if (request.containsKey("title")) {
                exam.setTitle(request.get("title").toString());
            }
            if (request.containsKey("courseId")) {
                exam.setCourseId(Long.valueOf(request.get("courseId").toString()));
            }
            if (request.containsKey("durationMin")) {
                exam.setDurationMin(Integer.valueOf(request.get("durationMin").toString()));
            }
            if (request.containsKey("maxMarks")) {
                exam.setMaxMarks(Integer.valueOf(request.get("maxMarks").toString()));
            }
            if (request.containsKey("startTime")) {
                // Parse startTime if provided as string
                exam.setStartTime(LocalDateTime.parse(request.get("startTime").toString()));
            } else {
                exam.setStartTime(LocalDateTime.now());
            }
            if (request.containsKey("proctoringSettingsJson")) {
                exam.setProctoringSettingsJson(request.get("proctoringSettingsJson").toString());
            }
            
            exam.setCreatedAt(LocalDateTime.now());
            
            Exam saved = examRepository.save(exam);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", saved.getId());
            response.put("title", saved.getTitle());
            response.put("message", "Exam created successfully");
            
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create exam: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateExam(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Optional<Exam> examOpt = examRepository.findById(id);
            if (examOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Exam not found");
                return ResponseEntity.notFound().build();
            }
            
            Exam exam = examOpt.get();
            
            if (request.containsKey("title")) {
                exam.setTitle(request.get("title").toString());
            }
            if (request.containsKey("courseId")) {
                exam.setCourseId(Long.valueOf(request.get("courseId").toString()));
            }
            if (request.containsKey("durationMin")) {
                exam.setDurationMin(Integer.valueOf(request.get("durationMin").toString()));
            }
            if (request.containsKey("maxMarks")) {
                exam.setMaxMarks(Integer.valueOf(request.get("maxMarks").toString()));
            }
            if (request.containsKey("startTime")) {
                exam.setStartTime(LocalDateTime.parse(request.get("startTime").toString()));
            }
            if (request.containsKey("proctoringSettingsJson")) {
                exam.setProctoringSettingsJson(request.get("proctoringSettingsJson").toString());
            }
            
            Exam updated = examRepository.save(exam);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update exam: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExam(@PathVariable Long id) {
        try {
            if (examRepository.existsById(id)) {
                examRepository.deleteById(id);
                Map<String, String> response = new HashMap<>();
                response.put("message", "Exam deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Exam not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete exam: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getExamsByCourse(@PathVariable Long courseId) {
        try {
            List<Exam> exams = examRepository.findByCourseId(courseId);
            return ResponseEntity.ok(exams);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch exams: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}

