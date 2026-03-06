import sqlite3
import time
import os
import uuid

db_path = os.path.join(os.path.dirname(__file__), "sql_app.db")

def migrate():
    max_retries = 5
    for attempt in range(max_retries):
        try:
            conn = sqlite3.connect(db_path, timeout=10.0)
            cursor = conn.cursor()
            
            # Add share_uuid to brochures
            cursor.execute("PRAGMA table_info(brochures)")
            columns = [col[1] for col in cursor.fetchall()]
            
            if 'share_uuid' not in columns:
                print("Adding share_uuid column to brochures table...")
                cursor.execute("ALTER TABLE brochures ADD COLUMN share_uuid VARCHAR")
            
            # Backfill existing brochures with a UUID
            cursor.execute("SELECT id FROM brochures WHERE share_uuid IS NULL")
            rows = cursor.fetchall()
            for row in rows:
                brochure_id = row[0]
                new_uuid = str(uuid.uuid4())
                cursor.execute("UPDATE brochures SET share_uuid = ? WHERE id = ?", (new_uuid, brochure_id))
            
            conn.commit()
            print(f"Migration completed successfully. Backfilled {len(rows)} existing brochures.")
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
