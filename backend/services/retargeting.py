from sqlalchemy.orm import Session
from models.profile import LeadCapture, BrochureEngagement, Brochure
from services.ai_service import AIService
import json

class RetargetingService:
    def __init__(self):
        self.ai = AIService()

    async def analyze_leads_for_retargeting(self, db: Session, org_id: str = None):
        # 1. Fetch high-resonance leads
        query = db.query(LeadCapture).join(Brochure)
        if org_id:
            query = query.filter(Brochure.org_id == org_id)
        
        leads = query.order_by(LeadCapture.created_at.desc()).limit(10).all()
        
        if not leads:
            return []

        # 2. Extract context
        context = []
        for lead in leads:
            context.append(f"Name: {lead.name}, Email: {lead.email}, Message: {lead.message or 'N/A'}, Brochure: {lead.brochure.title}")

        # 3. Generate Prospect Archetype & Search Queries
        prompt = f"""
        Based on these high-resonance leads, identify the 'Ideal Customer Archetype' and suggest 5 new prospective companies or industries to target.
        Leads:
        {json.dumps(context)}
        
        Return a JSON list of prospects with 'company', 'reason', and 'strategy'.
        """
        
        res = await self.ai.client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        
        prospects = json.loads(res.choices[0].message.content)
        return prospects.get("prospects", [])

retargeting_service = RetargetingService()
