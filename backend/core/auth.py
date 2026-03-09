import jwt
from jwt import PyJWKClient
from fastapi import Request, HTTPException
from core.config import settings

# Clerk JWKS URL
CLERK_JWKS_URL = f"{settings.CLERK_FRONTEND_API}/.well-known/jwks.json"
if not CLERK_JWKS_URL.startswith("http"):
    CLERK_JWKS_URL = f"https://{CLERK_JWKS_URL}"

def log_auth(msg: str):
    # Print to console for production logging (Fly.io/Uvicorn capture)
    print(f"[Auth Sentinel] {msg}")

log_auth(f"JWKS initialized: {CLERK_JWKS_URL}")

# PyJWT's built-in JWKS client handles key fetching and caching
jwks_client = PyJWKClient(CLERK_JWKS_URL)


def verify_token(token: str):
    """Verify a Clerk JWT using PyJWT + JWKS endpoint."""
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        # For diagnostics: peek at payload without verification first to see timestamps
        unverified = jwt.decode(token, options={"verify_signature": False})
        iat = unverified.get("iat")
        exp = unverified.get("exp")
        import time
        now = int(time.time())
        
        log_auth(f"[Auth] Token iat: {iat}, exp: {exp}, current_time: {now}, delta_to_exp: {exp - now if exp else 'N/A'}")

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={
                "verify_aud": False,
                "verify_iss": False,
            },
            leeway=300 # Increased from 60 to 300 (5 mins) to handle server/client clock drift
        )
        return {"success": True, "payload": payload}
    except jwt.ExpiredSignatureError:
        # Re-fetch timestamps for error log if not already done
        log_auth("[Auth] Token expired definitively (even after 300s leeway)")
        return {"success": False, "error": "Token expired"}
    except jwt.InvalidTokenError as e:
        log_auth(f"[Auth] Invalid token: {e}")
        return {"success": False, "error": f"Invalid token: {e}"}
    except Exception as e:
        log_auth(f"[Auth] Unexpected error: {e}")
        return {"success": False, "error": f"Unexpected error: {e}"}


async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        log_auth(f"[Auth] Missing or invalid header: {auth_header}")
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = auth_header.split(" ")[1]
    log_auth(f"[Auth] Received token length: {len(token)}, start: {token[:15] if token else 'None'}")
    
    if token == "null" or not token:
        log_auth("[Auth] Token is 'null' or empty")
        raise HTTPException(status_code=401, detail="JWT Error: Provided token is 'null' or empty")

    result = verify_token(token)
    
    if not result["success"]:
        log_auth(f"[Auth] Sync failed: {result['error']}")
        raise HTTPException(status_code=401, detail=f"JWT Error: {result['error']}")

    return result["payload"]
