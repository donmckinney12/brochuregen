from fastapi import APIRouter, HTTPException, Depends, Request, BackgroundTasks
from services.db_orm import get_user_brochures, create_brochure, get_shared_brochure
from schemas.brochure import Brochure, BrochureCreate, BrochureCommentBase, BrochureCommentCreate, BrochureComment, BrochureVariant
from schemas.activity import ActivityLog as ActivityLogSchema

# ... inside router definition ...

@router.post("/{brochure_id}/generate-variant", response_model=BrochureVariant)
async def create_variant(brochure_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    from models.profile import Brochure as BrochureModel, BrochureVariant as VariantModel
    from services.ai_service import AIService
    import json
    
    # 1. Fetch Brochure
    db_brochure = db.query(BrochureModel).filter(BrochureModel.id == brochure_id, BrochureModel.user_id == user_id).first()
    if not db_brochure:
        raise HTTPException(status_code=404, detail="Brochure not found")
        
    # 2. Check for credits
    from services.db_orm import deduct_credits_orm
    credit_check = deduct_credits_orm(db, user_id, amount=1, credit_type='refine_credits')
    if not credit_check["success"]:
        raise HTTPException(status_code=402, detail="Insufficient refine credits for variant generation")
        
    # 3. Generate content
    ai_svc = AIService()
    original_content = json.loads(db_brochure.content)
    res = await ai_svc.generate_variant(original_content)
    
    if "error" in res:
        raise HTTPException(status_code=500, detail=res["error"])
        
    # 4. Save Variant
    db_variant = VariantModel(
        brochure_id=brochure_id,
        variant_name="Variant B (AI Optimized)",
        content=json.dumps(res["variant"])
    )
    db.add(db_variant)
    db.commit()
    db.refresh(db_variant)
    return db_variant
from core.database import get_db
from sqlalchemy.orm import Session
from typing import List
import hashlib

from core.auth import get_current_user
from models.profile import BrochureView

router = APIRouter()

def log_brochure_view(db: Session, brochure_id: int, ip_address: str, user_agent: str, variant_id: int = None):
    try:
        ip_hash = hashlib.sha256(ip_address.encode()).hexdigest()
        new_view = BrochureView(
            brochure_id=brochure_id,
            variant_id=variant_id,
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
        
    # A/B Testing Logic: Randomly serve variant if it exists
    import random
    import json
    content = brochure.content
    variant_id = None
    
    if brochure.variants and len(brochure.variants) > 0:
        # 50/50 split if there's at least one variant
        if random.random() > 0.5:
            variant = random.choice(brochure.variants)
            content = variant.content
            variant_id = variant.id
            
    # Schedule logging in the background
    client_ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")
    background_tasks.add_task(log_brochure_view, db, brochure.id, client_ip, user_agent, variant_id)
    
    # We return the brochure mapped as dict so we can inject the owner's vault settings
    resp = {
        "id": brochure.id,
        "title": brochure.title,
        "url": brochure.url,
        "content": content,
        "variant_id": variant_id, # Track which variant was served
        "share_uuid": brochure.share_uuid,
        "seo_metadata": json.loads(brochure.seo_metadata) if brochure.seo_metadata else None,
        "created_at": brochure.created_at,
        "owner_vault": {
            "brand_logo_url": brochure.owner.brand_logo_url if brochure.owner else None,
            "brand_primary_color": brochure.owner.brand_primary_color if brochure.owner else None,
            "brand_secondary_color": brochure.owner.brand_secondary_color if brochure.owner else None,
            "brand_font": brochure.owner.brand_font if brochure.owner else None,
        },
        "comments": [{
            "id": c.id,
            "text": c.text,
            "section_id": c.section_id,
            "created_at": c.created_at
        } for c in brochure.comments]
    }
    return resp

@router.post("/{brochure_id}/seo-generate")
async def generate_brochure_seo(brochure_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    from models.profile import Brochure as BrochureModel
    from services.ai_service import AIService
    import json
    
    # 1. Fetch Brochure
    db_brochure = db.query(BrochureModel).filter(BrochureModel.id == brochure_id, BrochureModel.user_id == user_id).first()
    if not db_brochure:
        raise HTTPException(status_code=404, detail="Brochure not found")
        
    # 2. Extract context
    try:
        content_dict = json.loads(db_brochure.content)
    except:
        content_dict = {}
        
    # 3. Generate SEO
    ai_svc = AIService()
    res = await ai_svc.generate_seo_metadata(db_brochure.title, content_dict)
    
    if "error" in res:
        raise HTTPException(status_code=500, detail=res["error"])
        
    # 4. Save
    db_brochure.seo_metadata = json.dumps(res["metadata"])
    db.commit()
    db.refresh(db_brochure)
    
@router.post("/{share_uuid}/comment")
def add_brochure_comment(share_uuid: str, comment: BrochureCommentCreate, db: Session = Depends(get_db)):
    from models.profile import Brochure, BrochureComment
    brochure = db.query(Brochure).filter(Brochure.share_uuid == share_uuid).first()
    if not brochure:
        raise HTTPException(status_code=404, detail="Brochure not found")
        
    db_comment = BrochureComment(
        brochure_id=brochure.id,
        text=comment.text,
        section_id=comment.section_id,
        is_read=0
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.get("/pulse")
def get_pulse(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    org_id = current_user.get("org_id")
    from models.profile import Brochure, BrochureComment, LeadCapture as LeadCaptureModel
    
    # Base query for user's brochures
    brochures_query = db.query(Brochure.id)
    if org_id:
        brochures_query = brochures_query.filter(Brochure.org_id == org_id)
    else:
        brochures_query = brochures_query.filter(Brochure.user_id == user_id)
        
    brochure_ids = [b.id for b in brochures_query.all()]
    
    unread_comments = db.query(BrochureComment).filter(BrochureComment.brochure_id.in_(brochure_ids), BrochureComment.is_read == 0).count()
    unread_leads = db.query(LeadCaptureModel).filter(LeadCaptureModel.brochure_id.in_(brochure_ids), LeadCaptureModel.is_read == 0).count()
    
    return {
        "unread_comments": unread_comments,
        "unread_leads": unread_leads,
        "total_pulse": unread_comments + unread_leads
    }

@router.get("/feedback/all")
def get_all_feedback(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    org_id = current_user.get("org_id")
    from models.profile import Brochure, BrochureComment
    
    query = db.query(BrochureComment).join(Brochure)
    if org_id:
        query = query.filter(Brochure.org_id == org_id)
    else:
        query = query.filter(Brochure.user_id == user_id)
        
    return query.order_by(BrochureComment.created_at.desc()).all()

@router.post("/feedback/{comment_id}/read")
def mark_comment_read(comment_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    org_id = current_user.get("org_id")
    from models.profile import Brochure, BrochureComment
    
    comment = db.query(BrochureComment).join(Brochure).filter(BrochureComment.id == comment_id)
    if org_id:
        comment = comment.filter(Brochure.org_id == org_id)
    else:
        comment = comment.filter(Brochure.user_id == user_id)
        
    comment_item = comment.first()
    if not comment_item:
        raise HTTPException(status_code=404, detail="Comment not found")
        
    comment_item.is_read = 1
    db.commit()
    return {"status": "success"}

@router.get("/", response_model=List[Brochure])
def list_brochures(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    org_id = current_user.get("org_id")
    
    # Sync Org Context
    from services.db_orm import sync_enterprise_context
    sync_enterprise_context(db, user_id, org_id)
    
    return get_user_brochures(db, user_id, org_id)

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    from sqlalchemy import func
    from models.profile import Brochure, BrochureView
    
    org_id = current_user.get("org_id")
    
    # 1. Get generation counts
    query = db.query(
        func.date(Brochure.created_at).label("date"),
        func.count(Brochure.id).label("count")
    )
    if org_id:
        query = query.filter(Brochure.org_id == org_id)
    else:
        query = query.filter(Brochure.user_id == user_id)
    gen_results = query.group_by(func.date(Brochure.created_at)).order_by("date").all()
    
    # 2. Get view counts
    view_query = db.query(
        func.date(BrochureView.viewed_at).label("date"),
        func.count(BrochureView.id).label("views"),
        func.count(func.distinct(BrochureView.viewer_ip_hash)).label("visitors")
    ).join(Brochure)
    if org_id:
        view_query = view_query.filter(Brochure.org_id == org_id)
    else:
        view_query = view_query.filter(Brochure.user_id == user_id)
    view_results = view_query.group_by(func.date(BrochureView.viewed_at)).order_by("date").all()
    
    # 3. Get Variant Stats
    variant_query = db.query(
        BrochureView.variant_id,
        func.count(BrochureView.id).label("views")
    ).join(Brochure).filter(BrochureView.variant_id != None)
    if org_id:
        variant_query = variant_query.filter(Brochure.org_id == org_id)
    else:
        variant_query = variant_query.filter(Brochure.user_id == user_id)
    variant_results = variant_query.group_by(BrochureView.variant_id).all()
    
    variant_perf = [{"variant_id": r.variant_id, "views": r.views} for r in variant_results]

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
        
    # Return sorted list of dicts + variant performance
    return {
        "timeline": sorted(list(analytics_map.values()), key=lambda x: x["date"]),
        "variant_performance": variant_perf
    }

async def generate_automated_seo(brochure_id: int, db: Session):
    """
    Background task to generate SEO metadata autonomously.
    """
    from models.profile import Brochure as BrochureModel
    from services.ai_service import AIService
    import json
    
    # Use a new session for background task to avoid issues
    # But since we are passing 'db', we should be careful. 
    # Actually, it's safer to use the provided 'db' if it's managed correctly, 
    # but FastAPI background tasks usually benefit from a clean session.
    # For now, we'll use the passed Session but wrap in try/finally if needed.
    
    db_brochure = db.query(BrochureModel).filter(BrochureModel.id == brochure_id).first()
    if not db_brochure: return
    
    try:
        content_dict = json.loads(db_brochure.content)
        ai_svc = AIService()
        res = await ai_svc.generate_seo_metadata(db_brochure.title, content_dict)
        
        if "status" in res and res["status"] == "success":
            db_brochure.seo_metadata = json.dumps(res["metadata"])
            db.commit()
    except Exception as e:
        print(f"Background SEO generation failed: {e}")
        db.rollback()

@router.post("/", response_model=Brochure)
async def add_brochure(brochure: BrochureCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user["sub"] != brochure.user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    import uuid
    data = brochure.dict()
    data["share_uuid"] = str(uuid.uuid4())
    
    org_id = current_user.get("org_id")
    if org_id:
        data["org_id"] = org_id
        
    from models.profile import Brochure as BrochureModel
    db_item = BrochureModel(**data)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    
    # Trigger SEO generation in background
    background_tasks.add_task(generate_automated_seo, db_item.id, db)
    
    return db_item
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

@router.get("/activities/stream", response_model=List[ActivityLogSchema])
def read_activities(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    from services.db_orm import get_profile, get_activities
    profile = get_profile(db, user_id)
    org_id = profile.org_id if profile else None
    return get_activities(db, user_id, org_id=org_id)
