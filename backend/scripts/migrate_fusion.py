import sys
import os

# Add the backend directory to python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import Base, engine
# Import all models to ensure they are registered with Base
from models.profile import *
from models.api_key import *
from models.webhook import *
from models.team import *

def migrate():
    print("🚀 Initializing System Fusion Tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Models synchronized with Database.")
    except Exception as e:
        print(f"❌ Migration failed: {e}")

if __name__ == "__main__":
    migrate()
