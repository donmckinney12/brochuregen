from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.deps import get_db
from services.social_sync import social_sync_service
from services.db_orm import get_current_user_profile
from models.profile import Profile
from pydantic import BaseModel

router = APIRouter()

class SocialDispatchRequest(BaseModel):
    brochure_id: int
    platform: str
    post_index: int

@router.post("/dispatch")
async def dispatch_social_post(
    request: SocialDispatchRequest,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user_profile)
):
    """
    Synchronize a social post to the specified platform via API Pulse.
    """
    try:
        result = await social_sync_service.dispatch_post(
            db, 
            request.brochure_id, 
            request.platform, 
            request.post_index
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dispatch failed: {str(e)}")
