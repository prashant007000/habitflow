package com.habitflow.controller;

import com.habitflow.security.CurrentUser;
import com.habitflow.dto.GoalRequest;
import com.habitflow.dto.GoalResponse;
import com.habitflow.entity.User;
import com.habitflow.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @GetMapping
    public ResponseEntity<List<GoalResponse>> getGoals(@CurrentUser User user) {
        return ResponseEntity.ok(goalService.getUserGoals(user));
    }

    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(@CurrentUser User user, @Valid @RequestBody GoalRequest request) {
        return ResponseEntity.ok(goalService.createGoal(user, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoalResponse> updateGoal(@CurrentUser User user, @PathVariable Long id, @Valid @RequestBody GoalRequest request) {
        return ResponseEntity.ok(goalService.updateGoal(user, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@CurrentUser User user, @PathVariable Long id) {
        goalService.deleteGoal(user, id);
        return ResponseEntity.noContent().build();
    }
}
