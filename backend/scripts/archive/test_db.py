
from services.db import get_user_profile, deduct_credits_server, engine
from sqlalchemy import text

if __name__ == "__main__":
    print("Testing DB Logic...")
    if not engine:
        print("No DB connection.")
        exit()
        
    try:
        with engine.connect() as conn:
            # Check what tables exist
            print("Listing tables in public schema:")
            result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
            for row in result:
                print(f" - {row[0]}")

            # Find a user
            print("Querying public.profiles...")
            result = conn.execute(text("SELECT * FROM public.profiles LIMIT 1"))
            user = result.mappings().first()
            
            if not user:
                print("No users found. Creating test user...")
                conn.execute(text(
                    "INSERT INTO public.profiles (id, email, credits, refine_credits) VALUES (:uid, :email, 10, 5)"
                ), {"uid": "550e8400-e29b-41d4-a716-446655440000", "email": "testuser@example.com"})
                conn.commit()
                # Fetch again
                result = conn.execute(text("SELECT * FROM public.profiles WHERE email = 'testuser@example.com'"))
                user = result.mappings().first()
            else:
                uid = user['id']
                credits = user['credits']
                print(f"Found user {uid} with {credits} credits.")
                
                # Test deduction (dry run or real?)
                # Real test: Attempt to deduct 0 to verify read, or 1 if plenty.
                # Let's deduct 0 just to test the function flow without changing state too much,
                # actually 0 might be optimized out or invalid? 
                # Let's deduct 1 and give it back?
                # Or just deduct 1.
                
                print("Attempting to deduct 1 credit...")
                res = deduct_credits_server(uid, 1)
                if res['success']:
                    print(f"Success! New balance: {res['new_balance']}")
                    # Optional: Refund
                    # deduct_credits_server(uid, -1) 
                    # print("Refunded.")
                else:
                    print(f"Failed: {res['error']}")
                    
    except Exception as e:
        print(f"Test failed: {e}")
