# Fireflies Clone — Scaler SDE Fullstack Assignment

A Fireflies.ai-inspired meeting assistant built with Next.js + FastAPI + SQLite.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS v4 |
| Backend | FastAPI, SQLAlchemy, SQLite |
| AI Summary | Extractive algorithm (no external LLM required) |

## Features

- **Meetings Library** — list, search, filter, sort by recency
- **Transcript Viewer** — speaker labels, timestamps, search & highlight
- **Media Player** — simulated playback with click-to-seek transcript sync
- **AI Summary** — auto-generated overview, key topics, chapter outline
- **Action Items** — create, complete, edit, delete per meeting
- **Full CRUD** — create meetings (form or paste transcript), edit, delete

---

## Quickstart — Docker Compose (recommended for evaluators)

> Requires Docker Desktop (or Docker Engine + Compose plugin).

```bash
git clone <repo-url>
cd fireflies-clone
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/api |
| API docs (Swagger) | http://localhost:8000/docs |

The database is created and seeded with sample data automatically on first startup.
Data persists in a named Docker volume (`db_data`) across restarts.

To stop and remove containers (data volume is preserved):

```bash
docker compose down
```

To also remove the database volume:

```bash
docker compose down -v
```

---

## Local Development (without Docker)

### Backend

Requires Python 3.11 or 3.12 (3.14 is not recommended — pydantic-core wheels may be missing).

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\pip install -r requirements.txt
.venv\Scripts\uvicorn app.main:app --reload --port 8000

# macOS / Linux
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --port 8000
```

The database (`fireflies.db`) is created in `backend/` and seeded automatically on first run.

### Frontend

Requires Node.js 18+.

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000.

The frontend reads `frontend/.env.local` for configuration:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Environment Variables

Copy `.env.example` and adjust as needed. See comments in that file for details.

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api` | Backend API URL (baked in at build time — must be browser-reachable) |
| `DATABASE_URL` | `sqlite:///./fireflies.db` | SQLAlchemy database URL |
| `CORS_ORIGINS` | `http://localhost:3000,http://127.0.0.1:3000` | Comma-separated CORS allowed origins |

In Docker Compose, `NEXT_PUBLIC_API_URL` can be overridden at build time:

```bash
NEXT_PUBLIC_API_URL=http://myserver:8000/api docker compose up --build
```

---

## Project Structure

```
fireflies-clone/
├── docker-compose.yml
├── .env.example
├── frontend/              # Next.js + TypeScript + Tailwind
│   ├── Dockerfile
│   └── src/
│       ├── app/           # Route pages (App Router)
│       ├── components/
│       ├── lib/           # API client + TypeScript types
│       └── hooks/
└── backend/               # FastAPI + SQLite
    ├── Dockerfile
    └── app/
        ├── main.py
        ├── models.py
        ├── schemas.py
        ├── database.py
        ├── routers/
        └── services/
```

---

## API Reference

Base URL: `http://localhost:8000/api`

| Method | Path | Description |
|--------|------|-------------|
| GET | /meetings | List meetings (search, filter, sort) |
| POST | /meetings | Create meeting |
| GET | /meetings/{id} | Get full meeting detail |
| PUT | /meetings/{id} | Update meeting |
| DELETE | /meetings/{id} | Delete meeting |
| GET | /meetings/{id}/transcript | Get transcript lines |
| PUT | /meetings/{id}/transcript | Replace transcript |
| GET | /meetings/{id}/summary | Get AI summary |
| POST | /meetings/{id}/summary/generate | Regenerate summary |
| GET | /meetings/{id}/action-items | List action items |
| POST | /meetings/{id}/action-items | Create action item |
| PATCH | /action-items/{id} | Update / toggle action item |
| DELETE | /action-items/{id} | Delete action item |
