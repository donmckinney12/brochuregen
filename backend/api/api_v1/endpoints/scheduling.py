"""Scheduled publishing endpoints for brochures."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from core.auth import get_current_user
import datetime

router = APIRouter()

# In-memory schedule store (production would use DB + task queue)
schedule_store: dict = {}


class SchedulePublishRequest(BaseModel):
    brochure_id: int
    publish_at: str  # ISO datetime string
    auto_expire: Optional[str] = None  # ISO datetime for auto-expiry
    notify_email: Optional[str] = None


@router.post("/publish")
async def schedule_publish(
    request: SchedulePublishRequest,
    current_user: dict = Depends(get_current_user)
):
    """Schedule a brochure for future publishing."""
    user_id = current_user["sub"]

    try:
        publish_time = datetime.datetime.fromisoformat(request.publish_at)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid datetime format. Use ISO 8601.")

    if publish_time <= datetime.datetime.utcnow():
        raise HTTPException(status_code=400, detail="Publish time must be in the future.")

    if user_id not in schedule_store:
        schedule_store[user_id] = []

    schedule_id = len(schedule_store[user_id]) + 1
    schedule = {
        "id": schedule_id,
        "brochure_id": request.brochure_id,
        "publish_at": request.publish_at,
        "auto_expire": request.auto_expire,
        "notify_email": request.notify_email,
        "status": "scheduled",
        "created_at": datetime.datetime.utcnow().isoformat(),
    }
    schedule_store[user_id].append(schedule)

    return {"status": "scheduled", "schedule": schedule}


@router.get("/upcoming")
async def get_upcoming(
    current_user: dict = Depends(get_current_user)
):
    """List all upcoming scheduled publications."""
    user_id = current_user["sub"]
    schedules = schedule_store.get(user_id, [])

    upcoming = [s for s in schedules if s["status"] == "scheduled"]
    return {"schedules": upcoming, "count": len(upcoming)}


@router.delete("/{schedule_id}")
async def cancel_schedule(
    schedule_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Cancel a scheduled publication."""
    user_id = current_user["sub"]
    schedules = schedule_store.get(user_id, [])

    for s in schedules:
        if s["id"] == schedule_id:
            s["status"] = "cancelled"
            return {"status": "cancelled", "schedule_id": schedule_id}

    raise HTTPException(status_code=404, detail="Schedule not found")
