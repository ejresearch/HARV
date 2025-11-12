"""
Complete FastAPI Main Application with Enhanced Memory System Integration
Replace your entire backend/app/main.py with this file
"""

from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env file

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import os
import json

# Import database and models
from app.database import get_db, engine
from app.models import Base, Class, Module, User, Conversation, MemorySummary, OnboardingSurvey, UserProgress

# Import authentication
from app.auth import (
    authenticate_user, create_user_tokens, get_password_hash,
    create_user_account, get_current_user
)

# Import all endpoint routers
from app.endpoints.modules import router as modules_router

# Import classes router
try:
    from app.endpoints.classes import router as classes_router
    print("[OK] Classes router loaded")
except ImportError:
    print("[WARN] Classes router not found")
    from fastapi import APIRouter
    classes_router = APIRouter()

# Import new admin routers
try:
    from app.endpoints.analytics import router as analytics_router
    print("[OK] Analytics router loaded")
except ImportError:
    print("[WARN] Analytics router not found")
    from fastapi import APIRouter
    analytics_router = APIRouter()

try:
    from app.endpoints.corpus import router as corpus_router
    print("[OK] Corpus router loaded")
except ImportError:
    print("[WARN] Corpus router not found")
    from fastapi import APIRouter
    corpus_router = APIRouter()

try:
    from app.endpoints.documents import router as documents_router
    print("[OK] Documents router loaded")
except ImportError:
    print("[WARN] Documents router not found")
    from fastapi import APIRouter
    documents_router = APIRouter()

# Import chat router with fallback
try:
    from app.endpoints.chat import router as chat_router
    print("[OK] Chat router loaded from endpoints")
except ImportError:
    try:
        from app.routers.chat import router as chat_router
        print("[OK] Chat router loaded from routers")
    except ImportError:
        print("[WARN] Chat router not found, creating fallback")
        from fastapi import APIRouter
        chat_router = APIRouter()
        
        @chat_router.get("/health")
        def chat_health():
            return {"status": "Chat router fallback active"}

# Import other routers with fallbacks
try:
    from app.endpoints.memory import router as memory_router
    print("[OK] Memory router loaded")
except ImportError:
    print("[WARN] Memory router not found, creating fallback")
    from fastapi import APIRouter
    memory_router = APIRouter()

try:
    from app.endpoints.conversations import router as conversations_router
    print("[OK] Conversations router loaded")
except ImportError:
    print("[WARN] Conversations router not found, creating fallback")
    from fastapi import APIRouter
    conversations_router = APIRouter()

try:
    from app.endpoints.progress import router as progress_router
    print("[OK] Progress router loaded")
except ImportError:
    print("[WARN] Progress router not found, creating fallback")
    from fastapi import APIRouter
    progress_router = APIRouter()

try:
    from app.endpoints.auth import router as auth_router
    print("[OK] Auth router loaded from endpoints")
except ImportError:
    try:
        from app.routers.auth import router as auth_router
        print("[OK] Auth router loaded from routers")
    except ImportError:
        print("[WARN] Auth router not found, will use inline auth")
        from fastapi import APIRouter
        auth_router = APIRouter()

# Import ASHER testing router
try:
    from app.endpoints.asher import router as asher_router
    print("[OK] ASHER testing router loaded")
except ImportError:
    print("[WARN] ASHER testing router not found")
    from fastapi import APIRouter
    asher_router = APIRouter()

# Check for enhanced memory system
try:
    from app.memory_context_enhanced import DynamicMemoryAssembler
    ENHANCED_MEMORY_AVAILABLE = True
    print("[OK] Enhanced memory system loaded")
except ImportError:
    ENHANCED_MEMORY_AVAILABLE = False
    print("[WARN] Enhanced memory system not available")

# Create FastAPI app
app = FastAPI(
    title="Harv Backend - Enhanced Memory System",
    description="AI Tutoring Platform with 4-Layer Dynamic Memory System",
    version="4.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers with proper prefixes
app.include_router(classes_router, prefix="", tags=["classes"])  # NEW: Class management
app.include_router(modules_router, prefix="", tags=["modules"])
app.include_router(chat_router, prefix="", tags=["chat"])  # No prefix so /chat/ works
app.include_router(memory_router, prefix="", tags=["memory"])
app.include_router(conversations_router, prefix="", tags=["conversations"])
app.include_router(progress_router, prefix="", tags=["progress"])
# app.include_router(auth_router, prefix="", tags=["auth"])  # Temporarily disabled to use inline auth

# Include admin routers
app.include_router(analytics_router, prefix="", tags=["analytics"])
app.include_router(corpus_router, prefix="", tags=["corpus"])
app.include_router(documents_router, prefix="", tags=["documents"])

# Include ASHER testing router
app.include_router(asher_router, prefix="", tags=["asher-testing"])

# Create tables on startup
@app.on_event("startup")
def startup_event():
    print("[START] Starting Harv Backend with Enhanced Memory System...")
    Base.metadata.create_all(bind=engine)
    print("[OK] Database tables created")
    print(f"[MEMORY] Enhanced Memory System: {'Available' if ENHANCED_MEMORY_AVAILABLE else 'Not Available'}")
    print("[INFO] Ready for classes and modules to be created via admin interface")

# Root endpoint
@app.get("/")
def root(db: Session = Depends(get_db)):
    modules_count = db.query(Module).count()
    classes_count = db.query(Class).count()

    return {
        "message": "Harv Backend - Enhanced Memory-Aware AI Tutoring System",
        "status": "running",
        "version": "4.0.0",
        "database": {
            "classes": classes_count,
            "modules": modules_count
        },
        "features": [
            "4-layer dynamic memory system",
            "Socratic tutoring methodology",
            "Enhanced memory-driven responses",
            "Cross-module learning persistence",
            "Real-time context optimization"
        ],
        "enhanced_memory": ENHANCED_MEMORY_AVAILABLE
    }

# Health check with enhanced memory status
@app.get("/health")
def health_check():
    """Enhanced health check with system status"""
    db = next(get_db())
    try:
        # Check database connectivity
        module_count = db.query(Module).count()
        user_count = db.query(User).count()
        conversation_count = db.query(Conversation).count()
        memory_count = db.query(MemorySummary).count()
        
        # Check OpenAI API key
        has_openai_key = bool(os.getenv("OPENAI_API_KEY"))
        
        return {
            "status": "healthy",
            "version": "4.0.0",
            "timestamp": datetime.utcnow().isoformat(),
            "course": "Communication Media & Society",
            "database": {
                "modules": module_count,
                "users": user_count,
                "conversations": conversation_count,
                "memory_summaries": memory_count
            },
            "openai_configured": has_openai_key,
            "enhanced_memory": ENHANCED_MEMORY_AVAILABLE,
            "memory_system": "active" if ENHANCED_MEMORY_AVAILABLE else "basic"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }
    finally:
        db.close()

# Simplified auth endpoints for backward compatibility
from pydantic import BaseModel, EmailStr

class SimpleLoginRequest(BaseModel):
    email: EmailStr
    password: str

class SimpleRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = "student"  # "student" or "admin"
    # Student-specific onboarding fields
    age_grade_level: str = ""
    learning_notes: str = ""
    # Original onboarding fields (optional for backward compatibility)
    reason: str = ""
    familiarity: str = ""
    learning_style: str = ""
    goals: str = ""
    background: str = ""

@app.post("/auth/login")
def simple_login(request: SimpleLoginRequest, db: Session = Depends(get_db)):
    """Simplified login endpoint for frontend compatibility"""
    try:
        user = authenticate_user(db, request.email, request.password)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        tokens = create_user_tokens(user.id)

        return {
            "success": True,
            "user_id": user.id,
            "user": {"id": user.id, "email": user.email, "name": user.name, "is_admin": user.is_admin},
            "access_token": tokens["access_token"],
            "refresh_token": tokens["refresh_token"],
            "token_type": tokens["token_type"]
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Login failed")

@app.post("/auth/register")
def simple_register(request: SimpleRegisterRequest, db: Session = Depends(get_db)):
    """Simplified registration endpoint for frontend compatibility"""
    try:
        # Set is_admin based on role
        is_admin = request.role == "admin"

        user = create_user_account(
            db=db,
            email=request.email,
            password=request.password,
            name=request.name,
            reason=request.reason,
            familiarity=request.familiarity,
            learning_style=request.learning_style,
            goals=request.goals,
            background=request.background,
            age_grade_level=request.age_grade_level,
            learning_notes=request.learning_notes
        )

        # Update is_admin flag
        user.is_admin = is_admin
        db.commit()
        db.refresh(user)

        tokens = create_user_tokens(user.id)

        return {
            "success": True,
            "user_id": user.id,
            "user": {"id": user.id, "email": user.email, "name": user.name, "is_admin": user.is_admin},
            "access_token": tokens["access_token"],
            "refresh_token": tokens["refresh_token"],
            "token_type": tokens["token_type"]
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail="Registration failed")

# Additional endpoints for enhanced memory system
@app.get("/memory")
def get_all_memory_summaries(db: Session = Depends(get_db)):
    """Get all memory summaries (for admin dashboard)"""
    summaries = db.query(MemorySummary).all()
    return {
        "summaries": [
            {
                "id": s.id,
                "user_id": s.user_id,
                "module_id": s.module_id,
                "conversation_id": s.conversation_id,
                "what_learned": s.what_learned,
                "how_learned": s.how_learned,
                "key_concepts": s.key_concepts,
                "created_at": s.created_at.isoformat() if s.created_at else None
            }
            for s in summaries
        ],
        "total": len(summaries)
    }

@app.get("/users/me")
async def get_me(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    db: Session = Depends(get_db)
):
    """Get current authenticated user's info"""
    from app.auth import verify_token

    token_data = verify_token(credentials.credentials)
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == token_data["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": "admin" if user.is_admin else "student",
        "is_admin": user.is_admin
    }

@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    """Get all users with role-specific data (admin only in production)"""
    users = db.query(User).all()
    result = []

    for user in users:
        user_data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "is_admin": user.is_admin,
            "role": "admin" if user.is_admin else "student"
        }

        if user.is_admin:
            # For admins: show how many classes and modules they created
            classes_created = db.query(Class).filter(Class.created_by == user.id).count()
            modules_created = db.query(Module).filter(Module.created_by == user.id).count()
            user_data["classes_created"] = classes_created
            user_data["modules_created"] = modules_created
        else:
            # For students: show onboarding data and completion stats
            survey = db.query(OnboardingSurvey).filter(OnboardingSurvey.user_id == user.id).first()
            if survey:
                user_data["age_grade_level"] = survey.age_grade_level
                user_data["learning_style"] = survey.learning_style
                user_data["familiarity"] = survey.familiarity
                user_data["goals"] = survey.goals

            # Count completed classes and modules
            classes_completed = db.query(UserProgress).filter(
                UserProgress.user_id == user.id,
                UserProgress.class_id.isnot(None),
                UserProgress.completed == True
            ).count()

            modules_completed = db.query(UserProgress).filter(
                UserProgress.user_id == user.id,
                UserProgress.module_id.isnot(None),
                UserProgress.completed == True
            ).count()

            user_data["classes_completed"] = classes_completed
            user_data["modules_completed"] = modules_completed

        result.append(user_data)

    return {"users": result}

class UserUpdateRequest(BaseModel):
    name: str = None

@app.put("/users/{user_id}")
def update_user(user_id: int, update_data: UserUpdateRequest, db: Session = Depends(get_db)):
    """Update user information (admin only in production)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update only the provided fields
    if update_data.name is not None:
        user.name = update_data.name

    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "is_admin": user.is_admin,
        "role": "admin" if user.is_admin else "student"
    }

@app.get("/surveys/{user_id}")
def get_user_survey(user_id: int, db: Session = Depends(get_db)):
    """Get onboarding survey for a specific user"""
    survey = db.query(OnboardingSurvey).filter(OnboardingSurvey.user_id == user_id).first()

    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")

    return {
        "id": survey.id,
        "user_id": survey.user_id,
        "reason": survey.reason,
        "familiarity": survey.familiarity,
        "learning_style": survey.learning_style,
        "goals": survey.goals,
        "background": survey.background,
        "age_grade_level": survey.age_grade_level,
        "learning_notes": survey.learning_notes,
        "created_at": survey.created_at.isoformat() if survey.created_at else None
    }

@app.get("/system/status")
def system_status(db: Session = Depends(get_db)):
    """Get detailed system status"""
    # Query actual database counts
    classes_count = db.query(Class).count()
    modules_count = db.query(Module).count()
    users_count = db.query(User).count()
    conversations_count = db.query(Conversation).count()

    return {
        "enhanced_memory": ENHANCED_MEMORY_AVAILABLE,
        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),
        "version": "4.0.0",
        "database": {
            "classes": classes_count,
            "modules": modules_count,
            "users": users_count,
            "conversations": conversations_count
        },
        "features": {
            "socratic_tutoring": True,
            "memory_persistence": True,
            "cross_module_learning": True,
            "context_optimization": ENHANCED_MEMORY_AVAILABLE
        }
    }

def mask_api_key(key: str) -> str:
    """Mask API key for display (show first 8 and last 4 characters)"""
    if not key or len(key) < 12:
        return ""
    return f"{key[:8]}...{key[-4:]}"

@app.get("/system/api-keys")
def get_api_keys():
    """Get all API keys (masked for security)"""
    providers = {
        "openai": {
            "name": "OpenAI",
            "env_var": "OPENAI_API_KEY",
            "description": "GPT-5, o3, o4, and other OpenAI models",
            "key": mask_api_key(os.getenv("OPENAI_API_KEY", ""))
        },
        "anthropic": {
            "name": "Anthropic",
            "env_var": "ANTHROPIC_API_KEY",
            "description": "Claude Opus 4.1, Sonnet 4, and other Claude models",
            "key": mask_api_key(os.getenv("ANTHROPIC_API_KEY", ""))
        },
        "google": {
            "name": "Google",
            "env_var": "GOOGLE_API_KEY",
            "description": "Gemini 2.5 Pro and other Gemini models",
            "key": mask_api_key(os.getenv("GOOGLE_API_KEY", ""))
        },
        "xai": {
            "name": "xAI",
            "env_var": "XAI_API_KEY",
            "description": "Grok 3 and other xAI models",
            "key": mask_api_key(os.getenv("XAI_API_KEY", ""))
        },
        "perplexity": {
            "name": "Perplexity AI",
            "env_var": "PERPLEXITY_API_KEY",
            "description": "Sonar, Sonar Pro, and other Perplexity models",
            "key": mask_api_key(os.getenv("PERPLEXITY_API_KEY", ""))
        }
    }
    return providers

class ApiKeyUpdate(BaseModel):
    provider: str
    api_key: str

@app.post("/system/api-keys")
def update_api_key(update: ApiKeyUpdate):
    """Update an API key in the .env file"""
    provider_map = {
        "openai": "OPENAI_API_KEY",
        "anthropic": "ANTHROPIC_API_KEY",
        "google": "GOOGLE_API_KEY",
        "xai": "XAI_API_KEY",
        "perplexity": "PERPLEXITY_API_KEY"
    }

    if update.provider not in provider_map:
        raise HTTPException(status_code=400, detail="Invalid provider")

    env_var = provider_map[update.provider]
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")

    try:
        # Read .env file
        with open(env_path, 'r') as f:
            lines = f.readlines()

        # Update or add the key
        key_found = False
        for i, line in enumerate(lines):
            if line.startswith(f"{env_var}="):
                lines[i] = f"{env_var}={update.api_key}\n"
                key_found = True
                break

        if not key_found:
            lines.append(f"{env_var}={update.api_key}\n")

        # Write back to .env file
        with open(env_path, 'w') as f:
            f.writelines(lines)

        # Update environment variable for current process
        os.environ[env_var] = update.api_key

        return {
            "success": True,
            "message": f"{provider_map[update.provider]} updated successfully",
            "masked_key": mask_api_key(update.api_key)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update API key: {str(e)}")

@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Delete a user and all related data (admin only in production)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Delete related records
    db.query(OnboardingSurvey).filter(OnboardingSurvey.user_id == user_id).delete()
    db.query(UserProgress).filter(UserProgress.user_id == user_id).delete()
    db.query(MemorySummary).filter(MemorySummary.user_id == user_id).delete()
    db.query(Conversation).filter(Conversation.user_id == user_id).delete()

    # Delete user
    db.delete(user)
    db.commit()

    return {"success": True, "message": f"User {user.name} deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
