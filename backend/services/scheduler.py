import asyncio
from core.database import SessionLocal
from services.db_orm import get_profile, update_profile
from models.profile import Profile
from sqlalchemy import select

rollover_limits = {
    "starter": 15,
    "pro": 30,
    "agency": 999999
}

plan_limits = {
    "free": 1,
    "starter": 5,
    "pro": 25,
    "agency": 999999
}

def reset_credits():
    """
    Resets user credits based on their plan and rollover limits using SQLAlchemy.
    Intended to run on the 1st of every month.
    """
    print("Starting Monthly Credit Reset (SQLAlchemy)...")
    db = SessionLocal()
    updated_count = 0
    
    try:
        # Fetch all profiles
        profiles = db.execute(select(Profile)).scalars().all()
        
        for profile in profiles:
            plan = profile.plan or 'free'
            current_credits = profile.credits or 0
            
            # Calculate Rollover
            limit = rollover_limits.get(plan, 0)
            rollover_amount = min(current_credits, limit)
            
            # Calculate New Balance
            base_credits = plan_limits.get(plan, 1)
            new_balance = base_credits + rollover_amount
            
            # Update User
            profile.credits = new_balance
            updated_count += 1
            print(f"Updated user {profile.id}: {current_credits} -> {new_balance}")
        
        db.commit()
        print(f"Credit Reset Complete. Updated {updated_count} users.")
        return {"status": "success", "updated_users": updated_count}
        
    except Exception as e:
        db.rollback()
        print(f"Error during credit reset: {e}")
        return {"status": "error", "message": str(e)}
    finally:
        db.close()
