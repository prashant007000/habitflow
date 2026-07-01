# HabitFlow Frontend

React (Vite) + Tailwind CSS frontend for HabitFlow — a premium, dark-themed
habit & mood tracker.

## Setup

```bash
npm install
cp .env.example .env   # point VITE_API_URL at your backend if not localhost:8080
npm run dev
```

Runs on `http://localhost:5173` by default and expects the backend at
`http://localhost:8080/api` (configurable via `VITE_API_URL`).

## Structure

```
src/
  api/            axios client + per-resource API calls
  context/        AuthContext (JWT session state)
  components/
    layout/       Sidebar, Topbar, DashboardLayout
    ui/           GlassCard, Badge, CircularProgress
    habits/       HabitCard, HabitFormModal
    checkin/      MoodSelector, MetricSlider
    dashboard/    StatCard, ActivityHeatmap, MoodTrendChart,
                   ProductivityTrendChart, BestWorstHabits, AchievementsGrid
  pages/          Login, Signup, Dashboard, Habits, CheckIn, Profile
  constants.js    Categories, moods, AI goal presets
```

## What's implemented (MVP slice)
- JWT auth (signup/login) with protected routes
- Habit CRUD + daily toggle with streak tracking
- Daily check-in: mood, productivity/energy/stress sliders, journal
- Dashboard: stat cards, 30-day activity heatmap, mood trend, productivity/energy/stress
  trend, best/worst habits, achievements grid, AI weekly summary
- AI habit recommendations by goal (Crack CDS, Learn DSA, Get a Software Job,
  Weight Gain, Improve Productivity) — one-click add to your habit list

## Not yet built (natural next steps)
- PDF export of progress reports
- Leaderboard / social features
- Settings page (theme toggle is dark-only for now; light mode would need a
  `light` Tailwind variant pass)
- Push/browser notification reminders
- Yearly heatmap view (currently last 30 days)
