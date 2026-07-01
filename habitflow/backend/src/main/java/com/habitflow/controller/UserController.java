package com.habitflow.controller;

import com.habitflow.dto.UserProfileResponse;
import com.habitflow.entity.User;
import com.habitflow.security.CurrentUser;
import com.habitflow.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> me(@CurrentUser User user) {
        return ResponseEntity.ok(userService.getProfile(user));
    }
}
