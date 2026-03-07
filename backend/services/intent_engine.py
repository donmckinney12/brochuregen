from sqlalchemy.orm import Session
from models.profile import Organization, Brochure, Profile
from services.ai_service import AIService
from datetime import datetime
import json

class IntentEngine:
    def __init__(self):
        self.ai = AIService()

    async def generate_proactive_draft(self, db: Session, org_id: str):
        # 1. Fetch Organization Context
        org = db.query(Organization).filter(Organization.id == org_id).first()
        if not org:
            return None

        # 2. Construct Prompt for Proactive Drafting
        brand_context = f"""
        Organization: {org.name}
        Brand Tone: {org.brand_voice_tone or 'Professional'}
        Identity: {org.brand_identity_snippet or 'Enterprise Solution'}
        """

        prompt = f"""
        Based on the following brand context, proactively draft a high-resonance brochure headline, sub-protocol (subheadline), and summary.
        Context:
        {brand_context}
        
        The draft should feel visionary and 'God-Tier'.
        Return as JSON with keys: 'headline', 'subheadline', 'summary', 'features' (list of 3).
        """

        res = await self.ai.client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )

        content = json.loads(res.choices[0].message.content)

        # 3. Create the Proactive Brochure
        # We assign it to the first profile in the org if available
        profile = db.query(Profile).filter(Profile.org_id == org_id).first()
        user_id = profile.id if profile else None

        new_brochure = Brochure(
            org_id=org_id,
            user_id=user_id,
            title=f"PROACTIVE DRAFT: {content['headline']}",
            content=json.dumps(content),
            status="proactive_draft",
            layout_theme="modern"
        )
        
        db.add(new_brochure)
        org.last_intent_scan = datetime.utcnow()
        db.commit()
        db.refresh(new_brochure)

        return new_brochure

intent_engine = IntentEngine()
