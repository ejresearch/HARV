from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.models import Module, User
from app.database import get_db
from app.auth import require_admin
from typing import Optional

router = APIRouter()

class ModuleConfig(BaseModel):
    system_prompt: Optional[str] = None
    module_prompt: Optional[str] = None
    system_corpus: Optional[str] = None
    module_corpus: Optional[str] = None
    dynamic_corpus: Optional[str] = None
    api_endpoint: Optional[str] = None

class ModuleCreate(BaseModel):
    class_id: int  # NEW: required parent class
    title: str
    description: Optional[str] = None
    outline: Optional[str] = None  # NEW
    resources: Optional[str] = None
    system_prompt: Optional[str] = None
    module_prompt: Optional[str] = None
    system_corpus: Optional[str] = None
    module_corpus: Optional[str] = None
    dynamic_corpus: Optional[str] = None
    api_endpoint: Optional[str] = "https://api.openai.com/v1/chat/completions"
    learning_objectives: Optional[str] = None

class ModuleUpdate(BaseModel):
    class_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    outline: Optional[str] = None
    resources: Optional[str] = None
    system_prompt: Optional[str] = None
    learning_objectives: Optional[str] = None

@router.get("/modules")
def get_modules(db: Session = Depends(get_db)):
    modules = db.query(Module).all()
    return {"modules": modules}

@router.get("/modules/{module_id}")
def get_module_config(module_id: int, db: Session = Depends(get_db)):
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return module

@router.put("/modules/{module_id}")
def update_module_config(module_id: int, config: ModuleConfig, db: Session = Depends(get_db)):
    module = db.query(Module).filter(Module.id == module_id).first()
    
    if not module:
        module = Module(
            id=module_id, 
            title=f"Module {module_id}",
            description="",
            resources=""
        )
        db.add(module)
    
    # Update fields
    if config.system_prompt is not None:
        module.system_prompt = config.system_prompt
    if config.module_prompt is not None:
        module.module_prompt = config.module_prompt
    if config.system_corpus is not None:
        module.system_corpus = config.system_corpus
    if config.module_corpus is not None:
        module.module_corpus = config.module_corpus
    if config.dynamic_corpus is not None:
        module.dynamic_corpus = config.dynamic_corpus
    if config.api_endpoint is not None:
        module.api_endpoint = config.api_endpoint
    
    db.commit()
    db.refresh(module)
    return {"message": f"Configuration saved for Module {module_id}"}

@router.get("/modules/{module_id}/config")
def get_module_config_api(module_id: int, db: Session = Depends(get_db)):
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    return {
        "id": module.id,
        "title": module.title,
        "system_prompt": module.system_prompt or "",
        "module_prompt": module.module_prompt or "",
        "system_corpus": module.system_corpus or "",
        "module_corpus": module.module_corpus or "",
        "dynamic_corpus": module.dynamic_corpus or ""
    }

@router.put("/modules/{module_id}/config")
def update_module_config_api(module_id: int, config: dict, db: Session = Depends(get_db)):
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    for field, value in config.items():
        if hasattr(module, field):
            setattr(module, field, value)
    
    db.commit()
    return {"message": "Configuration updated successfully"}

@router.get("/modules/{module_id}/test")
def test_module_config(module_id: int, db: Session = Depends(get_db)):
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    return {
        "module_id": module_id,
        "title": module.title,
        "config_status": "loaded",
        "has_prompts": bool(module.system_prompt and module.module_prompt),
        "has_corpus": bool(module.system_corpus or module.module_corpus)
    }

@router.get("/classes/{class_id}/modules")
def get_class_modules(class_id: int, db: Session = Depends(get_db)):
    """Get all modules for a specific class"""
    modules = db.query(Module).filter(Module.class_id == class_id).all()
    return {"modules": modules}

@router.post("/modules")
def create_module(
    module_data: ModuleCreate,
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Create a new module (must belong to a class)"""

    # Create new module
    new_module = Module(
        class_id=module_data.class_id,  # NEW
        title=module_data.title,
        description=module_data.description,
        outline=module_data.outline,  # NEW
        resources=module_data.resources or "",
        system_prompt=module_data.system_prompt,
        module_prompt=module_data.module_prompt,
        system_corpus=module_data.system_corpus,
        module_corpus=module_data.module_corpus,
        dynamic_corpus=module_data.dynamic_corpus,
        api_endpoint=module_data.api_endpoint,
        learning_objectives=module_data.learning_objectives
    )

    db.add(new_module)
    db.commit()
    db.refresh(new_module)

    return {
        "message": "Module created successfully",
        "module": new_module
    }

@router.delete("/modules/{module_id}")
def delete_module(
    module_id: int,
    admin_user: User = Depends(require_admin()),
    db: Session = Depends(get_db)
):
    """Delete a module and all associated data"""

    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    module_title = module.title
    db.delete(module)
    db.commit()

    return {
        "message": f"Module '{module_title}' deleted successfully",
        "module_id": module_id
    }
