package com.habitflow.dto;

import com.habitflow.entity.enums.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HabitResponse {
    private Long id;
    private String name;
    private String description;
    private Category category;
    private String icon;
    private String color;
    private Integer currentStreak;
    private Integer longestStreak;
    private boolean completedToday;
    private double completionPercentage; // last 30 days
    private boolean active;
    private String timeOfDay;
    private Integer duration;
}
