# HabitFlow — AI-Powered Habit & Mood Tracker

A full-stack MVP slice of HabitFlow: JWT auth, habit tracking with streaks,
daily mood/productivity check-ins, an analytics dashboard, achievements, and
AI-powered habit recommendations + weekly summaries (real Anthropic API
integration with a rule-based fallback).

```
habitflow/
  backend/    Spring Boot 3 + Spring Security + JWT + JPA + MySQL
  frontend/   React (Vite) + Tailwind CSS, dark glassmorphism UI
```

## Quick start

### 1. Backend
```bash
cd backend
# create the DB (or let auto-create handle it)
mysql -u root -p -e "CREATE DATABASE habitflow_db;"

export DB_USERNAME=root
export DB_PASSWORD=your_mysql_password
export JWT_SECRET=$(openssl rand -base64 64)
export CORS_ALLOWED_ORIGINS=http://localhost:5173
# optional — enables real AI responses instead of the rule-based fallback
export ANTHROPIC_API_KEY=sk-ant-...

mvn spring-boot:run
```
API runs at `http://localhost:8080`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:5173`.

Sign up, set a goal, create a few habits (or use "AI suggestions"), check in
daily, and watch the dashboard fill in.

## What's in this MVP slice

**Backend**
- Signup/login with BCrypt + JWT (`/api/auth/**`)
- Habit CRUD + daily toggle, with automatic current/longest streak calculation
- Daily check-in (mood enum, productivity/energy/stress 1–10, journal)
- `/api/dashboard` — single endpoint returning: today's completions, active
  streaks, weekly/monthly completion rate, overall consistency, a 30-day
  heatmap, mood trend, productivity/energy/stress trend, best/worst habits,
  mood-vs-productivity averages, and achievement unlock state
- `/api/ai/recommendations` and `/api/ai/weekly-summary` — call the Anthropic
  Messages API when `ANTHROPIC_API_KEY` is set, otherwise fall back to
  deterministic rule-based logic so the app works without any key

**Frontend**
- Premium dark theme: glassmorphism cards, violet/amber accent system,
  Outfit + Inter + JetBrains Mono type system, animated streak flame,
  GitHub-style (but on-brand) contribution heatmap
- Dashboard, Habits (with AI suggestions modal), Daily Check-in, Profile pages
- Recharts-powered mood and productivity/energy/stress trend lines
- Fully responsive, mobile nav included

## Deliberately out of scope for this slice
These were in the original brief but are natural "next PR" items rather than
part of the focused MVP:
- PDF export, leaderboard, notification reminders, settings/light-mode toggle
- Yearly (vs. 30-day) heatmap, weekly/monthly tabbed views
- Refresh tokens (current JWT is a single 24h access token)
- Flyway/Liquibase migrations (currently `ddl-auto: update` for dev speed)

See `backend/README.md` and `frontend/README.md` for endpoint references and
folder structure.
