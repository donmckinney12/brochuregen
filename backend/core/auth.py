import jwt
from jwt import PyJWKClient
from fastapi import Request, HTTPException
from core.config import settings

# Clerk JWKS URL
CLERK_JWKS_URL = f"{settings.CLERK_FRONTEND_API}/.well-known/jwks.json"
if not CLERK_JWKS_URL.startswith("http"):
    CLERK_JWKS_URL = f"https://{CLERK_JWKS_URL}"

print(f"[Auth] JWKS URL: {CLERK_JWKS_URL}")

# PyJWT's built-in JWKS client handles key fetching and caching
jwks_client = PyJWKClient(CLERK_JWKS_URL)


def verify_token(token: str):
    """Verify a Clerk JWT using PyJWT + JWKS endpoint."""
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={
                "verify_aud": False,
                "verify_iss": False,
            }
        )
        return {"success": True, "payload": payload}
    except jwt.ExpiredSignatureError:
        print("[Auth] Token expired")
        return {"success": False, "error": "Token expired"}
    except jwt.InvalidTokenError as e:
        print(f"[Auth] Invalid token: {e}")
        return {"success": False, "error": f"Invalid token: {e}"}
    except Exception as e:
        print(f"[Auth] Unexpected error: {e}")
        return {"success": False, "error": f"Unexpected error: {e}"}


async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = auth_header.split(" ")[1]
    result = verify_token(token)
    
    if not result["success"]:
        raise HTTPException(status_code=401, detail=f"JWT Error: {result['error']}")

    return result["payload"]
