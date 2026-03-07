from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ActivityLogBase(BaseModel):
    action: str
    details: Optional[str] = None

class ActivityLogCreate(ActivityLogBase):
    user_id: str
    org_id: Optional[str] = None

class ActivityLog(ActivityLogBase):
    id: int
    user_id: str
    org_id: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True
