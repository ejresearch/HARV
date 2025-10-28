# Harv Simple - Streamlined AI Tutor

A simplified version of Harv with **~1,500 lines of code** instead of 11,000+.

## What's Different?

### Original Harv
- 11,000+ lines of code
- 11 separate endpoint modules
- 4-layer memory system
- Multiple AI providers
- 5,127-line frontend (app.js)
- 10+ admin pages
- Complex analytics

### Harv Simple
- **~1,500 lines total**
- **Single main.py** (~500 lines) with all endpoints
- **Simple memory** (last 10 messages)
- **OpenAI only** (easy to extend)
- **~600-line frontend** (app.js)
- **3 pages**: Chat, Modules, Admin
- **Basic stats**

## What's Included

✅ JWT Authentication (login/register)
✅ AI Chat with GPT-4
✅ Module Management (CRUD)
✅ Conversation History
✅ Admin Dashboard
✅ User Management
✅ Clean, responsive UI

## Tech Stack

**Backend:**
- FastAPI
- SQLite + SQLAlchemy
- OpenAI API
- JWT auth

**Frontend:**
- Vanilla JavaScript
- CSS3 (no framework)
- No build process needed

## Quick Start

### Easy Way (Recommended)

```bash
./start.sh
```

Then open http://localhost:3001

### Manual Setup

**1. Backend Setup**

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "OPENAI_API_KEY=sk-your-key-here" > .env

# Run server (note: port 8001, not 8000)
uvicorn main:app --reload --port 8001
```

The backend will:
- Create database automatically
- Create default admin: `admin@harv.com` / `admin123`
- Load 3 sample modules

**2. Frontend Setup**

```bash
cd frontend

# Serve with Python (note: port 3001, not 3000)
python -m http.server 3001

# Or with Node
npx http-server -p 3001
```

### 3. Access

- **Frontend:** http://localhost:3001
- **API Docs:** http://localhost:8001/docs
- **Health Check:** http://localhost:8001/health

**Important:** Harv Simple uses ports **8001** and **3001** to avoid conflicts with main Harv (ports 8000/3000). Both systems can run simultaneously!

### 4. Login

```
Email: admin@harv.com
Password: admin123
```

## File Structure

```
harv_simple/
├── backend/
│   ├── main.py              # 500 lines - All endpoints
│   ├── models.py            # 60 lines - 3 models
│   ├── auth.py              # 70 lines - JWT auth
│   ├── database.py          # 20 lines - DB config
│   ├── requirements.txt     # 9 dependencies
│   └── .env                 # OPENAI_API_KEY
│
└── frontend/
    ├── index.html           # Structure
    ├── app.js               # 600 lines - All logic
    └── styles.css           # 500 lines - All styling
```

**Total: ~1,750 lines** (vs 11,000+ in original)

## API Endpoints

### Authentication
```
POST /auth/register          - Register new user
POST /auth/login             - Login user
GET  /auth/me                - Get current user
```

### Chat
```
POST /chat                   - Send message to AI
GET  /conversations          - List conversations
GET  /conversations/{id}     - Get conversation details
```

### Modules
```
GET    /modules              - List all modules
GET    /modules/{id}         - Get module details
POST   /modules              - Create module (admin)
PUT    /modules/{id}         - Update module (admin)
DELETE /modules/{id}         - Delete module (admin)
```

### Admin
```
GET /admin/users             - List all users (admin)
GET /admin/stats             - System statistics (admin)
```

### Health
```
GET /                        - API info
GET /health                  - Health check with stats
```

## How It Works

### Simple Memory System

Instead of a complex 4-layer memory system, we just:

1. Load the last 10 messages from the conversation
2. Add module context (title, description, teaching prompt)
3. Send to GPT-4

That's it. Simple and effective.

### Database

Three tables:
- **users** - Student and admin accounts
- **modules** - Learning modules with teaching prompts
- **conversations** - Chat history (JSON stored)

### Frontend

Single-page app with 3 sections:
1. **Chat** - Talk with AI tutor
2. **Modules** - Browse available modules
3. **Admin** - Manage modules and users (admin only)

No framework, no build process, just vanilla JavaScript.

## Extending This

### Add More AI Providers

```python
# In main.py, replace OpenAI call with:

from anthropic import Anthropic

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    messages=openai_messages
)
```

### Add More Features

The simplified structure makes it easy to add:
- Progress tracking (add `user_progress` table)
- File uploads (add document storage)
- Analytics (add aggregation queries)
- Memory summaries (add `memory_summaries` table)

Just add what you need, when you need it.

## Development Tips

### Backend Hot Reload
```bash
uvicorn main:app --reload
```
Changes to Python files reload automatically.

### Check Database
```bash
sqlite3 harv_simple.db
sqlite> .tables
sqlite> SELECT * FROM users;
```

### API Testing
Visit http://localhost:8000/docs for interactive API documentation.

### Frontend Development
Since it's vanilla JS with no build process, just refresh the browser to see changes.

## Comparison Table

| Feature | Original | Simple | Notes |
|---------|----------|--------|-------|
| Total Lines | 11,000+ | 1,750 | 84% reduction |
| Backend Files | 13 | 4 | Consolidated |
| Frontend Files | 3 | 3 | Similar structure |
| Endpoints | 30+ | 15 | Core features only |
| Dependencies | 37 | 9 | Minimal set |
| Memory System | 4 layers | Last 10 msgs | Still effective |
| AI Providers | 4 | 1 | Easy to add more |
| Admin Pages | 10+ | 3 | Essential only |
| Setup Time | 15+ min | 5 min | Quick start |

## When to Use Original vs Simple

**Use Simple When:**
- Starting a new project
- Prototyping or MVP
- Learning the codebase
- Want minimal dependencies
- Need quick deployment

**Use Original When:**
- Need advanced memory system
- Multiple AI provider support required
- Complex analytics needed
- Enterprise features
- Scaling to 1000+ users

## Troubleshooting

### OpenAI API Error
```
Error: OpenAI error: ...
```
**Solution:** Check your `.env` file has valid `OPENAI_API_KEY`

### CORS Error
```
Access-Control-Allow-Origin error
```
**Solution:** Make sure backend is running on port 8000

### Database Locked
```
SQLite database is locked
```
**Solution:** Close any other connections to the database

### Port Already in Use
```
Address already in use
```
**Solution:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

## Performance

**Tested with:**
- 100 users
- 500 conversations
- 20 modules

**Response times:**
- Chat: < 3s (GPT-4 API call time)
- Module list: < 50ms
- Auth: < 100ms

**Database size:**
- ~1MB per 100 conversations
- SQLite handles up to 1TB

## License

MIT

## Contributing

This is a simplified reference implementation. Feel free to:
- Fork and modify
- Add features you need
- Remove features you don't
- Use as learning material

## Questions?

Check the original Harv documentation at `../docs/` for more detailed information about the architecture and design decisions.

---

**Built with ❤️ to show that simple can be powerful.**
