"""Webhook endpoints for external integrations (Zapier, CRMs, custom)."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from core.database import get_db
from core.auth import get_current_user
import json

router = APIRouter()

# In-memory webhook registry (production would use DB)
webhook_registry: dict = {}


class WebhookConfigRequest(BaseModel):
    url: str
    events: list[str] = ["lead.created", "brochure.generated"]
    secret: Optional[str] = None


class WebhookTestRequest(BaseModel):
    url: str


@router.post("/configure")
async def configure_webhook(
    request: WebhookConfigRequest,
    current_user: dict = Depends(get_current_user)
):
    """Register a webhook URL to receive event notifications."""
    user_id = current_user["sub"]

    webhook_registry[user_id] = {
        "url": request.url,
        "events": request.events,
        "secret": request.secret,
        "active": True,
    }

    return {
        "status": "configured",
        "url": request.url,
        "events": request.events,
        "message": "Webhook will receive POST payloads for the specified events."
    }


@router.post("/test")
async def test_webhook(
    request: WebhookTestRequest,
    current_user: dict = Depends(get_current_user)
):
    """Send a test payload to the configured webhook URL."""
    import requests as http_client

    test_payload = {
        "event": "test.ping",
        "data": {
            "message": "Hello from BrochureGen!",
            "timestamp": __import__("datetime").datetime.utcnow().isoformat(),
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
    current_user: dict = Depends(get_current_user)
):
    """Get the current webhook configuration."""
    user_id = current_user["sub"]
    config = webhook_registry.get(user_id)

    if not config:
        return {"status": "not_configured", "message": "No webhook configured yet."}

    return {"status": "active", **config}


@router.delete("/config")
async def delete_webhook_config(
    current_user: dict = Depends(get_current_user)
):
    """Remove webhook configuration."""
    user_id = current_user["sub"]
    if user_id in webhook_registry:
        del webhook_registry[user_id]
    return {"status": "removed"}


async def dispatch_webhook(user_id: str, event: str, data: dict):
    """Internal: dispatch a webhook payload for an event."""
    config = webhook_registry.get(user_id)
    if not config or not config["active"]:
        return

    if event not in config["events"]:
        return

    import requests as http_client
    payload = {"event": event, "data": data}

    try:
        http_client.post(
            config["url"],
            json=payload,
            headers={
                "Content-Type": "application/json",
                "X-BrochureGen-Event": event,
            },
            timeout=5
        )
    except Exception:
        pass  # Silently fail for webhooks
