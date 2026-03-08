"""Gamification endpoints for achievements, streaks, and leaderboard."""
from fastapi import APIRouter, Depends
from core.auth import get_current_user
from sqlalchemy.orm import Session
from core.database import get_db
from models.profile import Brochure as BrochureModel

router = APIRouter()

ACHIEVEMENTS = [
    {"id": "first_brochure", "name": "First Steps", "description": "Generate your first brochure", "icon": "🚀", "xp": 50, "threshold": 1},
    {"id": "five_brochures", "name": "Content Creator", "description": "Generate 5 brochures", "icon": "📄", "xp": 150, "threshold": 5},
    {"id": "ten_brochures", "name": "Prolific Producer", "description": "Generate 10 brochures", "icon": "🔥", "xp": 300, "threshold": 10},
    {"id": "fifty_brochures", "name": "Brochure Machine", "description": "Generate 50 brochures", "icon": "⚡", "xp": 1000, "threshold": 50},
    {"id": "first_lead", "name": "Lead Magnet", "description": "Capture your first lead", "icon": "🧲", "xp": 100, "threshold": 1},
    {"id": "hundred_views", "name": "Audience Builder", "description": "Reach 100 total views", "icon": "👀", "xp": 200, "threshold": 100},
    {"id": "thousand_views", "name": "Viral Sensation", "description": "Reach 1,000 total views", "icon": "🌟", "xp": 500, "threshold": 1000},
    {"id": "translator", "name": "Polyglot", "description": "Translate a brochure", "icon": "🌍", "xp": 75, "threshold": 1},
]


@router.get("/profile")
async def get_profile(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get gamification profile: achievements, XP, streaks."""
    user_id = current_user["sub"]

    # Count brochures
    brochure_count = db.query(BrochureModel).filter(BrochureModel.user_id == user_id).count()

    # Calculate unlocked achievements
    unlocked = []
    total_xp = 0
    for ach in ACHIEVEMENTS:
        is_unlocked = False
        if ach["id"] in ["first_brochure", "five_brochures", "ten_brochures", "fifty_brochures"]:
            is_unlocked = brochure_count >= ach["threshold"]

        if is_unlocked:
            unlocked.append(ach["id"])
            total_xp += ach["xp"]

    # Calculate level (100 XP per level)
    level = max(1, total_xp // 100)

    return {
        "user_id": user_id,
        "level": level,
        "xp": total_xp,
        "xp_to_next_level": (level + 1) * 100 - total_xp,
        "achievements": [
            {**ach, "unlocked": ach["id"] in unlocked}
            for ach in ACHIEVEMENTS
        ],
        "stats": {
            "brochures_created": brochure_count,
        }
    }


@router.get("/leaderboard")
async def get_leaderboard(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get top users by brochure count."""
    from sqlalchemy import func

    results = (
        db.query(
            BrochureModel.user_id,
            func.count(BrochureModel.id).label("count")
        )
        .group_by(BrochureModel.user_id)
        .order_by(func.count(BrochureModel.id).desc())
        .limit(10)
        .all()
    )

    return {
        "leaderboard": [
            {"rank": i + 1, "user_id": r.user_id, "brochures": r.count}
            for i, r in enumerate(results)
        ]
    }
