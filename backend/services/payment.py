import stripe
import os
from fastapi import HTTPException

# Configure Stripe
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

CLIENT_URL = os.environ.get("CLIENT_URL", "http://localhost:3000")

def create_checkout_session(user_id: str, email: str, plan: str = "professional", billing_cycle: str = "monthly"):
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe API key not configured")
    
    # Map plan names to environment variables
    # Format: PRICE_{PLAN}_{CYCLE} (e.g. PRICE_STARTER_MONTHLY)
    # Handle aliases
    plan_key = plan.upper()
    if plan_key == "PROFESSIONAL":
        plan_key = "PRO"
        
    env_var_name = f"PRICE_{plan_key}_{billing_cycle.upper()}"
    price_id = os.environ.get(env_var_name)
    
    # Fallback/Debug
    if not price_id:
        # Try generic if specific not found
        price_id = os.environ.get("STRIPE_PRICE_ID")
        
    if not price_id:
        # Check if we are in local dev and provide a dummy if so
        if os.environ.get("DEBUG") == "True" or os.environ.get("CLIENT_URL", "").startswith("http://localhost"):
            print("WARNING: Using dummy Stripe Price ID for local development")
            price_id = "price_dummy_12345"
        else:
            error_msg = f"Stripe Price ID not found for {plan} ({billing_cycle}). Please configure {env_var_name} in .env"
            print(f"ERROR: {error_msg}")
            raise HTTPException(status_code=500, detail=error_msg)

    print(f"Creating checkout session for {email} with price_id: {price_id}")

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price': price_id,
                    'quantity': 1,
                },
            ],
            mode='subscription',
            success_url=f'{CLIENT_URL}/dashboard?payment=success&plan={plan}',
            cancel_url=f'{CLIENT_URL}/dashboard?payment=cancelled',
            customer_email=email,
            client_reference_id=user_id,
            metadata={
                'user_id': user_id,
                'plan': plan,
                'billing_cycle': billing_cycle
            }
        )
        print(f"Stripe Session URL: {checkout_session.url}")
        return {"url": checkout_session.url}
    except Exception as e:
        print(f"Stripe Error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

def create_portal_session(customer_id: str):
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe API key not configured")
    
    try:
        portal_session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=f"{CLIENT_URL}/dashboard",
        )
        return {"url": portal_session.url}
    except Exception as e:
        print(f"Stripe Portal Error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
