#!/usr/bin/env python3
"""
Initialize database with test admin and student users
"""
import sys
sys.path.insert(0, '/Users/elle_jansick/Harv_2/backend')

from app.database import SessionLocal, engine, Base
from app.models import User, OnboardingSurvey
from app.auth import get_password_hash

# Create all tables
Base.metadata.create_all(bind=engine)

# Create database session
db = SessionLocal()

try:
    # Delete all existing users (if any)
    try:
        db.query(User).delete()
        db.commit()
    except:
        db.rollback()

    # Create admin user
    admin = User(
        email="admin@harv.com",
        name="Admin User",
        hashed_password=get_password_hash("admin123"),
        is_admin=True
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    print(f"Created admin user: {admin.email} (ID: {admin.id})")

    # Create student user
    student = User(
        email="student@harv.com",
        name="Test Student",
        hashed_password=get_password_hash("student123"),
        is_admin=False
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    print(f"Created student user: {student.email} (ID: {student.id})")

    # Create onboarding survey for student
    survey = OnboardingSurvey(
        user_id=student.id,
        reason="I want to learn and improve my skills",
        familiarity="beginner",
        learning_style="visual",
        goals="Master the course material",
        background="High school student interested in technology",
        age_grade_level="10th grade",
        learning_notes="I learn best with visual examples and step-by-step guidance"
    )
    db.add(survey)
    db.commit()
    print(f"Created onboarding survey for student")

    print("\nDatabase initialized successfully!")
    print(f"\nAdmin Login:")
    print(f"  Email: admin@harv.com")
    print(f"  Password: admin123")
    print(f"\nStudent Login:")
    print(f"  Email: student@harv.com")
    print(f"  Password: student123")

except Exception as e:
    print(f"Error: {e}")
    db.rollback()
    raise
finally:
    db.close()
