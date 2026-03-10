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
# Note: allow_origins=["*"] is not allowed when allow_credentials=True
# We use settings.CLIENT_URL and specific production domains as base.
base_origins = [
    settings.CLIENT_URL,
    "http://localhost:3000",
    "https://brochuregen.netlify.app",
    "https://brochuregen.com",
    "https://www.brochuregen.com",
]

# Filtering out empty origins and normalizing
allowed_origins = [o.rstrip("/") for o in base_origins if o]
print(f"CORS Authorized Origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*brochuregen\.netlify\.app", # Resilient Netlify subdomain support
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Diagnostic Middleware: Log Origin for production debugging
@app.middleware("http")
async def log_origin(request: Request, call_next):
    origin = request.headers.get("origin")
    if origin:
        import re
        is_netlify_subdomain = bool(re.match(r"https://.*brochuregen\.netlify\.app", origin))
        if origin not in allowed_origins and not is_netlify_subdomain:
             print(f"⚠️ [CORS ALERT] Blocked request from unauthorized origin: {origin}")
        else:
             # Helpful for confirming it IS authorized
             print(f"✅ [CORS DEBUG] Authorized origin: {origin}")
    return await call_next(request)


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
    # --- DB Schema Auto-Fix ---
    try:
        from fix_prod_db import fix_db
        fix_db()
        print("✅ Production DB Schema Sync complete")
    except Exception as e:
        print(f"❌ DB Schema Sync failed: {e}")

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

