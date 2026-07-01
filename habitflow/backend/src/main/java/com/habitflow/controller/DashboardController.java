package com.habitflow.controller;

import com.habitflow.security.CurrentUser;
import com.habitflow.dto.DashboardResponse;
import com.habitflow.entity.User;
import com.habitflow.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(@CurrentUser User user) {
        return ResponseEntity.ok(dashboardService.buildDashboard(user));
    }
}
