from playwright.sync_api import sync_playwright

def test():
    print("Testing Playwright...")
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            print("Browser launched successfully!")
            page = browser.new_page()
            page.goto("http://example.com")
            print("Navigation successful!")
            browser.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test()
