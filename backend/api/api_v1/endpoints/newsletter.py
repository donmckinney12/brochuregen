from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from core.database import get_db

router = APIRouter()

class NewsletterSubscription(BaseModel):
    email: EmailStr

@router.post("/subscribe")
async def subscribe_newsletter(sub: NewsletterSubscription, db: Session = Depends(get_db)):
    # Simulate saving to a mailing list
    print(f"--- NEURAL LINK ESTABLISHED ---")
    print(f"SUBSCRIBER_NODE: {sub.email}")
    print(f"LINK_STATUS: ACTIVE")
    print(f"--------------------------------")
    return {"status": "success", "message": "Neural Link Established. Welcome to the Matrix."}
