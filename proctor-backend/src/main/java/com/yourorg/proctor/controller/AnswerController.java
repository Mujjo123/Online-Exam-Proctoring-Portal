package com.yourorg.proctor.controller;

import com.yourorg.proctor.model.Answer;
import com.yourorg.proctor.repository.AnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/answers")
@CrossOrigin
public class AnswerController {
    
    @Autowired
    private AnswerRepository answerRepository;
    
    @PostMapping
    public ResponseEntity<?> saveAnswer(@RequestBody Map<String, Object> request) {
        try {
            Long sessionId = Long.valueOf(request.get("sessionId").toString());
            Long questionId = Long.valueOf(request.get("questionId").toString());
            String answerText = request.get("answerText").toString();
            
            // Check if answer already exists for this session and question
            List<Answer> existingAnswers = answerRepository.findBySessionIdAndQuestionId(sessionId, questionId);
            Answer answer;
            
            if (!existingAnswers.isEmpty()) {
                // Update existing answer
                answer = existingAnswers.get(0);
                answer.setAnswerText(answerText);
            } else {
                // Create new answer
                answer = new Answer(sessionId, questionId, answerText);
            }
            
            Answer saved = answerRepository.save(answer);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", saved.getId());
            response.put("sessionId", saved.getSessionId());
            response.put("questionId", saved.getQuestionId());
            response.put("answerText", saved.getAnswerText());
            response.put("message", "Answer saved successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to save answer: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<?> getAnswersBySession(@PathVariable Long sessionId) {
        try {
            List<Answer> answers = answerRepository.findBySessionId(sessionId);
            return ResponseEntity.ok(answers);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch answers: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/session/{sessionId}/question/{questionId}")
    public ResponseEntity<?> getAnswerBySessionAndQuestion(
            @PathVariable Long sessionId, 
            @PathVariable Long questionId) {
        try {
            List<Answer> answers = answerRepository.findBySessionIdAndQuestionId(sessionId, questionId);
            if (!answers.isEmpty()) {
                return ResponseEntity.ok(answers.get(0));
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "No answer found for this question in this session");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch answer: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}