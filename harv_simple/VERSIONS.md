# Harv Simple - Two Versions

## Version 1: With Authentication (CURRENTLY ACTIVE ✅)

**Status:** Fully working

**Features:**
- Login/Logout system
- JWT authentication
- Admin and Student accounts
- Secure API endpoints

**How to use:**
```bash
./start.sh
# Open: http://localhost:3000
# Login: admin@harv.com / admin123
```

**Files:**
- `frontend/index_with_auth.html` (original index.html)
- `frontend/app_with_auth.js` (original app.js)

---

## Version 2: No Authentication (IN PROGRESS)

**Status:** Needs debugging

**Concept:**
- No login required
- Just toggle between Teacher View and Student View
- Simpler UX

**Files:**
- `frontend/index_no_auth.html`
- `frontend/app_no_auth.js`

**To switch to no-auth version:**
```bash
cd frontend
mv index.html index_with_auth.html
mv app.js app_with_auth.js
mv index_no_auth.html index.html
mv app_no_auth.js app.js
```

---

## Recommendation

**Use the AUTH version** - it's fully working and tested.

The no-auth version is a good idea for simplification, but needs:
1. Backend public endpoints to be properly configured
2. Route ordering fixes
3. Testing with the frontend

**Current setup:** Auth version is active and working perfectly!
