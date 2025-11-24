package com.yourorg.proctor.controller;

import com.yourorg.proctor.model.Question;
import com.yourorg.proctor.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin
public class QuestionController {
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @GetMapping
    public ResponseEntity<?> getAllQuestions() {
        try {
            List<Question> questions = questionRepository.findAll();
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch questions: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getQuestion(@PathVariable Long id) {
        try {
            Optional<Question> questionOpt = questionRepository.findById(id);
            if (questionOpt.isPresent()) {
                return ResponseEntity.ok(questionOpt.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Question not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch question: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/exam/{examId}")
    public ResponseEntity<?> getQuestionsByExam(@PathVariable Long examId) {
        try {
            List<Question> questions = questionRepository.findByExamId(examId);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch questions: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createQuestion(@RequestBody Map<String, Object> request) {
        try {
            Question question = new Question();
            
            if (request.containsKey("examId")) {
                question.setExamId(Long.valueOf(request.get("examId").toString()));
            }
            if (request.containsKey("type")) {
                question.setType(request.get("type").toString());
            }
            if (request.containsKey("questionText")) {
                question.setQuestionText(request.get("questionText").toString());
            }
            if (request.containsKey("optionsJson")) {
                Object optionsObj = request.get("optionsJson");
                if (optionsObj instanceof Map || optionsObj instanceof List) {
                    question.setOptionsJson(new com.fasterxml.jackson.databind.ObjectMapper()
                        .writeValueAsString(optionsObj));
                } else {
                    question.setOptionsJson(optionsObj.toString());
                }
            }
            if (request.containsKey("answerKey")) {
                question.setAnswerKey(request.get("answerKey").toString());
            }
            
            question.setCreatedAt(LocalDateTime.now());
            
            Question saved = questionRepository.save(question);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create question: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuestion(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Optional<Question> questionOpt = questionRepository.findById(id);
            if (questionOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Question not found");
                return ResponseEntity.notFound().build();
            }
            
            Question question = questionOpt.get();
            
            if (request.containsKey("type")) {
                question.setType(request.get("type").toString());
            }
            if (request.containsKey("questionText")) {
                question.setQuestionText(request.get("questionText").toString());
            }
            if (request.containsKey("optionsJson")) {
                Object optionsObj = request.get("optionsJson");
                if (optionsObj instanceof Map || optionsObj instanceof List) {
                    question.setOptionsJson(new com.fasterxml.jackson.databind.ObjectMapper()
                        .writeValueAsString(optionsObj));
                } else {
                    question.setOptionsJson(optionsObj.toString());
                }
            }
            if (request.containsKey("answerKey")) {
                question.setAnswerKey(request.get("answerKey").toString());
            }
            
            Question updated = questionRepository.save(question);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update question: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        try {
            if (questionRepository.existsById(id)) {
                questionRepository.deleteById(id);
                Map<String, String> response = new HashMap<>();
                response.put("message", "Question deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Question not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete question: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}

