from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Brochure Generator API"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL", "").strip()
    
    # OpenAI
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", "").strip()
    
    # Stripe
    STRIPE_SECRET_KEY: Optional[str] = os.getenv("STRIPE_SECRET_KEY", "").strip()
    STRIPE_WEBHOOK_SECRET: Optional[str] = os.getenv("STRIPE_WEBHOOK_SECRET", "").strip()
    
    # Stripe Prices
    PRICE_STARTER_MONTHLY: Optional[str] = os.getenv("PRICE_STARTER_MONTHLY", "").strip()
    PRICE_STARTER_YEARLY: Optional[str] = os.getenv("PRICE_STARTER_YEARLY", "").strip()
    PRICE_PRO_MONTHLY: Optional[str] = os.getenv("PRICE_PRO_MONTHLY", "").strip()
    PRICE_PRO_YEARLY: Optional[str] = os.getenv("PRICE_PRO_YEARLY", "").strip()
    PRICE_AGENCY_MONTHLY: Optional[str] = os.getenv("PRICE_AGENCY_MONTHLY", "").strip()
    PRICE_AGENCY_YEARLY: Optional[str] = os.getenv("PRICE_AGENCY_YEARLY", "").strip()
    PRICE_ENTERPRISE_MONTHLY: Optional[str] = os.getenv("PRICE_ENTERPRISE_MONTHLY", "").strip()
    PRICE_ENTERPRISE_YEARLY: Optional[str] = os.getenv("PRICE_ENTERPRISE_YEARLY", "").strip()
    
    # Clerk
    CLERK_FRONTEND_API: Optional[str] = os.getenv("CLERK_FRONTEND_API", "").strip()
    CLERK_SECRET_KEY: Optional[str] = os.getenv("CLERK_SECRET_KEY", "").strip()
    
    class Config:
        case_sensitive = True

settings = Settings()
