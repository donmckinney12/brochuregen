from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Any
from core.database import get_db
from core.auth import get_current_user
from models.profile import LeadCapture, BrochureComment, Brochure, Profile
from pydantic import BaseModel
from datetime import datetime
from services.ai_service import AIService

router = APIRouter()
ai_service = AIService()

class PulseItem(BaseModel):
    id: int
    type: str # 'LEAD' or 'FEEDBACK'
    brochure_title: str
    content: str
    timestamp: datetime
    metadata: dict = {}

class SuggestionRequest(BaseModel):
    id: int
    type: str # 'LEAD' or 'FEEDBACK'

@router.get("/pulse", response_model=List[PulseItem])
def get_command_pulse(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Get a unified pulse of all leads and feedback for the organization.
    """
    # Base query for brochures in the org
    brochure_ids_query = db.query(Brochure.id).filter(
        Brochure.org_id == current_user.org_id if current_user.org_id else Brochure.user_id == current_user.id
    )
    brochures = {b.id: b.title for b in db.query(Brochure).filter(Brochure.id.in_(brochure_ids_query)).all()}
    
    pulse = []
    
    # Fetch Leads
    leads = db.query(LeadCapture).filter(LeadCapture.brochure_id.in_(brochures.keys())).order_by(LeadCapture.created_at.desc()).limit(20).all()
    for lead in leads:
        pulse.append(PulseItem(
            id=lead.id,
            type='LEAD',
            brochure_title=brochures.get(lead.brochure_id, "Unknown"),
            content=f"New Lead: {lead.name or lead.email} ({lead.company or 'N/A'})",
            timestamp=lead.created_at,
            metadata={
                "email": lead.email,
                "message": lead.message,
                "is_read": lead.is_read
            }
        ))
        
    # Fetch Feedback
    comments = db.query(BrochureComment).filter(BrochureComment.brochure_id.in_(brochures.keys())).order_by(BrochureComment.created_at.desc()).limit(20).all()
    for comment in comments:
        pulse.append(PulseItem(
            id=comment.id,
            type='FEEDBACK',
            brochure_title=brochures.get(comment.brochure_id, "Unknown"),
            content=f"Feedback on {comment.section_id or 'General'}: {comment.text[:50]}...",
            timestamp=comment.created_at,
            metadata={
                "text": comment.text,
                "section_id": comment.section_id,
                "is_read": comment.is_read
            }
        ))
        
    # Sort unified pulse by timestamp
    pulse.sort(key=lambda x: x.timestamp, reverse=True)
    return pulse[:50]

@router.post("/suggest")
async def get_ai_suggestion(
    request: SuggestionRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Generate an AI suggestion for responding to a lead or feedback.
    """
    if request.type == 'LEAD':
        item = db.query(LeadCapture).filter(LeadCapture.id == request.id).first()
        if not item: raise HTTPException(status_code=404, detail="Lead not found")
        prompt = f"Lead from {item.name} at {item.company}. Message: {item.message}. Suggest a professional, high-converting follow-up response."
    else:
        item = db.query(BrochureComment).filter(BrochureComment.id == request.id).first()
        if not item: raise HTTPException(status_code=404, detail="Feedback not found")
        prompt = f"Customer feedback on section '{item.section_id}': {item.text}. Suggest a professional response that acknowledges the feedback and offers a solution or refinement."
        
    suggestion = await ai_service.generate_completion(
        system_prompt="You are an elite business concierge. Provide rapid, high-quality response suggestions.",
        user_prompt=prompt
    )
    
    return {"suggestion": suggestion}
