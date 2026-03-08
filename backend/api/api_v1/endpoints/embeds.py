"""Embeddable widget endpoints for external site integration."""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from core.auth import get_current_user

router = APIRouter()


@router.get("/code/{brochure_id}")
async def get_embed_code(
    brochure_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Generate embed code snippet for a brochure."""
    base_url = "https://brochuregen.com"

    iframe_code = f'<iframe src="{base_url}/api/v1/embeds/widget/{brochure_id}" width="100%" height="600" frameborder="0" style="border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.1);" allowfullscreen></iframe>'

    script_code = f'<div id="brochuregen-widget" data-brochure="{brochure_id}"></div>\n<script src="{base_url}/embed.js" async></script>'

    return {
        "brochure_id": brochure_id,
        "iframe": iframe_code,
        "script": script_code,
        "instructions": "Copy either the iframe or script embed code and paste it into your website HTML."
    }


@router.get("/widget/{share_uuid}", response_class=HTMLResponse)
async def serve_widget(share_uuid: str):
    """Serve the embeddable widget HTML for a shared brochure."""
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #fff; }}
        .widget-container {{ max-width: 800px; margin: 0 auto; padding: 2rem; }}
        .widget-header {{ text-align: center; padding: 2rem 0; border-bottom: 1px solid rgba(255,255,255,0.1); }}
        .widget-header h2 {{ font-size: 1.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; }}
        .widget-header p {{ font-size: 0.75rem; opacity: 0.4; margin-top: 0.5rem; }}
        .widget-cta {{ display: flex; justify-content: center; padding: 2rem; }}
        .widget-cta a {{ padding: 1rem 2rem; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; text-decoration: none; border-radius: 1rem; font-weight: 700; font-size: 0.85rem; transition: transform 0.2s; }}
        .widget-cta a:hover {{ transform: scale(1.05); }}
        .powered {{ text-align: center; padding: 1rem; font-size: 0.6rem; opacity: 0.3; }}
    </style>
</head>
<body>
    <div class="widget-container">
        <div class="widget-header">
            <h2>View Brochure</h2>
            <p>Interactive brochure powered by BrochureGen</p>
        </div>
        <div class="widget-cta">
            <a href="https://brochuregen.com/share/{share_uuid}" target="_blank">Open Full Brochure →</a>
        </div>
        <div class="powered">Powered by BrochureGen</div>
    </div>
</body>
</html>"""

    return HTMLResponse(content=html)
