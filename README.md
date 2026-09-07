# Fireflies Clone — Scaler SDE Fullstack Assignment

A Fireflies.ai-inspired meeting assistant built with Next.js + FastAPI + SQLite.

## Deployments

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://fireflies-clone-tz2k.vercel.app |
| Backend API (Render) | https://fireflies-clone-api-mm2v.onrender.com/api |
| API Docs (Swagger) | https://fireflies-clone-api-mm2v.onrender.com/docs |

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16.3.4 (App Router, Turbopack), TypeScript, Tailwind CSS v4 |
| Backend | FastAPI, SQLAlchemy, SQLite |
| AI Summary | Extractive algorithm (no external LLM required) |

## Features

- **Landing Page** — pixel-faithful Fireflies.ai marketing page with real asset downloads
- **Meetings Library** — list, search, filter by date/participant, sort by recency; "Hosted by me" / "Shared with me" tabs backed by real `is_hosted` column
- **Meeting Detail** — 3-panel layout (Smart Search + Media Player / Notes & Summary / AskFred & Transcript)
- **Transcript Viewer** — speaker labels, timestamps, click-to-seek, search & highlight with match navigation
- **Media Player** — simulated playback with draggable progress bar, speed control, skip ±10s; transcript line auto-scrolls to active position
- **AI Summary** — auto-generated overview, key topics (tag chips), and chapter outline with click-to-seek timestamps; accessible via the **Overview** tab in meeting detail
- **Action Items** — create, complete, edit, delete per meeting with progress bar; accessible via the **Actions** tab in meeting detail
- **Speaker Statistics** — real talktime percentages and WPM calculated from actual transcript timestamps
- **Meeting CRUD** — create meetings (form + paste/type transcript), edit metadata, delete with confirmation
- **Dark mode** — theme toggle in sidebar

---

## Quickstart — Docker Compose (recommended for evaluators)

> Requires Docker Desktop (or Docker Engine + Compose plugin).

```bash
git clone https://github.com/devantaris/fireflies-clone
cd fireflies-clone
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/api |
| API docs (Swagger) | http://localhost:8000/docs |

The database is created and seeded with **4 sample meetings** (full transcripts, summaries, and action items) automatically on first startup. 2 meetings are "hosted by me" and 2 are "shared with me" so both filter tabs are populated. Data persists in a named Docker volume (`db_data`) across restarts.

```bash
docker compose down        # stop (preserves data)
docker compose down -v     # stop + delete database volume
```

---

## Local Development (without Docker)

### Backend

Requires Python 3.11 or 3.12.

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
├── frontend/                    # Next.js 16.3.4 + TypeScript + Tailwind CSS v4
│   ├── Dockerfile
│   └── src/
│       ├── app/                 # App Router pages
│       │   ├── page.tsx         # Landing page (/)
│       │   ├── home/            # Dashboard (/home)
│       │   ├── meetings/        # Library + detail + new + edit
│       │   └── ...              # tasks, settings, etc. (placeholders)
│       ├── components/
│       │   ├── detail/          # MeetingDetailClient, TranscriptPanel, RightPanel, MediaPlayer
│       │   ├── layout/          # Sidebar, TopBar, LayoutShell, ThemeToggle
│       │   ├── meetings/        # MeetingCard, CreateMeetingModal, MeetingFilters, EditMeetingClient
│       │   └── ui/              # Modal, ConfirmDialog
│       ├── lib/
│       │   ├── api.ts           # Typed fetch wrappers for all endpoints
│       │   ├── types.ts         # TypeScript interfaces matching API schemas
│       │   ├── currentUser.ts   # Centralized demo user profile (no auth)
│       │   └── utils.ts         # formatDuration, parseTranscriptText, getAvatarColor, …
│       └── hooks/
│           └── usePlayer.ts     # Simulated media player state (play/pause/seek/speed)
└── backend/                     # FastAPI + SQLAlchemy + SQLite
    ├── Dockerfile
    └── app/
        ├── main.py              # App factory, CORS, auto-seed on startup
        ├── models.py            # SQLAlchemy ORM models
        ├── schemas.py           # Pydantic request/response schemas
        ├── database.py          # Engine + session factory
        ├── routers/
        │   ├── meetings.py      # CRUD + list/search/filter (incl. hosted= param)
        │   ├── transcripts.py   # GET + PUT transcript lines
        │   ├── summaries.py     # GET + POST /generate
        │   └── action_items.py  # CRUD action items
        └── services/
            ├── ai_service.py    # Extractive summarizer (no LLM)
            └── seed_service.py  # Sample meetings seeder (4 meetings)
```

---

## Database Schema

```
meetings
  id            INTEGER  PRIMARY KEY
  title         VARCHAR(255)  NOT NULL
  date          DATETIME  NOT NULL
  duration      INTEGER  NOT NULL  -- seconds
  is_hosted     BOOLEAN  NOT NULL  DEFAULT true  -- true = hosted by current user
  created_at    DATETIME
  updated_at    DATETIME

participants
  id            INTEGER  PRIMARY KEY
  meeting_id    INTEGER  FK → meetings.id  (cascade delete)
  name          VARCHAR(255)  NOT NULL
  email         VARCHAR(255)

transcript_lines
  id            INTEGER  PRIMARY KEY
  meeting_id    INTEGER  FK → meetings.id  (cascade delete)
  speaker       VARCHAR(255)  NOT NULL
  text          TEXT  NOT NULL
  start_time    FLOAT  NOT NULL  -- seconds
  end_time      FLOAT  NOT NULL
  sequence      INTEGER  NOT NULL  -- ordering

summaries
  id            INTEGER  PRIMARY KEY
  meeting_id    INTEGER  FK → meetings.id  UNIQUE  (cascade delete)
  overview      TEXT
  key_topics    TEXT  -- JSON: [{title, description}]
  chapters      TEXT  -- JSON: [{title, start_time}]
  created_at    DATETIME

action_items
  id            INTEGER  PRIMARY KEY
  meeting_id    INTEGER  FK → meetings.id  (cascade delete)
  text          TEXT  NOT NULL
  assignee      VARCHAR(255)
  due_date      VARCHAR(20)  -- ISO date string
  completed     BOOLEAN  DEFAULT false
  created_at    DATETIME
```

**Relationships:** One meeting → many participants, many transcript lines, one summary, many action items. All child records cascade-delete when a meeting is deleted.

---

## API Reference

Base URL: `http://localhost:8000/api`

Full interactive docs at: `http://localhost:8000/docs` (Swagger UI)

| Method | Path | Description |
|--------|------|-------------|
| GET | /meetings | List meetings — supports `search`, `date_from`, `date_to`, `participant`, `sort`, `hosted` (bool) query params |
| POST | /meetings | Create meeting (with optional transcript lines) |
| GET | /meetings/{id} | Get full meeting detail (participants, transcript, summary, action items) |
| PUT | /meetings/{id} | Update meeting metadata (title, date, duration, participants) |
| DELETE | /meetings/{id} | Delete meeting and all related records |
| GET | /meetings/{id}/transcript | Get transcript lines |
| PUT | /meetings/{id}/transcript | Replace transcript lines |
| GET | /meetings/{id}/summary | Get AI summary |
| POST | /meetings/{id}/summary/generate | Regenerate summary from current transcript |
| GET | /meetings/{id}/action-items | List action items |
| POST | /meetings/{id}/action-items | Create action item |
| PATCH | /action-items/{id} | Update action item (text, assignee, due_date, completed) |
| DELETE | /action-items/{id} | Delete action item |
| POST | /api/seed | Re-seed database (idempotent — skips if data exists) |
| GET | /health | Health check |

---

## Transcript Format (paste to create)

When pasting a transcript in the "New Meeting" modal, the parser supports:

```
[0:00] Sarah: Good morning everyone.
[0:06] Marcus: Thanks Sarah, ready to get started.
```

Or speaker-only format:
```
Sarah: Good morning everyone.
Marcus: Thanks Sarah, ready to get started.
```

---

## Assumptions & Mocked Sections

- **Authentication** — single default user (configurable via `src/lib/currentUser.ts`), no real login flow
- **Audio/Video** — media player is simulated (time advances via `setInterval`); no actual audio file is loaded
- **Live bot / real-time transcription** — out of scope per assignment; nav links exist as placeholders
- **Integrations** — placeholder page only
- **AskFred AI chat** — UI shell only (suggestion chips populate the input, but sends nothing to a backend LLM)
