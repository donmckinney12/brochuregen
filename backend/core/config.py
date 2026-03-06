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
    PRICE_PRO_MONTHLY: Optional[str] = os.getenv("PRICE_PRO_MONTHLY", "").strip()
    
    # Clerk
    CLERK_FRONTEND_API: Optional[str] = os.getenv("CLERK_FRONTEND_API", "").strip()
    CLERK_SECRET_KEY: Optional[str] = os.getenv("CLERK_SECRET_KEY", "").strip()
    
    class Config:
        case_sensitive = True

settings = Settings()
