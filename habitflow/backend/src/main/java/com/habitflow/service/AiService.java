package com.habitflow.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.habitflow.dto.AiRecommendationResponse;
import com.habitflow.dto.AiWeeklySummaryResponse;
import com.habitflow.dto.CheckInResponse;
import com.habitflow.dto.HabitResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * AiService talks to the Anthropic Messages API to generate habit recommendations
 * and weekly performance summaries.
 *
 * Set ANTHROPIC_API_KEY as an environment variable to enable real AI responses.
 * If no key is configured, this service falls back to deterministic rule-based
 * suggestions so the rest of the app keeps working out of the box.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.ai.anthropic.api-key}")
    private String anthropicApiKey;

    @Value("${app.ai.anthropic.model}")
    private String anthropicModel;

    @Value("${app.ai.anthropic.base-url}")
    private String anthropicBaseUrl;

    public AiRecommendationResponse getHabitRecommendations(String goal) {
        if (anthropicApiKey == null || anthropicApiKey.isBlank()) {
            return fallbackRecommendations(goal);
        }

        try {
            String prompt = """
                    You are a habit-formation coach inside an app called HabitFlow.
                    The user's goal is: "%s"

                    Suggest exactly 5 daily habits that would help them achieve this goal.
                    Respond ONLY with raw JSON (no markdown, no backticks, no preamble) in this exact shape:
                    {
                      "advice": "one short paragraph of motivating, practical advice (max 50 words)",
                      "habits": [
                        {"name": "...", "description": "...", "category": "CODING|FITNESS|READING|STUDY|HEALTH|CUSTOM", "icon": "a single emoji"}
                      ]
                    }
                    """.formatted(goal);

            JsonNode response = callAnthropic(prompt, 700);
            String text = extractText(response);
            JsonNode parsed = objectMapper.readTree(stripCodeFences(text));

            List<AiRecommendationResponse.SuggestedHabit> habits = new ArrayList<>();
            for (JsonNode h : parsed.path("habits")) {
                habits.add(AiRecommendationResponse.SuggestedHabit.builder()
                        .name(h.path("name").asText())
                        .description(h.path("description").asText())
                        .category(h.path("category").asText("CUSTOM"))
                        .icon(h.path("icon").asText("✅"))
                        .build());
            }

            return AiRecommendationResponse.builder()
                    .goal(goal)
                    .advice(parsed.path("advice").asText())
                    .suggestedHabits(habits)
                    .build();

        } catch (Exception e) {
            log.warn("AI recommendation call failed, falling back to rule-based suggestions: {}", e.getMessage());
            return fallbackRecommendations(goal);
        }
    }

    public AiWeeklySummaryResponse getWeeklySummary(List<HabitResponse> habits, List<CheckInResponse> recentCheckIns) {
        if (anthropicApiKey == null || anthropicApiKey.isBlank()) {
            return fallbackWeeklySummary(habits, recentCheckIns);
        }

        try {
            String habitsSummary = habits.stream()
                    .map(h -> "- %s: %.0f%% completion, streak %d".formatted(h.getName(), h.getCompletionPercentage(), h.getCurrentStreak()))
                    .reduce("", (a, b) -> a + b + "\n");

            String moodSummary = recentCheckIns.stream().limit(7)
                    .map(c -> "- %s: mood=%s, productivity=%s".formatted(c.getDate(), c.getMood(), c.getProductivityScore()))
                    .reduce("", (a, b) -> a + b + "\n");

            String prompt = """
                    You are an encouraging but honest productivity coach reviewing a user's week
                    inside the HabitFlow app.

                    Habit performance:
                    %s

                    Recent daily check-ins (mood/productivity):
                    %s

                    Respond ONLY with raw JSON (no markdown, no backticks) in this exact shape:
                    {
                      "summary": "2-3 sentence overview of the week",
                      "wins": ["short bullet", "short bullet"],
                      "improvementAreas": ["short bullet", "short bullet"],
                      "nextWeekSuggestions": ["short actionable bullet", "short actionable bullet"]
                    }
                    """.formatted(habitsSummary, moodSummary);

            JsonNode response = callAnthropic(prompt, 600);
            String text = extractText(response);
            JsonNode parsed = objectMapper.readTree(stripCodeFences(text));

            return AiWeeklySummaryResponse.builder()
                    .summary(parsed.path("summary").asText())
                    .wins(toStringList(parsed.path("wins")))
                    .improvementAreas(toStringList(parsed.path("improvementAreas")))
                    .nextWeekSuggestions(toStringList(parsed.path("nextWeekSuggestions")))
                    .build();

        } catch (Exception e) {
            log.warn("AI weekly summary call failed, falling back to rule-based summary: {}", e.getMessage());
            return fallbackWeeklySummary(habits, recentCheckIns);
        }
    }

    private JsonNode callAnthropic(String prompt, int maxTokens) {
        Map<String, Object> body = Map.of(
                "model", anthropicModel,
                "max_tokens", maxTokens,
                "messages", List.of(Map.of("role", "user", "content", prompt))
        );

        return webClient.post()
                .uri(anthropicBaseUrl)
                .header("x-api-key", anthropicApiKey)
                .header("anthropic-version", "2023-06-01")
                .header("content-type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
    }

    private String extractText(JsonNode response) {
        JsonNode content = response.path("content");
        StringBuilder sb = new StringBuilder();
        for (JsonNode block : content) {
            if ("text".equals(block.path("type").asText())) {
                sb.append(block.path("text").asText());
            }
        }
        return sb.toString();
    }

    private String stripCodeFences(String text) {
        return text.replaceAll("```json", "").replaceAll("```", "").trim();
    }

    private List<String> toStringList(JsonNode node) {
        List<String> result = new ArrayList<>();
        node.forEach(n -> result.add(n.asText()));
        return result;
    }

    // ---- Fallback rule-based logic (used when no API key is configured) ----

    private AiRecommendationResponse fallbackRecommendations(String goal) {
        List<AiRecommendationResponse.SuggestedHabit> habits = new ArrayList<>();
        String g = goal.toLowerCase();

        if (g.contains("cds") || g.contains("ssb") || g.contains("defence") || g.contains("defense")) {
            habits.add(habit("Morning Run", "Build stamina with a 5km run", "FITNESS", "🏃"));
            habits.add(habit("Current Affairs Reading", "Read newspaper for GK & awareness", "READING", "📰"));
            habits.add(habit("Mock Test Practice", "Solve CDS-pattern questions", "STUDY", "📝"));
            habits.add(habit("Push-up & Pull-up Sets", "Strength training for SSB physical", "FITNESS", "💪"));
            habits.add(habit("Group Discussion Practice", "Practice articulation for SSB", "STUDY", "🗣️"));
        } else if (g.contains("dsa") || g.contains("software") || g.contains("job") || g.contains("coding")) {
            habits.add(habit("Solve DSA Problems", "2 problems a day on patterns", "CODING", "💻"));
            habits.add(habit("System Design Reading", "Study one concept daily", "STUDY", "📐"));
            habits.add(habit("Build Side Project", "Ship a small feature daily", "CODING", "🛠️"));
            habits.add(habit("Mock Interview", "Practice explaining solutions out loud", "STUDY", "🎤"));
            habits.add(habit("Resume & LinkedIn Update", "Refine weekly for visibility", "CUSTOM", "📄"));
        } else if (g.contains("weight") || g.contains("gain") || g.contains("muscle")) {
            habits.add(habit("Strength Training", "Progressive overload 4x/week", "FITNESS", "🏋️"));
            habits.add(habit("Calorie-Dense Meals", "Hit your daily surplus target", "HEALTH", "🍽️"));
            habits.add(habit("Protein Intake Tracking", "Log protein to hit your target", "HEALTH", "🥩"));
            habits.add(habit("8 Hours Sleep", "Recovery drives muscle growth", "HEALTH", "😴"));
            habits.add(habit("Progress Photos", "Track visual change weekly", "CUSTOM", "📸"));
        } else {
            habits.add(habit("Deep Work Block", "90 minutes of focused work", "STUDY", "🧠"));
            habits.add(habit("Daily Planning", "Plan top 3 priorities each morning", "CUSTOM", "🗓️"));
            habits.add(habit("No-Phone Mornings", "First 30 min screen-free", "HEALTH", "📵"));
            habits.add(habit("Evening Review", "Reflect on wins & blockers", "CUSTOM", "🪞"));
            habits.add(habit("Exercise", "30 minutes of movement daily", "FITNESS", "🏃"));
        }

        return AiRecommendationResponse.builder()
                .goal(goal)
                .advice("Here are habits tailored to \"" + goal + "\". Start small, stay consistent — streaks compound faster than intensity. (Connect an ANTHROPIC_API_KEY for fully personalized AI coaching.)")
                .suggestedHabits(habits)
                .build();
    }

    private AiRecommendationResponse.SuggestedHabit habit(String name, String desc, String category, String icon) {
        return AiRecommendationResponse.SuggestedHabit.builder()
                .name(name).description(desc).category(category).icon(icon).build();
    }

    private AiWeeklySummaryResponse fallbackWeeklySummary(List<HabitResponse> habits, List<CheckInResponse> checkIns) {
        double avgCompletion = habits.stream().mapToDouble(HabitResponse::getCompletionPercentage).average().orElse(0);
        String summary = habits.isEmpty()
                ? "Add a few habits to start seeing weekly insights here."
                : "Your average completion rate this period was %.0f%%. Keep showing up — consistency beats intensity. (Connect an ANTHROPIC_API_KEY for AI-generated insights.)".formatted(avgCompletion);

        List<String> wins = new ArrayList<>();
        habits.stream().filter(h -> h.getCompletionPercentage() >= 70)
                .forEach(h -> wins.add(h.getName() + " is going strong at " + (int) h.getCompletionPercentage() + "%"));
        if (wins.isEmpty()) wins.add("You showed up and tracked your days — that's the foundation.");

        List<String> improvements = new ArrayList<>();
        habits.stream().filter(h -> h.getCompletionPercentage() < 40)
                .forEach(h -> improvements.add(h.getName() + " needs attention (" + (int) h.getCompletionPercentage() + "%)"));
        if (improvements.isEmpty()) improvements.add("Nothing major — keep refining your hardest habit.");

        List<String> suggestions = List.of(
                "Pick your weakest habit and reduce its difficulty for next week",
                "Stack a new habit right after an existing strong one",
                "Set a fixed time of day for your lowest-completion habit"
        );

        return AiWeeklySummaryResponse.builder()
                .summary(summary)
                .wins(wins)
                .improvementAreas(improvements)
                .nextWeekSuggestions(suggestions)
                .build();
    }
}
