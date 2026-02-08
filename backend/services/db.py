
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")

engine = None
SessionLocal = None

if DATABASE_URL:
    try:
        # Use psycopg2 driver
        if DATABASE_URL.startswith("postgres://"):
             DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
             
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    except Exception as e:
        print(f"DB Config Error: {e}")

def get_user_profile(user_id: str):
    if not engine: return None
    try:
        with engine.connect() as conn:
            # properly handle uuid mapping if needed, but text usually handles strings fine for uuid comparison
            result = conn.execute(text("SELECT * FROM profiles WHERE id = :uid"), {"uid": user_id})
            row = result.mappings().first()
            return dict(row) if row else None
    except Exception as e:
        print(f"Error fetching profile: {e}")
        return None

def deduct_credits_server(user_id: str, amount: int = 1, credit_type: str = 'credits'):
    if not engine: return {"success": False, "error": "DB not connected"}
    
    try:
        with engine.begin() as conn: # Transaction
            # Check balance (sanitize column name to avoid injection, though we control credit_type)
            if credit_type not in ['credits', 'refine_credits']:
                return {"success": False, "error": "Invalid credit type"}

            result = conn.execute(text(f"SELECT {credit_type} FROM profiles WHERE id = :uid"), {"uid": user_id})
            row = result.mappings().first()
            if not row:
                return {"success": False, "error": "User not found"}
            
            current_balance = row[credit_type]
            if current_balance is None: current_balance = 0
            
            if current_balance < amount:
                return {"success": False, "error": "Insufficient credits"}
            
            # Deduct
            conn.execute(text(f"UPDATE profiles SET {credit_type} = {credit_type} - :amt WHERE id = :uid"), {"amt": amount, "uid": user_id})
            
            return {"success": True, "new_balance": current_balance - amount}
            
    except Exception as e:
        return {"success": False, "error": str(e)}
