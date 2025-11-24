package com.yourorg.proctor.repository;

import com.yourorg.proctor.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findBySessionId(Long sessionId);
    List<Answer> findBySessionIdAndQuestionId(Long sessionId, Long questionId);
}