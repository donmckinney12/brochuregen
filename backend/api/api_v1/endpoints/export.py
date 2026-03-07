from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from api.deps import get_db
from services.email_exporter import email_exporter
from services.db_orm import get_current_user_profile
from models.profile import Profile, Brochure
from services.deployment import deployment_service

router = APIRouter()

@router.get("/brochure/{brochure_id}/html")
async def export_brochure_html(
    brochure_id: int,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user_profile)
):
    """
    Generate and return a "God-Tier" responsive HTML email version of the brochure.
    """
    try:
        html_content = await email_exporter.generate_email_html(db, brochure_id)
        return Response(content=html_content, media_type="text/html")
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")

@router.post("/brochure/{brochure_id}/deploy")
async def deploy_brochure(
    brochure_id: int,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user_profile)
):
    """
    Sync and deploy the brochure to the edge (Cloud Neural Sync).
    """
    brochure = db.query(Brochure).filter(Brochure.id == brochure_id, Brochure.user_id == current_user.id).first()
    if not brochure:
        raise HTTPException(status_code=404, detail="Brochure not found")
    
    try:
        deployment_result = await deployment_service.deploy_to_cloud(brochure)
        return deployment_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deployment failed: {str(e)}")
