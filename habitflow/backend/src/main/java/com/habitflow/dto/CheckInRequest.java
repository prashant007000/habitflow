package com.habitflow.dto;

import com.habitflow.entity.enums.MoodType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CheckInRequest {
    private LocalDate date; // defaults to today if null

    @NotNull
    private MoodType mood;

    @Min(1) @Max(10)
    private Integer productivityScore;

    @Min(1) @Max(10)
    private Integer energyLevel;

    @Min(1) @Max(10)
    private Integer stressLevel;

    private String journal;

    private Double sleepHours;
}
