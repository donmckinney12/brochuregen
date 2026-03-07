from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from api.api_v1.api import api_router
import sys
import asyncio
import time

app = FastAPI(title=settings.PROJECT_NAME)

# Configure CORS
origins = [
    settings.CLIENT_URL,
    "http://localhost:3000",
    "https://brochuregen.netlify.app", # Add production if known/needed
    "https://brochuregen.com",
    "https://www.brochuregen.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in origins if o],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Advance Brochure Generator API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.on_event("startup")
async def startup_event():
    print(f"{settings.PROJECT_NAME} Starting...")
    db_host = settings.DATABASE_URL.split('@')[-1] if settings.DATABASE_URL else "None"
    print(f"🗄️ Database Host: {db_host}")
    if settings.PRICE_PRO_MONTHLY:
        print("✅ Stripe Price IDs loaded")
    else:
        print("❌ Stripe Price IDs missing in environment")
