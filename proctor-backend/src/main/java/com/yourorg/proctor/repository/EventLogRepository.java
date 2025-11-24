package com.yourorg.proctor.repository;

import com.yourorg.proctor.model.EventLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventLogRepository extends JpaRepository<EventLog, Long> {
    List<EventLog> findBySessionId(Long sessionId);
}