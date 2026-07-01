package com.habitflow.repository;

import com.habitflow.entity.FocusSession;
import com.habitflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface FocusSessionRepository extends JpaRepository<FocusSession, Long> {
    List<FocusSession> findByUserOrderByCompletedAtDesc(User user);
    List<FocusSession> findByUserAndCompletedAtBetweenOrderByCompletedAtDesc(User user, LocalDateTime start, LocalDateTime end);
}
