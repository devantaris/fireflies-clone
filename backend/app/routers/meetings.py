from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Meeting, Participant, TranscriptLine, Summary, ActionItem
from app.schemas import (
    MeetingCreate, MeetingUpdate, MeetingListItem, MeetingDetail, ParticipantOut, TranscriptLineOut, SummaryOut, ActionItemOut
)
from app.services.ai_service import generate_summary

router = APIRouter(prefix="/meetings", tags=["meetings"])


@router.get("", response_model=list[MeetingListItem])
def list_meetings(
    search: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    participant: Optional[str] = Query(None),
    sort: str = Query("date_desc"),
    db: Session = Depends(get_db),
):
    q = db.query(Meeting)

    if search:
        q = q.filter(Meeting.title.ilike(f"%{search}%"))
    if date_from:
        q = q.filter(Meeting.date >= datetime.fromisoformat(date_from))
    if date_to:
        q = q.filter(Meeting.date <= datetime.fromisoformat(date_to))
    if participant:
        q = q.join(Participant).filter(Participant.name.ilike(f"%{participant}%"))

    if sort == "date_asc":
        q = q.order_by(Meeting.date.asc())
    else:
        q = q.order_by(Meeting.date.desc())

    meetings = q.all()
    result = []
    for m in meetings:
        result.append(MeetingListItem(
            id=m.id,
            title=m.title,
            date=m.date,
            duration=m.duration,
            participant_count=len(m.participants),
            participants=[ParticipantOut.model_validate(p) for p in m.participants],
            transcript_line_count=len(m.transcript_lines),
            created_at=m.created_at,
        ))
    return result


@router.post("", response_model=MeetingDetail, status_code=201)
def create_meeting(payload: MeetingCreate, db: Session = Depends(get_db)):
    meeting = Meeting(
        title=payload.title,
        date=payload.date,
        duration=payload.duration,
    )
    db.add(meeting)
    db.flush()

    for p in payload.participants:
        db.add(Participant(meeting_id=meeting.id, name=p.name, email=p.email))

    transcript_dicts = []
    for line in payload.transcript_lines:
        db.add(TranscriptLine(
            meeting_id=meeting.id,
            speaker=line.speaker,
            text=line.text,
            start_time=line.start_time,
            end_time=line.end_time,
            sequence=line.sequence,
        ))
        transcript_dicts.append(line.model_dump())

    if transcript_dicts:
        summary_data = generate_summary(transcript_dicts)
        db.add(Summary(
            meeting_id=meeting.id,
            overview=summary_data["overview"],
            key_topics=summary_data["key_topics"],
            chapters=summary_data["chapters"],
        ))

    db.commit()
    db.refresh(meeting)
    return _to_detail(meeting)


@router.get("/{meeting_id}", response_model=MeetingDetail)
def get_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.get(Meeting, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return _to_detail(meeting)


@router.put("/{meeting_id}", response_model=MeetingDetail)
def update_meeting(meeting_id: int, payload: MeetingUpdate, db: Session = Depends(get_db)):
    meeting = db.get(Meeting, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    if payload.title is not None:
        meeting.title = payload.title
    if payload.date is not None:
        meeting.date = payload.date
    if payload.duration is not None:
        meeting.duration = payload.duration
    if payload.participants is not None:
        for p in meeting.participants:
            db.delete(p)
        db.flush()
        for p in payload.participants:
            db.add(Participant(meeting_id=meeting.id, name=p.name, email=p.email))

    meeting.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(meeting)
    return _to_detail(meeting)


@router.delete("/{meeting_id}", status_code=204)
def delete_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.get(Meeting, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    db.delete(meeting)
    db.commit()


def _to_detail(meeting: Meeting) -> MeetingDetail:
    return MeetingDetail(
        id=meeting.id,
        title=meeting.title,
        date=meeting.date,
        duration=meeting.duration,
        participants=[ParticipantOut.model_validate(p) for p in meeting.participants],
        transcript_lines=[TranscriptLineOut.model_validate(l) for l in meeting.transcript_lines],
        summary=SummaryOut.model_validate(meeting.summary) if meeting.summary else None,
        action_items=[ActionItemOut.model_validate(a) for a in meeting.action_items],
        created_at=meeting.created_at,
        updated_at=meeting.updated_at,
    )
