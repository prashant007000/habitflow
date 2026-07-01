# HabitFlow Backend

Spring Boot 3 + Spring Security + JWT + JPA + MySQL API for HabitFlow.

## Requirements
- Java 17+
- Maven 3.9+
- MySQL 8+

## Setup

1. Create a MySQL database (or let the app create it automatically):
   ```sql
   CREATE DATABASE habitflow_db;
   ```

2. Set environment variables (or edit `src/main/resources/application.yml` directly):
   ```bash
   export DB_USERNAME=root
   export DB_PASSWORD=your_mysql_password
   export JWT_SECRET=$(openssl rand -base64 64)
   export CORS_ALLOWED_ORIGINS=http://localhost:5173

   # Optional: enable real AI features (recommendations + weekly summaries)
   export ANTHROPIC_API_KEY=sk-ant-...
   ```
   Without `ANTHROPIC_API_KEY`, the `/api/ai/*` endpoints automatically fall back
   to deterministic rule-based suggestions, so the app works fully out of the box.

3. Run it:
   ```bash
   mvn spring-boot:run
   ```
   The API starts on `http://localhost:8080`.

## Key endpoints

| Method | Path                          | Description                          |
|--------|-------------------------------|---------------------------------------|
| POST   | /api/auth/signup              | Register a new user                   |
| POST   | /api/auth/login               | Login, returns JWT                    |
| GET    | /api/users/me                 | Current user profile + stats          |
| GET    | /api/habits                   | List active habits                    |
| POST   | /api/habits                   | Create a habit                        |
| PUT    | /api/habits/{id}               | Update a habit                        |
| DELETE | /api/habits/{id}               | Archive (soft-delete) a habit         |
| POST   | /api/habits/{id}/toggle        | Toggle today's (or `?date=`) completion |
| POST   | /api/checkins                 | Create/update today's check-in        |
| GET    | /api/checkins/today            | Get today's check-in                  |
| GET    | /api/checkins                 | Check-in history                      |
| GET    | /api/dashboard                | Full analytics payload                |
| POST   | /api/ai/recommendations       | AI habit suggestions for a goal       |
| GET    | /api/ai/weekly-summary        | AI weekly performance summary         |

All endpoints except `/api/auth/**` require `Authorization: Bearer <token>`.

## Notes
- `ddl-auto: update` auto-creates/updates tables on startup — fine for development,
  swap for a migration tool (Flyway/Liquibase) before production.
- Passwords are hashed with BCrypt.
- CORS is restricted to `CORS_ALLOWED_ORIGINS` (defaults to the Vite dev server).
