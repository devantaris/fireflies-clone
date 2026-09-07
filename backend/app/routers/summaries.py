from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Meeting, Summary
from app.schemas import SummaryOut
from app.services.ai_service import generate_summary

router = APIRouter(tags=["summary"])


@router.get("/meetings/{meeting_id}/summary", response_model=SummaryOut)
def get_summary(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.get(Meeting, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    if not meeting.summary:
        raise HTTPException(status_code=404, detail="No summary available. Generate one first.")
    return SummaryOut.model_validate(meeting.summary)


@router.post("/meetings/{meeting_id}/summary/generate", response_model=SummaryOut)
def generate_meeting_summary(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.get(Meeting, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    transcript_dicts = [
        {
            "speaker": l.speaker,
            "text": l.text,
            "start_time": l.start_time,
            "end_time": l.end_time,
            "sequence": l.sequence,
        }
        for l in meeting.transcript_lines
    ]

    summary_data = generate_summary(transcript_dicts)

    if meeting.summary:
        meeting.summary.overview = summary_data["overview"]
        meeting.summary.key_topics = summary_data["key_topics"]
        meeting.summary.chapters = summary_data["chapters"]
    else:
        db.add(Summary(
            meeting_id=meeting_id,
            overview=summary_data["overview"],
            key_topics=summary_data["key_topics"],
            chapters=summary_data["chapters"],
        ))

    db.commit()
    db.refresh(meeting)
    return SummaryOut.model_validate(meeting.summary)
