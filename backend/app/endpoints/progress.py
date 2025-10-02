"""
User Progress Endpoints
Tracks student progress across modules
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import (
    User, Conversation, Module, UserProgress, MemorySummary,
    Document, OnboardingSurvey, CourseCorpus, ModuleCorpusEntry
)
from app.auth import require_admin
from typing import List, Dict, Any
from datetime import datetime

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

@router.get("/progress/tables/all")
def get_all_tables_data(db: Session = Depends(get_db)):
    """Get real-time data from all database tables"""

    # Users table
    users = db.query(User).all()
    users_data = [{
        "id": u.id,
        "email": u.email,
        "name": u.name,
        "is_admin": u.is_admin,
        "created_at": getattr(u, 'created_at', None)
    } for u in users]

    # Modules table
    modules = db.query(Module).all()
    modules_data = [{
        "id": m.id,
        "title": m.title,
        "description": m.description[:100] + "..." if m.description and len(m.description) > 100 else m.description,
        "system_prompt": m.system_prompt[:100] + "..." if m.system_prompt and len(m.system_prompt) > 100 else m.system_prompt,
        "module_prompt": m.module_prompt[:100] + "..." if m.module_prompt and len(m.module_prompt) > 100 else m.module_prompt,
        "resources": m.resources[:100] + "..." if m.resources and len(m.resources) > 100 else m.resources,
        "system_corpus": m.system_corpus[:100] + "..." if m.system_corpus and len(m.system_corpus) > 100 else m.system_corpus,
        "module_corpus": m.module_corpus[:100] + "..." if m.module_corpus and len(m.module_corpus) > 100 else m.module_corpus,
        "dynamic_corpus": m.dynamic_corpus[:100] + "..." if m.dynamic_corpus and len(m.dynamic_corpus) > 100 else m.dynamic_corpus,
        "api_endpoint": m.api_endpoint,
        "learning_objectives": m.learning_objectives[:100] + "..." if m.learning_objectives and len(m.learning_objectives) > 100 else m.learning_objectives,
        "created_at": getattr(m, 'created_at', None),
        "updated_at": getattr(m, 'updated_at', None)
    } for m in modules]

    # Conversations table
    conversations = db.query(Conversation).all()
    conversations_data = [{
        "id": c.id,
        "user_id": c.user_id,
        "module_id": c.module_id,
        "title": c.title,
        "message_count": len(c.messages_json) if c.messages_json else 0,
        "finalized": c.finalized,
        "created_at": c.created_at.isoformat() if c.created_at else None,
        "updated_at": c.updated_at.isoformat() if c.updated_at else None
    } for c in conversations]

    # Memory Summaries table
    memory_summaries = db.query(MemorySummary).all()
    memory_data = [{
        "id": m.id,
        "user_id": m.user_id,
        "module_id": m.module_id,
        "conversation_id": m.conversation_id,
        "what_learned": m.what_learned[:100] + "..." if m.what_learned and len(m.what_learned) > 100 else m.what_learned,
        "created_at": m.created_at.isoformat() if m.created_at else None
    } for m in memory_summaries]

    # User Progress table
    user_progress = db.query(UserProgress).all()
    progress_data = [{
        "id": p.id,
        "user_id": p.user_id,
        "module_id": p.module_id,
        "completed": p.completed,
        "grade": p.grade,
        "time_spent": p.time_spent,
        "attempts": p.attempts,
        "created_at": p.created_at.isoformat() if p.created_at else None
    } for p in user_progress]

    # Documents table
    documents = db.query(Document).all()
    documents_data = [{
        "id": d.id,
        "module_id": d.module_id,
        "user_id": d.user_id,
        "filename": d.filename,
        "content_length": len(d.content) if d.content else 0,
        "uploaded_at": d.uploaded_at.isoformat() if d.uploaded_at else None
    } for d in documents]

    # Onboarding Surveys table
    onboarding = db.query(OnboardingSurvey).all()
    onboarding_data = [{
        "id": o.id,
        "user_id": o.user_id,
        "reason": o.reason[:100] + "..." if o.reason and len(o.reason) > 100 else o.reason,
        "familiarity": o.familiarity,
        "learning_style": o.learning_style,
        "created_at": o.created_at.isoformat() if o.created_at else None
    } for o in onboarding]

    # Course Corpus table
    course_corpus = db.query(CourseCorpus).all()
    corpus_data = [{
        "id": c.id,
        "title": c.title,
        "type": c.type,
        "order_index": c.order_index,
        "content_length": len(c.content) if c.content else 0,
        "created_at": c.created_at.isoformat() if c.created_at else None
    } for c in course_corpus]

    # Module Corpus Entries table
    module_corpus = db.query(ModuleCorpusEntry).all()
    module_corpus_data = [{
        "id": m.id,
        "module_id": m.module_id,
        "title": m.title,
        "type": m.type,
        "order_index": m.order_index,
        "content_length": len(m.content) if m.content else 0,
        "created_at": m.created_at.isoformat() if m.created_at else None
    } for m in module_corpus]

    return {
        "timestamp": datetime.utcnow().isoformat(),
        "tables": {
            "users": {
                "count": len(users_data),
                "data": users_data
            },
            "modules": {
                "count": len(modules_data),
                "data": modules_data
            },
            "conversations": {
                "count": len(conversations_data),
                "data": conversations_data
            },
            "memory_summaries": {
                "count": len(memory_data),
                "data": memory_data
            },
            "user_progress": {
                "count": len(progress_data),
                "data": progress_data
            },
            "documents": {
                "count": len(documents_data),
                "data": documents_data
            },
            "onboarding_surveys": {
                "count": len(onboarding_data),
                "data": onboarding_data
            },
            "course_corpus": {
                "count": len(corpus_data),
                "data": corpus_data
            },
            "module_corpus_entries": {
                "count": len(module_corpus_data),
                "data": module_corpus_data
            }
        }
    }
