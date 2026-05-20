import sqlite3
import time
import os

db_path = os.path.join(os.path.dirname(__file__), "sql_app.db")

def migrate():
    max_retries = 5
    for attempt in range(max_retries):
        try:
            conn = sqlite3.connect(db_path, timeout=10.0)
            cursor = conn.cursor()
            
            cursor.execute("PRAGMA table_info(brochures)")
            columns = [col[1] for col in cursor.fetchall()]
            
            if 'is_campaign' not in columns:
                print("Adding is_campaign column to brochures table...")
                cursor.execute("ALTER TABLE brochures ADD COLUMN is_campaign INTEGER DEFAULT 0")
            
            if 'social_posts' not in columns:
                print("Adding social_posts column to brochures table...")
                cursor.execute("ALTER TABLE brochures ADD COLUMN social_posts VARCHAR")
                
            if 'email_sequence' not in columns:
                print("Adding email_sequence column to brochures table...")
                cursor.execute("ALTER TABLE brochures ADD COLUMN email_sequence VARCHAR")
            
            conn.commit()
            print("Campaign columns migration completed successfully.")
            conn.close()
            break
        except sqlite3.OperationalError as e:
            if "database is locked" in str(e):
                print(f"Database locked, retrying in 2 seconds... (Attempt {attempt + 1}/{max_retries})")
                time.sleep(2)
            else:
                print(f"An error occurred: {e}")
                break
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            break

if __name__ == "__main__":
    migrate()
