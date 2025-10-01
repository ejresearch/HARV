#!/usr/bin/env python3
"""Quick admin user creation without bcrypt"""
import sqlite3

# Connect to database
conn = sqlite3.connect('harv.db')
cursor = conn.cursor()

# Check if user exists
cursor.execute("SELECT id, is_admin FROM users WHERE email = ?", ('admin@harv.com',))
existing = cursor.fetchone()

if existing:
    user_id, is_admin = existing
    if is_admin:
        print(f"✅ Admin user already exists: admin@harv.com")
    else:
        # Promote to admin
        cursor.execute("UPDATE users SET is_admin = 1 WHERE email = ?", ('admin@harv.com',))
        conn.commit()
        print(f"✅ Promoted admin@harv.com to admin")
else:
    # Insert admin user with known bcrypt hash for password 'admin123'
    # This is $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU2YbYVl5yPm
    # Password: admin123
    cursor.execute("""
        INSERT INTO users (email, hashed_password, name, is_admin, onboarding_data)
        VALUES (?, ?, ?, ?, ?)
    """, (
        'admin@harv.com',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU2YbYVl5yPm',
        'Admin User',
        1,
        None
    ))
    conn.commit()
    print(f"✅ Admin user created successfully!")
    print(f"   Email: admin@harv.com")
    print(f"   Password: admin123")
    print(f"   Name: Admin User")

conn.close()
