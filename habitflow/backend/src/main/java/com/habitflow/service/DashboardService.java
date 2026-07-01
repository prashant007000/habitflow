package com.habitflow.service;

import com.habitflow.dto.DashboardResponse;
import com.habitflow.entity.DailyCheckIn;
import com.habitflow.entity.Habit;
import com.habitflow.entity.HabitCompletion;
import com.habitflow.entity.User;
import com.habitflow.entity.enums.MoodType;
import com.habitflow.repository.DailyCheckInRepository;
import com.habitflow.repository.HabitCompletionRepository;
import com.habitflow.repository.HabitRepository;
import com.habitflow.entity.FocusSession;
import com.habitflow.repository.FocusSessionRepository;
import com.habitflow.dto.CheckInResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final HabitRepository habitRepository;
    private final HabitCompletionRepository completionRepository;
    private final DailyCheckInRepository checkInRepository;
    private final FocusSessionRepository focusSessionRepository;

    private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_LOCAL_DATE;

    public DashboardResponse buildDashboard(User user) {
        List<Habit> habits = habitRepository.findByUserAndActiveTrueOrderByCreatedAtDesc(user);
        LocalDate today = LocalDate.now();
        LocalDate monthAgo = today.minusDays(29);
        LocalDate weekAgo = today.minusDays(6);

        List<HabitCompletion> last30 = completionRepository.findByUserAndCompletionDateBetween(user, monthAgo, today);

        int totalHabits = habits.size();
        int completedToday = (int) completionRepository.findByUserAndCompletionDate(user, today).size();
        int activeStreakCount = (int) habits.stream().filter(h -> h.getCurrentStreak() != null && h.getCurrentStreak() > 0).count();
        int longestCurrentStreak = habits.stream().mapToInt(h -> h.getCurrentStreak() != null ? h.getCurrentStreak() : 0).max().orElse(0);

        // XP and Level
        int userXp = user.getXp() != null ? user.getXp() : 0;
        int userLevel = user.getLevel() != null ? user.getLevel() : 1;

        // Daily Score: habits (50%), mood (20%), sleep (20%), focus (10%)
        double habitPortion = totalHabits > 0 ? ((double) completedToday / totalHabits) * 50.0 : 50.0;
        
        Optional<DailyCheckIn> todayCheckInOpt = checkInRepository.findByUserAndCheckinDate(user, today);
        double moodPortion = 0;
        double sleepPortion = 0;
        double sleepHours = 0.0;
        CheckInResponse todayCheckInDto = null;
        if (todayCheckInOpt.isPresent()) {
            DailyCheckIn ci = todayCheckInOpt.get();
            moodPortion = (moodToScore(ci.getMood()) / 5.0) * 20.0;
            sleepHours = ci.getSleepHours() != null ? ci.getSleepHours() : 8.0;
            sleepPortion = (Math.min(sleepHours, 10.0) / 8.0) * 20.0;
            todayCheckInDto = CheckInResponse.builder()
                    .id(ci.getId())
                    .date(ci.getCheckinDate())
                    .mood(ci.getMood())
                    .productivityScore(ci.getProductivityScore())
                    .energyLevel(ci.getEnergyLevel())
                    .stressLevel(ci.getStressLevel())
                    .journal(ci.getJournal())
                    .sleepHours(ci.getSleepHours())
                    .build();
        } else {
            moodPortion = 12.0; // average default
            sleepPortion = 15.0; // average default (6 hours)
        }

        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(23, 59, 59);
        List<FocusSession> todaySessions = focusSessionRepository.findByUserAndCompletedAtBetweenOrderByCompletedAtDesc(user, startOfDay, endOfDay);
        int focusMinutes = todaySessions.stream().mapToInt(FocusSession::getDurationMinutes).sum();
        double focusPortion = (Math.min(focusMinutes, 60) / 60.0) * 10.0;

        int dailyScore = (int) Math.round(habitPortion + moodPortion + sleepPortion + focusPortion);
        dailyScore = Math.max(0, Math.min(100, dailyScore));

        // Momentum Score: consistency (60%), sleep (20%), streak (20%)
        double weeklyRate = computeCompletionRate(last30, habits, weekAgo, today);
        double monthlyRate = computeCompletionRate(last30, habits, monthAgo, today);
        double overallConsistency = monthlyRate; // simplified: 30-day consistency

        double consistencyPortion = weeklyRate * 0.6;
        List<DailyCheckIn> last7Checkins = checkInRepository.findByUserAndCheckinDateBetweenOrderByCheckinDateAsc(user, weekAgo, today);
        double avgSleep = last7Checkins.stream().filter(c -> c.getSleepHours() != null).mapToDouble(DailyCheckIn::getSleepHours).average().orElse(8.0);
        double sleepMomPortion = (Math.min(avgSleep, 10.0) / 8.0) * 20.0;
        double streakPortion = (Math.min(longestCurrentStreak, 30) / 30.0) * 20.0;

        int momentumScore = (int) Math.round(consistencyPortion + sleepMomPortion + streakPortion);
        momentumScore = Math.max(0, Math.min(100, momentumScore));

        List<DashboardResponse.DayActivity> heatmap = buildHeatmap(last30, habits, monthAgo, today);
        List<DashboardResponse.MoodPoint> moodTrend = buildMoodTrend(user, monthAgo, today);
        List<DashboardResponse.ProductivityPoint> productivityTrend = buildProductivityTrend(user, monthAgo, today);
        List<DashboardResponse.HabitPerformance> performances = buildHabitPerformance(habits, last30);
        Map<String, Double> moodVsProductivity = buildMoodVsProductivity(user, monthAgo, today);
        List<DashboardResponse.Achievement> achievements = buildAchievements(habits, user);

        List<DashboardResponse.HabitPerformance> best = performances.stream()
                .sorted(Comparator.comparingDouble(DashboardResponse.HabitPerformance::getCompletionPercentage).reversed())
                .limit(3).collect(Collectors.toList());
        List<DashboardResponse.HabitPerformance> worst = performances.stream()
                .sorted(Comparator.comparingDouble(DashboardResponse.HabitPerformance::getCompletionPercentage))
                .limit(3).collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalHabits(totalHabits)
                .completedToday(completedToday)
                .activeStreakCount(activeStreakCount)
                .longestCurrentStreak(longestCurrentStreak)
                .weeklyCompletionRate(round(weeklyRate))
                .monthlyCompletionRate(round(monthlyRate))
                .overallConsistency(round(overallConsistency))
                .dailyScore(dailyScore)
                .momentumScore(momentumScore)
                .userXp(userXp)
                .userLevel(userLevel)
                .sleepHours(sleepHours)
                .focusMinutes(focusMinutes)
                .todayCheckIn(todayCheckInDto)
                .last30DaysActivity(heatmap)
                .moodTrend(moodTrend)
                .productivityTrend(productivityTrend)
                .bestHabits(best)
                .worstHabits(worst)
                .moodVsProductivity(moodVsProductivity)
                .achievements(achievements)
                .build();
    }

    private double computeCompletionRate(List<HabitCompletion> completions, List<Habit> habits, LocalDate start, LocalDate end) {
        if (habits.isEmpty()) return 0;
        long days = end.toEpochDay() - start.toEpochDay() + 1;
        long possible = days * habits.size();
        long actual = completions.stream()
                .filter(c -> !c.getCompletionDate().isBefore(start) && !c.getCompletionDate().isAfter(end))
                .count();
        if (possible == 0) return 0;
        return (actual / (double) possible) * 100.0;
    }

    private List<DashboardResponse.DayActivity> buildHeatmap(List<HabitCompletion> completions, List<Habit> habits, LocalDate start, LocalDate end) {
        Map<LocalDate, Long> grouped = completions.stream()
                .collect(Collectors.groupingBy(HabitCompletion::getCompletionDate, Collectors.counting()));

        List<DashboardResponse.DayActivity> result = new ArrayList<>();
        int totalHabits = Math.max(habits.size(), 1);
        for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {
            long count = grouped.getOrDefault(d, 0L);
            double intensity = Math.min(1.0, count / (double) totalHabits);
            result.add(DashboardResponse.DayActivity.builder()
                    .date(d.format(ISO))
                    .completedCount((int) count)
                    .totalCount(totalHabits)
                    .intensity(round(intensity))
                    .build());
        }
        return result;
    }

    private List<DashboardResponse.MoodPoint> buildMoodTrend(User user, LocalDate start, LocalDate end) {
        List<DailyCheckIn> checkIns = checkInRepository.findByUserAndCheckinDateBetweenOrderByCheckinDateAsc(user, start, end);
        return checkIns.stream().map(c -> DashboardResponse.MoodPoint.builder()
                        .date(c.getCheckinDate().format(ISO))
                        .mood(c.getMood().name())
                        .moodScore(moodToScore(c.getMood()))
                        .build())
                .collect(Collectors.toList());
    }

    private List<DashboardResponse.ProductivityPoint> buildProductivityTrend(User user, LocalDate start, LocalDate end) {
        List<DailyCheckIn> checkIns = checkInRepository.findByUserAndCheckinDateBetweenOrderByCheckinDateAsc(user, start, end);
        return checkIns.stream().map(c -> DashboardResponse.ProductivityPoint.builder()
                        .date(c.getCheckinDate().format(ISO))
                        .productivity(c.getProductivityScore())
                        .energy(c.getEnergyLevel())
                        .stress(c.getStressLevel())
                        .build())
                .collect(Collectors.toList());
    }

    private List<DashboardResponse.HabitPerformance> buildHabitPerformance(List<Habit> habits, List<HabitCompletion> last30) {
        Map<Long, Long> countByHabit = last30.stream()
                .collect(Collectors.groupingBy(c -> c.getHabit().getId(), Collectors.counting()));

        return habits.stream().map(h -> {
            long count = countByHabit.getOrDefault(h.getId(), 0L);
            double pct = (count / 30.0) * 100.0;
            return DashboardResponse.HabitPerformance.builder()
                    .habitId(h.getId())
                    .name(h.getName())
                    .icon(h.getIcon())
                    .completionPercentage(round(pct))
                    .currentStreak(h.getCurrentStreak() != null ? h.getCurrentStreak() : 0)
                    .build();
        }).collect(Collectors.toList());
    }

    private Map<String, Double> buildMoodVsProductivity(User user, LocalDate start, LocalDate end) {
        List<DailyCheckIn> checkIns = checkInRepository.findByUserAndCheckinDateBetweenOrderByCheckinDateAsc(user, start, end);
        Map<MoodType, List<Integer>> grouped = checkIns.stream()
                .filter(c -> c.getProductivityScore() != null)
                .collect(Collectors.groupingBy(DailyCheckIn::getMood,
                        Collectors.mapping(DailyCheckIn::getProductivityScore, Collectors.toList())));

        Map<String, Double> result = new LinkedHashMap<>();
        for (MoodType mood : MoodType.values()) {
            List<Integer> scores = grouped.getOrDefault(mood, Collections.emptyList());
            double avg = scores.stream().mapToInt(Integer::intValue).average().orElse(0);
            result.put(mood.name(), round(avg));
        }
        return result;
    }

    private List<DashboardResponse.Achievement> buildAchievements(List<Habit> habits, User user) {
        int maxStreak = habits.stream().mapToInt(h -> h.getLongestStreak() != null ? h.getLongestStreak() : 0).max().orElse(0);
        boolean hasCoding = habits.stream().anyMatch(h -> h.getCategory().name().equals("CODING"));
        boolean hasReading = habits.stream().anyMatch(h -> h.getCategory().name().equals("READING"));
        long activeHabitsCount = habits.size();

        List<DashboardResponse.Achievement> list = new ArrayList<>();
        list.add(achievement("streak_7", "7-Day Streak", "Maintain any habit for 7 days straight", "🔥", maxStreak >= 7));
        list.add(achievement("streak_30", "30-Day Streak", "Maintain any habit for 30 days straight", "⚡", maxStreak >= 30));
        list.add(achievement("streak_100", "100-Day Streak", "Maintain any habit for 100 days straight", "👑", maxStreak >= 100));
        list.add(achievement("consistency_master", "Consistency Master", "Keep 3+ active habits running", "🎯", activeHabitsCount >= 3));
        list.add(achievement("coding_warrior", "Coding Warrior", "Track a coding habit", "💻", hasCoding));
        list.add(achievement("reading_champion", "Reading Champion", "Track a reading habit", "📚", hasReading));
        list.add(achievement("early_bird", "Early Bird", "Complete a habit before 8 AM", "🌅", false));
        list.add(achievement("productivity_beast", "Productivity Beast", "Average productivity score of 8+", "🚀", false));
        return list;
    }

    private DashboardResponse.Achievement achievement(String key, String title, String desc, String icon, boolean unlocked) {
        return DashboardResponse.Achievement.builder()
                .key(key).title(title).description(desc).icon(icon).unlocked(unlocked).build();
    }

    private int moodToScore(MoodType mood) {
        return switch (mood) {
            case AMAZING -> 5;
            case GOOD -> 4;
            case AVERAGE -> 3;
            case BAD -> 2;
            case FUCKED_UP -> 1;
        };
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
