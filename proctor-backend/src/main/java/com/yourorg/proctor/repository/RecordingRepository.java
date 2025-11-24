package com.yourorg.proctor.repository;

import com.yourorg.proctor.model.Recording;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecordingRepository extends JpaRepository<Recording, Long> {
    List<Recording> findBySessionId(Long sessionId);
}