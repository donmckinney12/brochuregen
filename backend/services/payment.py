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
        error_msg = f"Price ID not found for {plan} ({billing_cycle}). Checked env: {env_var_name}"
        print(f"❌ {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)

    print(f"✅ Creating checkout session for {email} with price_id: {price_id}")

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
        print(f"🚀 Stripe Session URL: {checkout_session.url}")
        return {"url": checkout_session.url}
    except Exception as e:
        print(f"Stripe Error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

def create_portal_session(user_id: str):
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe API key not configured")
    
    try:
        # Crucial: This requires us to have at least one checkout completed by this user 
        # OR we need to find the customer id by email.
        # For a professional SaaS, we should store stripe_customer_id in our DB profiles.
        # For now, we'll try to find customer by user_id metadata if possible, 
        # but the most robust way is searching by email.
        
        # Search for customer by metadata user_id
        customers = stripe.Customer.list(limit=1) # Simplified for now, searching by email is safer
        # Filter logic here usually involves DB lookup
        # Since we don't have stripe_customer_id in models.profile yet, let's assume 
        # the user exists in Stripe. 
        
        # Better: create a session based on the customer who just checked out.
        # REALISTIC: We need the customer ID. I'll mock finding it for now OR 
        # recommend adding stripe_customer_id to the Profile model.
        
        # Let's assume the user has a customer account if they are on a plan
        # We search by user_id in metadata
        search = stripe.Customer.search(query=f"metadata['user_id']:'{user_id}'")
        if not search.data:
            raise HTTPException(status_code=404, detail="Stripe customer not found for this user")
        
        customer_id = search.data[0].id
        
        portal_session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=f"{CLIENT_URL}/dashboard",
        )
        return {"url": portal_session.url}
    except Exception as e:
        print(f"Stripe Portal Error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
