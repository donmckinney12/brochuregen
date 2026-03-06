from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ProfileBase(BaseModel):
    email: Optional[EmailStr] = None
    credits: Optional[int] = 10
    refine_credits: Optional[int] = 5
    plan: Optional[str] = "free"
    full_name: Optional[str] = None
    
    # Brand Vault Fields
    brand_logo_url: Optional[str] = None
    brand_primary_color: Optional[str] = "#4F46E5"
    brand_secondary_color: Optional[str] = "#EC4899"
    brand_font: Optional[str] = "Outfit"
    brand_voice_tone: Optional[str] = "Professional"

class ProfileCreate(ProfileBase):
    id: str # UUID from Auth provider

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    brand_logo_url: Optional[str] = None
    brand_primary_color: Optional[str] = None
    brand_secondary_color: Optional[str] = None
    brand_font: Optional[str] = None
    brand_voice_tone: Optional[str] = None

class Profile(ProfileBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
        from_attributes = True
