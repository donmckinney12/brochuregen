from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()
from pydantic import BaseModel
from services.scraper import scrape_website
from services.ai_service import AIService
import sys
import asyncio

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

app = FastAPI(title="Brochure Generator API")
ai_service = AIService()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScrapeRequest(BaseModel):
    url: str

@app.post("/api/scrape")
async def scrape_url(request: ScrapeRequest):
    result = await scrape_website(request.url)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
        
    # Generate AI content
    ai_content = await ai_service.generate_brochure_content(result.get("text", ""), request.url)
    result["ai_content"] = ai_content
    
    return result

@app.get("/")
def read_root():
    return {"message": "Welcome to the Sticker/Brochure Generator API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

from services.pdf_service import generate_brochure_pdf
from fastapi.responses import StreamingResponse
from services.db import deduct_credits_server
import io

@app.post("/api/generate-pdf")
async def generate_pdf(request: dict):
    # Check if user_id is provided for credit deduction
    user_id = request.get("user_id")
    if user_id:
        result = deduct_credits_server(user_id)
        if not result["success"]:
            raise HTTPException(status_code=402, detail=result["error"])

    pdf_bytes = await generate_brochure_pdf(request)
    return StreamingResponse(
        io.BytesIO(pdf_bytes), 
        media_type="application/pdf", 
        headers={"Content-Disposition": "attachment; filename=brochure.pdf"}
    )
