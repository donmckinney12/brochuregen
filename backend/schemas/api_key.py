from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class APIKeyBase(BaseModel):
    name: str

class APIKeyCreate(APIKeyBase):
    pass

class APIKeyResponse(APIKeyBase):
    id: int
    prefix: str
    is_active: bool
    last_used_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True

class APIKeySecretResponse(APIKeyResponse):
    secret: str # ONLY returned ONCE during creation
