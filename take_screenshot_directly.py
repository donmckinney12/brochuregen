from playwright.sync_api import sync_playwright
import os

def capture():
    print("Capturing screenshot of http://localhost:3000...")
    try:
        with sync_playwright() as p:
            print("Launching browser...")
            browser = p.chromium.launch()
            context = browser.new_context(viewport={"width": 1280, "height": 800})
            page = context.new_page()
            
            print("Navigating...")
            page.goto("http://localhost:3000", timeout=60000, wait_until="networkidle")
            
            # Ensure assets dir exists
            os.makedirs("assets", exist_ok=True)
            
            print("Saving screenshot...")
            page.screenshot(path="assets/preview.png", full_page=False)
            
            browser.close()
            print("Success! Saved to assets/preview.png")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    capture()
