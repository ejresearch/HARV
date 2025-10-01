"""
Database migration script to add is_admin field to users table
Run this script to update your existing database
"""

import sqlite3
import os

# Database path
DB_PATH = "backend/harv.db"

def add_admin_field():
    """Add is_admin column to users table"""

    if not os.path.exists(DB_PATH):
        print(f"❌ Database not found at {DB_PATH}")
        return False

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Check if column already exists
        cursor.execute("PRAGMA table_info(users)")
        columns = [col[1] for col in cursor.fetchall()]

        if 'is_admin' in columns:
            print("✅ is_admin field already exists in users table")
            conn.close()
            return True

        # Add the column
        cursor.execute("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0")
        conn.commit()

        print("✅ Successfully added is_admin field to users table")

        # Optionally, make the first user an admin
        cursor.execute("SELECT id, email FROM users LIMIT 1")
        first_user = cursor.fetchone()

        if first_user:
            user_id, email = first_user
            cursor.execute("UPDATE users SET is_admin = 1 WHERE id = ?", (user_id,))
            conn.commit()
            print(f"✅ Set first user ({email}) as admin")

        conn.close()
        return True

    except Exception as e:
        print(f"❌ Error adding is_admin field: {e}")
        return False

if __name__ == "__main__":
    print("🔧 Starting database migration...")
    success = add_admin_field()

    if success:
        print("\n✅ Migration completed successfully!")
        print("You can now use admin endpoints with the admin user.")
    else:
        print("\n❌ Migration failed. Check the error messages above.")
