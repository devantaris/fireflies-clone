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

## Getting Started

### Backend

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\pip install --only-binary=:all: pydantic
.venv\Scripts\pip install -r requirements.txt
.venv\Scripts\uvicorn app.main:app --reload --port 8000
```

The database is created and seeded automatically on first run.

API docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Project Structure

```
fireflies-clone/
├── frontend/          # Next.js + TypeScript + Tailwind
│   └── src/
│       ├── app/       # Route pages (App Router)
│       ├── components/
│       ├── lib/       # API client + TypeScript types
│       └── hooks/
└── backend/           # FastAPI + SQLite
    └── app/
        ├── main.py
        ├── models.py
        ├── schemas.py
        ├── routers/
        └── services/
```

## API

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
