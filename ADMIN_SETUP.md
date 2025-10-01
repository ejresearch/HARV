# Admin Interface Setup Guide

This guide will help you set up and test the admin interface for HARV.

## 🚀 Quick Start

### 1. Run Database Migration

First, add the `is_admin` field to your existing database:

```bash
cd backend
python add_admin_field.py
```

This will:
- Add the `is_admin` column to the users table
- Set the first user as admin automatically

### 2. Start the Backend

```bash
cd backend
pip install -r requirements.txt  # if not already done
uvicorn app.main:app --reload
```

The backend will start at `http://localhost:8000`

### 3. Verify Backend is Running

Visit `http://localhost:8000/docs` to see the API documentation with all the new admin endpoints:
- `/analytics/dashboard` - Dashboard metrics
- `/analytics/modules/performance` - Module performance data
- `/analytics/alerts` - Modules needing attention
- `/course-corpus` - Course-level corpus management
- `/modules/{id}/corpus` - Module-specific corpus
- `/documents/upload` - Document upload

### 4. Start the Frontend

```bash
cd frontend
# Open index.html in a browser or use a simple HTTP server:
python -m http.server 8080
```

Then visit `http://localhost:8080`

## 🔐 Admin Login

### Option 1: Use Existing User

If you already have a user account, the migration script made the first user an admin. Just log in with those credentials.

### Option 2: Create New Admin User

You can manually set any user as admin in the database:

```python
import sqlite3

conn = sqlite3.connect('backend/harv.db')
cursor = conn.cursor()

# Set specific user as admin by email
cursor.execute("UPDATE users SET is_admin = 1 WHERE email = ?", ("admin@example.com",))
conn.commit()
conn.close()
```

## 📊 Admin Features Available

### 1. **Dashboard Analytics** (`/analytics/dashboard`)
- Total students enrolled
- Active conversations
- Modules completed
- Average grades and time
- Completion rates

### 2. **Module Performance** (`/analytics/modules/performance`)
- Completion rate per module
- Average grades per module
- Time spent per module
- Status indicators (healthy/warning/needs_attention)

### 3. **Alerts** (`/analytics/alerts`)
- Modules with low completion rates
- Modules with below-average grades
- Modules taking too long

### 4. **Course Corpus Management** (`/course-corpus`)
CRUD operations for course-level knowledge:
- Create new entries
- Update existing entries
- Delete entries
- Types: theory, concept, example, guideline, definition, framework

### 5. **Module Corpus Management** (`/modules/{id}/corpus`)
CRUD operations for module-specific knowledge:
- Create module-specific entries
- Update entries
- Delete entries
- Types: theory, concept, example, guideline, definition, case_study

### 6. **Document Upload** (`/documents/upload`)
- Upload documents (.txt, .md, .pdf, .doc, .docx)
- Link to modules or course-level
- View document list
- Delete documents

### 7. **Per-Module Analytics** (`/analytics/modules/{id}`)
- Detailed module metrics
- Grade distribution
- Time analysis (min/max/avg)
- Recent conversations

### 8. **Per-Student Analytics** (`/analytics/students/{id}`)
- Student progress across modules
- GPA calculation
- Time spent
- Conversation history

## 🧪 Testing the Integration

### Test 1: Dashboard Metrics

```javascript
// In browser console after logging in as admin
const stats = await HarvAPI.getDashboardStats();
console.log(stats);
```

Expected output:
```json
{
  "students_enrolled": 5,
  "active_conversations": 12,
  "modules_completed": 45,
  "avg_grade": "B+",
  "completion_rate": 0.87
}
```

### Test 2: Create Course Corpus Entry

```javascript
const entry = await HarvAPI.createCourseCorpusEntry({
  title: "Communication Models",
  content: "The Shannon-Weaver model describes communication as a linear process...",
  type: "theory",
  order_index: 1
});
console.log(entry);
```

### Test 3: Upload Document

```javascript
// In an HTML form with file input
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
const result = await HarvAPI.uploadDocument(file, 1); // module_id = 1
console.log(result);
```

### Test 4: Get Module Performance

```javascript
const performance = await HarvAPI.getModulesPerformance();
console.log(performance.modules);
```

## 🔒 Admin-Only Endpoints

All admin endpoints require:
1. Valid JWT token in Authorization header
2. User account with `is_admin = true`

If you get a 403 error, check:
- Your user has `is_admin = 1` in the database
- You're logged in with the correct account
- Your token is valid (check localStorage)

## 📝 Frontend Integration Status

The backend is fully implemented. Frontend pages need to be wired up to call these APIs:

### Pages to Connect:
- ✅ `frontend/pages/dashboard.html` → Call `getDashboardStats()`, `getModulesPerformance()`, `getAnalyticsAlerts()`
- ✅ `frontend/pages/analytics.html` → Call `getModuleAnalytics()`, `getStudentAnalytics()`
- ✅ `frontend/pages/course-corpus.html` → Call course corpus CRUD endpoints
- ✅ `frontend/pages/corpus-entry.html` → Call module corpus CRUD endpoints
- ✅ `frontend/pages/documents.html` → Call document upload/management endpoints
- ✅ `frontend/pages/modules.html` → Enhanced with analytics data

## 🐛 Troubleshooting

### Issue: 401 Unauthorized
**Solution:** Make sure you're logged in and have a valid token
```javascript
console.log(localStorage.getItem('access_token'));
```

### Issue: 403 Forbidden
**Solution:** User needs admin privileges
```sql
-- In SQLite
SELECT id, email, is_admin FROM users;
-- If is_admin is 0, update it:
UPDATE users SET is_admin = 1 WHERE email = 'your@email.com';
```

### Issue: 404 Not Found on /analytics/dashboard
**Solution:** Make sure the backend is running and routers are loaded. Check terminal output for:
```
✅ Analytics router loaded
✅ Corpus router loaded
✅ Documents router loaded
```

### Issue: CORS Error
**Solution:** Check that your frontend origin is in the CORS allowed origins list in `backend/app/main.py`

## 📦 Dependencies

Make sure these are installed:

```bash
pip install fastapi uvicorn sqlalchemy passlib python-jose python-multipart
```

## 🎉 Next Steps

1. Run the migration script
2. Start backend and frontend
3. Log in as admin
4. Test the API endpoints using browser console
5. Wire up the frontend HTML pages to display the data
6. Customize the UI/UX for your needs

## 🤝 Need Help?

If you encounter issues:
1. Check the backend logs in terminal
2. Check browser console for errors
3. Verify the database has been migrated
4. Test endpoints directly at `/docs`
