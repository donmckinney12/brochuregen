from sqlalchemy import Column, String, Integer, DateTime, Boolean, JSON, ForeignKey
from sqlalchemy.sql import func
from core.database import Base

class WebhookConfig(Base):
    __tablename__ = "webhook_configs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("profiles.id"), index=True, nullable=True)
    org_id = Column(String, ForeignKey("organizations.id"), index=True, nullable=True)
    url = Column(String, nullable=False)
    events = Column(JSON, nullable=False, default=["lead.created", "brochure.generated"])
    secret = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
