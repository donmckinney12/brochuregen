import json
from jinja2 import Environment, FileSystemLoader
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from models.profile import Brochure, Profile, Organization
import os

class EmailExporter:
    def __init__(self, templates_dir: str = "templates"):
        self.env = Environment(loader=FileSystemLoader(templates_dir))
        self.template_name = "email_template.html"

    async def generate_email_html(self, db: Session, brochure_id: int) -> str:
        # 1. Fetch Brochure
        brochure = db.query(Brochure).filter(Brochure.id == brochure_id).first()
        if not brochure:
            raise ValueError("Brochure not found")

        # 2. Fetch Owner/Org Context for Branding
        owner = db.query(Profile).filter(Profile.user_id == brochure.user_id).first()
        org = None
        if brochure.org_id:
            org = db.query(Organization).filter(Organization.org_id == brochure.org_id).first()

        # 3. Determine Branding Matrix
        brand_source = org if org else owner
        primary_color = getattr(brand_source, "brand_primary_color", "#4F46E5") or "#4F46E5"
        secondary_color = getattr(brand_source, "brand_secondary_color", "#EC4899") or "#EC4899"
        brand_logo = getattr(brand_source, "brand_logo_url", None)
        brand_font = getattr(brand_source, "brand_font", "Outfit") or "Outfit"

        # 4. Parse Content
        content_dict = json.loads(brochure.content) if brochure.content else {}
        
        # Flatten content for the template
        template_data = {
            "headline": brochure.title or "Exclusive Marketing Brief",
            "subheadline": content_dict.get("subheadline", "Synthesized by BrochureGen Intelligence"),
            "summary": content_dict.get("summary", "A high-fidelity brochure generated for your brand."),
            "features": content_dict.get("features", []),
            "primary_color": primary_color,
            "secondary_color": secondary_color,
            "brand_logo": brand_logo,
            "brand_font": brand_font,
            "bespoke_image": brochure.bespoke_image,
            "share_url": f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/shared/{brochure.share_uuid}"
        }

        # 5. Render Template
        template = self.env.get_template(self.template_name)
        return template.render(**template_data)

email_exporter = EmailExporter()
