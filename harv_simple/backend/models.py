"""
Simplified Database Models with 4-Layer Memory Support
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    """User accounts (students and admins)"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    onboarding_survey = relationship("OnboardingSurvey", back_populates="user", uselist=False, cascade="all, delete-orphan")
    memory_summaries = relationship("MemorySummary", back_populates="user", cascade="all, delete-orphan")
    progress = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")

class Module(Base):
    """Learning modules"""
    __tablename__ = "modules"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    content = Column(Text)  # Learning objectives, key concepts
    socratic_prompt = Column(Text)  # Instructions for AI tutor
    system_prompt = Column(Text)  # System-level teaching configuration
    module_prompt = Column(Text)  # Module-specific prompts
    system_corpus = Column(Text)  # System-wide knowledge corpus
    module_corpus = Column(Text)  # Module-specific corpus
    dynamic_corpus = Column(Text)  # Dynamic/real-time corpus
    created_at = Column(DateTime, default=datetime.utcnow)

    conversations = relationship("Conversation", back_populates="module", cascade="all, delete-orphan")
    progress = relationship("UserProgress", back_populates="module", cascade="all, delete-orphan")

class Conversation(Base):
    """Chat conversations between user and AI"""
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    module_id = Column(Integer, ForeignKey("modules.id", ondelete="CASCADE"), nullable=False)
    messages_json = Column(Text, default="[]")  # JSON array of messages (changed for 4-layer memory compatibility)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="conversations")
    module = relationship("Module", back_populates="conversations")

class OnboardingSurvey(Base):
    """User onboarding survey for learning profile (Layer 1: System Data)"""
    __tablename__ = "onboarding_surveys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    learning_style = Column(String)  # visual, auditory, kinesthetic, reading/writing, adaptive
    preferred_pace = Column(String)  # slow, moderate, fast
    background_knowledge = Column(String)  # beginner, intermediate, advanced
    goals = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="onboarding_survey")

class MemorySummary(Base):
    """Memory summaries for learning insights (Layer 4: Prior Knowledge)"""
    __tablename__ = "memory_summaries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    module_id = Column(Integer, ForeignKey("modules.id", ondelete="CASCADE"))
    conversation_id = Column(Integer, ForeignKey("conversations.id", ondelete="CASCADE"))
    what_learned = Column(Text)  # Key concepts learned
    how_learned = Column(Text)  # Learning patterns observed
    key_concepts = Column(Text)  # Important takeaways
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="memory_summaries")

class UserProgress(Base):
    """User progress tracking (Layer 4: Prior Knowledge)"""
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    module_id = Column(Integer, ForeignKey("modules.id", ondelete="CASCADE"), nullable=False)
    completed = Column(Boolean, default=False)
    grade = Column(String)
    completion_date = Column(DateTime)
    time_spent = Column(Integer, default=0)  # minutes
    attempts = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="progress")
    module = relationship("Module", back_populates="progress")
