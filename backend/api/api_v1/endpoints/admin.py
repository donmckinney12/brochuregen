from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from core.database import get_db
from core.auth import get_current_user
from models.profile import Profile, Brochure, BrochureView, LeadCapture

router = APIRouter()

ADMIN_EMAILS = ["mckinneydonald321@gmail.com"]

def require_admin(current_user: dict = Depends(get_current_user)):
    """Dependency that ensures the caller is an admin."""
    # We need to look up email from profile since JWT only has 'sub'
    return current_user

def verify_admin(db: Session, user_id: str):
    profile = db.query(Profile).filter(Profile.id == user_id).first()
    if not profile or profile.email not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Admin access required")
    return profile


@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), current_user: dict = Depends(require_admin)):
    verify_admin(db, current_user["sub"])

    total_users = db.query(func.count(Profile.id)).scalar() or 0
    total_brochures = db.query(func.count(Brochure.id)).scalar() or 0
    total_leads = db.query(func.count(LeadCapture.id)).scalar() or 0
    total_views = db.query(func.count(BrochureView.id)).scalar() or 0

    # Plan distribution
    plan_counts = db.query(Profile.plan, func.count(Profile.id)).group_by(Profile.plan).all()
    plan_distribution = {plan: count for plan, count in plan_counts}

    return {
        "total_users": total_users,
        "total_brochures": total_brochures,
        "total_leads": total_leads,
        "total_views": total_views,
        "plan_distribution": plan_distribution,
    }


@router.get("/users")
def get_admin_users(db: Session = Depends(get_db), current_user: dict = Depends(require_admin)):
    verify_admin(db, current_user["sub"])

    users = db.query(Profile).order_by(Profile.created_at.desc()).limit(100).all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "plan": u.plan,
            "credits": u.credits,
            "refine_credits": u.refine_credits,
            "created_at": str(u.created_at) if u.created_at else None,
            "stripe_customer_id": u.stripe_customer_id,
        }
        for u in users
    ]


class CreditOverride(BaseModel):
    credits: int = None
    refine_credits: int = None
    plan: str = None


@router.post("/users/{user_id}/override")
def override_user(user_id: str, payload: CreditOverride, db: Session = Depends(get_db), current_user: dict = Depends(require_admin)):
    verify_admin(db, current_user["sub"])

    target = db.query(Profile).filter(Profile.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.credits is not None:
        target.credits = payload.credits
    if payload.refine_credits is not None:
        target.refine_credits = payload.refine_credits
    if payload.plan is not None:
        target.plan = payload.plan

    db.commit()
    db.refresh(target)

    return {
        "status": "success",
        "user_id": target.id,
        "credits": target.credits,
        "refine_credits": target.refine_credits,
        "plan": target.plan,
    }
