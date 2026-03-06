from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from core.database import get_db
from services.db_orm import get_profile, create_profile
from schemas.profile import Profile, ProfileCreate, ProfileUpdate
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
        
        db_profile = get_profile(db, profile.id)
        if db_profile:
            print(f"DEBUG: Found existing profile: {db_profile.id}, plan: {db_profile.plan}")
            return db_profile
        print(f"DEBUG: Creating new profile for: {profile.id}")
        return create_profile(db, profile)
    except Exception as e:
        print(f"Error in sync_profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))
