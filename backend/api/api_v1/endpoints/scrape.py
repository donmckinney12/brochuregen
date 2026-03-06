from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from services.scraper import scrape_website
from services.ai_service import AIService
from core.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()
ai_service = AIService()

class ScrapeRequest(BaseModel):
    url: str
    is_campaign: bool = False
    layout_theme: str = "modern"

from core.auth import get_current_user

@router.post("/scrape")
async def scrape_url(request: ScrapeRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    
    # Check and deduct credits BEFORE scraping to save compute if they are out of credits
    # Assume 1 credit for regular brochure, 3 credits for full campaign
    credit_cost = 3 if request.is_campaign else 1
    from services.db_orm import deduct_credits_orm, add_credits_orm
    
    credit_check = deduct_credits_orm(db, user_id, amount=credit_cost, credit_type='credits')
    if not credit_check["success"]:
        raise HTTPException(status_code=402, detail=f"Insufficient credits. Requires {credit_cost} credits.")
    
    try:
        result = await scrape_website(request.url)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        # Generate AI content
        ai_content = await ai_service.generate_brochure_content(result.get("text", ""), request.url, request.is_campaign)
        result["ai_content"] = ai_content
        result["is_campaign"] = request.is_campaign
        
        return result
    except Exception as e:
        # Refund on catastrophic failure
        add_credits_orm(db, user_id, amount=credit_cost, credit_type='credits')
        raise HTTPException(status_code=500, detail=str(e))

class RefineRequest(BaseModel):
    text: str
    action: str

@router.post("/refine-text")
async def refine_text(request: RefineRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    
    # Check and deduct refine credits
    from services.db_orm import deduct_credits_orm
    credit_check = deduct_credits_orm(db, user_id, amount=1, credit_type='refine_credits')
    if not credit_check["success"]:
        raise HTTPException(status_code=402, detail="Insufficient refine credits")
        
    result = await ai_service.refine_text_snippet(request.text, request.action)
    if "error" in result:
        # Refund credit if AI fails
        from services.db_orm import add_credits_orm
        add_credits_orm(db, user_id, amount=1, credit_type='refine_credits')
        raise HTTPException(status_code=500, detail=result["error"])
        
    return result
