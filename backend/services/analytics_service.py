from sqlalchemy.orm import Session
from sqlalchemy import func
from models.profile import Brochure, BrochureView, LeadCapture, BrochureComment


def get_conversion_funnel(db: Session, user_id: str) -> dict:
    """Calculate views -> leads -> feedback conversion funnel for user's brochures."""
    brochure_ids = [b.id for b in db.query(Brochure.id).filter(Brochure.user_id == user_id).all()]

    if not brochure_ids:
        return {"views": 0, "leads": 0, "feedback": 0, "view_to_lead_rate": 0, "lead_to_feedback_rate": 0}

    total_views = db.query(func.count(BrochureView.id)).filter(
        BrochureView.brochure_id.in_(brochure_ids)
    ).scalar() or 0

    total_leads = db.query(func.count(LeadCapture.id)).filter(
        LeadCapture.brochure_id.in_(brochure_ids)
    ).scalar() or 0

    total_feedback = db.query(func.count(BrochureComment.id)).filter(
        BrochureComment.brochure_id.in_(brochure_ids)
    ).scalar() or 0

    return {
        "views": total_views,
        "leads": total_leads,
        "feedback": total_feedback,
        "view_to_lead_rate": round((total_leads / total_views * 100), 1) if total_views > 0 else 0,
        "lead_to_feedback_rate": round((total_feedback / total_leads * 100), 1) if total_leads > 0 else 0,
    }


def get_top_performers(db: Session, user_id: str, limit: int = 5) -> list:
    """Get top-performing brochures ranked by views."""
    results = (
        db.query(
            Brochure.id,
            Brochure.title,
            Brochure.share_uuid,
            func.count(BrochureView.id).label("view_count")
        )
        .outerjoin(BrochureView, BrochureView.brochure_id == Brochure.id)
        .filter(Brochure.user_id == user_id)
        .group_by(Brochure.id)
        .order_by(func.count(BrochureView.id).desc())
        .limit(limit)
        .all()
    )

    top = []
    for r in results:
        lead_count = db.query(func.count(LeadCapture.id)).filter(
            LeadCapture.brochure_id == r.id
        ).scalar() or 0

        top.append({
            "id": r.id,
            "title": r.title or "Untitled",
            "share_uuid": r.share_uuid,
            "views": r.view_count,
            "leads": lead_count,
        })

    return top
