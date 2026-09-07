from datetime import datetime
from typing import Optional
from pydantic import BaseModel


# ── Participant ───────────────────────────────────────────────────────────────

class ParticipantBase(BaseModel):
    name: str
    email: Optional[str] = None

class ParticipantCreate(ParticipantBase):
    pass

class ParticipantOut(ParticipantBase):
    id: int
    meeting_id: int
    model_config = {"from_attributes": True}


# ── TranscriptLine ────────────────────────────────────────────────────────────

class TranscriptLineBase(BaseModel):
    speaker: str
    text: str
    start_time: float
    end_time: float
    sequence: int

class TranscriptLineCreate(TranscriptLineBase):
    pass

class TranscriptLineOut(TranscriptLineBase):
    id: int
    meeting_id: int
    model_config = {"from_attributes": True}


# ── ActionItem ────────────────────────────────────────────────────────────────

class ActionItemCreate(BaseModel):
    text: str
    assignee: Optional[str] = None
    due_date: Optional[str] = None

class ActionItemUpdate(BaseModel):
    text: Optional[str] = None
    assignee: Optional[str] = None
    due_date: Optional[str] = None
    completed: Optional[bool] = None

class ActionItemOut(BaseModel):
    id: int
    meeting_id: int
    text: str
    assignee: Optional[str] = None
    due_date: Optional[str] = None
    completed: bool
    created_at: datetime
    model_config = {"from_attributes": True}


# ── Summary ───────────────────────────────────────────────────────────────────

class SummaryOut(BaseModel):
    id: int
    meeting_id: int
    overview: Optional[str] = None
    key_topics: Optional[str] = None   # JSON string
    chapters: Optional[str] = None     # JSON string
    created_at: datetime
    model_config = {"from_attributes": True}


# ── Meeting ───────────────────────────────────────────────────────────────────

class MeetingCreate(BaseModel):
    title: str
    date: datetime
    duration: int = 0
    is_hosted: bool = True
    participants: list[ParticipantCreate] = []
    transcript_lines: list[TranscriptLineCreate] = []

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[datetime] = None
    duration: Optional[int] = None
    participants: Optional[list[ParticipantCreate]] = None

class MeetingListItem(BaseModel):
    id: int
    title: str
    date: datetime
    duration: int
    is_hosted: bool
    participant_count: int
    participants: list[ParticipantOut]
    transcript_line_count: int
    created_at: datetime
    model_config = {"from_attributes": True}

class MeetingDetail(BaseModel):
    id: int
    title: str
    date: datetime
    duration: int
    participants: list[ParticipantOut]
    transcript_lines: list[TranscriptLineOut]
    summary: Optional[SummaryOut] = None
    action_items: list[ActionItemOut]
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}
