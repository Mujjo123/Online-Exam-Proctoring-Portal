package com.yourorg.proctor.repository;

import com.yourorg.proctor.model.ProctoringReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProctoringReportRepository extends JpaRepository<ProctoringReport, Long> {
    List<ProctoringReport> findBySessionId(Long sessionId);
    List<ProctoringReport> findByStudentId(Long studentId);
    List<ProctoringReport> findByExamId(Long examId);
}