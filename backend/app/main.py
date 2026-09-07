from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, SessionLocal
from app.models import Base
from app.routers import meetings, transcripts, summaries, action_items

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Fireflies Clone API",
    version="1.0.0",
    description="Backend API for Fireflies.ai meeting assistant clone",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
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
def seed():
    """Seed the database with sample meetings (idempotent)."""
    from app.services.seed_service import seed_database
    db = SessionLocal()
    try:
        count = seed_database(db)
        return {"seeded": count, "message": f"Created {count} meetings" if count else "Data already exists"}
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
