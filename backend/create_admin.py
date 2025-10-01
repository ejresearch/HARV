#!/usr/bin/env python3
"""
Admin User Creation Script
Creates an admin user for the HARV system
"""

import sys
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Base, User
from app.auth import get_password_hash
import getpass

def create_admin_user(email: str, password: str, name: str):
    """Create an admin user in the database"""
    db = SessionLocal()

    try:
        # Check if user already exists
        existing = db.query(User).filter(User.email == email.lower()).first()
        if existing:
            print(f"❌ User with email {email} already exists!")
            if existing.is_admin:
                print("   (User is already an admin)")
            else:
                # Promote to admin
                existing.is_admin = True
                db.commit()
                print(f"✅ Promoted {email} to admin!")
            return

        # Truncate password to 72 bytes for bcrypt
        password_truncated = password[:72]

        # Create new admin user
        admin_user = User(
            email=email.lower(),
            hashed_password=get_password_hash(password_truncated),
            name=name,
            is_admin=True
        )

        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        print(f"✅ Admin user created successfully!")
        print(f"   Email: {email}")
        print(f"   Name: {name}")
        print(f"   Admin: True")

    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    print("=" * 60)
    print("HARV Admin User Creation")
    print("=" * 60)
    print()

    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)

    # Interactive mode
    if len(sys.argv) == 1:
        print("Creating admin user (interactive mode)")
        print("-" * 60)
        email = input("Admin email: ").strip()
        name = input("Admin name: ").strip()
        password = getpass.getpass("Password: ")
        password_confirm = getpass.getpass("Confirm password: ")

        if password != password_confirm:
            print("❌ Passwords do not match!")
            sys.exit(1)

        if not email or not name or not password:
            print("❌ All fields are required!")
            sys.exit(1)

        print()
        create_admin_user(email, password, name)

    # Command line mode
    elif len(sys.argv) == 4:
        email, password, name = sys.argv[1], sys.argv[2], sys.argv[3]
        create_admin_user(email, password, name)

    else:
        print("Usage:")
        print("  Interactive: python create_admin.py")
        print("  CLI:         python create_admin.py <email> <password> <name>")
        print()
        print("Example:")
        print("  python create_admin.py admin@harv.com password123 'Admin User'")
        sys.exit(1)

if __name__ == "__main__":
    main()
