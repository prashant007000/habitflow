package com.habitflow.dto;

import com.habitflow.entity.enums.GoalCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoalResponse {
    private Long id;
    private String title;
    private GoalCategory category;
    private Integer progress;
    private boolean completed;
    private LocalDate targetDate;
}
