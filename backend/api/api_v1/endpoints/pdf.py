from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from services.pdf_service import generate_brochure_pdf
from services.db_orm import deduct_credits_orm
from core.database import get_db
from sqlalchemy.orm import Session
import io

router = APIRouter()

from core.auth import get_current_user

@router.post("/generate-pdf")
async def generate_pdf(request: dict, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    from services.db_orm import get_profile, deduct_credits_orm
    
    # Fetch profile for brand settings
    profile = get_profile(db, user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    result = deduct_credits_orm(db, user_id)
    if not result["success"]:
        raise HTTPException(status_code=402, detail=result["error"])

    # Merge brand settings into request data
    pdf_data = {
        **request,
        "brand_logo": profile.brand_logo_url,
        "primary_color": profile.brand_primary_color,
        "secondary_color": profile.brand_secondary_color,
        "brand_font": profile.brand_font,
        "brand_voice": profile.brand_voice_tone
    }

    pdf_bytes = await generate_brochure_pdf(pdf_data)
    return StreamingResponse(
        io.BytesIO(pdf_bytes), 
        media_type="application/pdf", 
        headers={"Content-Disposition": "attachment; filename=brochure.pdf"}
    )
