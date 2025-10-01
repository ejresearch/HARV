"""
Memory Endpoints - Enhanced memory system access
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import MemorySummary, User
from app.auth import get_current_user, require_admin
from typing import Optional
from pydantic import BaseModel

router = APIRouter()

# ===== GET MEMORY SUMMARIES FOR USER =====

@router.get("/memory/{user_id}")
def get_memory_summaries(
    user_id: int,
    module_id: Optional[int] = None,
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Get all memory summaries for a specific user (admin only)"""
    query = db.query(MemorySummary).filter(MemorySummary.user_id == user_id)

    if module_id:
        query = query.filter(MemorySummary.module_id == module_id)

    summaries = query.order_by(MemorySummary.created_at.desc()).all()

    return {
        "user_id": user_id,
        "module_id": module_id,
        "count": len(summaries),
        "summaries": [
            {
                "id": s.id,
                "module_id": s.module_id,
                "summary_text": s.summary_text,
                "context_data": s.context_data,
                "created_at": s.created_at.isoformat() if s.created_at else None,
                "updated_at": s.updated_at.isoformat() if s.updated_at else None
            }
            for s in summaries
        ]
    }

# ===== EXISTING ENDPOINTS =====

class MemorySummaryRequest(BaseModel):
    user_id: int
    module_id: int
    summary_text: str
    context_data: Optional[str] = None

@router.post("/memory/summary")
def create_memory_summary(
    request: MemorySummaryRequest,
    current_user: User = Depends(get_current_user()),
    db: Session = Depends(get_db)
):
    """Create a new memory summary"""
    summary = MemorySummary(
        user_id=request.user_id,
        module_id=request.module_id,
        summary_text=request.summary_text,
        context_data=request.context_data
    )
    db.add(summary)
    db.commit()
    db.refresh(summary)

    return {
        "message": "Memory summary created",
        "summary_id": summary.id
    }

@router.get("/memory/stats/{module_id}")
def get_memory_stats(
    module_id: int,
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Get memory statistics for a module"""
    count = db.query(MemorySummary).filter(MemorySummary.module_id == module_id).count()

    return {
        "module_id": module_id,
        "total_summaries": count
    }

class MemoryTestRequest(BaseModel):
    user_id: int
    module_id: int

@router.post("/memory/test")
def test_memory(
    request: MemoryTestRequest,
    current_user: User = Depends(get_current_user()),
    db: Session = Depends(get_db)
):
    """Test memory retrieval"""
    summaries = db.query(MemorySummary).filter(
        MemorySummary.user_id == request.user_id,
        MemorySummary.module_id == request.module_id
    ).all()

    return {
        "user_id": request.user_id,
        "module_id": request.module_id,
        "found": len(summaries),
        "summaries": [s.summary_text for s in summaries]
    }

class MemoryPreviewRequest(BaseModel):
    user_id: int
    module_id: int

@router.post("/memory/preview")
def preview_memory(
    request: MemoryPreviewRequest,
    current_user: User = Depends(get_current_user()),
    db: Session = Depends(get_db)
):
    """Preview memory context"""
    summaries = db.query(MemorySummary).filter(
        MemorySummary.user_id == request.user_id,
        MemorySummary.module_id == request.module_id
    ).limit(5).all()

    return {
        "preview": [s.summary_text for s in summaries]
    }

class MemoryContextRequest(BaseModel):
    user_id: int
    module_id: int
    conversation_id: Optional[int] = None

@router.post("/memory/context")
def get_memory_context(
    request: MemoryContextRequest,
    current_user: User = Depends(get_current_user()),
    db: Session = Depends(get_db)
):
    """Get full memory context for AI"""
    summaries = db.query(MemorySummary).filter(
        MemorySummary.user_id == request.user_id,
        MemorySummary.module_id == request.module_id
    ).all()

    context = "\n\n".join([s.summary_text for s in summaries])

    return {
        "user_id": request.user_id,
        "module_id": request.module_id,
        "context": context,
        "summary_count": len(summaries)
    }
