# backend/app/models.py
"""
BACKWARD COMPATIBLE Models - Works with your existing database
REPLACE your existing models.py with this file
"""

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()

# Forward declare relationships using strings to avoid circular dependencies

# Class model (NEW - parent of modules)
class Class(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    outline = Column(Text)
    learning_objectives = Column(Text)
    system_prompt = Column(Text)
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))  # Track who created this class
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships (lazy-loaded via strings)
    creator = relationship("User", foreign_keys=[created_by], backref="created_classes")
    modules = relationship("Module", back_populates="class_parent", cascade="all, delete-orphan", lazy="dynamic")
    class_corpus_entries = relationship("ClassCorpus", back_populates="class_parent", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="class_parent", foreign_keys="Document.class_id")
    progress_records = relationship("UserProgress", back_populates="class_parent", foreign_keys="UserProgress.class_id")

# User model (matches your existing database)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String)
    onboarding_data = Column(Text)
    is_admin = Column(Boolean, default=False)
    # Note: created_at, updated_at don't exist in your DB yet
    
    # Relationships
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    progress = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")
    onboarding_survey = relationship("OnboardingSurvey", back_populates="user", uselist=False, cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")
    memory_summaries = relationship("MemorySummary", back_populates="user", cascade="all, delete-orphan")

# Module model (UPDATED - now child of class)
class Module(Base):
    __tablename__ = "modules"

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id", ondelete="CASCADE"))  # NEW: parent class
    title = Column(String, nullable=False)
    description = Column(Text)
    outline = Column(Text)  # NEW: module-level outline
    resources = Column(Text)
    system_prompt = Column(Text)

    # Added by migration
    module_prompt = Column(Text)
    system_corpus = Column(Text)
    module_corpus = Column(Text)
    dynamic_corpus = Column(Text)
    api_endpoint = Column(String, default="https://api.openai.com/v1/chat/completions")
    learning_objectives = Column(Text)
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))  # Track who created this module

    # Note: created_at, updated_at don't exist in your DB yet

    # Relationships
    creator = relationship("User", foreign_keys=[created_by], backref="created_modules")
    class_parent = relationship("Class", back_populates="modules")  # NEW
    conversations = relationship("Conversation", back_populates="module")
    progress = relationship("UserProgress", back_populates="module")
    module_corpus_entries = relationship("ModuleCorpusEntry", back_populates="module", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="module")

# Conversation model (matches your existing database + added columns)
class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    module_id = Column(Integer, ForeignKey("modules.id", ondelete="CASCADE"), nullable=False)
    messages_json = Column(Text)
    created_at = Column(DateTime(timezone=True))  # This exists in your DB
    
    # Added by migration
    title = Column(String, default="New Conversation")
    current_grade = Column(String)
    memory_summary = Column(Text)
    finalized = Column(Boolean, default=False)
    updated_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="conversations")
    module = relationship("Module", back_populates="conversations")

# Document model (UPDATED - can belong to class OR module)
class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    class_id = Column(Integer, ForeignKey("classes.id", ondelete="CASCADE"))  # NEW
    module_id = Column(Integer, ForeignKey("modules.id", ondelete="CASCADE"))
    filename = Column(String)
    content = Column(Text)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="documents")
    class_parent = relationship("Class", back_populates="documents")  # NEW
    module = relationship("Module", back_populates="documents")

# MemorySummary model (matches your existing database)
class MemorySummary(Base):
    __tablename__ = "memory_summaries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    module_id = Column(Integer, ForeignKey("modules.id", ondelete="CASCADE"))
    conversation_id = Column(Integer, ForeignKey("conversations.id", ondelete="CASCADE"))
    what_learned = Column(Text)
    how_learned = Column(Text)
    key_concepts = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="memory_summaries")
    conversation = relationship("Conversation")

# UserProgress model (UPDATED - can track class or module progress)
class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id", ondelete="CASCADE"))  # NEW: class-level progress
    module_id = Column(Integer, ForeignKey("modules.id", ondelete="CASCADE"))  # module-level progress
    completed = Column(Boolean, default=False)
    grade = Column(String)
    completion_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Added by migration (might be NULL)
    time_spent = Column(Integer, default=0)
    attempts = Column(Integer, default=0)

    # Relationships
    user = relationship("User", back_populates="progress")
    class_parent = relationship("Class", back_populates="progress_records")  # Fixed: back_populates must match Class relationship name
    module = relationship("Module", back_populates="progress")

# OnboardingSurvey model (matches your existing database)
class OnboardingSurvey(Base):
    __tablename__ = "onboarding_surveys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reason = Column(Text)
    familiarity = Column(String)
    learning_style = Column(String)
    goals = Column(Text)
    background = Column(Text)
    age_grade_level = Column(Text)  # New field for student age/grade
    learning_notes = Column(Text)   # New field for "how you learn" notes
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="onboarding_survey")

# ClassCorpus model (RENAMED from CourseCorpus - belongs to Class)
class ClassCorpus(Base):
    __tablename__ = "class_corpus"

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id", ondelete="CASCADE"))  # NEW: belongs to class
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    type = Column(String, nullable=False)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    class_parent = relationship("Class", back_populates="class_corpus_entries")  # NEW

# ModuleCorpusEntry model (matches your existing database)
class ModuleCorpusEntry(Base):
    __tablename__ = "module_corpus_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("modules.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    type = Column(String, nullable=False)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    module = relationship("Module", back_populates="module_corpus_entries")
