from sqlalchemy.orm import Session
from models.profile import BrochureEngagement
from datetime import datetime

class AnalyticsService:
    def track_engagement(self, db: Session, brochure_id: int, section_id: str, duration_ms: int):
        """
        Record or update engagement metrics for a specific brochure section.
        """
        engagement = db.query(BrochureEngagement).filter(
            BrochureEngagement.brochure_id == brochure_id,
            BrochureEngagement.section_id == section_id
        ).first()

        if not engagement:
            engagement = BrochureEngagement(
                brochure_id=brochure_id, 
                section_id=section_id,
                hover_count=1,
                total_hover_time=duration_ms
            )
            db.add(engagement)
        else:
            engagement.hover_count += 1
            engagement.total_hover_time += duration_ms
            engagement.last_interaction = datetime.utcnow()

        db.commit()
        return engagement

analytics_service = AnalyticsService()
