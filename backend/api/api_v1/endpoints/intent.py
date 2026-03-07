from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from services.intent_engine import intent_engine
from services.auth import get_current_user
from models.profile import Brochure
from typing import List

router = APIRouter()

@router.post("/trigger")
async def trigger_proactive_draft(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    org_id = current_user.get("org_id")
    if not org_id:
        raise HTTPException(status_code=400, detail="User must belong to an organization")
    
    draft = await intent_engine.generate_proactive_draft(db, org_id)
    if not draft:
        raise HTTPException(status_code=500, detail="Failed to generate draft")
    
    return draft

@router.get("/drafts")
async def get_proactive_drafts(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    org_id = current_user.get("org_id")
    if not org_id:
        return []
    
    drafts = db.query(Brochure).filter(
        Brochure.org_id == org_id,
        Brochure.status == "proactive_draft"
    ).all()
    
    return drafts

@router.post("/approve/{draft_id}")
async def approve_draft(draft_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    draft = db.query(Brochure).filter(Brochure.id == draft_id).first()
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")
    
    draft.status = "active"
    db.commit()
    return {"message": "Draft approved and activated"}
