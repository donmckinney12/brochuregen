import sqlite3
import os
import sys

# Ensure we're in the right directory
current_dir = os.path.dirname(os.path.abspath(__file__))

db_path = os.path.join(current_dir, "sql_app.db")

def migrate():
    print(f"Connecting to database: {db_path}")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # 1. Create brochure_views table
        print("Creating brochure_views table...")
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS brochure_views (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                brochure_id INTEGER NOT NULL,
                viewer_ip_hash VARCHAR NOT NULL,
                user_agent VARCHAR,
                viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(brochure_id) REFERENCES brochures(id)
            )
        ''')
        
        # Add index for faster queries
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_brochure_views_id ON brochure_views(brochure_id)")
        print("brochure_views table created successfully.")

        # 2. Add layout_theme column to brochures table
        print("Checking for layout_theme column in brochures...")
        cursor.execute("PRAGMA table_info(brochures)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'layout_theme' not in columns:
            print("Adding layout_theme column...")
            cursor.execute("ALTER TABLE brochures ADD COLUMN layout_theme VARCHAR DEFAULT 'modern'")
            print("layout_theme column added successfully.")
        else:
            print("layout_theme column already exists.")

        conn.commit()
        print("✅ Migration completed successfully!")

    except Exception as e:
        print(f"❌ Error during migration: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
