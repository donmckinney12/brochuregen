from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from core.database import Base

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(String, primary_key=True, index=True) # Clerk Org ID
    name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Brand Settings (Shared for Org)
    brand_logo_url = Column(String, nullable=True)
    brand_primary_color = Column(String, nullable=True)
    brand_secondary_color = Column(String, nullable=True)
    brand_voice_tone = Column(String, nullable=True)
    brand_voice_calibration = Column(Text, nullable=True)
    brand_identity_snippet = Column(Text, nullable=True)
    last_intent_scan = Column(DateTime, nullable=True)

    profiles = relationship("Profile", back_populates="organization")
    brochures = relationship("Brochure", back_populates="organization")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String, primary_key=True, index=True) # UUID from Clerk/Supabase Auth
    email = Column(String, unique=True, index=True)
    credits = Column(Integer, default=10)
    refine_credits = Column(Integer, default=5)
    plan = Column(String, default="free")
    full_name = Column(String, nullable=True)
    stripe_customer_id = Column(String, nullable=True)
    org_id = Column(String, ForeignKey("organizations.id"), nullable=True)
    
    organization = relationship("Organization", back_populates="profiles")
    # Brand Vault Fields
    brand_logo_url = Column(String, nullable=True)
    brand_primary_color = Column(String, nullable=True, default="#4F46E5") # Default Indigo
    brand_secondary_color = Column(String, nullable=True, default="#EC4899") # Default Pink
    brand_font = Column(String, nullable=True, default="Outfit")
    brand_voice_tone = Column(String, nullable=True, default="Professional")
    brand_voice_calibration = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    brochures = relationship("Brochure", back_populates="owner")
    activities = relationship("ActivityLog", back_populates="user")

    def __repr__(self):
        return f"<Profile(id={self.id}, email={self.email}, credits={self.credits})>"

class Brochure(Base):
    __tablename__ = "brochures"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("profiles.id"))
    org_id = Column(String, ForeignKey("organizations.id"), nullable=True)
    title = Column(String)
    url = Column(String) # Source URL
    content = Column(String) # AI Generated Content (JSON string)
    share_uuid = Column(String, unique=True, index=True, nullable=True)
    is_campaign = Column(Integer, default=0) # 0 for false, 1 for true
    social_posts = Column(String, nullable=True) # JSON array of posts
    email_sequence = Column(String, nullable=True) # JSON array of emails
    layout_theme = Column(String, default="modern") # e.g. modern, classic, playful
    seo_metadata = Column(Text, nullable=True) # JSON string of meta tags
    status = Column(String, default="active") # active, proactive_draft, archived
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("Profile", back_populates="brochures")
    organization = relationship("Organization", back_populates="brochures")
    views = relationship("BrochureView", back_populates="brochure")

class BrochureView(Base):
    __tablename__ = "brochure_views"

    id = Column(Integer, primary_key=True, index=True)
    brochure_id = Column(Integer, ForeignKey("brochures.id"), index=True)
    variant_id = Column(Integer, ForeignKey("brochure_variants.id"), nullable=True) # Which variant was viewed
    viewer_ip_hash = Column(String, nullable=False)
    user_agent = Column(String, nullable=True)
    viewed_at = Column(DateTime(timezone=True), server_default=func.now())

    brochure = relationship("Brochure", back_populates="views")

class BrochureComment(Base):
    __tablename__ = "brochure_comments"
    id = Column(Integer, primary_key=True, index=True)
    brochure_id = Column(Integer, ForeignKey("brochures.id"))
    text = Column(Text, nullable=False)
    section_id = Column(String, nullable=True) # e.g., 'headline', 'feature_0'
    is_read = Column(Integer, default=0) # 0 for unread, 1 for read
    created_at = Column(DateTime, default=datetime.utcnow)
    
    brochure = relationship("Brochure", back_populates="comments")

# Lead Capture Model
class LeadCapture(Base):
    __tablename__ = "lead_captures"
    id = Column(Integer, primary_key=True, index=True)
    brochure_id = Column(Integer, ForeignKey("brochures.id"))
    email = Column(String, nullable=False)
    name = Column(String, nullable=True)
    company = Column(String, nullable=True)
    message = Column(Text, nullable=True)
    is_read = Column(Integer, default=0) # 0 for unread, 1 for read
    created_at = Column(DateTime, default=datetime.utcnow)
    
    brochure = relationship("Brochure", back_populates="leads")

class BrochureVariant(Base):
    __tablename__ = "brochure_variants"
    id = Column(Integer, primary_key=True, index=True)
    brochure_id = Column(Integer, ForeignKey("brochures.id"))
    variant_name = Column(String) # e.g., 'Variant A', 'Variant B'
    content = Column(String) # JSON string of variant content
    created_at = Column(DateTime, default=datetime.utcnow)
    
    brochure = relationship("Brochure", back_populates="variants")

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("profiles.id"))
    org_id = Column(String, ForeignKey("organizations.id"), nullable=True)
    action = Column(String) # e.g., 'GENERATED', 'REFINED', 'EXPORTED', 'CALIBRATED'
    details = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("Profile", back_populates="activities")
    organization = relationship("Organization")

class BrochureEngagement(Base):
    __tablename__ = "brochure_engagements"
    id = Column(Integer, primary_key=True, index=True)
    brochure_id = Column(Integer, ForeignKey("brochures.id"), index=True)
    section_id = Column(String, nullable=False) # e.g., 'headline', 'features', 'summary'
    hover_count = Column(Integer, default=0)
    total_hover_time = Column(Integer, default=0) # In milliseconds
    last_interaction = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    brochure = relationship("Brochure", back_populates="engagements")

# Append relationships after classes are defined
Brochure.comments = relationship("BrochureComment", back_populates="brochure", cascade="all, delete-orphan")
Brochure.leads = relationship("LeadCapture", back_populates="brochure", cascade="all, delete-orphan")
Brochure.variants = relationship("BrochureVariant", back_populates="brochure", cascade="all, delete-orphan")
Brochure.engagements = relationship("BrochureEngagement", back_populates="brochure", cascade="all, delete-orphan")
