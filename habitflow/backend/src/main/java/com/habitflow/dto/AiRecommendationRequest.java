package com.habitflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AiRecommendationRequest {
    @NotBlank
    private String goal; // e.g. "Crack CDS", "Learn DSA", "Get a Software Job", "Weight Gain", "Improve Productivity"
}
