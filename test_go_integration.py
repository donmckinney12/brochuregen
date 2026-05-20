import asyncio
import os
import sys

# Add backend to path so we can import services
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "backend")))

from services.scraper import scrape_website

async def test_integration():
    url = "https://example.com"
    print(f"Testing scrape for {url}...")
    
    result = await scrape_website(url)
    
    print("\nScrape Result:")
    print(f"Title: {result.get('title')}")
    print(f"Text Preview: {result.get('text')[:100]}...")
    print(f"Screenshot: {'Present' if result.get('screenshot') else 'None (Expected if using Go)'}")

if __name__ == "__main__":
    asyncio.run(test_integration())
