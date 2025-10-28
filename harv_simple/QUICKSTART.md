# Harv Simple - Quick Start

## Starting & Stopping

```bash
# Start Harv (backend + frontend)
./start.sh

# Stop Harv
./stop.sh

# Check status
./status.sh
```

## ⚠️ Port Configuration

**Harv Simple uses different ports from main Harv:**
- **Harv Simple Backend:** http://localhost:8001
- **Harv Simple Frontend:** http://localhost:3001
- **Main Harv Backend:** http://localhost:8000
- **Main Harv Frontend:** http://localhost:3000

**Both systems can run simultaneously!** They use different ports to avoid conflicts.

## Access

Once started, open your browser:

**Main App:** http://localhost:3001

**API Docs:** http://localhost:8001/docs

**No login required!** The app auto-logs in and you can toggle between views.

---

## 🎯 NEW: View Toggle Feature

### Student View (Default)
- **What you see:** Chat + Modules tabs
- **What's hidden:** Admin tab
- **Button shows:** "👩‍🏫 Switch to Teacher View"

**Perfect for students** to chat with AI tutor and browse modules.

### Teacher View (Click toggle button)
- **What you see:** Chat + Modules + Admin tabs
- **Auto-switches to:** Admin tab
- **Button shows:** "👨‍🎓 Switch to Student View"

**Perfect for teachers** to manage modules, view stats, and admin tasks.

### How to Toggle:
1. Look at the **top-right corner**
2. Click the view toggle button
3. Instantly switch between Student and Teacher views!

---

## What You Can Do

### 👨‍🎓 As a Student:
1. **Chat Tab** - Select a module and talk with AI tutor
2. **Modules Tab** - Browse 3 pre-loaded communication theory modules

### 👩‍🏫 As a Teacher:
1. Everything students can do PLUS:
2. **Admin Tab** - Create/edit/delete modules
3. **Admin Tab** - View system statistics
4. **Admin Tab** - Manage users

---

## Scripts

| Script | Purpose |
|--------|---------|
| `./start.sh` | Start both servers |
| `./stop.sh` | Stop both servers |
| `./status.sh` | Check if running |

---

## Logs

If something goes wrong:
- Backend log: `/tmp/harv_simple_backend.log`
- Frontend log: `/tmp/harv_simple_frontend.log`

---

## Troubleshooting

**Toggle button not showing?**
1. Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Check console: Press `F12` → Console tab

**Port already in use?**
```bash
./stop.sh  # Kill any running Harv Simple processes
./start.sh # Start fresh
```

**Backend not responding?**
```bash
cat /tmp/harv_simple_backend.log  # Check errors
```

**Want to run both Harv and Harv Simple?**
No problem! They use different ports:
- Main Harv: ports 8000 (backend) and 3000 (frontend)
- Harv Simple: ports 8001 (backend) and 3001 (frontend)

---

## Manual Start (if scripts don't work)

```bash
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload --port 8001

# Terminal 2 - Frontend
cd frontend
python3 -m http.server 3001
```

Then open: http://localhost:3001

---

## Features Summary

✅ **No login required** - Auto-authenticates
✅ **Student/Teacher toggle** - One-click view switching
✅ **AI Chat** - Socratic tutoring with GPT-4
✅ **4-Layer Memory System** - Intelligent, personalized learning context
✅ **Module Management** - Full CRUD for teachers
✅ **Clean UI** - Flat design with sage & terracotta colors

## 🧠 NEW: 4-Layer Memory System

The AI tutor now has an intelligent memory system that personalizes the learning experience:

- **Layer 1: System Data** - Remembers your learning style and pace
- **Layer 2: Module Data** - Uses module-specific teaching strategies
- **Layer 3: Conversation Data** - Tracks your current discussion context
- **Layer 4: Prior Knowledge** - Connects insights from other modules

Read more: See `MEMORY_SYSTEM.md` for technical details.

**Enjoy using Harv Simple!** 🎓
