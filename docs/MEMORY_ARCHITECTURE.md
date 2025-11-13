# HARV Memory Architecture Documentation

## Overview

HARV uses a **4-layer dynamic memory system** that assembles contextual information from multiple database sources to create intelligent, personalized AI tutoring experiences. This document explains how the memory system works, what data flows through it, and how to use it.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [The 4 Memory Layers](#the-4-memory-layers)
3. [Data Schema Design](#data-schema-design)
4. [Memory Assembly Flow](#memory-assembly-flow)
5. [API Endpoints](#api-endpoints)
6. [Configuration Guide](#configuration-guide)
7. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### The Problem We Solved

**Before:** Each module was isolated. AI had no knowledge of:
- Class-wide teaching philosophy
- Core concepts taught in the course
- What students actually learned in previous modules
- Uploaded course materials
- Earlier parts of long conversations

**After:** Fully integrated system where:
- Class-level settings cascade to all modules
- Core knowledge is defined once, available everywhere
- AI references specific prior learning insights
- Course materials automatically inform responses
- Long conversations maintain coherence

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MEMORY ASSEMBLY SYSTEM                    │
│                                                              │
│  Student Message → DynamicMemoryAssembler                   │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Layer 1: System Data (User Profile)                  │  │
│  │  - OnboardingSurvey                                   │  │
│  │  - Cross-module activity                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Layer 2: Module Data (Teaching Configuration)        │  │
│  │  - Class.system_prompt (CASCADE!)                     │  │
│  │  - ClassCorpus (shared knowledge)                     │  │
│  │  - Module prompts & corpus                            │  │
│  │  - Document.content                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Layer 3: Conversation Data (Active Dialogue)         │  │
│  │  - Last 10 messages (full)                            │  │
│  │  - Older messages (summarized)                        │  │
│  │  - Engagement analysis                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Layer 4: Prior Knowledge (Cross-Module Learning)     │  │
│  │  - MemorySummary.what_learned                         │  │
│  │  - MemorySummary.key_concepts                         │  │
│  │  - Mastered concepts aggregation                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│               Assembled System Prompt (2000-5000 chars)     │
│                           ↓                                  │
│                      Send to AI Provider                     │
└─────────────────────────────────────────────────────────────┘
```

---

## The 4 Memory Layers

### Layer 1: System Data (User Profile)

**Purpose:** Cross-course learning profile

**Data Sources:**
- `OnboardingSurvey` - learning style, pace, background
- `Conversation` - cross-module activity tracking

**What It Provides:**
```python
{
    'learning_profile': {
        'style': 'adaptive',     # From onboarding
        'pace': 'moderate',      # Learning speed preference
        'background': 'beginner' # Prior knowledge level
    },
    'cross_module_mastery': [
        {
            'module_id': 1,
            'last_activity': '2025-11-13T...',
            'message_count': 15
        }
    ]
}
```

**Instructor Benefit:** AI adapts to each student's learning preferences automatically

---

### Layer 2: Module Data (Teaching Configuration)

**Purpose:** Subject-specific teaching context with class-wide inheritance

**Data Sources:**
- `Class` table → `system_prompt`, `learning_objectives` **(CASCADES TO ALL MODULES!)**
- `ClassCorpus` table → Shared knowledge base
- `Module` table → Module-specific prompts
- `Document` table → Uploaded course materials

**What It Provides:**
```python
{
    'class_context': {
        'id': 6,
        'title': 'Introduction to Psychology',
        'system_prompt': 'Use real-world examples...',  # APPLIES TO ALL MODULES
        'learning_objectives': 'Understand core principles...'
    },
    'class_corpus': [
        {
            'title': 'Scientific Method',
            'content': 'Psychology uses the scientific method...',
            'type': 'knowledge',
            'order_index': 1
        }
    ],
    'module_info': {
        'id': 1,
        'title': 'Cognitive Psychology',
        'description': 'Study of mental processes...'
    },
    'teaching_configuration': {
        'system_prompt': 'Guide students through Socratic questioning...',
        'module_prompt': 'Focus on working memory, attention...'
    },
    'document_data': {
        'class_documents': [
            {
                'filename': 'Course_Syllabus.txt',
                'content_preview': 'Introduction to Psychology - Spring 2025...',
                'full_length': 585
            }
        ],
        'module_documents': [...]
    }
}
```

**Key Innovation - Hierarchical Inheritance:**
1. Set `Class.system_prompt` ONCE → applies to ALL modules in that class
2. Define `ClassCorpus` entries ONCE → available in ALL modules
3. Upload class documents ONCE → inform ALL modules

**Instructor Benefit:**
- Consistent teaching philosophy across entire course
- No redundant configuration
- Course materials automatically integrated

---

### Layer 3: Conversation Data (Active Dialogue)

**Purpose:** Real-time dialogue context with intelligent compression

**Data Sources:**
- `Conversation.messages_json` - full chat history

**What It Provides:**
```python
{
    'state': 'active_conversation',
    'message_history': [...],  # Last 10 messages in full
    'old_messages_summary': 'Earlier conversation (15 messages):\n  Breakthrough moments: 1...',  # Summarized!
    'dialogue_context': 'Student: By grouping things...',
    'conversation_analysis': {
        'engagement_level': 'highly_engaged',
        'understanding_indicators': ['making connections']
    }
}
```

**Summarization Logic:**
- Conversations ≤ 20 messages: Keep all
- Conversations > 20 messages:
  - Last 10 messages: **Full detail**
  - Older messages: **Intelligent summary** (breakthroughs, questions, key explorations)

**Student Benefit:** Deep learning sessions stay coherent without AI "forgetting" earlier insights

---

### Layer 4: Prior Knowledge (Cross-Module Learning)

**Purpose:** Build cumulative understanding across modules

**Data Sources:**
- `MemorySummary` table - `what_learned`, `how_learned`, `key_concepts`

**What It Provides:**
```python
{
    'prior_module_insights': [
        {
            'module_title': 'Cognitive Psychology',
            'what_learned': 'Student understands working memory has limited capacity (7±2 items)...',
            'how_learned': 'Discovered through personal phone number example...',
            'key_concepts': 'working memory, attention, cognitive load, capacity limits',
            'last_activity': '2025-11-13T...'
        }
    ],
    'mastered_concepts': ['working memory', 'attention', 'cognitive load', 'capacity limits']
}
```

**Key Innovation:** AI sees **actual learning content**, not just metadata like "had a conversation"

**Student Benefit:** AI makes meaningful connections between modules using their specific insights

---

## Data Schema Design

### Database Tables

```sql
-- Hierarchical Structure
classes (
    id, title, description, outline,
    system_prompt,           -- CASCADES TO ALL MODULES
    learning_objectives,
    created_by, created_at, updated_at
)

modules (
    id, class_id,           -- LINKS TO PARENT CLASS
    title, description, outline,
    system_prompt,          -- Module-specific approach
    module_prompt,
    system_corpus, module_corpus, dynamic_corpus,
    learning_objectives,
    api_endpoint
)

-- Class-Wide Knowledge
class_corpus (
    id, class_id,
    title, content, type,   -- type: 'knowledge', 'reference', 'example'
    order_index             -- Controls display order
)

-- Module-Specific Knowledge
module_corpus_entries (
    id, module_id,
    title, content, type,
    order_index
)

-- User Learning
users (
    id, email, hashed_password, name, is_admin
)

onboarding_surveys (
    id, user_id,
    learning_style,         -- 'visual', 'auditory', 'kinesthetic', 'adaptive'
    preferred_pace,         -- 'slow', 'moderate', 'fast'
    background_knowledge,   -- 'beginner', 'intermediate', 'advanced'
    goals, interests
)

-- Conversations
conversations (
    id, user_id, module_id,
    title, messages_json,   -- Full chat history as JSON array
    memory_summary,         -- Text summary of what was learned
    current_grade,
    finalized,
    created_at, updated_at
)

-- Learning Summaries (CRITICAL FOR LAYER 4!)
memory_summaries (
    id, user_id, module_id, conversation_id,
    what_learned,           -- Specific learning outcomes
    how_learned,            -- Discovery process
    key_concepts,           -- Comma-separated or JSON
    created_at, updated_at
)

-- Course Materials
documents (
    id, user_id, class_id, module_id,
    filename, content,      -- Full document content
    uploaded_at
)

-- Progress Tracking
user_progress (
    id, user_id, class_id, module_id,
    completed, grade,
    time_spent,             -- In minutes
    completion_date
)
```

### Relationship Diagram

```
Class (1) ──────┬──────> (N) Modules
                │
                ├──────> (N) ClassCorpus
                │
                └──────> (N) Documents (class-level)

Module (1) ─────┬──────> (N) ModuleCorpusEntries
                │
                ├──────> (N) Conversations
                │
                ├──────> (N) Documents (module-level)
                │
                └──────> (N) MemorySummary

User (1) ───────┬──────> (1) OnboardingSurvey
                │
                ├──────> (N) Conversations
                │
                ├──────> (N) MemorySummary
                │
                └──────> (N) UserProgress
```

---

## Memory Assembly Flow

### Step-by-Step Process

**1. API Request Arrives**
```python
GET /memory/enhanced/{module_id}?user_id=5&conversation_id=1
```

**2. DynamicMemoryAssembler Initialized**
```python
assembler = DynamicMemoryAssembler(db)
context = assembler.assemble_dynamic_context(
    user_id=5,
    module_id=1,
    conversation_id='1'
)
```

**3. Data Injection (Parallel Queries)**
```python
# All layers query database simultaneously
system_data = _inject_system_data(user)              # Layer 1
module_data = _inject_module_data(module)            # Layer 2 (includes Class!)
conversation_data = _inject_conversation_data(...)    # Layer 3
prior_knowledge = _inject_prior_knowledge(...)        # Layer 4
document_data = _inject_document_data(module)        # Part of Layer 2
```

**4. Prompt Assembly**
```python
assembled_prompt = _assemble_optimized_prompt(
    system_data, module_data, conversation_data,
    prior_knowledge, document_data, current_message
)
```

**5. Final Output Structure**
```python
{
    'assembled_prompt': '=== HARV DYNAMIC MEMORY CONTEXT ===\n...',
    'context_metrics': {
        'total_chars': 2222,
        'optimization_score': 44.44
    },
    'memory_layers': {
        'system_data': {...},
        'module_data': {...},
        'conversation_data': {...},
        'prior_knowledge': {...},
        'document_data': {...}
    },
    'conversation_id': '1',
    'database_status': {
        'onboarding': True,
        'module_config': True,
        'conversation_analysis': True,
        'cross_module': True,
        'documents': True
    }
}
```

---

## API Endpoints

### Memory Inspection

**GET /memory/enhanced/{module_id}**

Retrieve fully assembled memory context for debugging or display.

**Query Parameters:**
- `user_id` (required) - Student ID
- `conversation_id` (optional) - Specific conversation to analyze

**Response:**
```json
{
    "assembled_prompt": "=== HARV DYNAMIC MEMORY CONTEXT ===\n...",
    "context_metrics": {
        "total_chars": 2222,
        "optimization_score": 44.44
    },
    "memory_layers": {
        "system_data": {...},
        "module_data": {...},
        "conversation_data": {...},
        "prior_knowledge": {...},
        "document_data": {...}
    },
    "database_status": {
        "onboarding": true,
        "module_config": true,
        "conversation_analysis": true,
        "cross_module": true,
        "documents": true
    }
}
```

**Example:**
```bash
curl "http://localhost:8000/memory/enhanced/1?user_id=5&conversation_id=1"
```

---

## Configuration Guide

### Setting Up a New Class

**1. Create the Class**
```python
POST /classes
{
    "title": "Introduction to Psychology",
    "description": "A comprehensive psychology course",
    "system_prompt": "Use real-world examples from everyday life. Connect concepts to students' personal experiences. Build understanding incrementally from concrete to abstract.",
    "learning_objectives": "Understand core psychological principles, apply scientific thinking, connect theory to practice"
}
```

**2. Add Class-Wide Knowledge (Optional)**
```python
POST /classes/{class_id}/corpus
{
    "title": "Scientific Method",
    "content": "Psychology uses the scientific method: form hypothesis, design experiment, collect data, analyze results, draw conclusions",
    "type": "knowledge",
    "order_index": 1
}
```

**3. Upload Class Documents (Optional)**
```python
POST /documents/upload
{
    "class_id": 6,
    "filename": "Course_Syllabus.txt",
    "content": "Introduction to Psychology - Spring 2025\n\nCOURSE OBJECTIVES:..."
}
```

**4. Create Modules**
```python
POST /modules
{
    "class_id": 6,  # Links to parent class
    "title": "Cognitive Psychology",
    "description": "Study of mental processes including memory, attention, and perception",
    "system_prompt": "Guide students through Socratic questioning about how the mind processes information",
    "module_prompt": "Focus on working memory, attention mechanisms, and cognitive biases"
}
```

**Result:** Module automatically inherits:
- ✅ Class teaching philosophy
- ✅ Class-wide knowledge entries
- ✅ Class-level documents

---

### Creating Memory Summaries

After a conversation, create a memory summary to enable cross-module learning:

```python
POST /memory/summary
{
    "user_id": 5,
    "module_id": 1,
    "what_learned": "Student understands that working memory has limited capacity (7±2 items) and duration of ~20 seconds. Grasped how attention acts as a selective filter.",
    "how_learned": "Discovered through personal phone number example. Made connections to everyday study habits.",
    "key_concepts": "working memory, attention, cognitive load, capacity limits"
}
```

This summary will then be available in Layer 4 for **all future modules** the student takes!

---

## Troubleshooting

### Memory Not Assembling

**Check database_status in response:**
```json
"database_status": {
    "onboarding": false,    // ⚠️ User has no OnboardingSurvey
    "module_config": true,
    "conversation_analysis": false,  // ⚠️ No active conversation
    "cross_module": false,  // ⚠️ No MemorySummary entries
    "documents": false      // ⚠️ No uploaded documents
}
```

**Solution:** Each false flag indicates missing data. System works without them (fallback values used), but experience is enhanced when all are present.

---

### Class Context Not Appearing

**Symptom:** Module doesn't show class teaching philosophy

**Check:**
1. Does `module.class_id` exist and link to valid class?
2. Does that class have a `system_prompt`?
3. Verify with: `GET /classes/{class_id}`

---

### Documents Not Injecting

**Symptom:** `document_data` in memory_layers is empty

**Check:**
1. Are documents uploaded to correct `class_id` or `module_id`?
2. Does `document.content` field have data?
3. Verify with: `GET /classes/{class_id}/documents` or `GET /documents?module_id=1`

---

### Prior Knowledge Missing

**Symptom:** Layer 4 shows empty `prior_module_insights`

**Cause:** No `MemorySummary` entries for this user from other modules

**Solution:** After conversations, create MemorySummary entries to capture learning

---

## Performance Considerations

### Context Size Management

**Current Optimization:**
- Class prompts: ~200 chars
- ClassCorpus (3 entries): ~300 chars
- Module prompts: ~200 chars
- Documents (chunked): ~1200 chars
- Conversation (last 10): ~800 chars
- Prior knowledge: ~300 chars

**Total: ~2000-5000 chars** (well within AI context limits)

### Database Query Optimization

Memory assembly performs **5 parallel database queries**:
1. OnboardingSurvey + Conversations (Layer 1)
2. Class + ClassCorpus + Module + Documents (Layer 2)
3. Conversation messages (Layer 3)
4. MemorySummary (Layer 4)

All queries use indexed fields for fast retrieval.

---

## Best Practices

### For Instructors

1. **Set class `system_prompt` first** - it cascades to all modules
2. **Use ClassCorpus for core concepts** - define once, available everywhere
3. **Upload syllabi/guides as class documents** - AI stays aligned with course materials
4. **Create MemorySummary after each module** - enables cumulative learning
5. **Review memory inspector** - see exactly what AI "knows"

### For Developers

1. **Always include `conversation_id`** when available - enables summarization
2. **Check `database_status` flags** - indicates what data is available
3. **Monitor `context_metrics.total_chars`** - watch for bloat
4. **Create MemorySummary entries** - critical for Layer 4 functionality

---

## Version History

**v2.0 - Memory System Integration (2025-11-13)**
- ✅ Phase 1: Class-level teaching philosophy inheritance
- ✅ Phase 2: Class-wide knowledge base (ClassCorpus)
- ✅ Phase 3: Learning insights memory (MemorySummary)
- ✅ Phase 4: Document intelligence
- ✅ Phase 5: Conversation summarization

**v1.0 - Basic Memory (Previous)**
- Basic module-level prompts
- Simple conversation history

---

## Support

For questions or issues:
- Review test results in `/docs/TESTING_GUIDE.md`
- Check `/tmp/harv_backend.log` for runtime errors
- Use Memory Inspector (`GET /memory/enhanced/{module_id}`) to debug

---

**Last Updated:** 2025-11-13
**Author:** HARV Development Team
