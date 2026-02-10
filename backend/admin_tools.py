from services.db import engine, text
import argparse

def update_user(email: str, credits: int = None, name: str = None):
    if not engine:
        print("❌ Database not connected.")
        return

    try:
        with engine.begin() as conn:
            # 1. Find User ID
            result = conn.execute(text("SELECT id FROM profiles WHERE email = :email"), {"email": email})
            row = result.mappings().first()
            
            if not row:
                print(f"❌ User with email '{email}' not found.")
                return

            user_id = row['id']
            
            # 2. Update Fields
            if credits is not None:
                conn.execute(
                    text("UPDATE profiles SET credits = :amount WHERE id = :uid"), 
                    {"amount": credits, "uid": user_id}
                )
                print(f"✅ Set credits to {credits}")

            if name:
                conn.execute(
                    text("UPDATE profiles SET full_name = :name WHERE id = :uid"), 
                    {"name": name, "uid": user_id}
                )
                print(f"✅ Set name to '{name}'")

            print(f"🎉 Updated user {email}!")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Admin Tool: Update User")
    parser.add_argument("email", help="User email address")
    parser.add_argument("--credits", type=int, help="Amount of credits to set")
    parser.add_argument("--name", type=str, help="Full name to set")
    
    args = parser.parse_args()
    update_user(args.email, args.credits, args.name)
