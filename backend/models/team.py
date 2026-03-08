from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from core.database import Base

class TeamInvite(Base):
    __tablename__ = "team_invites"

    id = Column(Integer, primary_key=True, index=True)
    org_id = Column(String, ForeignKey("organizations.id"), index=True)
    inviter_id = Column(String, ForeignKey("profiles.id"))
    email = Column(String, nullable=False)
    role = Column(String, default="editor") # owner, editor, viewer
    status = Column(String, default="pending") # pending, accepted, expired
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)
