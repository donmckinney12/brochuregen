from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BrochureBase(BaseModel):
    title: str
    url: str
    content: str
    layout_theme: Optional[str] = "modern"

class BrochureCreate(BrochureBase):
    user_id: str

class Brochure(BrochureBase):
    id: int
    share_uuid: Optional[str] = None
    is_campaign: int = 0
    social_posts: Optional[str] = None
    email_sequence: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True
