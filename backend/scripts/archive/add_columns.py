import sqlite3
import time

def add_columns():
    retries = 5
    for i in range(retries):
        try:
            conn = sqlite3.connect('backend/sql_app.db', timeout=10)
            c = conn.cursor()
            
            columns_to_add = [
                "brand_logo_url VARCHAR",
                "brand_primary_color VARCHAR",
                "brand_secondary_color VARCHAR",
                "brand_font VARCHAR",
                "brand_voice_tone VARCHAR"
            ]
            
            for col in columns_to_add:
                try:
                    c.execute(f"ALTER TABLE profiles ADD COLUMN {col};")
                    print(f"Added column {col}")
                except sqlite3.OperationalError as e:
                    if "duplicate column name" in str(e).lower():
                        print(f"Column {col} already exists")
                    else:
                        raise e
                        
            conn.commit()
            print("Successfully updated database schema.")
            break
        except sqlite3.OperationalError as e:
            if "database is locked" in str(e).lower() and i < retries - 1:
                print(f"Database locked, retrying left: {retries - i - 1}")
                time.sleep(1)
            else:
                raise e
        finally:
            if 'conn' in locals():
                conn.close()

if __name__ == "__main__":
    add_columns()
