from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Meeting, TranscriptLine
from app.schemas import TranscriptLineCreate, TranscriptLineOut

router = APIRouter(tags=["transcript"])


@router.get("/meetings/{meeting_id}/transcript", response_model=list[TranscriptLineOut])
def get_transcript(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.get(Meeting, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return [TranscriptLineOut.model_validate(l) for l in meeting.transcript_lines]


@router.put("/meetings/{meeting_id}/transcript", response_model=list[TranscriptLineOut])
def replace_transcript(meeting_id: int, lines: list[TranscriptLineCreate], db: Session = Depends(get_db)):
    meeting = db.get(Meeting, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    # Delete existing lines
    for line in meeting.transcript_lines:
        db.delete(line)
    db.flush()

    # Insert new lines
    new_lines = []
    for line_data in lines:
        line = TranscriptLine(
            meeting_id=meeting_id,
            speaker=line_data.speaker,
            text=line_data.text,
            start_time=line_data.start_time,
            end_time=line_data.end_time,
            sequence=line_data.sequence,
        )
        db.add(line)
        new_lines.append(line)

    db.commit()
    return [TranscriptLineOut.model_validate(l) for l in new_lines]
