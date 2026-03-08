from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import secrets
import hashlib
from core.database import get_db
from core.auth import get_current_user
from models.api_key import APIKey
from schemas.api_key import APIKeyCreate, APIKeyResponse, APIKeySecretResponse

router = APIRouter()

def hash_key(key: str) -> str:
    return hashlib.sha256(key.encode()).hexdigest()

@router.get("/", response_model=List[APIKeyResponse])
def list_api_keys(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    org_id = current_user.get("org_id")
    
    query = db.query(APIKey).filter(APIKey.is_active == True)
    if org_id:
        query = query.filter(APIKey.org_id == org_id)
    else:
        query = query.filter(APIKey.user_id == user_id)
        
    return query.all()

@router.post("/", response_model=APIKeySecretResponse)
def create_api_key(key_in: APIKeyCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    org_id = current_user.get("org_id")
    
    # Check limit (e.g., max 5 keys)
    query = db.query(APIKey).filter(APIKey.is_active == True)
    if org_id:
        query = query.filter(APIKey.org_id == org_id)
    else:
        query = query.filter(APIKey.user_id == user_id)
        
    if query.count() >= 5:
        raise HTTPException(status_code=400, detail="Maximum of 5 active API keys allowed.")
        
    # Generate key
    raw_secret = f"bg_live_{secrets.token_urlsafe(32)}"
    hashed_secret = hash_key(raw_secret)
    prefix = raw_secret[:12]
    
    db_key = APIKey(
        name=key_in.name,
        user_id=user_id,
        org_id=org_id,
        key_hash=hashed_secret,
        prefix=prefix
    )
    db.add(db_key)
    db.commit()
    db.refresh(db_key)
    
    # Convert to dict to include the secret which is only shown once
    resp = APIKeySecretResponse.from_orm(db_key)
    resp.secret = raw_secret
    return resp

@router.delete("/{key_id}")
def revoke_api_key(key_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    org_id = current_user.get("org_id")
    
    query = db.query(APIKey).filter(APIKey.id == key_id)
    if org_id:
        query = query.filter(APIKey.org_id == org_id)
    else:
        query = query.filter(APIKey.user_id == user_id)
        
    db_key = query.first()
    if not db_key:
        raise HTTPException(status_code=404, detail="API Key not found or access denied")
        
    db_key.is_active = False
    db.commit()
    return {"status": "success"}
