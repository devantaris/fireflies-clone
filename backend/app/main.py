import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, SessionLocal
from app.models import Base
from app.routers import meetings, transcripts, summaries, action_items

# Create all tables on startup
Base.metadata.create_all(bind=engine)

# Ensure is_hosted column exists on existing SQLite databases
from sqlalchemy import text
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE meetings ADD COLUMN is_hosted BOOLEAN NOT NULL DEFAULT 1"))
        conn.commit()
    except Exception:
        pass  # Column already exists

# CORS origins — comma-separated list via env var, falls back to localhost defaults
_cors_env = os.environ.get("CORS_ORIGINS", "")
cors_origins = (
    [o.strip() for o in _cors_env.split(",") if o.strip()]
    if _cors_env
    else ["http://localhost:3000", "http://127.0.0.1:3000"]
)

app = FastAPI(
    title="Fireflies Clone API",
    version="1.0.0",
    description="Backend API for Fireflies.ai meeting assistant clone",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(meetings.router, prefix="/api")
app.include_router(transcripts.router, prefix="/api")
app.include_router(summaries.router, prefix="/api")
app.include_router(action_items.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok", "service": "fireflies-clone-api"}


@app.post("/api/seed")
def seed(force: bool = False):
    """Seed the database with sample meetings (idempotent unless force=True)."""
    from app.services.seed_service import seed_database
    db = SessionLocal()
    try:
        count = seed_database(db, force=force)
        return {"seeded": count, "message": f"Created {count} meetings" if count else "Data already exists"}
    finally:
        db.close()


@app.post("/api/ask")
def ask_fred(payload: dict):
    """Answer a question about meetings using extractive keyword search."""
    from app.models import Meeting, TranscriptLine, Summary, ActionItem, Participant
    question = (payload.get("question") or "").strip()
    if not question:
        return {"answer": "Please ask a question about your meetings.", "sources": []}

    db = SessionLocal()
    try:
        # Tokenise question into keywords
        stop = {"a","an","the","is","are","was","were","do","does","did","can","could",
                "will","would","shall","should","may","might","must","be","been","being",
                "have","has","had","having","i","me","my","we","our","you","your","he",
                "she","it","they","them","their","in","on","at","to","for","of","with",
                "from","by","about","what","which","who","whom","how","when","where","why",
                "and","or","but","not","all","any","some","this","that","these","those","up"}
        keywords = [w for w in question.lower().split() if w not in stop and len(w) > 1]
        if not keywords:
            keywords = question.lower().split()[:3]

        # Search transcript lines for keyword matches
        all_lines = db.query(TranscriptLine).all()
        scored = []
        for line in all_lines:
            text_lower = line.text.lower()
            score = sum(1 for kw in keywords if kw in text_lower)
            if score > 0:
                scored.append((score, line))
        scored.sort(key=lambda x: -x[0])
        top_lines = scored[:6]

        # Search action items
        all_actions = db.query(ActionItem).all()
        action_matches = []
        for ai in all_actions:
            text_lower = ai.text.lower()
            score = sum(1 for kw in keywords if kw in text_lower)
            if score > 0:
                action_matches.append((score, ai))
        action_matches.sort(key=lambda x: -x[0])
        top_actions = action_matches[:3]

        # Search summaries
        all_summaries = db.query(Summary).all()
        summary_matches = []
        for s in all_summaries:
            text_lower = (s.overview or "").lower()
            score = sum(1 for kw in keywords if kw in text_lower)
            if score > 0:
                summary_matches.append((score, s))
        summary_matches.sort(key=lambda x: -x[0])

        # Build answer
        sources = []
        parts = []

        if top_lines:
            parts.append("Here's what I found in your meeting transcripts:\n")
            for _, line in top_lines:
                meeting = db.query(Meeting).filter(Meeting.id == line.meeting_id).first()
                title = meeting.title if meeting else "Unknown Meeting"
                mins = int(line.start_time // 60)
                secs = int(line.start_time % 60)
                parts.append(f'**[{title} — {mins}:{secs:02d}]** {line.speaker}: "{line.text}"')
                if title not in sources:
                    sources.append(title)

        if top_actions:
            parts.append("\n**Related action items:**")
            for _, ai in top_actions:
                meeting = db.query(Meeting).filter(Meeting.id == ai.meeting_id).first()
                title = meeting.title if meeting else "Unknown"
                status = "Done" if ai.completed else "Open"
                assignee = f" ({ai.assignee})" if ai.assignee else ""
                parts.append(f"- [{status}] {ai.text}{assignee} — from *{title}*")
                if title not in sources:
                    sources.append(title)

        if summary_matches and not top_lines:
            _, s = summary_matches[0]
            meeting = db.query(Meeting).filter(Meeting.id == s.meeting_id).first()
            title = meeting.title if meeting else "Unknown"
            parts.append(f"From the summary of **{title}**:\n{s.overview}")
            if title not in sources:
                sources.append(title)

        if not parts:
            answer = "I couldn't find anything matching your question across your meetings. Try rephrasing or asking about a specific topic discussed in a meeting."
        else:
            answer = "\n\n".join(parts)

        return {"answer": answer, "sources": sources}
    finally:
        db.close()


# Auto-seed on startup if DB is empty
@app.on_event("startup")
def auto_seed():
    from app.services.seed_service import seed_database
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
