"""
Corpus Management Endpoints for Admin
Handles both course-level and module-specific corpus entries
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models import CourseCorpus, ModuleCorpusEntry, Module, User
from app.auth import require_admin

router = APIRouter()


# Pydantic schemas
class CourseCorpusCreate(BaseModel):
    title: str
    content: str
    type: str  # "theory", "concept", "example", "guideline"
    order_index: Optional[int] = 0


class CourseCorpusUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    type: Optional[str] = None
    order_index: Optional[int] = None


class ModuleCorpusCreate(BaseModel):
    title: str
    content: str
    type: str
    order_index: Optional[int] = 0


class ModuleCorpusUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    type: Optional[str] = None
    order_index: Optional[int] = None


# ===== COURSE CORPUS ENDPOINTS =====

@router.get("/course-corpus")
def get_course_corpus(
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Get all course-level corpus entries"""
    entries = db.query(CourseCorpus).order_by(CourseCorpus.order_index).all()

    return {
        "entries": [{
            "id": e.id,
            "title": e.title,
            "content": e.content,
            "type": e.type,
            "order_index": e.order_index,
            "created_at": e.created_at.isoformat() if e.created_at else None,
            "updated_at": e.updated_at.isoformat() if e.updated_at else None
        } for e in entries]
    }


@router.post("/course-corpus")
def create_course_corpus_entry(
    entry_data: CourseCorpusCreate,
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Create new course-level corpus entry"""

    # Validate type
    valid_types = ["theory", "concept", "example", "guideline", "definition", "framework"]
    if entry_data.type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Invalid type. Must be one of: {', '.join(valid_types)}")

    new_entry = CourseCorpus(
        title=entry_data.title,
        content=entry_data.content,
        type=entry_data.type,
        order_index=entry_data.order_index
    )

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    return {
        "id": new_entry.id,
        "title": new_entry.title,
        "content": new_entry.content,
        "type": new_entry.type,
        "order_index": new_entry.order_index,
        "created_at": new_entry.created_at.isoformat() if new_entry.created_at else None
    }


@router.put("/course-corpus/{entry_id}")
def update_course_corpus_entry(
    entry_id: int,
    entry_data: CourseCorpusUpdate,
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Update existing course-level corpus entry"""

    entry = db.query(CourseCorpus).filter(CourseCorpus.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Corpus entry not found")

    # Update fields if provided
    if entry_data.title is not None:
        entry.title = entry_data.title
    if entry_data.content is not None:
        entry.content = entry_data.content
    if entry_data.type is not None:
        valid_types = ["theory", "concept", "example", "guideline", "definition", "framework"]
        if entry_data.type not in valid_types:
            raise HTTPException(status_code=400, detail=f"Invalid type. Must be one of: {', '.join(valid_types)}")
        entry.type = entry_data.type
    if entry_data.order_index is not None:
        entry.order_index = entry_data.order_index

    db.commit()
    db.refresh(entry)

    return {
        "id": entry.id,
        "title": entry.title,
        "content": entry.content,
        "type": entry.type,
        "order_index": entry.order_index,
        "updated_at": entry.updated_at.isoformat() if entry.updated_at else None
    }


@router.delete("/course-corpus/{entry_id}")
def delete_course_corpus_entry(
    entry_id: int,
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Delete course-level corpus entry"""

    entry = db.query(CourseCorpus).filter(CourseCorpus.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Corpus entry not found")

    db.delete(entry)
    db.commit()

    return {"message": "Corpus entry deleted successfully", "id": entry_id}


# ===== MODULE CORPUS ENDPOINTS =====

@router.get("/modules/{module_id}/corpus")
def get_module_corpus(
    module_id: int,
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Get all corpus entries for a specific module"""

    # Verify module exists
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    entries = db.query(ModuleCorpusEntry).filter(
        ModuleCorpusEntry.module_id == module_id
    ).order_by(ModuleCorpusEntry.order_index).all()

    return {
        "module_id": module_id,
        "module_title": module.title,
        "entries": [{
            "id": e.id,
            "title": e.title,
            "content": e.content,
            "type": e.type,
            "order_index": e.order_index,
            "created_at": e.created_at.isoformat() if e.created_at else None,
            "updated_at": e.updated_at.isoformat() if e.updated_at else None
        } for e in entries]
    }


@router.post("/modules/{module_id}/corpus")
def create_module_corpus_entry(
    module_id: int,
    entry_data: ModuleCorpusCreate,
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Create new module-specific corpus entry"""

    # Verify module exists
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    # Validate type
    valid_types = ["theory", "concept", "example", "guideline", "definition", "case_study"]
    if entry_data.type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Invalid type. Must be one of: {', '.join(valid_types)}")

    new_entry = ModuleCorpusEntry(
        module_id=module_id,
        title=entry_data.title,
        content=entry_data.content,
        type=entry_data.type,
        order_index=entry_data.order_index
    )

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    return {
        "id": new_entry.id,
        "module_id": module_id,
        "title": new_entry.title,
        "content": new_entry.content,
        "type": new_entry.type,
        "order_index": new_entry.order_index,
        "created_at": new_entry.created_at.isoformat() if new_entry.created_at else None
    }


@router.put("/module-corpus/{entry_id}")
def update_module_corpus_entry(
    entry_id: int,
    entry_data: ModuleCorpusUpdate,
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Update existing module-specific corpus entry"""

    entry = db.query(ModuleCorpusEntry).filter(ModuleCorpusEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Corpus entry not found")

    # Update fields if provided
    if entry_data.title is not None:
        entry.title = entry_data.title
    if entry_data.content is not None:
        entry.content = entry_data.content
    if entry_data.type is not None:
        valid_types = ["theory", "concept", "example", "guideline", "definition", "case_study"]
        if entry_data.type not in valid_types:
            raise HTTPException(status_code=400, detail=f"Invalid type. Must be one of: {', '.join(valid_types)}")
        entry.type = entry_data.type
    if entry_data.order_index is not None:
        entry.order_index = entry_data.order_index

    db.commit()
    db.refresh(entry)

    return {
        "id": entry.id,
        "module_id": entry.module_id,
        "title": entry.title,
        "content": entry.content,
        "type": entry.type,
        "order_index": entry.order_index,
        "updated_at": entry.updated_at.isoformat() if entry.updated_at else None
    }


@router.delete("/module-corpus/{entry_id}")
def delete_module_corpus_entry(
    entry_id: int,
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Delete module-specific corpus entry"""

    entry = db.query(ModuleCorpusEntry).filter(ModuleCorpusEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Corpus entry not found")

    db.delete(entry)
    db.commit()

    return {"message": "Module corpus entry deleted successfully", "id": entry_id}


@router.get("/corpus/types")
def get_corpus_types(
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Get available corpus entry types"""
    return {
        "types": [
            {"value": "theory", "label": "Theory/Framework"},
            {"value": "concept", "label": "Key Concept"},
            {"value": "example", "label": "Example"},
            {"value": "guideline", "label": "Teaching Guideline"},
            {"value": "definition", "label": "Definition"},
            {"value": "case_study", "label": "Case Study"},
            {"value": "framework", "label": "Framework"}
        ]
    }
