package com.yourorg.proctor.repository;

import com.yourorg.proctor.model.PlagiarismReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlagiarismReportRepository extends JpaRepository<PlagiarismReport, Long> {
    Optional<PlagiarismReport> findBySessionId(Long sessionId);
}