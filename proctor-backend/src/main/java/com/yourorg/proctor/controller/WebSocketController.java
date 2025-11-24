package com.yourorg.proctor.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.yourorg.proctor.model.ExamSession;
import com.yourorg.proctor.repository.ExamSessionRepository;

import java.util.HashMap;
import java.util.Map;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ExamSessionRepository examSessionRepository;

    @MessageMapping("/session/{sessionId}")
    @SendTo("/topic/session/{sessionId}")
    public Map<String, Object> handleSessionMessage(@Payload Map<String, Object> message) {
        Map<String, Object> response = new HashMap<>();
        response.put("type", "ECHO");
        response.put("content", message);
        return response;
    }

    /**
     * Send an alert to a specific exam session
     */
    public void sendAlertToSession(Long sessionId, String alertType, String content) {
        Map<String, Object> alertMessage = new HashMap<>();
        alertMessage.put("type", "ALERT");
        alertMessage.put("alertType", alertType);
        alertMessage.put("content", content);
        
        messagingTemplate.convertAndSend("/topic/session/" + sessionId, alertMessage);
    }

    /**
     * Send suspicion score update to a specific exam session
     */
    public void sendSuspicionUpdateToSession(Long sessionId, Double suspicionScore) {
        Map<String, Object> updateMessage = new HashMap<>();
        updateMessage.put("type", "SUSPICION_UPDATE");
        updateMessage.put("suspicionScore", suspicionScore);
        
        messagingTemplate.convertAndSend("/topic/session/" + sessionId, updateMessage);
    }

    /**
     * Send instructor message to a specific exam session
     */
    public void sendInstructorMessageToSession(Long sessionId, String message) {
        Map<String, Object> instructorMessage = new HashMap<>();
        instructorMessage.put("type", "INSTRUCTOR_MESSAGE");
        instructorMessage.put("content", message);
        
        messagingTemplate.convertAndSend("/topic/session/" + sessionId, instructorMessage);
    }

    /**
     * Send proctoring alert to a specific exam session
     */
    public void sendProctoringAlertToSession(Long sessionId, String alertType, Object details) {
        Map<String, Object> proctoringAlert = new HashMap<>();
        proctoringAlert.put("type", "PROCTORING_ALERT");
        proctoringAlert.put("alertType", alertType);
        proctoringAlert.put("details", details);
        
        messagingTemplate.convertAndSend("/topic/session/" + sessionId, proctoringAlert);
    }
}