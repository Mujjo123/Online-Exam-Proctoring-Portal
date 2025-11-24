package com.yourorg.proctor.repository;

import com.yourorg.proctor.model.ExamSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamSessionRepository extends JpaRepository<ExamSession, Long> {
    List<ExamSession> findByUserId(Long userId);
    List<ExamSession> findByExamId(Long examId);
    Optional<ExamSession> findByExamIdAndUserId(Long examId, Long userId);
}