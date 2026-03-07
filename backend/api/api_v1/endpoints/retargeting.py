from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from core.auth import get_current_user
from services.retargeting import retargeting_service
from typing import List

router = APIRouter()

@router.get("/analyze")
async def analyze_retargeting(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    org_id = current_user.get("org_id")
    
    try:
        prospects = await retargeting_service.analyze_leads_for_retargeting(db, org_id)
        return prospects
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
