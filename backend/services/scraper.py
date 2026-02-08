import base64
from playwright.async_api import async_playwright

async def scrape_website(url: str):
    """
    Scrapes the given URL for title, text content, and a full-page screenshot.
    Returns a dictionary with the data.
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Use a consistent viewport for screenshots
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        
        # Manual Stealth
        await context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        await context.add_init_script("Object.defineProperty(navigator, 'languages', {get: () => ['en-US', 'en']})")
        await context.add_init_script("Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3, 4, 5]})")

        page = await context.new_page()
        
        try:
            # Go to URL with a timeout
            await page.goto(url, wait_until="networkidle", timeout=60000)
            
            title = await page.title()
            
            # Extract main text (simple approach for now)
            # Evaluate script to get visible text
            text = await page.evaluate("() => document.body.innerText")
            
            # Take full page screenshot
            screenshot_bytes = await page.screenshot(full_page=True, type='jpeg', quality=80)
            screenshot_b64 = base64.b64encode(screenshot_bytes).decode('utf-8')
            
            return {
                "title": title,
                "text": text,
                "screenshot": f"data:image/jpeg;base64,{screenshot_b64}"
            }
            
        except Exception as e:
            return {
                "error": str(e)
            }
        finally:
            await browser.close()
