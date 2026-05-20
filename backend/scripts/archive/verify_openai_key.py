import sys
import os
import asyncio
from openai import AsyncOpenAI
from dotenv import load_dotenv

async def test_key():
    load_dotenv()
    api_key = os.getenv("OPENAI_API_KEY")
    print(f"Testing key ending in: ...{api_key[-10:]}")
    
    client = AsyncOpenAI(api_key=api_key)
    try:
        models = await client.models.list()
        print("Model list successful!")
        for m in list(models.data)[:3]:
            print(f"- {m.id}")
    except Exception as e:
        print(f"Key test FAILED: {e}")

if __name__ == "__main__":
    asyncio.run(test_key())
