import os
import asyncio
from postgrest import SyncRequestBuilder

# Use Postgrest Client directly to avoid full Supabase dependency issues on Windows
# Since we just need DB access, this is sufficient.

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
    Resets user credits based on their plan and rollover limits.
    Intended to run on the 1st of every month.
    """
    url: str = os.environ.get("SUPABASE_URL", "")
    key: str = os.environ.get("SUPABASE_KEY", "")
    
    if not url or not key:
        print("Supabase credentials missing.")
        return {"status": "error", "message": "Supabase credentials missing"}

    # Construct Postgrest URL (Supabase URL + /rest/v1)
    # If the user provides the base supabase URL, append /rest/v1
    if not url.endswith("/rest/v1"):
        postgrest_url = f"{url}/rest/v1"
    else:
        postgrest_url = url

    print("Starting Monthly Credit Reset...")
    
    try:
        # Headers for authentication
        headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json"
        }
        
        # Initialize SyncRequestBuilder (from postgrest-py)
        # Note: 'postgrest-py' usage is slightly different than 'supabase-py'
        # We need to manually construct requests.
        # But wait, SyncRequestBuilder is a builder properly.
        # Let's use a simpler approach for stability: standard requests if complex client fails,
        # but let's try to adapt the logic first.
        
        # Actually, let's use 'postgrest' package client if possible, but the docs are scarce here.
        # Safest bet on Windows without complex deps is to use 'requests' directly for REST API.
        # It's robust and zero-dependency (other than requests).
        
        import requests
        
        # 1. Fetch all users
        response = requests.get(
            f"{postgrest_url}/profiles?select=*",
            headers=headers
        )
        
        if response.status_code != 200:
            raise Exception(f"Failed to fetch users: {response.text}")
            
        users = response.json()
        
    except Exception as e:
        print(f"Error fetching users: {e}")
        return {"status": "error", "message": str(e)}

    updated_count = 0
    
    for user in users:
        plan = user.get('plan', 'free')
        current_credits = user.get('credits', 0)
        user_id = user.get('id')
        
        if not user_id:
            continue
        
        # Calculate Rollover
        limit = rollover_limits.get(plan, 0)
        rollover_amount = min(current_credits, limit)
        
        # Calculate New Balance
        base_credits = plan_limits.get(plan, 1)
        new_balance = base_credits + rollover_amount
        
        # Update User
        try:
            update_response = requests.patch(
                f"{postgrest_url}/profiles?id=eq.{user_id}",
                headers=headers,
                json={'credits': new_balance}
            )
            
            if update_response.status_code in [200, 204]:
                updated_count += 1
                print(f"Updated user {user_id}: {current_credits} -> {new_balance}")
            else:
                print(f"Failed to update user {user_id}: {update_response.text}")
                
        except Exception as e:
            print(f"Exception updating user {user['id']}: {e}")

    print(f"Credit Reset Complete. Updated {updated_count} users.")
    return {"status": "success", "updated_users": updated_count}
