"""
User Progress Endpoints
Tracks student progress across modules
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import User, Conversation, Module
from app.auth import require_admin
from typing import List, Dict, Any

router = APIRouter()

@router.get("/progress/{user_id}")
def get_user_progress(
    user_id: int,
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Get comprehensive progress report for a user (admin only)"""

    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get all modules
    modules = db.query(Module).all()

    # Get conversation stats per module
    progress_data = []
    for module in modules:
        conv_count = db.query(Conversation).filter(
            Conversation.user_id == user_id,
            Conversation.module_id == module.id
        ).count()

        # Get message count (approximate - count conversations * 2 for basic estimate)
        message_count = conv_count * 2

        progress_data.append({
            "module_id": module.id,
            "module_title": module.title,
            "conversations": conv_count,
            "messages": message_count,
            "completed": conv_count > 0,
            "last_activity": None  # Would need timestamps in conversations
        })

    # Overall stats
    total_conversations = db.query(Conversation).filter(
        Conversation.user_id == user_id
    ).count()

    modules_started = sum(1 for p in progress_data if p["conversations"] > 0)

    return {
        "user_id": user_id,
        "user_name": user.name,
        "user_email": user.email,
        "overall": {
            "total_conversations": total_conversations,
            "total_messages": total_conversations * 2,
            "modules_started": modules_started,
            "modules_total": len(modules),
            "completion_rate": round((modules_started / len(modules)) * 100, 1) if modules else 0
        },
        "modules": progress_data
    }
