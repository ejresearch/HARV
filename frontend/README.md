# HARV Frontend - Admin Dashboard

Modular admin interface for the HARV AI Socratic tutoring platform.

## Directory Structure

```
frontend/
├── index.html              # Main entry point with layout and navigation
├── css/
│   └── styles.css          # Complete CSS with dark mode theming
├── js/
│   ├── app.js              # Core app logic, navigation, theme management
│   └── api.js              # Backend API integration layer
├── pages/                  # Individual page content (loaded dynamically)
│   ├── dashboard.html      # Overview dashboard with stats
│   ├── modules.html        # Module list and management
│   ├── module-editor.html  # Edit module configuration (4 tabs)
│   ├── corpus-entry.html   # Create module-specific corpus entries
│   ├── course-corpus.html  # Manage global course corpus
│   ├── documents.html      # Upload and manage documents
│   ├── analytics.html      # Analytics with 3 views (overview, per-module, per-student)
│   ├── conversations.html  # Browse student-AI conversations
│   ├── testing.html        # Test modules with 3 modes (health check, simulator, automated)
│   └── settings.html       # LLM configuration (OpenAI, Anthropic, Gemini, Grok)
├── components/
│   └── modals.html         # Reusable modal dialogs
└── assets/                 # (Future: images, icons, fonts)
```

## Features

### 🎨 Design
- Clean, modern interface with Google Material-inspired design
- **Dark mode** support with persistent localStorage theme
- Fully responsive layout (desktop, tablet, mobile)
- CSS variables for easy theming

### 🧭 Navigation
- Sidebar navigation with 10 sections
- Dynamic page loading (SPA-style)
- Active state management
- Page title updates

### 📄 Pages

#### 1. **Dashboard** (`pages/dashboard.html`)
- 6 stat cards (students, conversations, completion rate, etc.)
- Module performance overview with progress bars
- Modules needing attention alerts
- Recent activity table

#### 2. **Module Management** (`pages/modules.html`)
- List all 16 modules with stats
- Search and filter
- CRUD operations (Create, Edit, Delete)
- Quick actions (Test, Analytics)

#### 3. **Module Editor** (`pages/module-editor.html`)
- **4 Tabs:**
  - Basic Information (title, description, objectives)
  - Teaching Strategy (system/module prompts, Socratic config)
  - Knowledge Base (system/module corpus)
  - Preview & Test (test AI responses)
- Save as draft or publish

#### 4. **Module Corpus Entry** (`pages/corpus-entry.html`)
- Create module-specific knowledge entries
- Content types: theory, case study, example, exercise, reading
- Expandable entry list with edit/delete
- Order indexing for retrieval priority

#### 5. **Course Corpus** (`pages/course-corpus.html`)
- Global knowledge shared across all modules
- CRUD for foundational theories
- Import/export functionality
- Search and filter

#### 6. **Document Management** (`pages/documents.html`)
- Upload PDFs, DOCs, TXT files
- Assign to specific modules or global
- Preview, download, delete
- Analytics (total size, most viewed)

#### 7. **Analytics** (`pages/analytics.html`)
- **3 Views:**
  - Overview: engagement trends, grade distribution
  - Per-Module: completion rate, quality metrics
  - Per-Student: individual progress tracking

#### 8. **Conversation Browser** (`pages/conversations.html`)
- Browse all student-AI conversations
- Filter by module, status, grade
- View full conversation transcripts in modal
- Quality analysis (Socratic question rate, engagement)

#### 9. **Module Testing** (`pages/testing.html`)
- **3 Testing Modes:**
  - Health Check: validate configuration
  - Test Simulator: interactive AI conversation
  - Automated Scenarios: test with student personas

#### 10. **LLM Configuration** (`pages/settings.html`)
- Multi-provider support: OpenAI, Anthropic, Gemini, Grok
- Model selection per provider
- Temperature and max tokens config
- Test connection
- Usage & billing stats

### 🧩 Components

#### Modals (`components/modals.html`)
- **Create Module Modal**: quick module creation form
- **Upload Document Modal**: file upload with module assignment
- **Conversation Detail Modal**: full conversation view with analysis

### 🔌 API Integration (`js/api.js`)

Backend endpoints ready for integration:

```javascript
// Example usage
await HarvAPI.getModules();
await HarvAPI.createModule(moduleData);
await HarvAPI.sendMessage(moduleId, message);
await HarvAPI.uploadDocument(file, moduleId);
await HarvAPI.getDashboardStats();
```

**Available methods:**
- Authentication: `login()`, `register()`
- Modules: `getModules()`, `createModule()`, `updateModule()`, `deleteModule()`
- Conversations: `getConversations()`, `sendMessage()`
- Corpus: `getCourseCorpus()`, `getModuleCorpusEntries()`, `createCorpusEntry()`
- Documents: `getDocuments()`, `uploadDocument()`, `deleteDocument()`
- Analytics: `getDashboardStats()`, `getModuleAnalytics()`, `getStudentAnalytics()`

## Setup & Usage

### Local Development

1. **Start Backend:**
   ```bash
   cd ../backend
   uvicorn app.main:app --reload
   ```

2. **Serve Frontend:**
   ```bash
   cd frontend
   # Option 1: Python HTTP server
   python3 -m http.server 8080

   # Option 2: Node.js http-server
   npx http-server -p 8080

   # Option 3: VS Code Live Server extension
   ```

3. **Open in browser:**
   ```
   http://localhost:8080
   ```

### Configuration

**Backend URL:** Edit `API_BASE_URL` in `js/api.js`
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

**Theme:** Default is light mode. Users can toggle with theme button (persists to localStorage).

## Chart.js Visualizations

**Included:** Chart.js 4.4.0 via CDN

**3 Charts Implemented:**

1. **Dashboard - Module Performance Bar Chart**
   - Horizontal bars showing completion rates
   - Color-coded: green (≥85%), yellow (≥65%), red (<65%)

2. **Analytics - Engagement Trends Line Chart**
   - 30-day timeline of daily active students
   - Smooth line with gradient fill

3. **Analytics - Grade Distribution Doughnut Chart**
   - A/B/C/D/F breakdown with percentages
   - Color-coded by grade tier

**Location:** `/js/charts.js` - Auto-initialized on page load

## Technical Details

### Page Loading System
Pages are loaded dynamically using `fetch()`:
```javascript
loadPage('dashboard') → fetches pages/dashboard.html → injects into #mainContent
```

### Theme Management
- CSS variables in `:root` and `[data-theme="dark"]`
- Toggle switches `data-theme` attribute on `<html>`
- Persisted to `localStorage.getItem('theme')`

### Modal System
- Modals loaded once on page load from `components/modals.html`
- Show/hide with `HarvApp.showModal(modalId)` / `HarvApp.closeModal(modalId)`
- Close on background click or × button

### Tab Navigation
- Tabs within pages use `.tab` and `.tab-content` classes
- `handleTabClick()` manages active state
- Used in: Module Editor, Analytics, Testing

## Next Steps

### API Integration
Connect all buttons and forms to backend endpoints:
```javascript
// Example: Create Module button
document.querySelector('#createModuleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const moduleData = { /* form data */ };
    await HarvAPI.createModule(moduleData);
    HarvApp.closeModal('createModuleModal');
    loadPage('modules');
});
```

### ✅ Charts & Visualizations (Complete)
Chart.js 4.4.0 already integrated with 3 charts:
- Dashboard: Module Performance Bar Chart
- Analytics: Engagement Trends Line Chart
- Analytics: Grade Distribution Doughnut Chart

All charts auto-initialize and match dark mode theme.

### Real-time Updates
Add WebSocket support for live conversation monitoring:
```javascript
const ws = new WebSocket('ws://localhost:8000/ws');
ws.onmessage = (event) => {
    // Update conversation count, recent activity, etc.
};
```

### Form Validation
Add client-side validation before API calls:
```javascript
function validateModuleForm() {
    const title = document.querySelector('#moduleTitle').value;
    if (!title || title.length < 3) {
        alert('Module title must be at least 3 characters');
        return false;
    }
    return true;
}
```

### Loading States
Add spinners/skeletons during API calls:
```javascript
async function loadModules() {
    showLoader();
    const modules = await HarvAPI.getModules();
    hideLoader();
    renderModules(modules);
}
```

### Error Handling
Implement toast notifications for errors:
```javascript
try {
    await HarvAPI.createModule(data);
    showToast('Module created successfully!', 'success');
} catch (error) {
    showToast(error.message, 'error');
}
```

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Related Files
- Backend API: `../backend/README.md`
- Complete Documentation: `../docs/README.md`
- Database Schema: `../docs/DATABASE_SCHEMA.md`
- Admin Specs: `../docs/ADMIN_SPEC.md`, `../docs/ADMIN_SPEC_PART2.md`
- UX Flows: `../docs/UX_FLOWS.md`
- Frontend Structure: `../docs/STRUCTURE.md`
- Spec Coverage: `../docs/SPEC_COVERAGE.md`

## License
Developed by YT Research for HARV AI Socratic Tutoring Platform
