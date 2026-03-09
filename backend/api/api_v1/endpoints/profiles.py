from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from core.database import get_db
from services.db_orm import get_profile, create_profile
from schemas.profile import Profile, ProfileCreate, ProfileUpdate, BrandCalibrateRequest
from core.auth import get_current_user

router = APIRouter()

class DeductRequest(BaseModel):
    user_id: str
    type: str # 'generate' or 'refine'

@router.post("/deduct")
def deduct_credits(request: DeductRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # Ensure user is only deducting their own credits
    if current_user["sub"] != request.user_id:
         raise HTTPException(status_code=403, detail="Forbidden")
    
    from services.db_orm import deduct_credits_orm
    credit_type = 'credits' if request.type == 'generate' else 'refine_credits'
    result = deduct_credits_orm(db, request.user_id, amount=1, credit_type=credit_type)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.get("/me", response_model=Profile)
def read_profile_me(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    db_profile = get_profile(db, user_id)
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return db_profile

@router.patch("/me", response_model=Profile)
def update_profile_me(profile_update: ProfileUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    from services.db_orm import update_profile
    db_profile = update_profile(db, user_id, profile_update)
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return db_profile

@router.post("/", response_model=Profile)
def sync_profile(profile: ProfileCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    try:
        # Ensure user is only syncing their own profile
        if current_user["sub"] != profile.id:
             raise HTTPException(status_code=403, detail="Forbidden")
        
        # --- Enterprise Sync ---
        # If frontend sends org context, ensure it's synced in our DB
        # This prevents FK errors or missing org data
        org_id = current_user.get("org_id") or profile.org_id
        if org_id:
            from services.db_orm import sync_enterprise_context
            # Note: ProfileCreate schema has org_id but we might also have org_name from somewhere (future)
            sync_enterprise_context(db, profile.id, org_id)

        db_profile = get_profile(db, profile.id)
        if db_profile:
            print(f"DEBUG: Found existing profile: {db_profile.id}, plan: {db_profile.plan}")
            return db_profile
            
        print(f"DEBUG: Creating new profile for: {profile.id}")
        return create_profile(db, profile)
    except Exception as e:
        print(f"Error in sync_profile: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/organization/brand")
def read_organization_brand(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    org_id = current_user.get("org_id")
    if not org_id:
        raise HTTPException(status_code=400, detail="No active organization found")
    
    from services.db_orm import get_organization_brand
    db_org = get_organization_brand(db, org_id)
    if not db_org:
        # Auto-creation of org if sync somehow missed it
        from services.db_orm import sync_enterprise_context
        sync_enterprise_context(db, current_user["sub"], org_id)
        db_org = get_organization_brand(db, org_id)
        
    if not db_org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return db_org

@router.put("/organization/brand")
def update_org_brand(brand_data: dict, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    org_id = current_user.get("org_id")
    if not org_id:
        raise HTTPException(status_code=400, detail="No active organization found")
    
    from services.db_orm import update_organization_brand
    db_org = update_organization_brand(db, org_id, brand_data)
    if not db_org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return db_org

@router.post("/calibrate-from-url", response_model=Profile)
async def calibrate_brand_voice(request: BrandCalibrateRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    from services.scraper import scrape_website
    from services.ai_service import AIService
    from services.db_orm import get_profile, log_activity
    
    profile = get_profile(db, user_id)
    org_id = profile.org_id if profile else None
    
    # 1. Scrape
    scraped = await scrape_website(request.url)
    if "error" in scraped:
        raise HTTPException(status_code=400, detail=f"Scrape failed: {scraped['error']}")
    
    # 2. Extract Voice
    ai_svc = AIService()
    analysis = await ai_svc.extract_brand_voice(scraped["text"])
    if "error" in analysis:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {analysis['error']}")
    
    voice_profile = analysis["voice_profile"]
    
    # 3. Update Profile
    from services.db_orm import update_profile
    
    update_data = ProfileUpdate(
        brand_voice_tone=voice_profile.get("tone"),
        brand_voice_calibration=voice_profile.get("calibration_snippet")
    )
    
    db_profile = update_profile(db, user_id, update_data)
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    log_activity(db, user_id, "CALIBRATED", f"Voice calibrated from {request.url}", org_id=org_id)
    return db_profile
