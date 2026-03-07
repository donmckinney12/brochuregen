import asyncio
import json
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add backend to sys.path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from models.profile import Brochure, Profile
from services.email_exporter import email_exporter
from core.database import Base

# Mock database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

async def test_export():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    try:
        # 1. Create a dummy profile
        profile = Profile(id="user_123", email="test@example.com", credits=10)
        db.add(profile)
        db.commit()
        
        # 2. Create a dummy brochure
        content = {
            "headline": "The Future of Digital Intelligence",
            "subheadline": "Protocol v13.0 Resonance",
            "summary": "Synthesizing high-fidelity marketing assets for enterprise-grade growth.",
            "features": ["Neural Synthesis", "Quantum Analytics", "Direct API Sync"]
        }
        brochure = Brochure(
            user_id="user_123",
            title="Test Brochure",
            content=json.dumps(content),
            share_uuid="test-uuid-123",
            bespoke_image="https://placeholder.com/600x400"
        )
        db.add(brochure)
        db.commit()
        
        # 3. Test Export
        print(f"Testing export for brochure ID: {brochure.id}")
        html = await email_exporter.generate_email_html(db, brochure.id)
        
        # Save to a temp file to verify manually if needed
        with open("test_email_output.html", "w") as f:
            f.write(html)
            
        print("Test complete. HTML generated successfully in 'test_email_output.html'.")
        print(f"HTML Length: {len(html)} bytes")
        
    finally:
        db.close()
        engine.dispose() # Dispose engine to drop connections
        # Clean up database file
        if os.path.exists("test_temp.db"):
            try:
                os.remove("test_temp.db")
            except:
                pass

if __name__ == "__main__":
    asyncio.run(test_export())
