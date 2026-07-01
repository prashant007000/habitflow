package com.habitflow.service;

import com.habitflow.dto.HabitRequest;
import com.habitflow.dto.HabitResponse;
import com.habitflow.entity.Habit;
import com.habitflow.entity.HabitCompletion;
import com.habitflow.entity.User;
import com.habitflow.exception.ResourceNotFoundException;
import com.habitflow.repository.HabitCompletionRepository;
import com.habitflow.repository.HabitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HabitService {

    private final HabitRepository habitRepository;
    private final HabitCompletionRepository completionRepository;
    private final UserService userService;

    public List<HabitResponse> getUserHabits(User user) {
        return habitRepository.findByUserAndActiveTrueOrderByCreatedAtDesc(user).stream()
                .map(habit -> toResponse(habit, user))
                .collect(Collectors.toList());
    }

    public HabitResponse createHabit(User user, HabitRequest request) {
        Habit habit = Habit.builder()
                .user(user)
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .icon(request.getIcon() != null ? request.getIcon() : "✅")
                .color(request.getColor() != null ? request.getColor() : "#7C5CFC")
                .timeOfDay(request.getTimeOfDay())
                .duration(request.getDuration())
                .currentStreak(0)
                .longestStreak(0)
                .active(true)
                .build();

        habitRepository.save(habit);
        return toResponse(habit, user);
    }

    public HabitResponse updateHabit(User user, Long habitId, HabitRequest request) {
        Habit habit = getOwnedHabit(user, habitId);
        habit.setName(request.getName());
        habit.setDescription(request.getDescription());
        habit.setCategory(request.getCategory());
        if (request.getIcon() != null) habit.setIcon(request.getIcon());
        if (request.getColor() != null) habit.setColor(request.getColor());
        habit.setTimeOfDay(request.getTimeOfDay());
        habit.setDuration(request.getDuration());
        habitRepository.save(habit);
        return toResponse(habit, user);
    }

    public void deleteHabit(User user, Long habitId) {
        Habit habit = getOwnedHabit(user, habitId);
        habit.setActive(false);
        habitRepository.save(habit);
    }

    public HabitResponse toggleCompletion(User user, Long habitId, LocalDate date) {
        Habit habit = getOwnedHabit(user, habitId);
        LocalDate targetDate = date != null ? date : LocalDate.now();

        Optional<HabitCompletion> existing = completionRepository.findByHabitAndCompletionDate(habit, targetDate);

        if (existing.isPresent()) {
            completionRepository.delete(existing.get());
        } else {
            HabitCompletion completion = HabitCompletion.builder()
                    .habit(habit)
                    .user(user)
                    .completionDate(targetDate)
                    .completed(true)
                    .build();
            completionRepository.save(completion);
            userService.addXp(user, 10);
        }

        recalculateStreaks(habit);
        habitRepository.save(habit);

        return toResponse(habit, user);
    }

    private void recalculateStreaks(Habit habit) {
        List<HabitCompletion> completions = completionRepository.findByHabitOrderByCompletionDateDesc(habit);

        if (completions.isEmpty()) {
            habit.setCurrentStreak(0);
            return;
        }

        // Current streak: consecutive days ending today or yesterday
        int currentStreak = 0;
        LocalDate cursor = LocalDate.now();
        List<LocalDate> dates = completions.stream().map(HabitCompletion::getCompletionDate)
                .sorted((a, b) -> b.compareTo(a))
                .collect(Collectors.toList());

        // allow streak to count if most recent completion is today or yesterday
        if (!dates.isEmpty() && (dates.get(0).equals(LocalDate.now()) || dates.get(0).equals(LocalDate.now().minusDays(1)))) {
            cursor = dates.get(0);
            for (LocalDate d : dates) {
                if (d.equals(cursor)) {
                    currentStreak++;
                    cursor = cursor.minusDays(1);
                } else {
                    break;
                }
            }
        }

        // Longest streak: scan all sorted ascending dates for max consecutive run
        List<LocalDate> ascending = completions.stream().map(HabitCompletion::getCompletionDate)
                .sorted()
                .collect(Collectors.toList());

        int longest = 0, run = 0;
        LocalDate prev = null;
        for (LocalDate d : ascending) {
            if (prev != null && d.equals(prev.plusDays(1))) {
                run++;
            } else {
                run = 1;
            }
            longest = Math.max(longest, run);
            prev = d;
        }

        habit.setCurrentStreak(currentStreak);
        habit.setLongestStreak(Math.max(longest, habit.getLongestStreak() != null ? habit.getLongestStreak() : 0));
    }

    private Habit getOwnedHabit(User user, Long habitId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found"));
        if (!habit.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Habit not found");
        }
        return habit;
    }

    public HabitResponse toResponse(Habit habit, User user) {
        boolean completedToday = completionRepository.findByHabitAndCompletionDate(habit, LocalDate.now()).isPresent();

        LocalDate start = LocalDate.now().minusDays(29);
        long completedLast30 = completionRepository.findByHabitOrderByCompletionDateDesc(habit).stream()
                .filter(c -> !c.getCompletionDate().isBefore(start))
                .count();
        double percentage = (completedLast30 / 30.0) * 100.0;

        return HabitResponse.builder()
                .id(habit.getId())
                .name(habit.getName())
                .description(habit.getDescription())
                .category(habit.getCategory())
                .icon(habit.getIcon())
                .color(habit.getColor())
                .currentStreak(habit.getCurrentStreak())
                .longestStreak(habit.getLongestStreak())
                .completedToday(completedToday)
                .completionPercentage(Math.round(percentage * 10.0) / 10.0)
                .active(habit.isActive())
                .timeOfDay(habit.getTimeOfDay())
                .duration(habit.getDuration())
                .build();
    }
}
