package com.habitflow.service;

import com.habitflow.dto.CheckInRequest;
import com.habitflow.dto.CheckInResponse;
import com.habitflow.entity.DailyCheckIn;
import com.habitflow.entity.User;
import com.habitflow.repository.DailyCheckInRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CheckInService {

    private final DailyCheckInRepository checkInRepository;
    private final UserService userService;

    public CheckInResponse upsertCheckIn(User user, CheckInRequest request) {
        LocalDate date = request.getDate() != null ? request.getDate() : LocalDate.now();

        Optional<DailyCheckIn> existing = checkInRepository.findByUserAndCheckinDate(user, date);
        boolean isNew = existing.isEmpty();

        DailyCheckIn checkIn = existing.orElse(DailyCheckIn.builder().user(user).checkinDate(date).build());

        checkIn.setMood(request.getMood());
        checkIn.setProductivityScore(request.getProductivityScore());
        checkIn.setEnergyLevel(request.getEnergyLevel());
        checkIn.setStressLevel(request.getStressLevel());
        checkIn.setJournal(request.getJournal());
        checkIn.setSleepHours(request.getSleepHours());

        checkInRepository.save(checkIn);
        if (isNew) {
            userService.addXp(user, 15);
        }
        return toResponse(checkIn);
    }

    public Optional<CheckInResponse> getCheckInForDate(User user, LocalDate date) {
        return checkInRepository.findByUserAndCheckinDate(user, date).map(this::toResponse);
    }

    public List<CheckInResponse> getHistory(User user) {
        return checkInRepository.findByUserOrderByCheckinDateDesc(user).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private CheckInResponse toResponse(DailyCheckIn checkIn) {
        return CheckInResponse.builder()
                .id(checkIn.getId())
                .date(checkIn.getCheckinDate())
                .mood(checkIn.getMood())
                .productivityScore(checkIn.getProductivityScore())
                .energyLevel(checkIn.getEnergyLevel())
                .stressLevel(checkIn.getStressLevel())
                .journal(checkIn.getJournal())
                .sleepHours(checkIn.getSleepHours())
                .build();
    }
}
