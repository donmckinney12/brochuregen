from sqlalchemy import create_engine, text
from core.database import SQLALCHEMY_DATABASE_URL, Base
from models.profile import Organization, Profile, Brochure, ActivityLog, LeadCapture, BrochureView, BrochureComment, BrochureVariant, BrochureEngagement

def fix_db():
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    print(f"Connecting to: {SQLALCHEMY_DATABASE_URL}")
    
    # 1. Create all missing tables based on current model definitions
    print("Creating all missing tables...")
    Base.metadata.create_all(bind=engine)
    print("Base metadata check/creation complete.")

    # 2. Handle SQLite ALTER TABLE for missing columns (since create_all doesn't add columns to existing tables)
    with engine.connect() as conn:
        # profiles schema updates
        try:
            conn.execute(text("SELECT org_id FROM profiles LIMIT 1"))
        except Exception:
            print("Adding missing column 'org_id' to 'profiles' table...")
            conn.execute(text("ALTER TABLE profiles ADD COLUMN org_id VARCHAR"))
            conn.commit()
            
        # brochures schema updates (UUID for sharing)
        try:
            conn.execute(text("SELECT share_uuid FROM brochures LIMIT 1"))
        except Exception:
            print("Adding missing column 'share_uuid' to 'brochures' table...")
            conn.execute(text("ALTER TABLE brochures ADD COLUMN share_uuid VARCHAR"))
            conn.commit()

        # brochures schema updates (Campaign flag)
        try:
            conn.execute(text("SELECT is_campaign FROM brochures LIMIT 1"))
        except Exception:
            print("Adding missing column 'is_campaign' to 'brochures' table...")
            conn.execute(text("ALTER TABLE brochures ADD COLUMN is_campaign INTEGER DEFAULT 0"))
            conn.commit()

    print("✅ Database schema sync complete.")

if __name__ == "__main__":
    fix_db()
