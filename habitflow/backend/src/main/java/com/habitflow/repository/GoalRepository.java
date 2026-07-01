package com.habitflow.repository;

import com.habitflow.entity.Goal;
import com.habitflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUserOrderByCreatedAtDesc(User user);
    List<Goal> findByUserAndCompletedFalseOrderByCreatedAtDesc(User user);
}
