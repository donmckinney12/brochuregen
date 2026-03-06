from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from services.ai_service import AIService
from core.auth import get_current_user
from sqlalchemy.orm import Session
from core.database import get_db

router = APIRouter()
ai_service = AIService()

class ImageGenerateRequest(BaseModel):
    prompt: str
    user_id: str

@router.post("/generate")
async def generate_image(request: ImageGenerateRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # Security: Ensure user is only generating for themselves
    if current_user["sub"] != request.user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    # Optional: Deduct credits here if needed (e.g., 5 credits for an image)
    from services.db_orm import get_profile, deduct_credits_orm
    profile = get_profile(db, request.user_id)
    
    if not profile or (profile.credits or 0) < 5:
        raise HTTPException(status_code=400, detail="Insufficient credits for AI image generation (5 credits required)")

    # Deduct credits
    deduct_result = deduct_credits_orm(db, request.user_id, amount=5, credit_type='credits')
    if not deduct_result["success"]:
        raise HTTPException(status_code=400, detail=deduct_result["error"])

    result = await ai_service.generate_bespoke_image(request.prompt)
    if "error" in result:
        # Refund credits if generation fails
        from services.db_orm import add_credits_orm
        add_credits_orm(db, request.user_id, amount=5, credit_type='credits')
        raise HTTPException(status_code=500, detail=result["error"])
    
    return result
