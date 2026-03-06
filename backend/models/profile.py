from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String, primary_key=True, index=True) # UUID from Clerk/Supabase Auth
    email = Column(String, unique=True, index=True)
    credits = Column(Integer, default=10)
    refine_credits = Column(Integer, default=5)
    plan = Column(String, default="free")
    full_name = Column(String, nullable=True)
    stripe_customer_id = Column(String, nullable=True)
    
    # Brand Vault Fields
    brand_logo_url = Column(String, nullable=True)
    brand_primary_color = Column(String, nullable=True, default="#4F46E5") # Default Indigo
    brand_secondary_color = Column(String, nullable=True, default="#EC4899") # Default Pink
    brand_font = Column(String, nullable=True, default="Outfit")
    brand_voice_tone = Column(String, nullable=True, default="Professional")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    brochures = relationship("Brochure", back_populates="owner")

    def __repr__(self):
        return f"<Profile(id={self.id}, email={self.email}, credits={self.credits})>"

class Brochure(Base):
    __tablename__ = "brochures"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("profiles.id"))
    title = Column(String)
    url = Column(String) # Source URL
    content = Column(String) # AI Generated Content (JSON string)
    share_uuid = Column(String, unique=True, index=True, nullable=True)
    is_campaign = Column(Integer, default=0) # 0 for false, 1 for true
    social_posts = Column(String, nullable=True) # JSON array of posts
    email_sequence = Column(String, nullable=True) # JSON array of emails
    layout_theme = Column(String, default="modern") # e.g. modern, classic, playful
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("Profile", back_populates="brochures")
    views = relationship("BrochureView", back_populates="brochure")

class BrochureView(Base):
    __tablename__ = "brochure_views"

    id = Column(Integer, primary_key=True, index=True)
    brochure_id = Column(Integer, ForeignKey("brochures.id"), index=True)
    viewer_ip_hash = Column(String, nullable=False)
    user_agent = Column(String, nullable=True)
    viewed_at = Column(DateTime(timezone=True), server_default=func.now())

    brochure = relationship("Brochure", back_populates="views")
