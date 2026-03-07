from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from pydantic import BaseModel
from services.analytics import analytics_service

router = APIRouter()

class TrackEngagementRequest(BaseModel):
    brochure_id: int
    section_id: str
    duration_ms: int

@router.post("/track")
async def track_engagement(
    request: TrackEngagementRequest,
    db: Session = Depends(get_db)
):
    """
    Track and record real-time engagement metrics (hovers, duration) for a shared brochure section.
    This is a public endpoint (no auth required) as it handles anonymous viewer tracking.
    """
    try:
        analytics_service.track_engagement(
            db, 
            request.brochure_id, 
            request.section_id, 
            request.duration_ms
        )
        return {"status": "tracked"}
    except Exception as e:
        # Silently fail for analytics to not break the UI for viewer
        print(f"Analytics error: {str(e)}")
        return {"status": "error", "message": "Failed to track engagement"}

@router.get("/{brochure_id}")
async def get_analytics(
    brochure_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve aggregated engagement metrics (heatmaps) for a specific brochure.
    """
    from models.profile import BrochureEngagement
    engagements = db.query(BrochureEngagement).filter(
        BrochureEngagement.brochure_id == brochure_id
    ).all()
    
    return [
        {
            "section_id": e.section_id,
            "hover_count": e.hover_count,
            "total_hover_time": e.total_hover_time,
            "last_interaction": e.last_interaction
        } for e in engagements
    ]
