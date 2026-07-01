package com.habitflow.dto;

import com.habitflow.entity.enums.GoalCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class GoalRequest {
    @NotBlank
    private String title;

    @NotNull
    private GoalCategory category;

    private Integer progress;

    private Boolean completed;

    private LocalDate targetDate;
}
