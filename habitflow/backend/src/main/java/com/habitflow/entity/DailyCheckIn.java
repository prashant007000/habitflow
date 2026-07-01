package com.habitflow.entity;

import com.habitflow.entity.enums.MoodType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_checkins", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "checkin_date"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyCheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "checkin_date", nullable = false)
    private LocalDate checkinDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MoodType mood;

    @Min(1) @Max(10)
    @Column(name = "productivity_score")
    private Integer productivityScore;

    @Min(1) @Max(10)
    @Column(name = "energy_level")
    private Integer energyLevel;

    @Min(1) @Max(10)
    @Column(name = "stress_level")
    private Integer stressLevel;

    @Column(name = "sleep_hours")
    private Double sleepHours;

    @Column(columnDefinition = "TEXT")
    private String journal;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
