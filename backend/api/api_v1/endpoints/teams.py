"""Team collaboration endpoints for inviting members and managing roles."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from sqlalchemy.orm import Session
from core.database import get_db
from core.auth import get_current_user
from models.team import TeamInvite
from models.profile import Profile, Organization
import datetime

router = APIRouter()


class InviteRequest(BaseModel):
    email: EmailStr
    role: str = "editor"  # owner, editor, viewer


class MemberResponse(BaseModel):
    email: str
    role: str
    status: str
    created_at: datetime.datetime


@router.post("/invite")
async def invite_member(
    request: InviteRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Invite a team member by email."""
    user_id = current_user["sub"]
    org_id = current_user.get("org_id")

    if not org_id:
        # Auto-create a personal organization context if missing
        from services.db_orm import sync_enterprise_context
        org_id = sync_enterprise_context(db, user_id, f"org_{user_id}", f"{current_user.get('name', 'My')}'s Network")

    # Check for existing pending invite
    existing = db.query(TeamInvite).filter(
        TeamInvite.org_id == org_id,
        TeamInvite.email == request.email,
        TeamInvite.status == "pending"
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Member already has a pending invitation")

    if request.role not in ["owner", "editor", "viewer"]:
        raise HTTPException(status_code=400, detail="Invalid role. Must be owner, editor, or viewer.")

    db_invite = TeamInvite(
        org_id=org_id,
        inviter_id=user_id,
        email=request.email,
        role=request.role,
        status="pending"
    )
    db.add(db_invite)
    
    # In a real app, send email here
    # from services.email_service import send_invite_email
    # send_invite_email(request.email, org_id)

    db.commit()
    db.refresh(db_invite)

    return {"status": "invited", "invite_id": db_invite.id}


@router.get("/members")
async def list_members(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """List all team members (including pending invites)."""
    user_id = current_user["sub"]
    org_id = current_user.get("org_id")
    
    if not org_id:
        return {"members": [], "count": 0}

    # 1. Fetch active members from Profiles
    profiles = db.query(Profile).filter(Profile.org_id == org_id).all()
    members = [{
        "email": p.email,
        "role": "owner" if p.id == user_id else "editor", # simplistic mapping
        "status": "active",
        "name": p.full_name
    } for p in profiles]

    # 2. Fetch pending invites
    invites = db.query(TeamInvite).filter(TeamInvite.org_id == org_id, TeamInvite.status == "pending").all()
    for invite in invites:
        members.append({
            "email": invite.email,
            "role": invite.role,
            "status": "pending",
            "created_at": invite.created_at
        })

    return {"members": members, "count": len(members)}


@router.delete("/members/{email}")
async def remove_member(
    email: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Remove a team member or revoke an invite."""
    user_id = current_user["sub"]
    org_id = current_user.get("org_id")

    if not org_id:
         raise HTTPException(status_code=404, detail="No organization context found")

    # 1. Try revoking invite
    invite = db.query(TeamInvite).filter(TeamInvite.org_id == org_id, TeamInvite.email == email).first()
    if invite:
        db.delete(invite)
        db.commit()
        return {"status": "revoked", "email": email}

    # 2. Try removing active member (cannot remove self)
    profile = db.query(Profile).filter(Profile.org_id == org_id, Profile.email == email).first()
    if profile:
        if profile.id == user_id:
            raise HTTPException(status_code=400, detail="Cannot remove yourself from your own team")
        
        profile.org_id = None
        db.commit()
        return {"status": "removed", "email": email}

    raise HTTPException(status_code=404, detail="Member or invite not found")
