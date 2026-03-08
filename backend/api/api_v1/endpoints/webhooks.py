"""Webhook endpoints for external integrations (Zapier, CRMs, custom)."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from core.database import get_db
from core.auth import get_current_user
from models.webhook import WebhookConfig
import json

router = APIRouter()


class WebhookConfigRequest(BaseModel):
    url: str
    events: List[str] = ["lead.created", "brochure.generated"]
    secret: Optional[str] = None


class WebhookTestRequest(BaseModel):
    url: str


@router.post("/configure")
async def configure_webhook(
    request: WebhookConfigRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Register a webhook URL to receive event notifications."""
    user_id = current_user["sub"]
    org_id = current_user.get("org_id")

    # Check if a config already exists
    query = db.query(WebhookConfig)
    if org_id:
        query = query.filter(WebhookConfig.org_id == org_id)
    else:
        query = query.filter(WebhookConfig.user_id == user_id)
    
    config = query.first()

    if config:
        config.url = request.url
        config.events = request.events
        config.secret = request.secret
        config.is_active = True
    else:
        config = WebhookConfig(
            user_id=user_id,
            org_id=org_id,
            url=request.url,
            events=request.events,
            secret=request.secret
        )
        db.add(config)
    
    db.commit()
    db.refresh(config)

    return {
        "status": "configured",
        "url": config.url,
        "events": config.events,
        "message": "Webhook successfully persisted and active."
    }


@router.post("/test")
async def test_webhook(
    request: WebhookTestRequest,
    current_user: dict = Depends(get_current_user)
):
    """Send a test payload to the configured webhook URL."""
    import requests as http_client
    import datetime

    test_payload = {
        "event": "test.ping",
        "data": {
            "message": "Hello from BrochureGen System Fusion!",
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "user_id": current_user["sub"],
        }
    }

    try:
        response = http_client.post(
            request.url,
            json=test_payload,
            headers={"Content-Type": "application/json", "X-BrochureGen-Event": "test.ping"},
            timeout=10
        )
        return {
            "status": "sent",
            "response_code": response.status_code,
            "payload": test_payload,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook test failed: {str(e)}")


@router.get("/config")
async def get_webhook_config(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get the current webhook configuration."""
    user_id = current_user["sub"]
    org_id = current_user.get("org_id")
    
    query = db.query(WebhookConfig)
    if org_id:
        query = query.filter(WebhookConfig.org_id == org_id)
    else:
        query = query.filter(WebhookConfig.user_id == user_id)
        
    config = query.first()

    if not config:
        return {"status": "not_configured", "message": "No webhook configured yet."}

    return {
        "status": "active" if config.is_active else "inactive",
        "url": config.url,
        "events": config.events,
        "secret": config.secret
    }


@router.delete("/config")
async def delete_webhook_config(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Remove webhook configuration."""
    user_id = current_user["sub"]
    org_id = current_user.get("org_id")

    query = db.query(WebhookConfig)
    if org_id:
        query = query.filter(WebhookConfig.org_id == org_id)
    else:
        query = query.filter(WebhookConfig.user_id == user_id)
    
    config = query.first()
    if config:
        db.delete(config)
        db.commit()
        
    return {"status": "removed"}


async def dispatch_webhook(db: Session, user_id: str, event: str, data: dict):
    """Internal: dispatch a webhook payload for an event."""
    # Note: We need the org_id to find the correct config if applicable
    from models.profile import Profile
    profile = db.query(Profile).filter(Profile.id == user_id).first()
    org_id = profile.org_id if profile else None

    query = db.query(WebhookConfig).filter(WebhookConfig.is_active == True)
    if org_id:
        query = query.filter(WebhookConfig.org_id == org_id)
    else:
        query = query.filter(WebhookConfig.user_id == user_id)
        
    config = query.first()
    if not config:
        return

    if event not in config.events:
        return

    import requests as http_client
    payload = {"event": event, "data": data}

    try:
        # Fire and forget if possible, but requests is synchronous.
        # Real production would use Celery/BackgroundTasks.
        http_client.post(
            config.url,
            json=payload,
            headers={
                "Content-Type": "application/json",
                "X-BrochureGen-Event": event,
            },
            timeout=5
        )
    except Exception:
        pass  # Silently fail for webhooks
