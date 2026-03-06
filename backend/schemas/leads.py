from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class LeadCaptureBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    company: Optional[str] = None
    message: Optional[str] = None

class LeadCaptureCreate(LeadCaptureBase):
    brochure_id: int

class LeadCapture(LeadCaptureBase):
    id: int
    brochure_id: int
    created_at: datetime

    class Config:
        from_attributes = True
