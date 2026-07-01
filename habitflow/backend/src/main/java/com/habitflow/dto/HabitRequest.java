package com.habitflow.dto;

import com.habitflow.entity.enums.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class HabitRequest {
    @NotBlank
    private String name;

    private String description;

    @NotNull
    private Category category;

    private String icon;

    private String color;

    private String timeOfDay;

    private Integer duration;
}
