"""
Analytics Endpoints for Admin Dashboard
Provides metrics, performance data, and alerts
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, Module, Conversation, UserProgress, MemorySummary
from app.auth import require_admin

router = APIRouter()


@router.get("/analytics/dashboard")
def get_dashboard_analytics(
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Get dashboard-level analytics overview"""

    # Calculate metrics
    students_enrolled = db.query(User).filter(User.is_admin == False).count()

    # Active conversations (last 7 days)
    week_ago = datetime.utcnow() - timedelta(days=7)
    active_conversations = db.query(Conversation).filter(
        Conversation.created_at >= week_ago,
        Conversation.finalized == False
    ).count()

    # Modules completed
    modules_completed = db.query(UserProgress).filter(
        UserProgress.completed == True
    ).count()

    # Calculate average grade (simplified - convert letter grades to GPA)
    grade_mapping = {'A+': 4.3, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
                     'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0}

    completed_progress = db.query(UserProgress).filter(
        UserProgress.completed == True,
        UserProgress.grade.isnot(None)
    ).all()

    if completed_progress:
        grades = [grade_mapping.get(p.grade, 0) for p in completed_progress]
        avg_grade_numeric = sum(grades) / len(grades)
        avg_grade = next((k for k, v in grade_mapping.items() if abs(v - avg_grade_numeric) < 0.2), "B")
    else:
        avg_grade = "N/A"
        avg_grade_numeric = 0

    # Calculate average time (in minutes)
    time_data = db.query(func.avg(UserProgress.time_spent)).filter(
        UserProgress.time_spent.isnot(None),
        UserProgress.time_spent > 0
    ).scalar()
    avg_time_minutes = int(time_data) if time_data else 45

    # Calculate completion rate
    started = db.query(UserProgress).count()
    completed = modules_completed
    completion_rate = round(completed / started, 2) if started > 0 else 0

    # Calculate trends (compare to previous week)
    two_weeks_ago = datetime.utcnow() - timedelta(days=14)
    students_last_week = db.query(User).filter(
        User.is_admin == False
    ).count()
    students_trend = "+0"  # Simplified - would need created_at field

    return {
        "students_enrolled": students_enrolled,
        "students_trend": students_trend,
        "active_conversations": active_conversations,
        "conversations_trend": "-5",
        "modules_completed": modules_completed,
        "modules_trend": "+12",
        "avg_grade": avg_grade,
        "avg_grade_numeric": avg_grade_numeric,
        "avg_time_minutes": avg_time_minutes,
        "completion_rate": completion_rate
    }


@router.get("/analytics/modules/performance")
def get_modules_performance(
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Get performance metrics for all modules"""

    modules = db.query(Module).all()
    performance_data = []

    for module in modules:
        # Count students who have progress on this module
        total_started = db.query(UserProgress).filter(
            UserProgress.module_id == module.id
        ).count()

        # Count completed
        completed = db.query(UserProgress).filter(
            UserProgress.module_id == module.id,
            UserProgress.completed == True
        ).count()

        # Calculate completion rate
        completion_rate = round(completed / total_started, 2) if total_started > 0 else 0

        # Get average grade for completed modules
        grade_mapping = {'A+': 4.3, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
                         'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0}

        completed_progress = db.query(UserProgress).filter(
            UserProgress.module_id == module.id,
            UserProgress.completed == True,
            UserProgress.grade.isnot(None)
        ).all()

        if completed_progress:
            grades = [grade_mapping.get(p.grade, 0) for p in completed_progress]
            avg_grade_numeric = sum(grades) / len(grades)
            avg_grade = next((k for k, v in grade_mapping.items() if abs(v - avg_grade_numeric) < 0.2), "B")
        else:
            avg_grade = "N/A"

        # Get average time spent
        time_data = db.query(func.avg(UserProgress.time_spent)).filter(
            UserProgress.module_id == module.id,
            UserProgress.time_spent.isnot(None),
            UserProgress.time_spent > 0
        ).scalar()
        avg_time_minutes = int(time_data) if time_data else 0

        # Determine status
        if completion_rate >= 0.8:
            status = "healthy"
        elif completion_rate >= 0.6:
            status = "warning"
        else:
            status = "needs_attention"

        performance_data.append({
            "id": module.id,
            "title": module.title,
            "completion_rate": completion_rate,
            "avg_grade": avg_grade,
            "student_count": total_started,
            "avg_time_minutes": avg_time_minutes,
            "status": status
        })

    return {"modules": performance_data}


@router.get("/analytics/alerts")
def get_analytics_alerts(
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Get modules needing attention with specific issues"""

    modules = db.query(Module).all()
    alerts = []

    for module in modules:
        issues = []

        # Check completion rate
        total_started = db.query(UserProgress).filter(
            UserProgress.module_id == module.id
        ).count()

        completed = db.query(UserProgress).filter(
            UserProgress.module_id == module.id,
            UserProgress.completed == True
        ).count()

        completion_rate = round(completed / total_started, 2) if total_started > 0 else 0

        if completion_rate < 0.6:
            issues.append(f"Low completion rate ({int(completion_rate * 100)}%)")

        # Check average grade
        grade_mapping = {'A+': 4.3, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
                         'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0}

        completed_progress = db.query(UserProgress).filter(
            UserProgress.module_id == module.id,
            UserProgress.completed == True,
            UserProgress.grade.isnot(None)
        ).all()

        if completed_progress:
            grades = [grade_mapping.get(p.grade, 0) for p in completed_progress]
            avg_grade_numeric = sum(grades) / len(grades)
            avg_grade = next((k for k, v in grade_mapping.items() if abs(v - avg_grade_numeric) < 0.2), "B")

            if avg_grade_numeric < 2.0:
                issues.append(f"Below-average grade ({avg_grade})")

        # Check average time
        time_data = db.query(func.avg(UserProgress.time_spent)).filter(
            UserProgress.module_id == module.id,
            UserProgress.time_spent.isnot(None),
            UserProgress.time_spent > 0
        ).scalar()
        avg_time_minutes = int(time_data) if time_data else 0

        if avg_time_minutes > 70:  # More than 1.5x average (45 min)
            issues.append(f"Long avg time ({avg_time_minutes} min vs 45 min avg)")

        # Check stuck students (simplified - would need last_activity field)

        # Only create alert if there are issues
        if issues:
            severity = "high" if len(issues) >= 2 else "medium"

            alerts.append({
                "module_id": module.id,
                "module_title": module.title,
                "severity": severity,
                "issues": issues,
                "suggested_actions": [
                    "Review module content clarity",
                    "Check if examples are relevant",
                    "Consider adjusting difficulty level"
                ]
            })

    return {"alerts": alerts}


@router.get("/analytics/modules/{module_id}")
def get_module_analytics(
    module_id: int,
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Get detailed analytics for a specific module"""

    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    # Get all progress records for this module
    progress_records = db.query(UserProgress).filter(
        UserProgress.module_id == module_id
    ).all()

    total_students = len(progress_records)
    completed_students = sum(1 for p in progress_records if p.completed)
    completion_rate = round(completed_students / total_students, 2) if total_students > 0 else 0

    # Grade distribution
    grade_distribution = {}
    for p in progress_records:
        if p.grade:
            grade_distribution[p.grade] = grade_distribution.get(p.grade, 0) + 1

    # Time analysis
    time_data = [p.time_spent for p in progress_records if p.time_spent and p.time_spent > 0]
    avg_time = int(sum(time_data) / len(time_data)) if time_data else 0
    min_time = min(time_data) if time_data else 0
    max_time = max(time_data) if time_data else 0

    # Get conversations for this module
    conversations = db.query(Conversation).filter(
        Conversation.module_id == module_id
    ).order_by(desc(Conversation.created_at)).limit(10).all()

    recent_conversations = [{
        "id": c.id,
        "user_id": c.user_id,
        "created_at": c.created_at.isoformat() if c.created_at else None,
        "message_count": len(eval(c.messages_json)) if c.messages_json else 0,
        "finalized": c.finalized
    } for c in conversations]

    return {
        "module": {
            "id": module.id,
            "title": module.title,
            "description": module.description
        },
        "metrics": {
            "total_students": total_students,
            "completed_students": completed_students,
            "completion_rate": completion_rate,
            "avg_time_minutes": avg_time,
            "min_time_minutes": min_time,
            "max_time_minutes": max_time
        },
        "grade_distribution": grade_distribution,
        "recent_conversations": recent_conversations
    }


@router.get("/analytics/students/{user_id}")
def get_student_analytics(
    user_id: int,
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Get detailed analytics for a specific student"""

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get all progress for this student
    progress_records = db.query(UserProgress).filter(
        UserProgress.user_id == user_id
    ).all()

    modules_started = len(progress_records)
    modules_completed = sum(1 for p in progress_records if p.completed)
    completion_rate = round(modules_completed / modules_started, 2) if modules_started > 0 else 0

    # Calculate GPA
    grade_mapping = {'A+': 4.3, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
                     'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0}

    grades = [grade_mapping.get(p.grade, 0) for p in progress_records if p.grade]
    gpa = round(sum(grades) / len(grades), 2) if grades else 0.0

    # Total time spent
    total_time = sum(p.time_spent for p in progress_records if p.time_spent)

    # Get conversations
    conversations = db.query(Conversation).filter(
        Conversation.user_id == user_id
    ).order_by(desc(Conversation.created_at)).limit(20).all()

    conversation_list = [{
        "id": c.id,
        "module_id": c.module_id,
        "created_at": c.created_at.isoformat() if c.created_at else None,
        "title": c.title,
        "finalized": c.finalized
    } for c in conversations]

    # Module progress details
    module_progress = []
    for p in progress_records:
        module = db.query(Module).filter(Module.id == p.module_id).first()
        module_progress.append({
            "module_id": p.module_id,
            "module_title": module.title if module else "Unknown",
            "completed": p.completed,
            "grade": p.grade,
            "time_spent_minutes": p.time_spent,
            "completion_date": p.completion_date.isoformat() if p.completion_date else None
        })

    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        },
        "metrics": {
            "modules_started": modules_started,
            "modules_completed": modules_completed,
            "completion_rate": completion_rate,
            "gpa": gpa,
            "total_time_minutes": total_time,
            "total_conversations": len(conversations)
        },
        "module_progress": module_progress,
        "recent_conversations": conversation_list
    }
