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
    tone: str = None

from core.auth import get_current_user

@router.post("/scrape")
async def scrape_url(request: ScrapeRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    
    # Check and deduct credits BEFORE scraping to save compute if they are out of credits
    # Assume 1 credit for regular brochure, 3 credits for full campaign
    credit_cost = 3 if request.is_campaign else 1
    from services.db_orm import deduct_credits_orm, add_credits_orm, log_activity, get_profile
    
    credit_check = deduct_credits_orm(db, user_id, amount=credit_cost, credit_type='credits')
    if not credit_check["success"]:
        raise HTTPException(status_code=402, detail=f"Insufficient credits. Requires {credit_cost} credits.")
    
    try:
        from services.db_orm import get_profile
        db_profile = get_profile(db, user_id)
        brand_voice = db_profile.brand_voice_calibration if db_profile else None
        org_id = db_profile.org_id if db_profile else None

        result = await scrape_website(request.url)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        # Generate AI content
        ai_content = await ai_service.generate_brochure_content(
            result.get("text", ""), 
            request.url, 
            request.is_campaign,
            brand_voice=brand_voice,
            tone=request.tone,
            layout_theme=request.layout_theme
        )
        result["ai_content"] = ai_content
        result["is_campaign"] = request.is_campaign
        
        log_activity(db, user_id, "GENERATED", f"Brochure for {request.url}", org_id=org_id)
        
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
    from services.db_orm import deduct_credits_orm, log_activity, get_profile
    profile = get_profile(db, user_id)
    org_id = profile.org_id if profile else None

    credit_check = deduct_credits_orm(db, user_id, amount=1, credit_type='refine_credits')
    if not credit_check["success"]:
        raise HTTPException(status_code=402, detail="Insufficient refine credits")
        
    result = await ai_service.refine_text_snippet(request.text, request.action)
    if "error" in result:
        # Refund credit if AI fails
        from services.db_orm import add_credits_orm
        add_credits_orm(db, user_id, amount=1, credit_type='refine_credits')
        raise HTTPException(status_code=500, detail=result["error"])
        
    log_activity(db, user_id, "REFINED", f"Refined {request.action}", org_id=org_id)
    return result

class VoiceExtractRequest(BaseModel):
    url: str

@router.post("/extract-voice")
async def extract_voice(request: VoiceExtractRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    
    # Check subscription tier
    from services.db_orm import get_profile
    profile = get_profile(db, user_id)
    if not profile or (profile.plan != 'pro' and profile.plan != 'agency' and profile.plan != 'enterprise'):
        raise HTTPException(status_code=403, detail="Automated Voice Extraction requires a Premium plan.")

    try:
        from services.scraper import scrape_website
        result = await scrape_website(request.url)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        voice_res = await ai_service.extract_brand_voice(result.get("text", ""))
        return voice_res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
