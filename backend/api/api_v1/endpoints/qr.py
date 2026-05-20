from fastapi import APIRouter, HTTPException, Depends, Response
import qrcode
import io
from core.auth import get_current_user

router = APIRouter()

@router.get("/generate/{share_uuid}")
async def generate_qr(share_uuid: str):
    """
    Generates a high-fidelity QR code for a digital brochure twin.
    """
    # In production, this base URL should be configurable via env vars
    base_url = "http://localhost:3000" 
    target_url = f"{base_url}/view/{share_uuid}"
    
    # Generate QR Code with high-quality settings
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H, # High error correction for print robustness
        box_size=10,
        border=2,
    )
    qr.add_data(target_url)
    qr.make(fit=True)

    # Create the QR image (defaulting to clean black/white for maximum scannability)
    img = qr.make_image(fill_color="black", back_color="white")
    
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    
    return Response(content=buf.getvalue(), media_type="image/png")
