
from sqlalchemy import create_engine, MetaData, Table, Column, String, Integer, DateTime, JSON, text
from sqlalchemy.dialects.postgresql import UUID
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")

def create_tables():
    if not DATABASE_URL:
        print("DATABASE_URL not set")
        return

    # Use psycopg2 driver
    url = DATABASE_URL
    if url.startswith("postgres://"):
             url = url.replace("postgres://", "postgresql://", 1)

    print(f"Connecting to database...")
    engine = create_engine(url)
    
    metadata = MetaData()
    
    # Define profiles table
    # Matches frontend/src/context/AuthContext.tsx expectation
    profiles = Table(
        'profiles', metadata,
        Column('id', UUID(as_uuid=True), primary_key=True), # Linked to auth.users in concept, but we manually insert for now
        Column('email', String, nullable=False),
        Column('full_name', String, nullable=True),
        Column('plan', String, default='free'), # 'free' | 'pro' | 'agency'
        Column('credits', Integer, default=5),
        Column('refine_credits', Integer, default=0),
        Column('brand_vault', JSON, default={}),
        Column('created_at', DateTime, default=datetime.datetime.utcnow)
    )

    try:
        print("Creating tables if not exist...")
        metadata.create_all(engine)
        print("Tables created successfully.")
        
        # Verify
        with engine.connect() as conn:
            result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
            print("Tables in public schema:")
            for row in result:
                print(f" - {row[0]}")
                
    except Exception as e:
        print(f"Error creating tables: {e}")

if __name__ == "__main__":
    create_tables()
