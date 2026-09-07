from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Meeting, ActionItem
from app.schemas import ActionItemCreate, ActionItemUpdate, ActionItemOut

router = APIRouter(tags=["action_items"])


@router.get("/meetings/{meeting_id}/action-items", response_model=list[ActionItemOut])
def list_action_items(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.get(Meeting, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return [ActionItemOut.model_validate(a) for a in meeting.action_items]


@router.post("/meetings/{meeting_id}/action-items", response_model=ActionItemOut, status_code=201)
def create_action_item(meeting_id: int, payload: ActionItemCreate, db: Session = Depends(get_db)):
    meeting = db.get(Meeting, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    item = ActionItem(
        meeting_id=meeting_id,
        text=payload.text,
        assignee=payload.assignee,
        due_date=payload.due_date,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return ActionItemOut.model_validate(item)


@router.patch("/action-items/{item_id}", response_model=ActionItemOut)
def update_action_item(item_id: int, payload: ActionItemUpdate, db: Session = Depends(get_db)):
    item = db.get(ActionItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found")
    if payload.text is not None:
        item.text = payload.text
    if payload.assignee is not None:
        item.assignee = payload.assignee
    if payload.due_date is not None:
        item.due_date = payload.due_date
    if payload.completed is not None:
        item.completed = payload.completed
    db.commit()
    db.refresh(item)
    return ActionItemOut.model_validate(item)


@router.delete("/action-items/{item_id}", status_code=204)
def delete_action_item(item_id: int, db: Session = Depends(get_db)):
    item = db.get(ActionItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found")
    db.delete(item)
    db.commit()
