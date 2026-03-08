from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base

class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("profiles.id"), nullable=False, index=True)
    org_id = Column(String, ForeignKey("organizations.id"), nullable=True, index=True)
    name = Column(String, nullable=False) # E.g., "Production Webhook", "Zapier Integration"
    key_hash = Column(String, unique=True, nullable=False, index=True) # Hashed key for security
    prefix = Column(String, nullable=False) # First 8 chars for display purposes (e.g., bg_live_1a2b...)
    is_active = Column(Boolean, default=True)
    last_used_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    owner = relationship("Profile")
    organization = relationship("Organization")
