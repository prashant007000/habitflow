package com.habitflow.controller;

import com.habitflow.security.CurrentUser;
import com.habitflow.dto.FocusSessionRequest;
import com.habitflow.dto.FocusSessionResponse;
import com.habitflow.entity.User;
import com.habitflow.service.FocusSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/focus-sessions")
@RequiredArgsConstructor
public class FocusSessionController {

    private final FocusSessionService focusSessionService;

    @GetMapping
    public ResponseEntity<List<FocusSessionResponse>> getSessions(@CurrentUser User user) {
        return ResponseEntity.ok(focusSessionService.getUserSessions(user));
    }

    @PostMapping
    public ResponseEntity<FocusSessionResponse> createSession(@CurrentUser User user, @Valid @RequestBody FocusSessionRequest request) {
        return ResponseEntity.ok(focusSessionService.createSession(user, request));
    }
}
