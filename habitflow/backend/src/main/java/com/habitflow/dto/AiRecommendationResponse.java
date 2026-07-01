package com.habitflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiRecommendationResponse {
    private String goal;
    private List<SuggestedHabit> suggestedHabits;
    private String advice;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SuggestedHabit {
        private String name;
        private String description;
        private String category;
        private String icon;
    }
}
