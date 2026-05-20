import sys
import os
import asyncio
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.ai_service import AIService

async def test_strategy():
    load_dotenv()
    ai_service = AIService()
    
    test_content = {
        "headline": "Transform Your Marketing",
        "about_us": "We are a top-tier marketing agency.",
        "features": ["AI Powered", "Cloud Native", "Elite Design"]
    }
    
    print("Testing generate_marketing_strategy...")
    result = await ai_service.generate_marketing_strategy(test_content)
    
    if "error" in result:
        print(f"FAILED: {result['error']}")
    else:
        print("SUCCESS!")
        print(result["strategy"])

if __name__ == "__main__":
    asyncio.run(test_strategy())
