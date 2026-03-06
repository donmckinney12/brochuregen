from sqlalchemy.orm import Session
from models.profile import Profile
from schemas.profile import ProfileCreate, ProfileUpdate
from typing import Optional

def get_profile(db: Session, user_id: str) -> Optional[Profile]:
    return db.query(Profile).filter(Profile.id == user_id).first()

def create_profile(db: Session, profile: ProfileCreate) -> Profile:
    db_item = Profile(**profile.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_profile(db: Session, user_id: str, profile_update: ProfileUpdate) -> Optional[Profile]:
    db_profile = get_profile(db, user_id)
    if not db_profile:
        return None
    
    update_data = profile_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_profile, key, value)
    
    db.commit()
    db.refresh(db_profile)
    return db_profile

def deduct_credits_orm(db: Session, user_id: str, amount: int = 1, credit_type: str = 'credits') -> dict:
    db_profile = get_profile(db, user_id)
    if not db_profile:
        return {"success": False, "error": "User not found"}
    
    current_balance = getattr(db_profile, credit_type, 0)
    if current_balance is None: current_balance = 0
    
    if current_balance < amount:
        return {"success": False, "error": "Insufficient credits"}
    
    setattr(db_profile, credit_type, current_balance - amount)
    db.commit()
    db.refresh(db_profile)
    
    return {"success": True, "new_balance": getattr(db_profile, credit_type)}

def update_profile_plan(db: Session, user_id: str, plan: str, customer_id: str) -> bool:
    db_profile = get_profile(db, user_id)
    if db_profile:
        db_profile.plan = plan
        db_profile.stripe_customer_id = customer_id
        db.commit()
        return True
    return False

from models.profile import Profile, Brochure
from schemas.brochure import BrochureCreate

def get_user_brochures(db: Session, user_id: str):
    return db.query(Brochure).filter(Brochure.user_id == user_id).order_by(Brochure.created_at.desc()).all()

def get_shared_brochure(db: Session, share_uuid: str):
    # Eagerly load the owner profile to return Brand Vault settings
    from sqlalchemy.orm import joinedload
    return db.query(Brochure).options(joinedload(Brochure.owner)).filter(Brochure.share_uuid == share_uuid).first()

def create_brochure(db: Session, brochure: BrochureCreate) -> Brochure:
    db_item = Brochure(**brochure.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def add_credits_orm(db: Session, user_id: str, amount: int = 100, credit_type: str = 'credits') -> dict:
    db_profile = get_profile(db, user_id)
    if not db_profile:
        # Optionally auto-create profile if not exists
        return {"success": False, "error": "User not found"}
    
    current_balance = getattr(db_profile, credit_type, 0)
    if current_balance is None: current_balance = 0
    
    setattr(db_profile, credit_type, current_balance + amount)
    db.commit()
    db.refresh(db_profile)
    
    return {"success": True, "new_balance": getattr(db_profile, credit_type)}
