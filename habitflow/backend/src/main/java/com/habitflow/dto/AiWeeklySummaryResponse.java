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
public class AiWeeklySummaryResponse {
    private String summary;
    private List<String> wins;
    private List<String> improvementAreas;
    private List<String> nextWeekSuggestions;
}
