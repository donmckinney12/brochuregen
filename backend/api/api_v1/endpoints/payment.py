from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from services.payment import create_checkout_session, create_portal_session
from services.db_orm import add_credits_orm, update_profile_plan
from models.profile import Profile
from core.database import get_db
from sqlalchemy.orm import Session
from core.config import settings
import stripe

from core.auth import get_current_user

router = APIRouter()

class CheckoutRequest(BaseModel):
    user_id: str
    email: str
    plan: str = "professional"
    billing_cycle: str = "monthly"

@router.post("/create-checkout-session")
async def create_checkout(request: CheckoutRequest, current_user: dict = Depends(get_current_user)):
    try:
        print(f"create_checkout hit for user: {request.user_id}")
        return create_checkout_session(request.user_id, request.email, request.plan, request.billing_cycle)
    except Exception as e:
        print(f"UNHANDLED ERROR in create_checkout: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.post("/create-portal-session")
async def create_portal(user_id: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    try:
        from services.db_orm import get_profile
        profile = get_profile(db, user_id)
        if not profile or not profile.stripe_customer_id:
            raise HTTPException(status_code=400, detail="No active subscription found. Upgrade your plan first.")
            
        print(f"create_portal hit for user: {user_id} with customer: {profile.stripe_customer_id}")
        return create_portal_session(profile.stripe_customer_id)
    except Exception as e:
        print(f"UNHANDLED ERROR in create_portal: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    webhook_secret = settings.STRIPE_WEBHOOK_SECRET
    
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
        user_id = session.get('client_reference_id')
        customer_id = session.get('customer')
        plan = session.get('metadata', {}).get('plan', 'pro')
        
        if user_id:
             print(f"Payment successful for user {user_id}")
             
             # v8.0 Credit Synthesis Mapping
             plan_credits = {
                 "starter": 15,
                 "professional": 60,
                 "pro": 60,
                 "enterprise": 250,
                 "ultimate": 9999
             }
             amount = plan_credits.get(plan.lower(), 15) # default to starter v8
             
             # Add credits
             add_credits_orm(db, user_id, amount)
             # Update plan and customer_id
             update_profile_plan(db, user_id, plan, customer_id)
             
    return {"status": "success"}
