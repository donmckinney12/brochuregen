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

from models.profile import Profile, Brochure, Organization
from schemas.brochure import BrochureCreate

def sync_enterprise_context(db: Session, user_id: str, org_id: Optional[str], org_name: Optional[str] = "Unified Org"):
    """
    Syncs the Clerk Org context with our internal models.
    """
    if not org_id:
        return None
        
    # 1. Upsert Organization
    db_org = db.query(Organization).filter(Organization.id == org_id).first()
    if not db_org:
        db_org = Organization(id=org_id, name=org_name or "New Team Node")
        db.add(db_org)
        db.commit()
        db.refresh(db_org)
    
    # 2. Link Profile
    db_profile = get_profile(db, user_id)
    if db_profile and db_profile.org_id != org_id:
        db_profile.org_id = org_id
        db.commit()
        db.refresh(db_profile)
        
    return org_id

def get_user_brochures(db: Session, user_id: str, org_id: Optional[str] = None):
    """
    Returns brochures for a user. If org_id is provided, returns all org brochures.
    """
    if org_id:
        return db.query(Brochure).filter(Brochure.org_id == org_id).order_by(Brochure.created_at.desc()).all()
    return db.query(Brochure).filter(Brochure.user_id == user_id).order_by(Brochure.created_at.desc()).all()

def get_shared_brochure(db: Session, share_uuid: str):
    # Eagerly load the owner profile to return Brand Vault settings
    from sqlalchemy.orm import joinedload
    return db.query(Brochure).options(joinedload(Brochure.owner)).filter(Brochure.share_uuid == share_uuid).first()

def create_brochure(db: Session, brochure: BrochureCreate, org_id: Optional[str] = None) -> Brochure:
    data = brochure.dict()
    if org_id:
        data["org_id"] = org_id
    db_item = Brochure(**data)
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
