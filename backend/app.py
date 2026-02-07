from flask import Flask, jsonify, request
# from fastapi import FastAPI, Request
# from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

load_dotenv()

# --- Flask App ---
app = Flask(__name__)

@app.route('/')
def home():
    return "Hello, Flask is running!"

@app.route('/api/scrape', methods=['POST'])
def scrape():
    data = request.get_json()
    url = data.get('url')
    if not url:
        return jsonify({'error': 'URL is required'}), 400

    # Placeholder for Playwright scraping logic
    print(f"Scraping {url}...")
    # from playwright.sync_api import sync_playwright
    # with sync_playwright() as p:
    #     browser = p.chromium.launch()
    #     page = browser.new_page()
    #     page.goto(url)
    #     content = page.content()
    #     browser.close()
    #     return jsonify({'status': 'success', 'url': url, 'content_length': len(content)})

    return jsonify({'status': 'success', 'url': url, 'message': 'Scraping logic not implemented yet.'})


if __name__ == '__main__':
    app.run(debug=True, port=os.environ.get('PORT', 5001))


# --- FastAPI App ---
# app = FastAPI()
#
# @app.get("/")
# async def read_root():
#     return {"Hello": "FastAPI is running!"}
#
# @app.post("/api/scrape")
# async def scrape_url(request: Request):
#     data = await request.json()
#     url = data.get('url')
#     if not url:
#         return JSONResponse(content={'error': 'URL is required'}, status_code=400)
#
#     # Placeholder for Playwright scraping logic
#     print(f"Scraping {url}...")
#     # from playwright.async_api import async_playwright
#     # async with async_playwright() as p:
#     #     browser = await p.chromium.launch()
#     #     page = await browser.new_page()
#     #     await page.goto(url)
#     #     content = await page.content()
#     #     await browser.close()
#     #     return {'status': 'success', 'url': url, 'content_length': len(content)}
#
#     return {'status': 'success', 'url': url, 'message': 'Scraping logic not implemented yet.'}
#
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get('PORT', 8000)))
