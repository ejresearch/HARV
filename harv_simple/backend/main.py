"""
Simplified Harv - All endpoints in one file
~500 lines instead of 2,417
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import json
import os
from openai import OpenAI

# Import local modules
from database import engine, get_db, Base
from models import User, Module, Conversation, OnboardingSurvey, MemorySummary, UserProgress
from auth import (
    hash_password, verify_password, create_access_token,
    get_current_user, require_admin
)
from memory_context_enhanced import DynamicMemoryAssembler

# Initialize OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Create FastAPI app
app = FastAPI(title="Harv Simple", version="1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# ============================================================================
# PYDANTIC MODELS (Request/Response schemas)
# ============================================================================

class UserRegister(BaseModel):
    email: EmailStr
    name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class ModuleCreate(BaseModel):
    title: str
    description: Optional[str] = None
    content: Optional[str] = None
    socratic_prompt: Optional[str] = None

class ModuleUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    socratic_prompt: Optional[str] = None

class ChatMessage(BaseModel):
    module_id: int
    message: str
    conversation_id: Optional[int] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: int

# ============================================================================
# STARTUP: Create default admin and modules
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Create default admin user and sample modules"""
    db = next(get_db())

    # Create admin if doesn't exist
    admin = db.query(User).filter(User.email == "admin@harv.com").first()
    if not admin:
        admin = User(
            email="admin@harv.com",
            name="Admin",
            hashed_password=hash_password("admin123"),
            is_admin=True
        )
        db.add(admin)
        db.commit()
        print("✓ Created default admin (admin@harv.com / admin123)")

    # Create sample modules if none exist
    if db.query(Module).count() == 0:
        sample_modules = [
            {
                "title": "Introduction to Communication Theory",
                "description": "Explore the foundational concepts of human communication",
                "content": "Key concepts: sender, receiver, message, channel, feedback, noise",
                "socratic_prompt": "Guide the student to discover communication concepts through questioning. Ask about their daily communication experiences."
            },
            {
                "title": "Media Effects",
                "description": "Understanding how media influences society and individuals",
                "content": "Key concepts: cultivation theory, agenda setting, uses and gratifications",
                "socratic_prompt": "Help students think critically about media influence. Ask them to identify examples from their own media consumption."
            },
            {
                "title": "Digital Communication",
                "description": "Modern communication in the digital age",
                "content": "Key concepts: social media, digital identity, online communities",
                "socratic_prompt": "Guide exploration of digital communication. Encourage reflection on their own digital behavior."
            }
        ]

        for mod_data in sample_modules:
            module = Module(**mod_data)
            db.add(module)

        db.commit()
        print(f"✓ Created {len(sample_modules)} sample modules")

    db.close()

# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@app.post("/auth/register", response_model=TokenResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hash_password(user_data.password),
        is_admin=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create token (sub must be string)
    token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "is_admin": user.is_admin
        }
    }

@app.post("/auth/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # Create token (sub must be string)
    token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "is_admin": user.is_admin
        }
    }

@app.get("/auth/me")
def get_me(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "is_admin": current_user.is_admin
    }

# ============================================================================
# CHAT ENDPOINT
# ============================================================================

@app.post("/chat", response_model=ChatResponse)
def chat(
    chat_data: ChatMessage,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Chat with AI tutor using 4-layer memory system"""

    # Get module
    module = db.query(Module).filter(Module.id == chat_data.module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    # Get or create conversation
    if chat_data.conversation_id:
        conversation = db.query(Conversation).filter(
            Conversation.id == chat_data.conversation_id,
            Conversation.user_id == current_user.id
        ).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        conversation = Conversation(
            user_id=current_user.id,
            module_id=module.id,
            messages_json="[]"
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

    # === 4-LAYER MEMORY SYSTEM ===
    # Assemble dynamic context using DynamicMemoryAssembler
    memory_assembler = DynamicMemoryAssembler(db)

    try:
        context = memory_assembler.assemble_dynamic_context(
            user_id=current_user.id,
            module_id=module.id,
            current_message=chat_data.message,
            conversation_id=conversation.id
        )

        # Use the assembled prompt from 4-layer memory
        system_prompt = context['assembled_prompt']

        # Get conversation data to extract recent messages
        conversation_data = context['memory_layers']['conversation_data']
        recent_messages = conversation_data.get('message_history', [])

    except Exception as e:
        print(f"Memory system error: {str(e)}")
        # Fallback to simple system if memory fails
        system_prompt = f"""You are a Socratic AI tutor for {module.title}.

Module: {module.description}
Content: {module.content}
Strategy: {module.socratic_prompt}

Guide through questioning, not direct answers."""

        # Load message history as fallback
        messages = json.loads(conversation.messages_json) if conversation.messages_json else []
        recent_messages = messages[-10:] if len(messages) > 10 else messages

    # Build messages for OpenAI
    openai_messages = [{"role": "system", "content": system_prompt}]

    # Add recent conversation history
    for msg in recent_messages:
        openai_messages.append({
            "role": msg.get("role", "user"),
            "content": msg.get("content", "")
        })

    # Add current user message
    openai_messages.append({
        "role": "user",
        "content": chat_data.message
    })

    # Call OpenAI
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=openai_messages,
            temperature=0.7,
            max_tokens=500
        )
        ai_response = response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")

    # Save messages to conversation
    messages = json.loads(conversation.messages_json) if conversation.messages_json else []
    messages.append({"role": "user", "content": chat_data.message, "timestamp": datetime.utcnow().isoformat()})
    messages.append({"role": "assistant", "content": ai_response, "timestamp": datetime.utcnow().isoformat()})

    conversation.messages_json = json.dumps(messages)
    conversation.updated_at = datetime.utcnow()
    db.commit()

    return {
        "response": ai_response,
        "conversation_id": conversation.id
    }

# ============================================================================
# MODULE ENDPOINTS
# ============================================================================

@app.get("/modules")
def list_modules(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """List all modules"""
    modules = db.query(Module).all()
    return [
        {
            "id": m.id,
            "title": m.title,
            "description": m.description,
            "created_at": m.created_at.isoformat() if m.created_at else None
        }
        for m in modules
    ]

@app.get("/modules/{module_id}")
def get_module(module_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get module details"""
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    return {
        "id": module.id,
        "title": module.title,
        "description": module.description,
        "content": module.content,
        "socratic_prompt": module.socratic_prompt,
        "created_at": module.created_at.isoformat() if module.created_at else None
    }

@app.post("/modules", dependencies=[Depends(require_admin)])
def create_module(module_data: ModuleCreate, db: Session = Depends(get_db)):
    """Create new module (admin only)"""
    module = Module(**module_data.dict())
    db.add(module)
    db.commit()
    db.refresh(module)
    return {"id": module.id, "title": module.title}

@app.put("/modules/{module_id}", dependencies=[Depends(require_admin)])
def update_module(module_id: int, module_data: ModuleUpdate, db: Session = Depends(get_db)):
    """Update module (admin only)"""
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    # Update fields
    for field, value in module_data.dict(exclude_unset=True).items():
        setattr(module, field, value)

    db.commit()
    return {"message": "Module updated"}

@app.delete("/modules/{module_id}", dependencies=[Depends(require_admin)])
def delete_module(module_id: int, db: Session = Depends(get_db)):
    """Delete module (admin only)"""
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    db.delete(module)
    db.commit()
    return {"message": "Module deleted"}

# ============================================================================
# CONVERSATION ENDPOINTS
# ============================================================================

@app.get("/conversations")
def list_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List user's conversations"""
    conversations = db.query(Conversation).filter(
        Conversation.user_id == current_user.id
    ).all()

    result = []
    for conv in conversations:
        messages = json.loads(conv.messages_json) if conv.messages_json else []
        result.append({
            "id": conv.id,
            "module_id": conv.module_id,
            "message_count": len(messages),
            "created_at": conv.created_at.isoformat() if conv.created_at else None,
            "updated_at": conv.updated_at.isoformat() if conv.updated_at else None
        })

    return result

@app.get("/conversations/{conversation_id}")
def get_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get conversation details"""
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    messages = json.loads(conversation.messages_json) if conversation.messages_json else []

    return {
        "id": conversation.id,
        "module_id": conversation.module_id,
        "messages": messages,
        "created_at": conversation.created_at.isoformat() if conversation.created_at else None,
        "updated_at": conversation.updated_at.isoformat() if conversation.updated_at else None
    }

# ============================================================================
# ADMIN ENDPOINTS
# ============================================================================

@app.get("/admin/users", dependencies=[Depends(require_admin)])
def list_users(db: Session = Depends(get_db)):
    """List all users (admin only)"""
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "name": u.name,
            "is_admin": u.is_admin,
            "created_at": u.created_at.isoformat() if u.created_at else None
        }
        for u in users
    ]

@app.get("/admin/stats", dependencies=[Depends(require_admin)])
def get_stats(db: Session = Depends(get_db)):
    """Get system statistics (admin only)"""
    return {
        "total_users": db.query(User).count(),
        "total_students": db.query(User).filter(User.is_admin == False).count(),
        "total_admins": db.query(User).filter(User.is_admin == True).count(),
        "total_modules": db.query(Module).count(),
        "total_conversations": db.query(Conversation).count()
    }

# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.get("/")
def root():
    """API info"""
    return {
        "name": "Harv Simple API",
        "version": "1.0",
        "status": "running",
        "features": [
            "JWT Authentication",
            "AI Chat with GPT-4",
            "Module Management",
            "Simple Memory (last 10 messages)",
            "Admin Panel"
        ]
    }

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Health check with stats"""
    try:
        user_count = db.query(User).count()
        module_count = db.query(Module).count()
        conversation_count = db.query(Conversation).count()

        return {
            "status": "healthy",
            "database": "connected",
            "stats": {
                "users": user_count,
                "modules": module_count,
                "conversations": conversation_count
            }
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }

# ============================================================================
# PUBLIC ENDPOINTS (NO AUTH REQUIRED)
# ============================================================================

@app.get("/public/modules")
def list_modules_public(db: Session = Depends(get_db)):
    """List all modules - no auth required"""
    modules = db.query(Module).all()
    return [
        {
            "id": m.id,
            "title": m.title,
            "description": m.description,
            "created_at": m.created_at.isoformat() if m.created_at else None
        }
        for m in modules
    ]

@app.get("/public/modules/{module_id}")
def get_module_public(module_id: int, db: Session = Depends(get_db)):
    """Get module details - no auth required"""
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    return {
        "id": module.id,
        "title": module.title,
        "description": module.description,
        "content": module.content,
        "socratic_prompt": module.socratic_prompt,
        "created_at": module.created_at.isoformat() if module.created_at else None
    }

@app.post("/public/modules")
def create_module_public(module_data: ModuleCreate, db: Session = Depends(get_db)):
    """Create new module - no auth required"""
    module = Module(**module_data.dict())
    db.add(module)
    db.commit()
    db.refresh(module)
    return {"id": module.id, "title": module.title}

@app.put("/public/modules/{module_id}")
def update_module_public(module_id: int, module_data: ModuleUpdate, db: Session = Depends(get_db)):
    """Update module - no auth required"""
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    for field, value in module_data.dict(exclude_unset=True).items():
        setattr(module, field, value)

    db.commit()
    return {"message": "Module updated"}

@app.delete("/public/modules/{module_id}")
def delete_module_public(module_id: int, db: Session = Depends(get_db)):
    """Delete module - no auth required"""
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    db.delete(module)
    db.commit()
    return {"message": "Module deleted"}

@app.post("/public/chat", response_model=ChatResponse)
def chat_public(chat_data: ChatMessage, db: Session = Depends(get_db)):
    """Chat with AI tutor - no auth required (uses anonymous user)"""

    # Get module
    module = db.query(Module).filter(Module.id == chat_data.module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    # Get or create conversation (use negative ID for anonymous)
    if chat_data.conversation_id:
        conversation = db.query(Conversation).filter(
            Conversation.id == chat_data.conversation_id
        ).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        # Create anonymous conversation (user_id = 1, the default admin)
        conversation = Conversation(
            user_id=1,  # Use default user
            module_id=module.id,
            messages="[]"
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

    # Load message history
    messages = json.loads(conversation.messages) if conversation.messages else []

    # Keep only last 10 messages
    recent_messages = messages[-10:] if len(messages) > 10 else messages

    # Build prompt
    system_prompt = f"""You are a Socratic AI tutor for the module: {module.title}

Module Description: {module.description}

Key Concepts: {module.content}

Teaching Strategy: {module.socratic_prompt}

Your goal is to guide the student to discover knowledge through strategic questioning, not direct answers.
Be encouraging, thought-provoking, and adaptive to their responses."""

    # Build messages for OpenAI
    openai_messages = [{"role": "system", "content": system_prompt}]

    for msg in recent_messages:
        openai_messages.append({
            "role": msg["role"],
            "content": msg["content"]
        })

    openai_messages.append({
        "role": "user",
        "content": chat_data.message
    })

    # Call OpenAI
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=openai_messages,
            temperature=0.7,
            max_tokens=500
        )
        ai_response = response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")

    # Save messages
    messages.append({"role": "user", "content": chat_data.message, "timestamp": datetime.utcnow().isoformat()})
    messages.append({"role": "assistant", "content": ai_response, "timestamp": datetime.utcnow().isoformat()})

    conversation.messages = json.dumps(messages)
    conversation.updated_at = datetime.utcnow()
    db.commit()

    return {
        "response": ai_response,
        "conversation_id": conversation.id
    }

@app.get("/public/stats")
def get_stats_public(db: Session = Depends(get_db)):
    """Get system statistics - no auth required"""
    return {
        "total_modules": db.query(Module).count(),
        "total_conversations": db.query(Conversation).count()
    }
