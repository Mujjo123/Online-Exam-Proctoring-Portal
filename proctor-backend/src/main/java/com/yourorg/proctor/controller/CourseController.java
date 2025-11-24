package com.yourorg.proctor.controller;

import com.yourorg.proctor.model.Course;
import com.yourorg.proctor.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin
public class CourseController {
    
    @Autowired
    private CourseRepository courseRepository;
    
    @GetMapping
    public ResponseEntity<?> getAllCourses() {
        try {
            List<Course> courses = courseRepository.findAll();
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch courses: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getCourse(@PathVariable Long id) {
        try {
            Optional<Course> courseOpt = courseRepository.findById(id);
            if (courseOpt.isPresent()) {
                return ResponseEntity.ok(courseOpt.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Course not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch course: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<?> getCoursesByInstructor(@PathVariable Long instructorId) {
        try {
            List<Course> courses = courseRepository.findByInstructorId(instructorId);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch courses: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody Map<String, Object> request) {
        try {
            Course course = new Course();
            
            if (request.containsKey("title")) {
                course.setTitle(request.get("title").toString());
            }
            if (request.containsKey("instructorId")) {
                course.setInstructorId(Long.valueOf(request.get("instructorId").toString()));
            }
            
            course.setCreatedAt(LocalDateTime.now());
            
            Course saved = courseRepository.save(course);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create course: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Optional<Course> courseOpt = courseRepository.findById(id);
            if (courseOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Course not found");
                return ResponseEntity.notFound().build();
            }
            
            Course course = courseOpt.get();
            
            if (request.containsKey("title")) {
                course.setTitle(request.get("title").toString());
            }
            if (request.containsKey("instructorId")) {
                course.setInstructorId(Long.valueOf(request.get("instructorId").toString()));
            }
            
            Course updated = courseRepository.save(course);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update course: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            if (courseRepository.existsById(id)) {
                courseRepository.deleteById(id);
                Map<String, String> response = new HashMap<>();
                response.put("message", "Course deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Course not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete course: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}

