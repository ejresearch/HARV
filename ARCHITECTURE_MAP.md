# HARV Learning Platform - Architecture Map

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                │
│                                                                     │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐      │
│  │   Login/     │     │   Student    │     │    Admin     │      │
│  │  Register    │────▶│  Dashboard   │     │  Dashboard   │      │
│  └──────────────┘     └──────────────┘     └──────────────┘      │
│         │                     │                     │              │
│         └─────────────────────┴─────────────────────┘              │
│                              │                                     │
│                    ┌─────────▼─────────┐                          │
│                    │   Frontend App    │                          │
│                    │   (index.html)    │                          │
│                    │                   │                          │
│                    │  • app.js (v51)   │                          │
│                    │  • classes.js     │                          │
│                    │  • notifications  │                          │
│                    └─────────┬─────────┘                          │
└──────────────────────────────┼─────────────────────────────────────┘
                               │
                               │ HTTP/JSON API
                               │ Token: Bearer <JWT>
                               │
┌──────────────────────────────▼─────────────────────────────────────┐
│                      FASTAPI BACKEND                               │
│                    (localhost:8000)                                │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    API ENDPOINTS                            │  │
│  │                                                             │  │
│  │  /auth/login          → Authenticate & return JWT          │  │
│  │  /auth/register       → Create new user account            │  │
│  │  /users/me            → Get current user info              │  │
│  │  /chat/enhanced       → Send message, get AI response      │  │
│  │  /conversations       → List/filter conversations          │  │
│  │  /classes             → Manage classes                     │  │
│  │  /modules             → Manage modules                     │  │
│  │  /memory/{user_id}    → Get user's learning memory         │  │
│  │  /system/api-keys     → Manage AI provider keys            │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                               │                                    │
│  ┌────────────────────────────▼──────────────────────────────┐    │
│  │              MULTI-PROVIDER AI MANAGER                    │    │
│  │                                                            │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │    │
│  │  │  OpenAI  │  │ Anthropic│  │  Google  │  │   xAI    │ │    │
│  │  │  GPT-4   │  │  Claude  │  │  Gemini  │  │  Grok    │ │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │    │
│  │       ▲              ▲              ▲              ▲      │    │
│  │       └──────────────┴──────────────┴──────────────┘      │    │
│  │              API Keys from .env file                      │    │
│  └───────────────────────────────────────────────────────────┘    │
│                               │                                    │
│  ┌────────────────────────────▼──────────────────────────────┐    │
│  │                  SQLite DATABASE                          │    │
│  │                   (harv.db)                               │    │
│  │                                                            │    │
│  │  Tables:                                                  │    │
│  │  • users              → User accounts & roles             │    │
│  │  • classes            → Course classes                    │    │
│  │  • modules            → Learning modules                  │    │
│  │  • conversations      → Chat history (JSON)               │    │
│  │  • memory_summaries   → Learning insights                 │    │
│  │  • onboarding_survey  → Student preferences               │    │
│  │  • user_progress      → Completion tracking               │    │
│  └───────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌──────────┐                                          ┌──────────┐
│  BROWSER │                                          │  BACKEND │
└────┬─────┘                                          └────┬─────┘
     │                                                     │
     │ 1. User enters email/password                      │
     ├──────────POST /auth/login ────────────────────────▶│
     │    { email, password }                             │
     │                                                     │
     │                              2. Check credentials  │
     │                                 Hash password      │
     │                                 Generate JWT       │
     │                                                     │
     │◀────────── JWT Token + User Info ──────────────────┤
     │    { access_token, user: {id, name, is_admin} }   │
     │                                                     │
     │ 3. Store token in localStorage                     │
     │    currentUser = user                              │
     │    authToken = access_token                        │
     │                                                     │
     │ 4. All future requests include token               │
     ├──────────GET /users/me ───────────────────────────▶│
     │    Headers: { Authorization: "Bearer <token>" }    │
     │                                                     │
     │                              5. Verify JWT         │
     │                                 Decode user_id     │
     │                                 Fetch user data    │
     │                                                     │
     │◀────────── User Profile Data ──────────────────────┤
     │                                                     │
```

---

## 💬 Chat/Conversation Flow

```
┌─────────────┐                                    ┌─────────────┐
│  STUDENT    │                                    │   BACKEND   │
│  CHAT UI    │                                    │             │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │ 1. Student types message                        │
       │    "What is media cultivation theory?"          │
       │                                                  │
       ├─────── POST /chat/enhanced ────────────────────▶│
       │  {                                               │
       │    user_id: 2,                                   │
       │    module_id: 4,                                 │
       │    message: "What is...",                        │
       │    provider: "openai-gpt4",                      │
       │    conversation_id: null                         │
       │  }                                               │
       │                                                  │
       │              2. BACKEND PROCESSING               │
       │              ┌──────────────────────────────┐    │
       │              │ DynamicMemoryAssembler       │    │
       │              │                              │    │
       │              │ a) Fetch user profile        │    │
       │              │ b) Get learning memories     │    │
       │              │ c) Load conversation history │    │
       │              │ d) Retrieve module corpus    │    │
       │              │                              │    │
       │              │ e) Build 4-layer context:    │    │
       │              │    Layer 1: User Profile     │    │
       │              │    Layer 2: Memories         │    │
       │              │    Layer 3: Conversations    │    │
       │              │    Layer 4: Module Content   │    │
       │              └──────────────────────────────┘    │
       │                          │                       │
       │              3. Send to AI Provider              │
       │              ┌──────────────────────────────┐    │
       │              │ OpenAI / Claude / Gemini     │    │
       │              │                              │    │
       │              │ System Prompt: [4-layer      │    │
       │              │   context + Socratic tutor]  │    │
       │              │                              │    │
       │              │ User Message: "What is..."   │    │
       │              │                              │    │
       │              │ → AI generates reply         │    │
       │              └──────────────────────────────┘    │
       │                          │                       │
       │              4. Save to Database                 │
       │              ┌──────────────────────────────┐    │
       │              │ Conversation Table           │    │
       │              │                              │    │
       │              │ messages_json: [             │    │
       │              │   {role: "user", content},   │    │
       │              │   {role: "assistant", ...}   │    │
       │              │ ]                            │    │
       │              │                              │    │
       │              │ updated_at: NOW()            │    │
       │              └──────────────────────────────┘    │
       │                                                  │
       │◀─────── AI Response + conversation_id ──────────┤
       │  {                                               │
       │    reply: "Great question! Let me...",          │
       │    conversation_id: "123",                       │
       │    memory_metrics: {...},                        │
       │    enhanced: true                                │
       │  }                                               │
       │                                                  │
       │ 5. Display reply in chat UI                     │
       │    Append to message history                    │
       │    Store conversation_id for next message       │
       │                                                  │
```

---

## 🧠 4-Layer Memory System

```
┌────────────────────────────────────────────────────────────────┐
│                    MEMORY ASSEMBLY PROCESS                     │
│                 (DynamicMemoryAssembler)                       │
└───────────────────────────┬────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
    ┌───────────────┐              ┌───────────────┐
    │  User Profile │              │ Learning      │
    │  (Layer 1)    │              │ Memories      │
    │               │              │ (Layer 2)     │
    │ • Name        │              │               │
    │ • Age/Grade   │              │ • What learned│
    │ • Learning    │              │ • How learned │
    │   style       │              │ • Key concepts│
    │ • Preferences │              │ • Struggles   │
    └───────┬───────┘              └───────┬───────┘
            │                               │
            └───────────────┬───────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Conversations │
                    │ (Layer 3)     │
                    │               │
                    │ • Recent msgs │
                    │ • Questions   │
                    │ • Patterns    │
                    │ • Topics      │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Module Corpus │
                    │ (Layer 4)     │
                    │               │
                    │ • Module text │
                    │ • Documents   │
                    │ • References  │
                    │ • Examples    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  ASSEMBLED    │
                    │  PROMPT       │
                    │               │
                    │ [All 4 layers │
                    │  combined +   │
                    │  Socratic     │
                    │  instructions]│
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  AI PROVIDER  │
                    │  (GPT-4, etc) │
                    └───────────────┘
```

---

## 🗄️ Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE TABLES                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ name            │
│ email (unique)  │
│ hashed_password │
│ is_admin        │─────┐
│ created_at      │     │
└─────────────────┘     │
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌─────────────────┐           ┌─────────────────┐
│    classes      │           │ onboarding_     │
├─────────────────┤           │    survey       │
│ id (PK)         │           ├─────────────────┤
│ name            │           │ id (PK)         │
│ description     │           │ user_id (FK) ───┘
│ created_by (FK) │           │ age_grade_level │
│ created_at      │           │ learning_style  │
└────────┬────────┘           │ learning_notes  │
         │                    └─────────────────┘
         │
         │
         ▼
┌─────────────────┐
│    modules      │
├─────────────────┤
│ id (PK)         │
│ class_id (FK)   │
│ title           │
│ description     │
│ system_prompt   │────┐ Used to build
│ module_prompt   │────┤ AI context
│ system_corpus   │────┤
│ module_corpus   │────┤
│ dynamic_corpus  │────┘
│ created_by (FK) │
└────────┬────────┘
         │
         │
         ▼
┌─────────────────┐
│ conversations   │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ module_id (FK)  │
│ title           │
│ messages_json   │────▶ [{"role": "user", "content": "..."},
│ created_at      │        {"role": "assistant", "content": "..."}]
│ updated_at      │
└────────┬────────┘
         │
         │
         ▼
┌─────────────────┐
│ memory_         │
│  summaries      │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ module_id (FK)  │
│ conversation_id │
│ what_learned    │────┐ AI-generated
│ how_learned     │────┤ learning
│ key_concepts    │────┤ insights
│ struggles       │────┘
│ created_at      │
└─────────────────┘
```

---

## 🔄 Data Flow: Complete User Journey

```
1. APP BOOT
   ↓
   index.html loads
   ↓
   Check localStorage for token
   ↓
   ┌─────────────────────┐
   │ Token exists?       │
   └──────┬──────────────┘
          │
    YES   │   NO
   ┌──────┴──────┐
   │             │
   ▼             ▼
Validate     Show Login
with API     Overlay
   │
   ▼
Get user info
   │
   ▼
Load Dashboard
(admin or student)

───────────────────────────

2. STUDENT LEARNING SESSION
   ↓
   Select Class → Select Module
   ↓
   Open Chat Interface
   ↓
   Type question
   ↓
   Frontend sends to /chat/enhanced
   ↓
   Backend assembles 4-layer context
   ↓
   Send to AI provider (OpenAI/Claude/etc)
   ↓
   AI generates Socratic response
   ↓
   Save to conversations table
   ↓
   Return response to frontend
   ↓
   Display in chat UI
   ↓
   [Repeat for each message]
   ↓
   System auto-generates memory summary
   ↓
   Stored in memory_summaries table

───────────────────────────

3. ADMIN WORKFLOW
   ↓
   Login as admin
   ↓
   Admin Dashboard
   ↓
   ┌─────────────────────────┐
   │ Create Class            │
   │   ↓                     │
   │ Add Modules to Class    │
   │   ↓                     │
   │ Configure AI prompts    │
   │   ↓                     │
   │ Upload corpus documents │
   │   ↓                     │
   │ Add/manage students     │
   │   ↓                     │
   │ Monitor progress        │
   │   ↓                     │
   │ Review conversations    │
   │   ↓                     │
   │ Inspect memory system   │
   └─────────────────────────┘
```

---

## 🌐 API Request Example

```
┌──────────────────────────────────────────────────────────────┐
│                  CHAT REQUEST LIFECYCLE                      │
└──────────────────────────────────────────────────────────────┘

REQUEST:
--------
POST http://localhost:8000/chat/enhanced

Headers:
  Content-Type: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...

Body:
{
  "user_id": 2,
  "module_id": 4,
  "message": "What is cultivation theory?",
  "provider": "openai-gpt4",
  "conversation_id": "123"
}

BACKEND PROCESSING:
------------------
1. Verify JWT token → Extract user_id
2. Load DynamicMemoryAssembler
3. Fetch from database:
   - User profile (users + onboarding_survey)
   - Learning memories (memory_summaries)
   - Conversation history (conversations)
   - Module content (modules + corpus)
4. Assemble 4-layer prompt (~2000 chars)
5. Call OpenAI API with assembled prompt
6. Get AI response
7. Append to conversations.messages_json
8. db.commit()

RESPONSE:
---------
{
  "reply": "Great question! Before I explain cultivation theory...",
  "conversation_id": "123",
  "memory_metrics": {
    "total_chars": 2145,
    "optimization_score": 85,
    "layers_used": 4
  },
  "enhanced": true
}

FRONTEND UPDATE:
---------------
1. Append AI reply to chat UI
2. Store conversation_id for next message
3. Update message count
4. Enable input field for next question
```

---

## 📊 File Structure

```
Harv_2/
│
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI app & routes
│   │   ├── models.py                  # SQLAlchemy models
│   │   ├── database.py                # DB connection
│   │   ├── auth.py                    # JWT & authentication
│   │   ├── ai_providers.py            # Multi-AI provider support
│   │   ├── memory_context_enhanced.py # 4-layer memory system
│   │   │
│   │   └── endpoints/
│   │       ├── chat.py                # /chat/enhanced endpoint
│   │       ├── classes.py             # Class management
│   │       ├── modules.py             # Module management
│   │       ├── memory.py              # Memory summaries
│   │       ├── conversations.py       # Conversation history
│   │       └── analytics.py           # Progress tracking
│   │
│   ├── .env                           # API keys (OPENAI_API_KEY, etc)
│   └── harv.db                        # SQLite database
│
├── frontend/
│   ├── index.html                     # Main HTML (auth overlay + app)
│   ├── css/
│   │   └── styles.css                 # Tailwind + custom styles
│   └── js/
│       ├── app.js (v51)               # Main application logic
│       ├── classes.js                 # Class management UI
│       └── notifications.js           # Toast notifications
│
└── ARCHITECTURE_MAP.md (this file)
```

---

## 🔑 Key Technologies

- **Frontend:** Vanilla JS, Tailwind CSS, Fetch API
- **Backend:** FastAPI (Python), SQLAlchemy ORM
- **Database:** SQLite (local file-based)
- **Auth:** JWT tokens (Bearer authentication)
- **AI Providers:** OpenAI GPT-4, Anthropic Claude, Google Gemini, xAI Grok
- **Memory System:** Custom 4-layer context assembly

---

## 🚀 Request Flow Summary

```
User Action → Frontend JS → HTTP Request → FastAPI Route →
Database Query → AI Provider → Save to DB → HTTP Response →
Frontend Update → User Sees Result
```

Every interaction is logged, every conversation is saved, and the AI
learns from the 4-layer memory system to provide personalized Socratic tutoring.
