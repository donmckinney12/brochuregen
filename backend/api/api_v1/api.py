from fastapi import APIRouter
from api.api_v1.endpoints import scrape, pdf, payment, brochures, profiles, image

api_router = APIRouter()
api_router.include_router(scrape.router, prefix="/scrape", tags=["scrape"])
api_router.include_router(pdf.router, prefix="/pdf", tags=["pdf"])
api_router.include_router(payment.router, prefix="/payment", tags=["payment"])
api_router.include_router(brochures.router, prefix="/brochures", tags=["brochures"])
api_router.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
api_router.include_router(image.router, prefix="/image", tags=["image"])
