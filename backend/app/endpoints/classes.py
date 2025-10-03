"""
Class Management Endpoints
Handles CRUD operations for Classes and their hierarchical relationship with Modules
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app.models import Class, Module, ClassCorpus, Document, Conversation, ModuleCorpusEntry, UserProgress
from app.auth import require_admin

router = APIRouter()

# ===== PYDANTIC MODELS =====

class ClassBase(BaseModel):
    title: str
    description: Optional[str] = None
    outline: Optional[str] = None
    learning_objectives: Optional[str] = None
    system_prompt: Optional[str] = None

class ClassCreate(ClassBase):
    pass

class ClassUpdate(ClassBase):
    pass

class ClassResponse(ClassBase):
    id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class ModuleInClass(BaseModel):
    id: int
    title: str
    description: Optional[str]
    outline: Optional[str]
    learning_objectives: Optional[str]

    class Config:
        from_attributes = True

class ClassWithModules(ClassResponse):
    modules: List[ModuleInClass] = []

    class Config:
        from_attributes = True

class ClassCorpusBase(BaseModel):
    title: str
    content: str
    type: str  # 'knowledge', 'reference', 'example'
    order_index: int = 0

class ClassCorpusCreate(ClassCorpusBase):
    class_id: int

class ClassCorpusResponse(ClassCorpusBase):
    id: int
    class_id: int
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

# ===== CLASS CRUD ENDPOINTS =====

@router.get("/classes", response_model=List[ClassWithModules])
def get_all_classes(
    db: Session = Depends(get_db)
):
    """Get all classes with their modules (accessible to all authenticated users)"""
    classes = db.query(Class).all()
    return classes

@router.get("/classes/{class_id}", response_model=ClassWithModules)
def get_class(
    class_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific class with its modules (accessible to all authenticated users)"""
    class_obj = db.query(Class).filter(Class.id == class_id).first()
    if not class_obj:
        raise HTTPException(status_code=404, detail="Class not found")
    return class_obj

@router.post("/classes", response_model=ClassResponse)
def create_class(
    class_data: ClassCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin())
):
    """Create a new class"""
    new_class = Class(**class_data.dict())
    db.add(new_class)
    db.commit()
    db.refresh(new_class)
    return new_class

@router.put("/classes/{class_id}", response_model=ClassResponse)
def update_class(
    class_id: int,
    class_data: ClassUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin())
):
    """Update a class"""
    class_obj = db.query(Class).filter(Class.id == class_id).first()
    if not class_obj:
        raise HTTPException(status_code=404, detail="Class not found")

    for key, value in class_data.dict().items():
        setattr(class_obj, key, value)

    db.commit()
    db.refresh(class_obj)
    return class_obj

@router.delete("/classes/{class_id}")
def delete_class(
    class_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin())
):
    """Delete a class (cascades to modules, corpus, documents)"""
    class_obj = db.query(Class).filter(Class.id == class_id).first()
    if not class_obj:
        raise HTTPException(status_code=404, detail="Class not found")

    # Get all module IDs in this class
    module_ids = [m.id for m in class_obj.modules]

    if module_ids:
        # Delete conversations for these modules
        db.query(Conversation).filter(Conversation.module_id.in_(module_ids)).delete(synchronize_session=False)

        # Delete module corpus entries
        db.query(ModuleCorpusEntry).filter(ModuleCorpusEntry.module_id.in_(module_ids)).delete(synchronize_session=False)

        # Delete user progress for these modules
        db.query(UserProgress).filter(UserProgress.module_id.in_(module_ids)).delete(synchronize_session=False)

        # Delete documents for these modules
        db.query(Document).filter(Document.module_id.in_(module_ids)).delete(synchronize_session=False)

        # Delete the modules themselves
        db.query(Module).filter(Module.id.in_(module_ids)).delete(synchronize_session=False)

    # Delete class-level corpus entries
    db.query(ClassCorpus).filter(ClassCorpus.class_id == class_id).delete(synchronize_session=False)

    # Delete class-level documents
    db.query(Document).filter(Document.class_id == class_id).delete(synchronize_session=False)

    # Delete class-level progress
    db.query(UserProgress).filter(UserProgress.class_id == class_id).delete(synchronize_session=False)

    # Finally delete the class
    db.delete(class_obj)
    db.commit()

    return {"message": "Class deleted successfully"}

# ===== CLASS CORPUS ENDPOINTS =====

@router.get("/classes/{class_id}/corpus", response_model=List[ClassCorpusResponse])
def get_class_corpus(
    class_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin())
):
    """Get all corpus entries for a class"""
    corpus_entries = db.query(ClassCorpus).filter(
        ClassCorpus.class_id == class_id
    ).order_by(ClassCorpus.order_index).all()
    return corpus_entries

@router.post("/classes/{class_id}/corpus", response_model=ClassCorpusResponse)
def create_class_corpus(
    class_id: int,
    corpus_data: ClassCorpusBase,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin())
):
    """Create a new corpus entry for a class"""
    # Verify class exists
    class_obj = db.query(Class).filter(Class.id == class_id).first()
    if not class_obj:
        raise HTTPException(status_code=404, detail="Class not found")

    new_corpus = ClassCorpus(
        class_id=class_id,
        **corpus_data.dict()
    )
    db.add(new_corpus)
    db.commit()
    db.refresh(new_corpus)
    return new_corpus

@router.put("/classes/corpus/{corpus_id}", response_model=ClassCorpusResponse)
def update_class_corpus(
    corpus_id: int,
    corpus_data: ClassCorpusBase,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin())
):
    """Update a class corpus entry"""
    corpus_obj = db.query(ClassCorpus).filter(ClassCorpus.id == corpus_id).first()
    if not corpus_obj:
        raise HTTPException(status_code=404, detail="Corpus entry not found")

    for key, value in corpus_data.dict().items():
        setattr(corpus_obj, key, value)

    db.commit()
    db.refresh(corpus_obj)
    return corpus_obj

@router.delete("/classes/corpus/{corpus_id}")
def delete_class_corpus(
    corpus_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin())
):
    """Delete a class corpus entry"""
    corpus_obj = db.query(ClassCorpus).filter(ClassCorpus.id == corpus_id).first()
    if not corpus_obj:
        raise HTTPException(status_code=404, detail="Corpus entry not found")

    db.delete(corpus_obj)
    db.commit()
    return {"message": "Corpus entry deleted successfully"}

# ===== CLASS DOCUMENTS ENDPOINTS =====

@router.get("/classes/{class_id}/documents")
def get_class_documents(
    class_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin())
):
    """Get all documents for a class"""
    documents = db.query(Document).filter(
        Document.class_id == class_id
    ).all()

    return [{
        "id": doc.id,
        "filename": doc.filename,
        "uploaded_at": doc.uploaded_at,
        "class_id": doc.class_id
    } for doc in documents]
