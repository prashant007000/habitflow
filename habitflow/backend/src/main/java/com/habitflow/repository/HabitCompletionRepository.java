package com.habitflow.repository;

import com.habitflow.entity.Habit;
import com.habitflow.entity.HabitCompletion;
import com.habitflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HabitCompletionRepository extends JpaRepository<HabitCompletion, Long> {
    Optional<HabitCompletion> findByHabitAndCompletionDate(Habit habit, LocalDate date);
    List<HabitCompletion> findByHabitOrderByCompletionDateDesc(Habit habit);
    List<HabitCompletion> findByUserAndCompletionDateBetween(User user, LocalDate start, LocalDate end);
    List<HabitCompletion> findByUserAndCompletionDate(User user, LocalDate date);
    long countByHabitAndCompleted(Habit habit, boolean completed);
}
