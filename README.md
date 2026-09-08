# Fireflies Clone — Scaler SDE Fullstack Assignment

A functional clone of the [Fireflies.ai](https://fireflies.ai) meeting-assistant web application, replicating its design, user experience, and core post-meeting workflows.

## Live Demo

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://fireflies-clone-xi.vercel.app |
| Backend API (Render) | https://fireflies-clone-api-mmzv.onrender.com/api |
| API Docs (Swagger) | https://fireflies-clone-api-mmzv.onrender.com/docs |

> **Note:** The Render free tier spins down after inactivity. The first request may take 30–60 seconds to wake the server.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16.3 (App Router), TypeScript, Tailwind CSS v4 |
| Backend | Python, FastAPI, SQLAlchemy ORM |
| Database | SQLite |
| AI Summary | Extractive algorithm (no external LLM required) |
| Deployment | Vercel (frontend) + Render (backend) |

## Core Features

### 1. Meetings Library / Dashboard
- List of past meetings with title, date, duration, participants
- Search by title, filter by date range, participant name, hosted/shared
- Sort by recency (newest/oldest)
- Responsive grid layout with meeting cards

### 2. Meeting / Transcript Detail View
- Interactive transcript with speaker labels and timestamps
- Simulated media player with seek bar, speed control, skip ±10s
- Clicking a transcript line seeks the player to that timestamp
- Player position highlights and auto-scrolls the active transcript line
- Search within transcript with highlighted matches and prev/next navigation
- Speaker statistics panel with real talktime percentages and WPM

### 3. AI Summary & Notes
- AI-generated meeting summary (extractive algorithm from transcript text)
- Key topics extracted as tag chips
- Chapter outline with click-to-seek timestamps
- Overview section with meeting highlights

### 4. Meeting Management (CRUD)
- Create a meeting (form with title, participants, paste/type transcript)
- Edit meeting metadata (title, date, duration, participants)
- Delete a meeting with confirmation dialog
- Action items: create, edit, complete/toggle, delete per meeting
- Export meeting to Markdown (.md) or plain text (.txt) — includes summary, action items, and full transcript

### 5. Fireflies Experience
- Pixel-faithful landing page with real Fireflies assets and sections
- Sidebar navigation matching original layout
- Top bar with global search (Ctrl+K spotlight-style modal)
- Dark/light/system theme toggle
- Toast notifications for all user actions
- Loading skeletons on all data-fetching pages
- Error states with retry options
- Dynamic user identity with localStorage-based name entry

### Additional Pages (UI-complete)
- **Home** — dashboard with recent meetings, quick-action cards, AskFred sidebar
- **AskFred** — AI assistant chat interface with suggestion chips
- **Tasks** — action items grouped by meeting, create/toggle/filter
- **AI Skills** — discover, enable/disable, active skills list
- **Analytics** — dashboard with stats, charts, duration distribution
- **Voice Agents** — agent discovery and management
- **Integrations** — third-party integrations catalog
- **Settings** — user settings with recording, privacy, AI sections
- **Upgrade** — pricing plans with Free, Pro, Business, Enterprise tiers

---

## Quickstart — Docker Compose (recommended)

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

The database is auto-seeded with **11 sample meetings** (full transcripts, summaries, and action items) on first startup.

```bash
docker compose down        # stop (preserves data)
docker compose down -v     # stop + delete database volume
```

---

## Local Development (without Docker)

### Backend

Requires Python 3.11+.

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

The database (`fireflies.db`) is created and auto-seeded on first run.

### Frontend

Requires Node.js 18+.

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. Create `frontend/.env.local` if needed:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api` | Backend API URL (baked in at build time) |
| `DATABASE_URL` | `sqlite:///./fireflies.db` | SQLAlchemy database URL |
| `CORS_ORIGINS` | `http://localhost:3000,http://127.0.0.1:3000` | Comma-separated CORS allowed origins |

---

## Project Structure

```
fireflies-clone/
├── docker-compose.yml
├── frontend/                    # Next.js 16 + TypeScript + Tailwind CSS v4
│   ├── Dockerfile
│   └── src/
│       ├── app/                 # App Router pages
│       │   ├── page.tsx         # Landing page (/)
│       │   ├── home/            # Dashboard (/home)
│       │   ├── meetings/        # Library + detail + new + edit
│       │   ├── tasks/           # Action items management
│       │   ├── ai-skills/       # AI skills discovery & management
│       │   ├── analytics/       # Analytics dashboard
│       │   ├── askfred/         # AskFred AI assistant
│       │   ├── voice-agents/    # Voice agent discovery
│       │   ├── integrations/    # Third-party integrations
│       │   ├── settings/        # User settings
│       │   └── upgrade/         # Pricing plans
│       ├── components/
│       │   ├── detail/          # MeetingDetailClient, TranscriptPanel, RightPanel, MediaPlayer
│       │   ├── layout/          # Sidebar, TopBar, LayoutShell, ThemeToggle, UserProvider
│       │   ├── meetings/        # MeetingCard, CreateMeetingModal, MeetingFilters, EditMeetingClient
│       │   └── ui/              # Modal, ConfirmDialog
│       ├── lib/
│       │   ├── api.ts           # Typed Axios wrappers for all endpoints
│       │   ├── types.ts         # TypeScript interfaces matching API schemas
│       │   ├── currentUser.ts   # User identity (React Context + localStorage)
│       │   └── utils.ts         # formatDuration, formatMeetingDate, getAvatarColor, etc.
│       └── hooks/
│           └── usePlayer.ts     # Simulated media player state (play/pause/seek/speed)
└── backend/                     # FastAPI + SQLAlchemy + SQLite
    ├── Dockerfile
    └── app/
        ├── main.py              # App factory, CORS, auto-seed on startup
        ├── models.py            # SQLAlchemy ORM models (5 tables)
        ├── schemas.py           # Pydantic request/response schemas
        ├── database.py          # Engine + session factory
        ├── routers/
        │   ├── meetings.py      # CRUD + list/search/filter/sort
        │   ├── transcripts.py   # GET + PUT transcript lines
        │   ├── summaries.py     # GET + POST /generate
        │   └── action_items.py  # Full CRUD for action items
        └── services/
            ├── ai_service.py    # Extractive summarizer (overview, topics, chapters)
            └── seed_service.py  # Sample meetings seeder (11 meetings)
```

---

## Database Schema

```
meetings
  id            INTEGER  PRIMARY KEY
  title         VARCHAR(255)  NOT NULL
  date          DATETIME  NOT NULL
  duration      INTEGER  NOT NULL  -- seconds
  is_hosted     BOOLEAN  NOT NULL  DEFAULT true
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
  sequence      INTEGER  NOT NULL

summaries
  id            INTEGER  PRIMARY KEY
  meeting_id    INTEGER  FK → meetings.id  UNIQUE  (cascade delete)
  overview      TEXT
  key_topics    TEXT  -- JSON array
  chapters      TEXT  -- JSON array
  created_at    DATETIME

action_items
  id            INTEGER  PRIMARY KEY
  meeting_id    INTEGER  FK → meetings.id  (cascade delete)
  text          TEXT  NOT NULL
  assignee      VARCHAR(255)
  due_date      VARCHAR(20)
  completed     BOOLEAN  DEFAULT false
  created_at    DATETIME
```

**Relationships:** One meeting → many participants, many transcript lines, one summary, many action items. All child records cascade-delete when a meeting is deleted.

---

## API Reference

Base URL: `http://localhost:8000/api` (or use `/docs` for interactive Swagger UI)

| Method | Path | Description |
|--------|------|-------------|
| GET | /meetings | List meetings (search, date_from, date_to, participant, sort, hosted) |
| POST | /meetings | Create meeting (with optional transcript lines) |
| GET | /meetings/{id} | Get full meeting detail |
| PUT | /meetings/{id} | Update meeting metadata |
| DELETE | /meetings/{id} | Delete meeting and all related records |
| GET | /meetings/{id}/transcript | Get transcript lines |
| PUT | /meetings/{id}/transcript | Replace transcript lines |
| GET | /meetings/{id}/summary | Get AI summary |
| POST | /meetings/{id}/summary/generate | Generate/regenerate summary from transcript |
| GET | /meetings/{id}/action-items | List action items |
| POST | /meetings/{id}/action-items | Create action item |
| PATCH | /action-items/{id} | Update action item (text, assignee, completed) |
| DELETE | /action-items/{id} | Delete action item |
| POST | /api/seed | Re-seed database (idempotent) |
| GET | /health | Health check |

---

## Transcript Format (paste to create)

When creating a meeting, paste a transcript in either format:

```
[0:00] Sarah: Good morning everyone.
[0:06] Marcus: Thanks Sarah, ready to get started.
```

Or speaker-only format (timestamps auto-distributed):
```
Sarah: Good morning everyone.
Marcus: Thanks Sarah, ready to get started.
```

---

## Assumptions & Mocked Sections

- **Authentication** — simulated via localStorage name entry (no real login/OAuth)
- **Audio/Video** — media player is simulated (time advances via setInterval); no actual audio file loaded
- **Live bot / real-time transcription** — out of scope per assignment; page exists as placeholder
- **Integrations** — discovery page with mock data; no real third-party connections
- **AskFred AI chat** — UI implemented with suggestion chips; no backend LLM processing
