package com.habitflow.service;

import com.habitflow.dto.GoalRequest;
import com.habitflow.dto.GoalResponse;
import com.habitflow.entity.Goal;
import com.habitflow.entity.User;
import com.habitflow.exception.ResourceNotFoundException;
import com.habitflow.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;

    public List<GoalResponse> getUserGoals(User user) {
        return goalRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public GoalResponse createGoal(User user, GoalRequest request) {
        Goal goal = Goal.builder()
                .user(user)
                .title(request.getTitle())
                .category(request.getCategory())
                .progress(request.getProgress() != null ? request.getProgress() : 0)
                .completed(request.getCompleted() != null ? request.getCompleted() : false)
                .targetDate(request.getTargetDate())
                .build();

        goalRepository.save(goal);
        return toResponse(goal);
    }

    public GoalResponse updateGoal(User user, Long goalId, GoalRequest request) {
        Goal goal = getOwnedGoal(user, goalId);
        goal.setTitle(request.getTitle());
        goal.setCategory(request.getCategory());
        if (request.getProgress() != null) goal.setProgress(request.getProgress());
        if (request.getCompleted() != null) goal.setCompleted(request.getCompleted());
        if (request.getTargetDate() != null) goal.setTargetDate(request.getTargetDate());

        // Automatically mark completed if progress reaches 100
        if (goal.getProgress() >= 100) {
            goal.setCompleted(true);
        }

        goalRepository.save(goal);
        return toResponse(goal);
    }

    public void deleteGoal(User user, Long goalId) {
        Goal goal = getOwnedGoal(user, goalId);
        goalRepository.delete(goal);
    }

    private Goal getOwnedGoal(User user, Long goalId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));
        if (!goal.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Goal not found");
        }
        return goal;
    }

    public GoalResponse toResponse(Goal goal) {
        return GoalResponse.builder()
                .id(goal.getId())
                .title(goal.getTitle())
                .category(goal.getCategory())
                .progress(goal.getProgress())
                .completed(goal.isCompleted())
                .targetDate(goal.getTargetDate())
                .build();
    }
}
