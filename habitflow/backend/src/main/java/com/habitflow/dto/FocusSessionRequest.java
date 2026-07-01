package com.habitflow.dto;

import com.habitflow.entity.enums.FocusType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FocusSessionRequest {
    @NotNull
    private FocusType type;

    @NotNull
    private Integer durationMinutes;

    private String notes;
}
