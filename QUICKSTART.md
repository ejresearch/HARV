# HARV Quick Start Guide

## 🚀 Start Backend

```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

Backend will be available at: **http://localhost:8000**

## 🌐 Start Frontend

Open `frontend/index.html` in your browser, or use a local server:

```bash
cd frontend
python -m http.server 3000
```

Frontend will be available at: **http://localhost:3000**

## 🔐 Login Credentials

```
Email: admin@harv.com
Password: admin123
```

## ✅ Everything Working

- **✅ Database**: Consolidated at `backend/harv.db`
- **✅ Admin User**: Created and ready
- **✅ Authentication**: JWT tokens working
- **✅ Module CRUD**: Create, read, update, delete
- **✅ Conversations**: Browse and filter
- **✅ Analytics**: Real-time dashboard
- **✅ Testing**: Module validation
- **✅ Corpus Management**: Course + module level
- **✅ Documents**: Upload and manage

## 📊 Test the System

1. Open http://localhost:3000 (or `frontend/index.html`)
2. Login with admin credentials
3. Navigate to **Dashboard** - see analytics
4. Navigate to **Modules** - view 15 pre-loaded modules
5. Navigate to **Testing** - test module configuration
6. Navigate to **Conversations** - browse chat history

## 🔧 API Documentation

Visit: **http://localhost:8000/docs** for interactive Swagger UI

## 📝 Main Endpoints

- `POST /auth/login` - Get JWT token
- `GET /modules` - List all modules
- `GET /analytics/dashboard` - Get dashboard stats
- `GET /conversations` - List conversations (requires admin token)
- `POST /chat/enhanced` - Chat with AI tutor

## ⚙️ Optional: Add OpenAI API Key

Create `backend/.env`:
```
OPENAI_API_KEY=your-key-here
```

Then restart the backend server to enable AI chat functionality.

---

**Need help?** Check `SETUP_COMPLETE.md` for detailed information.
