package com.habitflow.repository;

import com.habitflow.entity.DailyCheckIn;
import com.habitflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyCheckInRepository extends JpaRepository<DailyCheckIn, Long> {
    Optional<DailyCheckIn> findByUserAndCheckinDate(User user, LocalDate date);
    List<DailyCheckIn> findByUserAndCheckinDateBetweenOrderByCheckinDateAsc(User user, LocalDate start, LocalDate end);
    List<DailyCheckIn> findByUserOrderByCheckinDateDesc(User user);
}
