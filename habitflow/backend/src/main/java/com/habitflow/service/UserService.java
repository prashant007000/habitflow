package com.habitflow.service;

import com.habitflow.dto.UserProfileResponse;
import com.habitflow.entity.Habit;
import com.habitflow.entity.User;
import com.habitflow.repository.HabitRepository;
import com.habitflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final HabitRepository habitRepository;
    private final DashboardService dashboardService;
    private final UserRepository userRepository;

    public void addXp(User user, int amount) {
        int currentXp = user.getXp() != null ? user.getXp() : 0;
        int currentLevel = user.getLevel() != null ? user.getLevel() : 1;
        int newXp = currentXp + amount;
        int xpNeeded = currentLevel * 100;
        while (newXp >= xpNeeded) {
            newXp -= xpNeeded;
            currentLevel++;
            xpNeeded = currentLevel * 100;
        }
        user.setXp(newXp);
        user.setLevel(currentLevel);
        userRepository.save(user);
    }

    public UserProfileResponse getProfile(User user) {
        List<Habit> habits = habitRepository.findByUserAndActiveTrueOrderByCreatedAtDesc(user);
        int longestEver = habits.stream().mapToInt(h -> h.getLongestStreak() != null ? h.getLongestStreak() : 0).max().orElse(0);
        double consistency = dashboardService.buildDashboard(user).getOverallConsistency();

        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .goal(user.getGoal())
                .darkMode(user.isDarkMode())
                .totalHabits(habits.size())
                .longestStreakEver(longestEver)
                .overallConsistency(consistency)
                .xp(user.getXp() != null ? user.getXp() : 0)
                .level(user.getLevel() != null ? user.getLevel() : 1)
                .build();
    }
}
