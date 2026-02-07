from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from playwright.async_api import async_playwright

load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScrapeRequest(BaseModel):
    url: str

@app.get("/")
async def read_root():
    return {"message": "BrochureGen API is running!"}

@app.post("/api/scrape")
async def scrape_url(request: ScrapeRequest):
    url = request.url
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")

    print(f"Scraping {url}...")
    
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            # specific user agent to avoid bot detection
            context = await browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
            page = await context.new_page()
            
            try:
                await page.goto(url, timeout=30000, wait_until="networkidle")
            except Exception as e:
                print(f"Initial navigation failed, retrying: {e}")
                await page.goto(url, timeout=30000, wait_until="domcontentloaded")

            # Get page title
            title = await page.title()
            
            # Take screenshot
            screenshot_bytes = await page.screenshot(full_page=False)
            import base64
            screenshot_b64 = base64.b64encode(screenshot_bytes).decode('utf-8')
            screenshot_data_uri = f"data:image/png;base64,{screenshot_b64}"

            # Extract text content (simple version)
            # In a real app, use BeautifulSoup or LLM to process this
            content = await page.evaluate("() => document.body.innerText")
            
            # Mock AI processing for now (since we don't have a live OpenAI key guaranteed)
            # In production, send 'content' to OpenAI here.
            
            ai_content = {
                "headline": f"Discover {title}",
                "subheadline": "Experience excellence with our premium services.",
                "features": [
                    "Professional Quality",
                    "Tailored Solutions",
                    "24/7 Support",
                    "Innovative Technology"
                ],
                "about_us": content[:500].replace('\n', ' ') + "..." if content else "Summary not available."
            }

            await browser.close()
            
            return {
                "status": "success",
                "url": url,
                "title": title,
                "screenshot": screenshot_data_uri,
                "ai_content": ai_content
            }
            
    except Exception as e:
        print(f"Error scraping: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get('PORT', 8000)))
