package com.habitflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private int totalHabits;
    private int completedToday;
    private int activeStreakCount;
    private int longestCurrentStreak;
    private double weeklyCompletionRate;
    private double monthlyCompletionRate;
    private double overallConsistency;

    private int dailyScore;
    private int momentumScore;
    private int userXp;
    private int userLevel;
    private double sleepHours;
    private int focusMinutes;
    private CheckInResponse todayCheckIn;

    private List<DayActivity> last30DaysActivity; // for heatmap
    private List<MoodPoint> moodTrend;
    private List<ProductivityPoint> productivityTrend;
    private List<HabitPerformance> bestHabits;
    private List<HabitPerformance> worstHabits;
    private Map<String, Double> moodVsProductivity;
    private List<Achievement> achievements;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DayActivity {
        private String date;
        private int completedCount;
        private int totalCount;
        private double intensity; // 0..1 for heatmap shading
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MoodPoint {
        private String date;
        private String mood;
        private int moodScore; // 1-5 numeric mapping
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductivityPoint {
        private String date;
        private Integer productivity;
        private Integer energy;
        private Integer stress;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HabitPerformance {
        private Long habitId;
        private String name;
        private String icon;
        private double completionPercentage;
        private int currentStreak;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Achievement {
        private String key;
        private String title;
        private String description;
        private String icon;
        private boolean unlocked;
    }
}
