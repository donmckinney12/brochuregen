"""White-label configuration endpoints for custom branding on shared brochures."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from core.auth import get_current_user

router = APIRouter()

# In-memory config store (production would use DB)
whitelabel_store: dict = {}


class WhiteLabelConfig(BaseModel):
    custom_domain: Optional[str] = None
    brand_name: Optional[str] = None
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    footer_text: Optional[str] = None
    hide_brochuregen_badge: bool = False


@router.post("/config")
async def save_config(
    config: WhiteLabelConfig,
    current_user: dict = Depends(get_current_user)
):
    """Save white-label/custom branding configuration."""
    user_id = current_user["sub"]

    whitelabel_store[user_id] = config.model_dump()

    return {
        "status": "saved",
        "config": whitelabel_store[user_id],
        "message": "White-label config saved. Shared brochures will use this branding."
    }


@router.get("/config")
async def get_config(
    current_user: dict = Depends(get_current_user)
):
    """Get current white-label configuration."""
    user_id = current_user["sub"]
    config = whitelabel_store.get(user_id)

    if not config:
        return {"status": "not_configured", "config": None}

    return {"status": "active", "config": config}


@router.delete("/config")
async def delete_config(
    current_user: dict = Depends(get_current_user)
):
    """Reset white-label configuration to defaults."""
    user_id = current_user["sub"]
    if user_id in whitelabel_store:
        del whitelabel_store[user_id]
    return {"status": "reset", "message": "Branding reset to BrochureGen defaults."}
