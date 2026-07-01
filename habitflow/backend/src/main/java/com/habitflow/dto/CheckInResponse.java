package com.habitflow.dto;

import com.habitflow.entity.enums.MoodType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckInResponse {
    private Long id;
    private LocalDate date;
    private MoodType mood;
    private Integer productivityScore;
    private Integer energyLevel;
    private Integer stressLevel;
    private String journal;
    private Double sleepHours;
}
