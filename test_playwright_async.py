import asyncio
from playwright.async_api import async_playwright
import sys

# Windows policy fix (crucial for async subprocesses)
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

async def test():
    print("Testing Async Playwright...")
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            print("Browser launched successfully!")
            page = await browser.new_page()
            await page.goto("http://example.com")
            print("Navigation successful!")
            await browser.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test())
