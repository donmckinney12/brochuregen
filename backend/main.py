from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Robust .env loading
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, ".env")
load_dotenv(env_path)

if os.path.exists(env_path):
    print(f"Loading .env from: {env_path}")
else:
    print(f"⚠️ .env NOT found at: {env_path}")

from pydantic import BaseModel
from services.scraper import scrape_website
from services.ai_service import AIService
import sys
import asyncio

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

app = FastAPI(title="Brochure Generator API")
ai_service = AIService()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScrapeRequest(BaseModel):
    url: str

@app.post("/api/scrape")
async def scrape_url(request: ScrapeRequest):
    result = await scrape_website(request.url)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
        
    # Generate AI content
    ai_content = await ai_service.generate_brochure_content(result.get("text", ""), request.url)
    result["ai_content"] = ai_content
    
    return result

@app.get("/")
def read_root():
    return {"message": "Welcome to the Sticker/Brochure Generator API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

from services.pdf_service import generate_brochure_pdf
from fastapi.responses import StreamingResponse
from services.db import deduct_credits_server
import io

@app.post("/api/generate-pdf")
async def generate_pdf(request: dict):
    # Check if user_id is provided for credit deduction
    user_id = request.get("user_id")
    if user_id:
        result = deduct_credits_server(user_id)
        if not result["success"]:
            raise HTTPException(status_code=402, detail=result["error"])

    pdf_bytes = await generate_brochure_pdf(request)
    return StreamingResponse(
        io.BytesIO(pdf_bytes), 
        media_type="application/pdf", 
        headers={"Content-Disposition": "attachment; filename=brochure.pdf"}
    )

# --- Stripe Integration ---
import os
from fastapi import Request
from services.payment import create_checkout_session

class CheckoutRequest(BaseModel):
    user_id: str
    email: str
    plan: str = "professional"
    billing_cycle: str = "monthly"

@app.on_event("startup")
async def startup_event():
    print("BrochureGen API Starting...")
    # Check for specific price keys to confirm .env loaded correctly
    if os.environ.get("PRICE_PRO_MONTHLY"):
        print("✅ PRICE_PRO_MONTHLY found")
    elif os.environ.get("STRIPE_PRICE_ID"):
        print("✅ STRIPE_PRICE_ID found (Fallback)")
    else:
        print("❌ No Price IDs found in .env")

@app.post("/api/create-checkout-session")
async def create_checkout(request: CheckoutRequest):
    return create_checkout_session(request.user_id, request.email, request.plan, request.billing_cycle)

@app.post("/api/webhook")
async def stripe_webhook(request: Request):
    import stripe
    from services.db import add_credits_server
    
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    webhook_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        # Fulfill the purchase...
        user_id = session.get('client_reference_id')
        if user_id:
             print(f"Payment successful for user {user_id}")
             # Add 1000 credits for Pro plan
             add_credits_server(user_id, 1000)
             
    return {"status": "success"}
