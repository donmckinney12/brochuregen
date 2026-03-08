from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from schemas.leads import LeadCapture, LeadCaptureCreate
from models.profile import Brochure, LeadCapture as LeadCaptureModel
from core.auth import get_current_user

router = APIRouter()

@router.post("/submit/{share_uuid}", response_model=LeadCapture)
def submit_lead(share_uuid: str, lead: LeadCaptureCreate, db: Session = Depends(get_db)):
    # 1. Verify Brochure exists
    brochure = db.query(Brochure).filter(Brochure.share_uuid == share_uuid).first()
    if not brochure:
        raise HTTPException(status_code=404, detail="Brochure not found")
        
    # 2. Save Lead
    db_lead = LeadCaptureModel(
        brochure_id=brochure.id,
        email=lead.email,
        name=lead.name,
        company=lead.company,
        message=lead.message
    )
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)

    # 3. Dispatch Webhook
    from api.api_v1.endpoints.webhooks import dispatch_webhook
    import asyncio
    
    lead_data = {
        "id": db_lead.id,
        "email": db_lead.email,
        "name": db_lead.name,
        "company": db_lead.company,
        "message": db_lead.message,
        "brochure_id": brochure.id,
        "brochure_title": brochure.title
    }
    # Using background tasks or async fire-and-forget
    asyncio.create_task(dispatch_webhook(db, brochure.user_id, "lead.created", lead_data))

    return db_lead

@router.get("/all", response_model=List[LeadCapture])
def get_all_leads(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    org_id = current_user.get("org_id")
    
    query = db.query(LeadCaptureModel).join(Brochure)
    if org_id:
        query = query.filter(Brochure.org_id == org_id)
    else:
        query = query.filter(Brochure.user_id == user_id)
        
    return query.all()

@router.get("/export")
def export_leads(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    org_id = current_user.get("org_id")
    import csv
    import io
    from fastapi.responses import StreamingResponse
    
    query = db.query(LeadCaptureModel).join(Brochure)
    if org_id:
        query = query.filter(Brochure.org_id == org_id)
    else:
        query = query.filter(Brochure.user_id == user_id)
    leads = query.all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Name", "Email", "Company", "Message", "Brochure Title", "Captured At"])
    
    for lead in leads:
        writer.writerow([
            lead.id,
            lead.name,
            lead.email,
            lead.company,
            lead.message,
            lead.brochure.title if lead.brochure else "N/A",
            lead.created_at
        ])
    
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=leads_export.csv"}
    )

@router.post("/followup/{lead_id}")
async def generate_lead_followup(lead_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    org_id = current_user.get("org_id")
    from services.ai_service import AIService
    import json
    
    # 1. Fetch Lead and verify owner/org
    query = db.query(LeadCaptureModel).join(Brochure).filter(LeadCaptureModel.id == lead_id)
    if org_id:
        query = query.filter(Brochure.org_id == org_id)
    else:
        query = query.filter(Brochure.user_id == user_id)
        
    lead = query.first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found or access denied")
        
    # 2. Extract context from brochure
    brochure = lead.brochure
    try:
        content = json.loads(brochure.content)
    except:
        content = {}
        
    brochure_context = {
        "title": brochure.title,
        "headline": content.get("headline", "N/A")
    }
    
    lead_data = {
        "name": lead.name,
        "company": lead.company,
        "message": lead.message
    }
    
    # 3. Generate Sequence
    ai_svc = AIService()
    res = await ai_svc.generate_followup_sequence(lead_data, brochure_context)
    
    if "error" in res:
        raise HTTPException(status_code=500, detail=res["error"])
        
    return res

@router.post("/{lead_id}/read")
def mark_lead_read(lead_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    org_id = current_user.get("org_id")
    from models.profile import Brochure, LeadCapture as LeadCaptureModel
    
    lead = db.query(LeadCaptureModel).join(Brochure).filter(LeadCaptureModel.id == lead_id)
    if org_id:
        lead = lead.filter(Brochure.org_id == org_id)
    else:
        lead = lead.filter(Brochure.user_id == user_id)
        
    lead_item = lead.first()
    if not lead_item:
        raise HTTPException(status_code=404, detail="Lead not found")
        
    lead_item.is_read = 1
    db.commit()
    return {"status": "success"}
