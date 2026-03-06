import httpx
import asyncio
import time

async def test_backend():
    url = "http://localhost:8000/health"
    print(f"Testing health check: {url}")
    start = time.time()
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(url)
            print(f"Status: {response.status_code}, Time: {time.time() - start:.2f}s")
            print(f"Body: {response.json()}")
    except Exception as e:
        print(f"Health check failed: {e}")

    # Test profiles endpoint (will fail auth but should be fast)
    url = "http://localhost:8000/api/v1/profiles/"
    print(f"\nTesting profiles sync (unauthorized): {url}")
    start = time.time()
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(url, json={"id": "test", "email": "test@example.com"})
            print(f"Status: {response.status_code}, Time: {time.time() - start:.2f}s")
    except Exception as e:
        print(f"Profiles sync failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_backend())
