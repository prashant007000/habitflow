package com.habitflow.repository;

import com.habitflow.entity.Habit;
import com.habitflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUserAndActiveTrueOrderByCreatedAtDesc(User user);
    List<Habit> findByUser(User user);
}
