from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from core.database import get_db
from models.profile import Profile # We can reuse profile or create a Leads model, but for now let's just log it or use a simple schema

router = APIRouter()

class EnterpriseLead(BaseModel):
    name: str
    email: str
    company: str
    size: str
    use_case: str
    message: Optional[str] = None

@router.post("/intake")
async def enterprise_intake(lead: EnterpriseLead, db: Session = Depends(get_db)):
    # In a real app, we'd save to a Leads table or send an email
    # For this SaaS polish, we will simulate a successful intake
    print(f"--- PROTOCOL INTAKE RECEIVED ---")
    print(f"NODE_NAME: {lead.name}")
    print(f"ENTITY: {lead.company} [SIZE: {lead.size}]")
    print(f"OBJECTIVE: {lead.use_case}")
    print(f"STATUS: SYNCHRONIZED")
    print(f"--------------------------------")
    return {"status": "success", "message": "Protocol Intake Synchronized. Our neural consultants will contact you shortly."}
