from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import User, Conversation, Module
from app.auth import require_admin
from typing import Optional
import json

router = APIRouter()

@router.get("/conversations")
def get_conversations(
    user_id: Optional[int] = Query(None),
    module_id: Optional[int] = Query(None),
    limit: int = Query(50, le=200),
    offset: int = Query(0, ge=0),
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Get all conversations with optional filtering"""

    query = db.query(Conversation)

    if user_id:
        query = query.filter(Conversation.user_id == user_id)
    if module_id:
        query = query.filter(Conversation.module_id == module_id)

    total = query.count()
    conversations = query.order_by(desc(Conversation.created_at)).limit(limit).offset(offset).all()

    result = []
    for conv in conversations:
        messages = json.loads(conv.messages_json) if conv.messages_json else []
        user = db.query(User).filter(User.id == conv.user_id).first()
        module = db.query(Module).filter(Module.id == conv.module_id).first()

        result.append({
            "id": conv.id,
            "title": conv.title or f"Conversation {conv.id}",
            "user_id": conv.user_id,
            "user_name": user.name if user else "Unknown",
            "module_id": conv.module_id,
            "module_title": module.title if module else "Unknown",
            "message_count": len(messages),
            "created_at": conv.created_at.isoformat() if conv.created_at else None,
            "updated_at": conv.updated_at.isoformat() if conv.updated_at else None,
            "current_grade": conv.current_grade,
            "finalized": conv.finalized
        })

    return {
        "conversations": result,
        "total": total,
        "limit": limit,
        "offset": offset
    }

@router.get("/conversations/{conversation_id}")
def get_conversation(
    conversation_id: int,
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Get detailed conversation data"""

    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    messages = json.loads(conv.messages_json) if conv.messages_json else []
    user = db.query(User).filter(User.id == conv.user_id).first()
    module = db.query(Module).filter(Module.id == conv.module_id).first()

    return {
        "id": conv.id,
        "title": conv.title or f"Conversation {conv.id}",
        "user": {
            "id": conv.user_id,
            "name": user.name if user else "Unknown",
            "email": user.email if user else "Unknown"
        },
        "module": {
            "id": conv.module_id,
            "title": module.title if module else "Unknown"
        },
        "messages": messages,
        "created_at": conv.created_at.isoformat() if conv.created_at else None,
        "updated_at": conv.updated_at.isoformat() if conv.updated_at else None,
        "current_grade": conv.current_grade,
        "memory_summary": conv.memory_summary,
        "finalized": conv.finalized
    }

@router.get("/export/{user_id}")
def export_conversations(user_id: int, db: Session = Depends(get_db)):
    """Export all conversations for a user"""
    try:
        conversations = db.query(Conversation).filter(
            Conversation.user_id == user_id
        ).order_by(Conversation.created_at).all()

        export_data = []
        for conv in conversations:
            messages = json.loads(conv.messages_json) if conv.messages_json else []
            export_data.append({
                "id": conv.id,
                "module_id": conv.module_id,
                "created_at": conv.created_at.isoformat() if conv.created_at else None,
                "messages": messages
            })

        return {
            "user_id": user_id,
            "conversations": export_data,
            "total": len(export_data)
        }
    except Exception as e:
        return {"conversations": [], "total": 0}
