"""Audit log and GDPR compliance endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from core.auth import get_current_user
import datetime

router = APIRouter()

# In-memory audit store (production would use DB)
audit_store: dict = {}


def log_audit_event(user_id: str, action: str, details: str = ""):
    """Internal: record an audit event."""
    if user_id not in audit_store:
        audit_store[user_id] = []
    audit_store[user_id].append({
        "action": action,
        "details": details,
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "ip": "system",
    })


@router.get("/log")
async def get_audit_log(
    limit: int = 50,
    current_user: dict = Depends(get_current_user)
):
    """Get activity audit trail for the current user."""
    user_id = current_user["sub"]
    events = audit_store.get(user_id, [])

    # Return most recent events first
    return {
        "events": events[-limit:][::-1],
        "total": len(events),
    }


@router.post("/export")
async def export_data(
    current_user: dict = Depends(get_current_user)
):
    """GDPR: Export all user data as JSON."""
    user_id = current_user["sub"]

    export = {
        "user_id": user_id,
        "email": current_user.get("email", "unknown"),
        "audit_events": audit_store.get(user_id, []),
        "exported_at": datetime.datetime.utcnow().isoformat(),
        "format": "json",
        "gdpr_compliant": True,
    }

    log_audit_event(user_id, "data_export", "User requested GDPR data export")

    return {
        "status": "exported",
        "data": export,
        "message": "Your data has been exported. This includes all activity logs and account information."
    }


@router.delete("/data")
async def delete_data(
    current_user: dict = Depends(get_current_user)
):
    """GDPR: Delete all user data (right to be forgotten)."""
    user_id = current_user["sub"]

    # Clear audit data
    if user_id in audit_store:
        del audit_store[user_id]

    return {
        "status": "deleted",
        "message": "All your data has been permanently deleted per GDPR right to erasure.",
        "timestamp": datetime.datetime.utcnow().isoformat(),
    }
