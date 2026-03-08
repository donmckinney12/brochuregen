"""Team collaboration endpoints for inviting members and managing roles."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from core.database import get_db
from core.auth import get_current_user

router = APIRouter()

# In-memory team store (production would use DB)
team_store: dict = {}


class InviteRequest(BaseModel):
    email: str
    role: str = "editor"  # owner, editor, viewer


class MemberResponse(BaseModel):
    email: str
    role: str
    status: str


@router.post("/invite")
async def invite_member(
    request: InviteRequest,
    current_user: dict = Depends(get_current_user)
):
    """Invite a team member by email."""
    user_id = current_user["sub"]

    if user_id not in team_store:
        team_store[user_id] = []

    # Check for duplicate
    existing = [m for m in team_store[user_id] if m["email"] == request.email]
    if existing:
        raise HTTPException(status_code=400, detail="Member already invited")

    if request.role not in ["owner", "editor", "viewer"]:
        raise HTTPException(status_code=400, detail="Invalid role. Must be owner, editor, or viewer.")

    member = {
        "email": request.email,
        "role": request.role,
        "status": "pending",
    }
    team_store[user_id].append(member)

    return {"status": "invited", "member": member}


@router.get("/members")
async def list_members(
    current_user: dict = Depends(get_current_user)
):
    """List all team members."""
    user_id = current_user["sub"]
    members = team_store.get(user_id, [])
    return {"members": members, "count": len(members)}


@router.delete("/members/{email}")
async def remove_member(
    email: str,
    current_user: dict = Depends(get_current_user)
):
    """Remove a team member."""
    user_id = current_user["sub"]

    if user_id not in team_store:
        raise HTTPException(status_code=404, detail="No team found")

    team_store[user_id] = [m for m in team_store[user_id] if m["email"] != email]
    return {"status": "removed", "email": email}
