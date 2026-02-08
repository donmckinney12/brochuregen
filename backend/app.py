from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import asyncio
from concurrent.futures import ProcessPoolExecutor
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScrapeRequest(BaseModel):
    url: str

# Helper function that runs in a separate process
def _run_scrape(url: str):
    from playwright.sync_api import sync_playwright
    import base64
    
    print(f"Scraping {url} in process...")
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                viewport={"width": 1920, "height": 1080},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            )
            
            # Manual Stealth
            context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            context.add_init_script("Object.defineProperty(navigator, 'languages', {get: () => ['en-US', 'en']})")
            context.add_init_script("Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3, 4, 5]})")
            
            page = context.new_page()
            
            try:
                page.goto(url, timeout=30000, wait_until="networkidle")
            except Exception as e:
                print(f"Initial navigation failed, retrying: {e}")
                page.goto(url, timeout=30000, wait_until="domcontentloaded")

            title = page.title()
            
            screenshot_bytes = page.screenshot(full_page=False)
            screenshot_b64 = base64.b64encode(screenshot_bytes).decode('utf-8')
            screenshot_data_uri = f"data:image/png;base64,{screenshot_b64}"

            content = page.evaluate("() => document.body.innerText")
            
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
            
            browser.close()
            return {
                "status": "success",
                "url": url,
                "title": title,
                "screenshot": screenshot_data_uri,
                "ai_content": ai_content
            }
            
    except Exception as e:
        import traceback
        return {"error": f"{repr(e)} | {traceback.format_exc()}"}

@app.get("/")
async def read_root():
    return {"message": "BrochureGen API is running!"}

@app.post("/api/scrape")
async def scrape_url(request: ScrapeRequest):
    url = request.url
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")

    print(f"Scraping {url}...")
    
    loop = asyncio.get_running_loop()
    
    # Run scraping in a separate process to avoid blocking event loop and Playwright conflicts
    with ProcessPoolExecutor() as pool:
        result = await loop.run_in_executor(pool, _run_scrape, url)
        
    if "error" in result:
        print(f"Error scraping: {result['error']}")
        raise HTTPException(status_code=500, detail=result['error'])
        
    return result

@app.post("/api/cron/reset-credits")
async def trigger_credit_reset(key: str):
    """
    Triggered by external cron service (e.g., GitHub Actions, EasyCron).
    Requires a valid CRON_SECRET to execute.
    """
    if key != os.environ.get("CRON_SECRET", "my_super_secret_cron_key"):
         raise HTTPException(status_code=401, detail="Invalid Cron Key")
         
    from services.scheduler import reset_credits
    result = reset_credits()
    return result

if __name__ == "__main__":
    import uvicorn
    # Make sure to run with reload=False to avoid multiple process spawning issues
    uvicorn.run("app:app", host="0.0.0.0", port=int(os.environ.get('PORT', 8002)), reload=False)
