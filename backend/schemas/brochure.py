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
    comments: Optional[list["BrochureComment"]] = []
    variants: Optional[list["BrochureVariant"]] = []

    class Config:
        orm_mode = True
        from_attributes = True

class BrochureCommentBase(BaseModel):
    text: str
    section_id: Optional[str] = None

class BrochureCommentCreate(BrochureCommentBase):
    pass

class BrochureComment(BrochureCommentBase):
    id: int
    brochure_id: int
    is_read: int
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True

class BrochureVariantBase(BaseModel):
    variant_name: str
    content: str

class BrochureVariant(BrochureVariantBase):
    id: int
    brochure_id: int
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True

class PulseResponse(BaseModel):
    unread_comments: int
    unread_leads: int
    total_pulse: int
