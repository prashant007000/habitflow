package com.habitflow.controller;

import com.habitflow.security.CurrentUser;
import com.habitflow.dto.HabitRequest;
import com.habitflow.dto.HabitResponse;
import com.habitflow.entity.User;
import com.habitflow.service.HabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;

    @GetMapping
    public ResponseEntity<List<HabitResponse>> getHabits(@CurrentUser User user) {
        return ResponseEntity.ok(habitService.getUserHabits(user));
    }

    @PostMapping
    public ResponseEntity<HabitResponse> createHabit(@CurrentUser User user, @Valid @RequestBody HabitRequest request) {
        return ResponseEntity.ok(habitService.createHabit(user, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HabitResponse> updateHabit(@CurrentUser User user, @PathVariable Long id, @Valid @RequestBody HabitRequest request) {
        return ResponseEntity.ok(habitService.updateHabit(user, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(@CurrentUser User user, @PathVariable Long id) {
        habitService.deleteHabit(user, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<HabitResponse> toggleCompletion(@CurrentUser User user, @PathVariable Long id,
                                                            @RequestParam(required = false) LocalDate date) {
        return ResponseEntity.ok(habitService.toggleCompletion(user, id, date));
    }
}
