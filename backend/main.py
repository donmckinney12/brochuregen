from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from core.config import settings
from api.api_v1.api import api_router
import sys
import asyncio
import time

# --- Rate Limiting Setup ---
try:
    from slowapi import Limiter, _rate_limit_exceeded_handler
    from slowapi.util import get_remote_address
    from slowapi.errors import RateLimitExceeded

    limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])
    HAS_SLOWAPI = True
except ImportError:
    limiter = None
    HAS_SLOWAPI = False
    print("slowapi not installed - rate limiting disabled. Run: pip install slowapi")

app = FastAPI(title=settings.PROJECT_NAME)

if HAS_SLOWAPI and limiter:
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
origins = [
    settings.CLIENT_URL,
    "http://localhost:3000",
    "https://brochuregen.netlify.app",
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


# --- Secure Headers Middleware ---
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    start_time = time.time()
    response: Response = await call_next(request)

    # Security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

    # Request timing
    response.headers["X-Process-Time"] = str(round(time.time() - start_time, 4))

    return response


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
    print(f"Database Host: {db_host}")
    if settings.PRICE_PRO_MONTHLY:
        print("Stripe Price IDs loaded")
    else:
        print("Stripe Price IDs missing in environment")
    if HAS_SLOWAPI:
        print("Rate limiter active (60/min)")
    print("Security headers enabled")

