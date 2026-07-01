package com.habitflow.service;

import com.habitflow.dto.FocusSessionRequest;
import com.habitflow.dto.FocusSessionResponse;
import com.habitflow.entity.FocusSession;
import com.habitflow.entity.User;
import com.habitflow.repository.FocusSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FocusSessionService {

    private final FocusSessionRepository focusSessionRepository;
    private final UserService userService;

    public List<FocusSessionResponse> getUserSessions(User user) {
        return focusSessionRepository.findByUserOrderByCompletedAtDesc(user).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public FocusSessionResponse createSession(User user, FocusSessionRequest request) {
        FocusSession session = FocusSession.builder()
                .user(user)
                .type(request.getType())
                .durationMinutes(request.getDurationMinutes())
                .notes(request.getNotes())
                .build();

        focusSessionRepository.save(session);

        // Award 2 XP per minute of focus
        int xpEarned = request.getDurationMinutes() * 2;
        userService.addXp(user, xpEarned);

        return toResponse(session);
    }

    private FocusSessionResponse toResponse(FocusSession session) {
        return FocusSessionResponse.builder()
                .id(session.getId())
                .type(session.getType())
                .durationMinutes(session.getDurationMinutes())
                .notes(session.getNotes())
                .completedAt(session.getCompletedAt())
                .build();
    }
}
