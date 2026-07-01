package com.habitflow.controller;

import com.habitflow.security.CurrentUser;
import com.habitflow.dto.*;
import com.habitflow.entity.User;
import com.habitflow.service.AiService;
import com.habitflow.service.CheckInService;
import com.habitflow.service.HabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;
    private final HabitService habitService;
    private final CheckInService checkInService;

    @PostMapping("/recommendations")
    public ResponseEntity<AiRecommendationResponse> getRecommendations(@CurrentUser User user,
                                                                         @Valid @RequestBody AiRecommendationRequest request) {
        return ResponseEntity.ok(aiService.getHabitRecommendations(request.getGoal()));
    }

    @GetMapping("/weekly-summary")
    public ResponseEntity<AiWeeklySummaryResponse> getWeeklySummary(@CurrentUser User user) {
        var habits = habitService.getUserHabits(user);
        var checkIns = checkInService.getHistory(user);
        return ResponseEntity.ok(aiService.getWeeklySummary(habits, checkIns));
    }
}
