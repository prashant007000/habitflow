package com.habitflow.dto;

import com.habitflow.entity.enums.FocusType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FocusSessionResponse {
    private Long id;
    private FocusType type;
    private Integer durationMinutes;
    private String notes;
    private LocalDateTime completedAt;
}
