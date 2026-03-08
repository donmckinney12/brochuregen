from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from core.database import get_db
from core.auth import get_current_user
from services.email_service import send_email

router = APIRouter()


class SendFollowupRequest(BaseModel):
    to_email: str
    subject: str
    body: str


class SendSequenceRequest(BaseModel):
    to_email: str
    sequence: List[dict]  # [{step, subject, body}, ...]


@router.post("/send-followup")
async def send_followup_email(
    request: SendFollowupRequest,
    current_user: dict = Depends(get_current_user)
):
    body_html = request.body.replace("\n", "<br/>")
    result = send_email(request.to_email, request.subject, body_html)

    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "Send failed"))

    return {"status": "sent", "to": request.to_email, "subject": request.subject}


@router.post("/send-sequence")
async def send_followup_sequence(
    request: SendSequenceRequest,
    current_user: dict = Depends(get_current_user)
):
    results = []
    for step in request.sequence:
        body_html = step.get("body", "").replace("\n", "<br/>")
        result = send_email(request.to_email, step.get("subject", "Follow-up"), body_html)
        results.append({
            "step": step.get("step"),
            "subject": step.get("subject"),
            "status": "sent" if result["success"] else "failed",
            "error": result.get("error"),
        })

    sent_count = sum(1 for r in results if r["status"] == "sent")
    return {
        "status": "complete",
        "sent": sent_count,
        "total": len(results),
        "details": results,
    }
