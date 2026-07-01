package com.habitflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String avatarUrl;
    private String goal;
    private boolean darkMode;
    private int totalHabits;
    private int longestStreakEver;
    private double overallConsistency;
    private int xp;
    private int level;
}
