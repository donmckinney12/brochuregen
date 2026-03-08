import httpx
from jose import jwt
from fastapi import Request, HTTPException, Depends
from core.config import settings
from typing import Optional

# Clerk JWKS URL
CLERK_JWKS_URL = f"{settings.CLERK_FRONTEND_API}/.well-known/jwks.json"
if not CLERK_JWKS_URL.startswith("http"):
    CLERK_JWKS_URL = f"https://{CLERK_JWKS_URL}"

class ClerkAuth:
    def __init__(self):
        self.jwks = None

    async def get_jwks(self):
        if not self.jwks:
            print(f"Fetching JWKS from: {CLERK_JWKS_URL}")
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(CLERK_JWKS_URL)
                if response.status_code != 200:
                    print(f"Failed to fetch JWKS: {response.status_code}")
                    raise HTTPException(status_code=500, detail="Failed to fetch auth keys")
                self.jwks = response.json()
                print("JWKS fetched successfully")
        return self.jwks

    async def verify_token(self, token: str):
        jwks = await self.get_jwks()
        try:
            # In a real app, you'd find the correct key in JWKS
            # For simplicity, we'll use the first key or use a library that handles this
            # Here we just decode with verification
            payload = jwt.decode(
                token,
                jwks,
                algorithms=["RS256"],
                audience=None, # Clerk tokens don't always have audience by default
            )
            return payload
        except Exception as e:
            print(f"Token verification failed: {e}")
            return None

clerk_auth = ClerkAuth()

async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        print("Missing or invalid Authorization header")
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    token = auth_header.split(" ")[1]
    print(f"Verifying token (prefix: {token[:10]}...)")
    payload = await clerk_auth.verify_token(token)
    if not payload:
        print("Token verification returned None")
        raise HTTPException(status_code=401, detail="Invalid token")
    
    print(f"User verified: {payload.get('sub')}")
    if payload.get("org_id"):
        print(f"Active Organization: {payload.get('org_id')}")
        
    return payload
