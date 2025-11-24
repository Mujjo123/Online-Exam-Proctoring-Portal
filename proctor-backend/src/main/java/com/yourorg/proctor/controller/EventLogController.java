package com.yourorg.proctor.controller;

import com.yourorg.proctor.model.EventLog;
import com.yourorg.proctor.repository.EventLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/event-logs")
@CrossOrigin
public class EventLogController {
    
    @Autowired
    private EventLogRepository eventLogRepository;
    
    @Autowired
    private WebSocketController webSocketController;
    
    @PostMapping
    public ResponseEntity<?> createEventLog(@RequestBody Map<String, Object> request) {
        try {
            Long sessionId = Long.valueOf(request.get("sessionId").toString());
            String eventType = request.get("eventType").toString();
            String severity = request.getOrDefault("severity", "INFO").toString();
            
            // Convert detailJson to string if it's an object
            String detailJson = "";
            if (request.containsKey("detailJson")) {
                Object detailObj = request.get("detailJson");
                if (detailObj instanceof Map) {
                    detailJson = new com.fasterxml.jackson.databind.ObjectMapper()
                        .writeValueAsString(detailObj);
                } else {
                    detailJson = detailObj.toString();
                }
            }
            
            EventLog eventLog = new EventLog(sessionId, eventType, detailJson, severity);
            eventLog.setTimestamp(LocalDateTime.now());
            
            EventLog saved = eventLogRepository.save(eventLog);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", saved.getId());
            response.put("sessionId", saved.getSessionId());
            response.put("eventType", saved.getEventType());
            response.put("timestamp", saved.getTimestamp());
            response.put("severity", saved.getSeverity());
            response.put("message", "Event logged successfully");
            
            // Send real-time alert via WebSocket for proctoring events
            if (isProctoringEvent(eventType)) {
                webSocketController.sendProctoringAlertToSession(
                    sessionId, 
                    eventType, 
                    Map.of(
                        "eventType", eventType,
                        "severity", severity,
                        "detailJson", detailJson,
                        "timestamp", saved.getTimestamp()
                    )
                );
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create event log: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<?> getEventLogsBySession(@PathVariable Long sessionId) {
        try {
            List<EventLog> events = eventLogRepository.findBySessionId(sessionId);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch event logs: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllEventLogs() {
        try {
            List<EventLog> events = eventLogRepository.findAll();
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch event logs: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Check if an event type is a proctoring event that should trigger real-time alerts
     */
    private boolean isProctoringEvent(String eventType) {
        return eventType != null && (
            eventType.equals("TAB_SWITCH") ||
            eventType.equals("MULTIPLE_FACES") ||
            eventType.equals("NO_FACE") ||
            eventType.equals("FULLSCREEN_EXIT") ||
            eventType.equals("COPY_PASTE_ATTEMPT") ||
            eventType.equals("KEYBOARD_SHORTCUT_ATTEMPT") ||
            eventType.equals("RIGHT_CLICK_ATTEMPT") ||
            eventType.equals("WEBCAM_ERROR")
        );
    }
}