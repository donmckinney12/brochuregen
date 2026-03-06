from fastapi import APIRouter, HTTPException, Depends, Request, BackgroundTasks
from services.db_orm import get_user_brochures, create_brochure, get_shared_brochure
from schemas.brochure import Brochure, BrochureCreate
from core.database import get_db
from sqlalchemy.orm import Session
from typing import List
import hashlib

from core.auth import get_current_user
from models.profile import BrochureView

router = APIRouter()

def log_brochure_view(db: Session, brochure_id: int, ip_address: str, user_agent: str):
    try:
        ip_hash = hashlib.sha256(ip_address.encode()).hexdigest()
        new_view = BrochureView(
            brochure_id=brochure_id,
            viewer_ip_hash=ip_hash,
            user_agent=user_agent
        )
        db.add(new_view)
        db.commit()
    except Exception as e:
        print(f"Error logging view: {e}")
        db.rollback()

@router.get("/shared/{share_uuid}")
def get_shared(share_uuid: str, request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    brochure = get_shared_brochure(db, share_uuid)
    if not brochure:
        raise HTTPException(status_code=404, detail="Shared brochure not found")
        
    # Schedule logging in the background
    client_ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")
    background_tasks.add_task(log_brochure_view, db, brochure.id, client_ip, user_agent)
    
    # We return the brochure mapped as dict so we can inject the owner's vault settings
    resp = {
        "id": brochure.id,
        "title": brochure.title,
        "url": brochure.url,
        "content": brochure.content,
        "share_uuid": brochure.share_uuid,
        "created_at": brochure.created_at,
        "owner_vault": {
            "brand_logo_url": brochure.owner.brand_logo_url if brochure.owner else None,
            "brand_primary_color": brochure.owner.brand_primary_color if brochure.owner else None,
            "brand_secondary_color": brochure.owner.brand_secondary_color if brochure.owner else None,
            "brand_font": brochure.owner.brand_font if brochure.owner else None,
        }
    }
    return resp

@router.get("/", response_model=List[Brochure])
def list_brochures(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    return get_user_brochures(db, user_id)

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    from sqlalchemy import func
    from models.profile import Brochure, BrochureView
    
    # 1. Get generation counts by date
    gen_results = db.query(
        func.date(Brochure.created_at).label("date"),
        func.count(Brochure.id).label("count")
    ).filter(Brochure.user_id == user_id).group_by(func.date(Brochure.created_at)).order_by("date").all()
    
    # 2. Get view counts by date and unique visitors
    view_results = db.query(
        func.date(BrochureView.viewed_at).label("date"),
        func.count(BrochureView.id).label("views"),
        func.count(func.distinct(BrochureView.viewer_ip_hash)).label("visitors")
    ).join(Brochure).filter(Brochure.user_id == user_id).group_by(func.date(BrochureView.viewed_at)).order_by("date").all()
    
    # Merge results
    analytics_map = {}
    for r in gen_results:
        date_str = str(r.date)
        if date_str not in analytics_map:
            analytics_map[date_str] = {"date": date_str, "generations": 0, "views": 0, "visitors": 0}
        analytics_map[date_str]["generations"] = r.count
        
    for r in view_results:
        date_str = str(r.date)
        if date_str not in analytics_map:
             analytics_map[date_str] = {"date": date_str, "generations": 0, "views": 0, "visitors": 0}
        analytics_map[date_str]["views"] = r.views
        analytics_map[date_str]["visitors"] = r.visitors
        
    # Return sorted list of dicts
    return sorted(list(analytics_map.values()), key=lambda x: x["date"])

@router.post("/", response_model=Brochure)
def add_brochure(brochure: BrochureCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user["sub"] != brochure.user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return create_brochure(db, brochure)
from pydantic import BaseModel

class TranslateRequest(BaseModel):
    target_language: str

@router.post("/{brochure_id}/translate", response_model=Brochure)
async def translate_brochure(brochure_id: int, request: TranslateRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    
    # 1. Fetch Brochure
    from models.profile import Brochure as BrochureModel
    db_brochure = db.query(BrochureModel).filter(BrochureModel.id == brochure_id, BrochureModel.user_id == user_id).first()
    if not db_brochure:
        raise HTTPException(status_code=404, detail="Brochure not found")
        
    # 2. Deduct Refine Credit
    from services.db_orm import deduct_credits_orm, add_credits_orm
    credit_check = deduct_credits_orm(db, user_id, amount=1, credit_type='refine_credits')
    if not credit_check["success"]:
        raise HTTPException(status_code=402, detail="Insufficient refine credits")
        
    try:
        from services.ai_service import AIService
        import json
        ai_svc = AIService()
        
        # Translate main content
        if db_brochure.content:
            content_dict = json.loads(db_brochure.content)
            res = await ai_svc.translate_json(content_dict, request.target_language)
            if "error" in res: raise Exception(res["error"])
            db_brochure.content = json.dumps(res["translated_data"])
            
        # Translate social posts
        if db_brochure.social_posts:
            social_list = json.loads(db_brochure.social_posts)
            # Wrap in dict for translate_json
            res = await ai_svc.translate_json({"posts": social_list}, request.target_language)
            if "error" not in res:
                db_brochure.social_posts = json.dumps(res["translated_data"].get("posts", social_list))
                
        # Translate email sequence
        if db_brochure.email_sequence:
            email_list = json.loads(db_brochure.email_sequence)
            res = await ai_svc.translate_json({"emails": email_list}, request.target_language)
            if "error" not in res:
                db_brochure.email_sequence = json.dumps(res["translated_data"].get("emails", email_list))
                
        db.commit()
        db.refresh(db_brochure)
        return db_brochure
        
    except Exception as e:
        # Refund on failure
        add_credits_orm(db, user_id, amount=1, credit_type='refine_credits')
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")
