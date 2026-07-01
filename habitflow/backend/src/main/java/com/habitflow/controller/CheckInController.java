package com.habitflow.controller;

import com.habitflow.security.CurrentUser;
import com.habitflow.dto.CheckInRequest;
import com.habitflow.dto.CheckInResponse;
import com.habitflow.entity.User;
import com.habitflow.service.CheckInService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/checkins")
@RequiredArgsConstructor
public class CheckInController {

    private final CheckInService checkInService;

    @PostMapping
    public ResponseEntity<CheckInResponse> upsert(@CurrentUser User user, @Valid @RequestBody CheckInRequest request) {
        return ResponseEntity.ok(checkInService.upsertCheckIn(user, request));
    }

    @GetMapping("/today")
    public ResponseEntity<CheckInResponse> today(@CurrentUser User user) {
        return checkInService.getCheckInForDate(user, LocalDate.now())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping
    public ResponseEntity<List<CheckInResponse>> history(@CurrentUser User user) {
        return ResponseEntity.ok(checkInService.getHistory(user));
    }
}
