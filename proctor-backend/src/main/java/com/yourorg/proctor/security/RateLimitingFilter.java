package com.yourorg.proctor.security;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@Order(0)
public class RateLimitingFilter extends OncePerRequestFilter {
    
    // Store request counts per IP
    private final ConcurrentHashMap<String, AtomicInteger> requestCounts = new ConcurrentHashMap<>();
    
    // Maximum requests per minute per IP
    private static final int MAX_REQUESTS_PER_MINUTE = 100;
    
    // Time window in milliseconds (1 minute)
    private static final long TIME_WINDOW = 60000;
    
    // Store timestamps for each IP
    private final ConcurrentHashMap<String, Long> requestTimestamps = new ConcurrentHashMap<>();
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String clientIp = getClientIp(request);
        
        // Get current timestamp
        long currentTime = System.currentTimeMillis();
        
        // Get or create request count for this IP
        AtomicInteger count = requestCounts.computeIfAbsent(clientIp, k -> new AtomicInteger(0));
        
        // Get last reset time for this IP
        Long lastResetTime = requestTimestamps.get(clientIp);
        
        // If this is the first request or time window has passed, reset the counter
        if (lastResetTime == null || (currentTime - lastResetTime) > TIME_WINDOW) {
            count.set(0);
            requestTimestamps.put(clientIp, currentTime);
        }
        
        // Check if request count exceeds limit
        if (count.incrementAndGet() > MAX_REQUESTS_PER_MINUTE) {
            response.setStatus(429); // HTTP 429 Too Many Requests
            response.getWriter().write("{\"error\": \"Rate limit exceeded. Please try again later.\"}");
            return;
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            // X-Forwarded-For can contain multiple IPs, take the first one
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}