import sys
import os

# Add the backend directory to python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import Base, engine
from models.profile import *
from models.api_key import *

def migrate():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("API Keys table created successfully.")

if __name__ == "__main__":
    migrate()
