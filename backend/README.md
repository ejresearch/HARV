# Harv Backend - AI Socratic Tutoring Platform

## Overview

**Harv** is an AI-powered Socratic tutoring system for Communication Media & Society courses. It uses GPT-4 with an advanced 4-layer memory system to provide personalized, context-aware teaching through strategic questioning rather than direct answers.

**Tech Stack:**
- Python 3.8+
- FastAPI web framework
- SQLite database (SQLAlchemy ORM)
- OpenAI GPT-4 API
- JWT authentication (bcrypt password hashing)

**Total Codebase:** 1,671 lines of Python

---

## Architecture

### **Directory Structure**

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                        # FastAPI app & startup (409 lines)
│   ├── database.py                    # SQLite connection & session (20 lines)
│   ├── models.py                      # SQLAlchemy ORM models (175 lines)
│   ├── auth.py                        # JWT auth & password hashing (263 lines)
│   ├── memory_context_enhanced.py     # 4-layer memory system (329 lines)
│   └── endpoints/
│       ├── __init__.py
│       ├── chat.py                    # Chat with AI tutor (281 lines)
│       ├── conversations.py           # Conversation export (34 lines)
│       ├── memory.py                  # Memory summaries (58 lines)
│       └── modules.py                 # Module CRUD (102 lines)
├── harv.db                            # SQLite database
├── requirements.txt                   # Python dependencies
└── README.md                          # This file
```

---

## Core Components

### **1. main.py - Application Entry Point**

**What it does:**
- Initializes FastAPI app with CORS middleware
- Auto-creates database tables on startup
- Auto-populates 16 communication modules if empty
- Includes all API routers (chat, modules, memory, conversations)
- Provides inline authentication endpoints (`/auth/login`, `/auth/register`)
- Health check and system status endpoints

**Key Features:**
- **Startup Event**: Creates tables + loads default modules
- **Module Auto-Population**: 16 pre-configured communication course modules
- **CORS**: Allows local frontend connections (ports 3000, 3001, 5173, 8080)
- **API Documentation**: Auto-generated at `/docs` and `/redoc`

**Endpoints:**
```
GET  /                  - System info & features
GET  /health            - Health check with database stats
GET  /system/status     - Detailed system status
POST /auth/login        - User authentication
POST /auth/register     - User registration
```

---

### **2. database.py - Database Configuration**

**What it does:**
- Configures SQLite connection at `../harv.db`
- Creates SQLAlchemy engine and session factory
- Provides `get_db()` dependency for FastAPI routes

**Connection String:** `sqlite:///../harv.db`

---

### **3. models.py - Database Schema**

**What it does:**
- Defines 9 SQLAlchemy ORM models for all database tables
- Establishes relationships between entities

**Models:**
1. **User** - Student accounts (email, password, name, onboarding data)
2. **Module** - Course modules with prompts and corpora
3. **Conversation** - Chat history with AI tutor
4. **MemorySummary** - Learning progress extracted from chats
5. **Document** - Uploaded educational materials
6. **UserProgress** - Module completion tracking (grades, time spent)
7. **OnboardingSurvey** - Student learning preferences
8. **CourseCorpus** - System-wide knowledge base
9. **ModuleCorpusEntry** - Module-specific content

**Key Relationships:**
- User → Conversations (one-to-many)
- User → MemorySummaries (one-to-many)
- Module → Conversations (one-to-many)
- Conversation → MemorySummaries (one-to-many)

See `../docs/DATABASE_SCHEMA.md` for complete field documentation.

---

### **4. auth.py - Authentication System**

**What it does:**
- JWT token generation and verification
- Password hashing with bcrypt
- User authentication and authorization

**Security Features:**
- **Password Hashing**: Bcrypt with salt
- **JWT Tokens**: HS256 algorithm
  - Access tokens: 24-hour expiration
  - Refresh tokens: 7-day expiration
- **Timing Attack Protection**: Safe password verification
- **Token Validation**: Expiration checking + signature verification

**Key Functions:**
```python
get_password_hash(password)          # Hash password
verify_password(plain, hashed)       # Check password
create_access_token(data)            # Generate access token
create_refresh_token(data)           # Generate refresh token
verify_token(token)                  # Validate JWT
authenticate_user(db, email, pass)   # Login authentication
create_user_account(...)             # Registration
get_current_user(credentials)        # Get user from token
```

**Environment Variables:**
- `JWT_SECRET_KEY` or `SECRET_KEY`: JWT signing key (default: dev key)

---

### **5. memory_context_enhanced.py - Enhanced Memory System**

**What it does:**
- Implements 4-layer dynamic memory context for GPT-4
- Assembles personalized learning context from database
- Optimizes prompt size while maximizing relevance

**The 4 Memory Layers:**

#### **Layer 1: System Data (Cross-Course Learning Profile)**
- User's learning style, pace, background from `onboarding_surveys`
- Cross-module activity history (last 5 conversations)
- Personalization based on user preferences

#### **Layer 2: Module Data (Subject-Specific Context)**
- Module title, description, learning objectives
- System prompt (Socratic teaching instructions)
- Module prompt (specific learning focus areas)
- System corpus (theoretical knowledge base)
- Module corpus (examples, case studies)

#### **Layer 3: Conversation Data (Real-Time Dialogue Context)**
- Last 10 messages from current conversation
- Conversation state (new vs. active)
- Dialogue pattern analysis
- Student engagement metrics

#### **Layer 4: Prior Knowledge (Cross-Module Learning)**
- Most recent conversation from each other module (1 per module)
- Top 3 relevant prior experiences
- Mastered concepts from previous modules
- Learning continuity across curriculum

**Key Class: `DynamicMemoryAssembler`**

```python
assembler = DynamicMemoryAssembler(db)
context = assembler.assemble_dynamic_context(
    user_id=1,
    module_id=3,
    current_message="What is agenda-setting?",
    conversation_id="conv_123"
)

# Returns:
{
    'assembled_prompt': '...full GPT-4 prompt...',
    'context_metrics': {'total_chars': 4523, 'optimization_score': 85},
    'memory_layers': {...},
    'database_status': {...}
}
```

**How It Works:**
1. Query database for user, module, conversations, onboarding
2. Inject data into each of 4 layers
3. Assemble optimized prompt combining all layers
4. Calculate context metrics (size, relevance)
5. Return complete context for GPT-4

---

### **6. endpoints/chat.py - Chat Endpoints**

**What it does:**
- Handles student-AI tutor conversations
- Two modes: basic chat + enhanced memory chat
- Calls OpenAI GPT-4 API
- Saves conversation history to database

**Endpoints:**

#### `POST /chat/`
Basic chat with simple memory (system + module prompts only)

**Request:**
```json
{
  "user_id": 1,
  "module_id": 3,
  "message": "What is cultivation theory?",
  "conversation_id": "conv_123" // optional
}
```

**Response:**
```json
{
  "reply": "Great question! Instead of telling you directly...",
  "conversation_id": "conv_123",
  "memory_metrics": {"total_chars": 1200, "optimization_score": 50},
  "enhanced": false
}
```

#### `POST /chat/enhanced`
Enhanced chat with full 4-layer memory system

**Request:** Same as `/chat/`

**Response:** Same as `/chat/` but with `enhanced: true` and richer context

**How Enhanced Chat Works:**
1. Receives user message
2. Calls `DynamicMemoryAssembler` to build context
3. Sends assembled prompt + user message to GPT-4
4. Receives Socratic response from GPT-4
5. Saves conversation to database
6. Returns AI response + metadata to frontend

**OpenAI Configuration:**
- Requires `OPENAI_API_KEY` environment variable
- Uses GPT-4 model
- Temperature: 0.7 (balanced creativity)
- Max tokens: 500 (concise responses)

**Fallback Mode:**
If no OpenAI key, returns helpful placeholder responses.

---

### **7. endpoints/modules.py - Module Management**

**What it does:**
- CRUD operations for course modules
- Module configuration management
- Testing endpoints for module setup

**Endpoints:**

```
GET  /modules                    - List all modules
GET  /modules/{id}               - Get single module
PUT  /modules/{id}               - Update module config
GET  /modules/{id}/config        - Get module configuration
PUT  /modules/{id}/config        - Update module configuration
GET  /modules/{id}/test          - Test module config loading
```

**Module Configuration Fields:**
- `system_prompt`: Socratic teaching instructions
- `module_prompt`: Learning objectives
- `system_corpus`: Theoretical knowledge base
- `module_corpus`: Examples and case studies
- `dynamic_corpus`: Runtime-generated content
- `api_endpoint`: OpenAI API URL

---

### **8. endpoints/memory.py - Memory Management**

**What it does:**
- Save and retrieve learning summaries
- Memory statistics for modules
- Test endpoints for memory system

**Endpoints:**

```
POST /memory/summary             - Save learning summary
GET  /memory/stats/{module_id}   - Get memory statistics
POST /memory/test                - Test memory system
POST /memory/preview             - Preview memory context
POST /memory/context             - Get memory context
```

**Memory Summary Structure:**
```json
{
  "user_id": 1,
  "module_id": 3,
  "what_learned": "Understood agenda-setting vs framing",
  "how_learned": "Through guided discovery with examples",
  "key_concepts": "agenda-setting, framing, media bias",
  "understanding_level": "intermediate",
  "learning_insights": "Connected to social media algorithms",
  "teaching_effectiveness": "high"
}
```

---

### **9. endpoints/conversations.py - Conversation Export**

**What it does:**
- Export conversation history for a user

**Endpoints:**

```
GET /export/{user_id}  - Export all conversations for user
```

**Response:**
```json
{
  "user_id": 1,
  "conversations": [
    {
      "id": 123,
      "message": "User question",
      "reply": "AI response",
      "module_id": 3,
      "created_at": "2025-09-30T12:00:00"
    }
  ]
}
```

---

## Database

See `../docs/DATABASE_SCHEMA.md` for complete documentation.

**Current State:**
- 16 communication modules pre-loaded
- All user/conversation tables empty (archived)
- 3 archive tables with historical data

**Tables:**
1. users
2. modules
3. conversations
4. memory_summaries
5. documents
6. user_progress
7. onboarding_surveys
8. course_corpus
9. module_corpus_entries

**Archive Tables:**
1. users_archive (6 users)
2. conversations_archive (51 conversations)
3. memory_summaries_archive (2 summaries)

---

## Installation & Setup

### **1. Install Dependencies**

```bash
pip install -r requirements.txt
```

**Required Packages:**
- fastapi==0.104.1
- uvicorn[standard]==0.24.0
- sqlalchemy==2.0.23
- openai==1.3.5
- python-jose[cryptography]==3.3.0
- passlib[bcrypt]==1.7.4
- python-dotenv==1.0.0
- httpx==0.25.1

### **2. Set Environment Variables**

Create a `.env` file in the backend directory:

```bash
# Required
OPENAI_API_KEY=sk-your-openai-api-key-here

# Optional (has defaults)
JWT_SECRET_KEY=your-secret-key-min-32-chars
SECRET_KEY=fallback-secret-key-min-32-chars
```

### **3. Run the Server**

**Development:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Production:**
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### **4. Access API Documentation**

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health Check: http://localhost:8000/health

---

## API Usage Examples

### **Register a User**

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@university.edu",
    "password": "securepassword",
    "name": "Jane Doe",
    "reason": "Required for communication studies degree",
    "familiarity": "beginner",
    "learning_style": "visual_and_interactive",
    "goals": "Understand media theory",
    "background": "Psychology major"
  }'
```

**Response:**
```json
{
  "success": true,
  "user_id": 1,
  "access_token": "eyJ0eXAi...",
  "refresh_token": "eyJ0eXAi...",
  "token_type": "bearer"
}
```

### **Login**

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@university.edu",
    "password": "securepassword"
  }'
```

### **List Modules**

```bash
curl http://localhost:8000/modules
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Introduction to Communication Theory",
    "description": "Foundational concepts and overview...",
    "system_prompt": "You are Harv, a Socratic tutor...",
    "module_prompt": "Focus on communication models...",
    "system_corpus": "Shannon-Weaver Model (1948)..."
  }
]
```

### **Chat with AI Tutor (Enhanced)**

```bash
curl -X POST http://localhost:8000/chat/enhanced \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "module_id": 3,
    "message": "What is cultivation theory?",
    "conversation_id": "conv_1_3_20250930"
  }'
```

**Response:**
```json
{
  "reply": "Great question! Before I explain, let me ask you: What patterns do you notice in the news you consume? Do you think heavy TV viewers might perceive reality differently than light viewers? Why or why not?",
  "conversation_id": "conv_1_3_20250930",
  "memory_metrics": {
    "total_chars": 4523,
    "optimization_score": 85,
    "layers_used": ["system", "module", "conversation", "prior_knowledge"]
  },
  "enhanced": true
}
```

### **Save Memory Summary**

```bash
curl -X POST http://localhost:8000/memory/summary \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "module_id": 3,
    "what_learned": "Understood cultivation theory - long-term media exposure shapes perception",
    "how_learned": "Through Socratic questioning about TV viewing patterns"
  }'
```

---

## Configuration

### **16 Pre-loaded Communication Modules**

1. Introduction to Communication Theory
2. History and Evolution of Media
3. Media Theory and Effects
4. Print Media and Journalism
5. Broadcasting: Radio and Television
6. Digital Media and the Internet
7. Social Media and New Platforms
8. Media Ethics and Responsibility
9. Media Law and Regulation
10. Advertising and Public Relations
11. Media Economics and Business Models
12. Global Media and Cultural Impact
13. Media Literacy and Critical Analysis
14. Future of Mass Communication
15. Capstone: Integrating Knowledge
16. 🧪 Synthetic AI Communication Test Module

Each module includes:
- **System Prompt**: Socratic teaching methodology instructions
- **Module Prompt**: Specific learning objectives
- **System Corpus**: Theoretical knowledge (Shannon-Weaver, Cultivation Theory, etc.)
- **Module Corpus**: Examples and case studies (empty by default)
- **Dynamic Corpus**: Runtime context (populated during chat)

### **Socratic Teaching Philosophy**

Harv uses the **Socratic method**:
- ✅ Ask strategic questions to guide discovery
- ✅ Build on student's existing knowledge
- ✅ Encourage critical thinking
- ✅ Use real-world examples and case studies
- ❌ Don't give direct answers
- ❌ Don't lecture or info-dump
- ❌ Don't move too fast

**Example Interaction:**

**Student:** "What is agenda-setting?"

**Harv (Good):** "Before we explore that, tell me: When you read news, how do you decide what's important? Do different news sources seem to emphasize different topics? What might that suggest about how media influences what we think about?"

**Harv (Bad):** "Agenda-setting is a theory that says media tells us what to think about by choosing which stories to cover."

---

## Testing

### **Health Check**

```bash
curl http://localhost:8000/health
```

Expected response includes:
- Database connectivity
- Table counts
- OpenAI API configuration status
- Enhanced memory system status

### **Test Module Configuration**

```bash
curl http://localhost:8000/modules/3/test
```

### **Test Memory System**

```bash
curl -X POST http://localhost:8000/memory/test \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## Data Population Guide

See `../docs/DATABASE_SCHEMA.md` section "Best-Case Data Population Guide" for:
- 5-phase optimal data flow
- Sample user journey (Day 1-10)
- SQL examples for populating course_corpus
- Data quality best practices

**Quick Start Data Flow:**

1. **User registers** → Creates `users` + `onboarding_surveys`
2. **Admin populates** → Add entries to `course_corpus` and `module_corpus_entries`
3. **Student chats** → Creates `conversations` with message history
4. **System generates** → Creates `memory_summaries` every 5-7 exchanges
5. **Module completion** → Creates `user_progress` with grade and time

---

## Architecture Highlights

### **Why 4-Layer Memory System?**

Traditional chatbots have no memory. Each request is independent. Harv's 4-layer system creates:

1. **Personalization**: Adapts to learning style (visual, hands-on, theoretical)
2. **Continuity**: References previous modules and conversations
3. **Context-Awareness**: Knows where student is in learning journey
4. **Optimization**: Only includes relevant context (not full history)

**Example:**

Without memory:
```
Student: "What's agenda-setting?"
AI: "Agenda-setting is when media tells us what to think about."
```

With 4-layer memory:
```
Student: "What's agenda-setting?"
AI: "Great question! Remember when we discussed the Shannon-Weaver model in Module 1?
     You mentioned being interested in social media algorithms. How do you think
     Facebook's news feed might influence what topics feel important to users?"
```

### **Socratic Method Implementation**

The system uses GPT-4's reasoning with carefully crafted prompts:

**System Prompt Structure:**
```
You are Harv, a Socratic tutor for [Module].

Core Principles:
- Guide through questions, not answers
- Build on student's knowledge
- Use real-world examples
- Encourage discovery

Learning Profile:
- Style: [visual/hands-on/theoretical]
- Pace: [fast/moderate/slow]
- Background: [beginner/intermediate/advanced]

Prior Knowledge:
- Module 1: Understands communication models
- Module 2: Explored media history

Current Conversation:
[Last 10 messages]

Now guide the student to discover: [Current concept]
```

---

## Performance Optimization

### **Context Size Management**

The enhanced memory system optimizes prompt size:
- Full history: 50,000+ chars → API expensive, slow
- Optimized context: 3,000-5,000 chars → Fast, cost-effective
- Only includes last 10 messages (not full conversation)
- Only retrieves 1 conversation per other module (not all)
- Summarizes learning profile (not full onboarding text)

### **Database Queries**

Efficient query patterns:
- Index on user_id, module_id, conversation_id
- Cascade deletes to maintain referential integrity
- Lazy loading of relationships
- Connection pooling via SQLAlchemy

---

## Security

### **Authentication**
- JWT tokens with HS256 signing
- Bcrypt password hashing (salt rounds: 12)
- Token expiration (24h access, 7d refresh)
- HTTPBearer scheme with auto-error handling

### **Password Security**
- Minimum length enforced by frontend
- Timing attack protection in verification
- Never logged or exposed in responses

### **API Security**
- CORS restricted to specific origins
- No SQL injection (SQLAlchemy ORM)
- Input validation via Pydantic models
- Environment variable secrets

---

## Error Handling

### **Database Errors**
- Automatic rollback on failures
- Graceful fallback to empty results
- Error logging to console

### **OpenAI API Errors**
- Fallback to demo responses when no API key
- Timeout handling (default: 30s)
- Retry logic for transient failures

### **Authentication Errors**
- 401 Unauthorized for invalid tokens
- 403 Forbidden for insufficient permissions
- 404 Not Found for invalid user/module IDs

---

## Future Enhancements

Potential improvements:
- [ ] PostgreSQL migration for production
- [ ] Redis caching for memory context
- [ ] Real-time WebSocket chat
- [ ] Admin dashboard for module management
- [ ] Analytics and learning insights
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Mobile app API endpoints
- [ ] Automated testing suite
- [ ] Docker containerization

---

## Troubleshooting

### **Database locked error**
SQLite doesn't handle concurrent writes well. Solution:
```python
# In database.py
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False, "timeout": 20}
)
```

### **OpenAI API errors**
Check environment variable:
```bash
echo $OPENAI_API_KEY
```

Verify API key is valid at https://platform.openai.com/api-keys

### **Import errors**
Ensure all dependencies installed:
```bash
pip install -r requirements.txt --upgrade
```

### **CORS errors**
Add frontend origin to CORS allowed origins in `main.py`:
```python
allow_origins=[
    "http://localhost:3000",
    "https://your-frontend-domain.com"
]
```

---

## Contributing

This is a research/educational project. Key areas for contribution:
- Enhanced memory retrieval algorithms
- Better Socratic question generation
- Improved context optimization
- Additional course modules
- Testing infrastructure

---

## License

Educational use only. OpenAI API usage subject to OpenAI terms of service.

---

## Credits

**Course Content**: Communication Media & Society curriculum
**AI Model**: OpenAI GPT-4
**Framework**: FastAPI (Python)
**Architecture**: Enhanced 4-layer memory system

---

## Contact

For questions or feedback, see project documentation in `../docs/README.md`.

**API Documentation**: http://localhost:8000/docs
**Database Schema**: `../docs/DATABASE_SCHEMA.md`
**Complete Documentation**: `../docs/README.md`
**Requirements**: `requirements.txt`
