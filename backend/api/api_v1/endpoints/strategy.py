from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from services.ai_service import AIService
from core.auth import get_current_user
from core.database import get_db
from sqlalchemy.orm import Session
import json

router = APIRouter()
ai_service = AIService()

class StrategyRequest(BaseModel):
    content: dict

@router.post("/analyze")
async def analyze_strategy(request: StrategyRequest, current_user: dict = Depends(get_current_user)):
    """
    Analyzes brochure content and returns marketing strategy tips.
    """
    try:
        strategy_res = await ai_service.generate_marketing_strategy(request.content)
        if "error" in strategy_res:
            raise HTTPException(status_code=500, detail=strategy_res["error"])
        return strategy_res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
