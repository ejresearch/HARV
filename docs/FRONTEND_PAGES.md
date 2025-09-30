# Harv Frontend - Required HTML Pages

Based on the UX flows and backend architecture, here's a complete list of HTML pages needed for the Harv platform.

---

## Page Architecture Overview

```
/ (landing)
├── /auth
│   ├── /login
│   ├── /register
│   └── /logout
│
├── /onboarding (student only)
│
├── /student (student dashboard & learning)
│   ├── /dashboard
│   ├── /modules
│   │   ├── /{module_id}
│   │   └── /{module_id}/chat
│   ├── /learning
│   ├── /resources
│   ├── /profile
│   └── /certificates
│
└── /admin (instructor dashboard & management)
    ├── /dashboard
    ├── /modules
    │   ├── /{module_id}/edit
    │   ├── /{module_id}/corpus
    │   └── /{module_id}/test
    ├── /corpus
    │   └── /course
    ├── /documents
    ├── /analytics
    │   ├── /overview
    │   ├── /modules/{module_id}
    │   └── /students
    └── /conversations
        └── /{conversation_id}
```

---

## Public Pages (No Authentication Required)

### 1. **index.html** - Landing Page
**Route:** `/`

**Purpose:** Marketing page introducing Harv platform

**Key Sections:**
- Hero section with value proposition
- Features overview (Socratic method, 4-layer memory, personalization)
- How it works (3-step process)
- Call-to-action buttons (Sign Up, Learn More)
- Demo video or screenshots

**Components:**
- Navigation bar with Login/Register buttons
- Feature cards
- Testimonials (optional)
- Footer with links

**API Calls:** None

---

### 2. **login.html** - Login Page
**Route:** `/auth/login`

**Purpose:** User authentication

**Form Fields:**
- Email (text input)
- Password (password input)
- Remember me (checkbox)
- Forgot password link

**Buttons:**
- Login (primary)
- Sign up (secondary link)

**API Calls:**
```javascript
POST /auth/login
{
  "email": "user@email.com",
  "password": "password"
}

Response:
{
  "access_token": "...",
  "user": { "id": 1, "email": "...", "name": "..." }
}
```

**On Success:**
- Store token in localStorage
- Redirect to appropriate dashboard based on role
- Show loading spinner during authentication

**Error Handling:**
- Display error message for invalid credentials
- Rate limiting notification
- Server error handling

---

### 3. **register.html** - Registration Page
**Route:** `/auth/register`

**Purpose:** New user account creation

**Form Fields:**
- Full name (text input)
- Email (email input with validation)
- Password (password input with strength indicator)
- Confirm password (password input with matching validation)
- Role selector (Student/Instructor) - optional
- Terms of service checkbox

**Buttons:**
- Create Account (primary)
- Already have an account? Login (link)

**API Calls:**
```javascript
POST /auth/register
{
  "name": "Sarah Chen",
  "email": "sarah@student.edu",
  "password": "securepassword",
  "role": "student"
}

Response:
{
  "success": true,
  "user_id": 1,
  "access_token": "..."
}
```

**On Success:**
- Store token in localStorage
- For students: Redirect to `/onboarding`
- For instructors: Redirect to `/admin/dashboard`

**Validation:**
- Real-time email format validation
- Password strength meter
- Confirm password matching
- Terms acceptance required

---

## Student Pages (Authentication Required)

### 4. **onboarding.html** - Student Onboarding Survey
**Route:** `/onboarding`

**Purpose:** Collect student learning preferences and background

**Multi-Step Form (5 steps):**

**Step 1: Why are you taking this course?**
- Radio buttons: Required for degree / Personal interest / Professional development / Other
- Text input if "Other" selected

**Step 2: Familiarity level**
- Radio buttons: Complete beginner / Some background / Intermediate / Advanced

**Step 3: Learning style**
- Checkboxes (multiple selection):
  - Visual (diagrams, videos)
  - Hands-on (exercises, projects)
  - Theoretical (concepts, frameworks)
  - Discussion-based (Q&A, dialogue)

**Step 4: Learning goals**
- Textarea: What do you hope to achieve?

**Step 5: Background**
- Textarea: Education, work, interests

**Navigation:**
- Progress indicator (Step 1 of 5)
- Next/Back buttons
- Skip option (fills with defaults)

**API Calls:**
```javascript
POST /onboarding/survey
{
  "user_id": 1,
  "reason": "Personal interest",
  "familiarity": "beginner",
  "learning_style": "visual_and_discussion",
  "goals": "Understand social media influence...",
  "background": "Psychology major..."
}
```

**On Success:**
- Redirect to `/student/dashboard`

---

### 5. **student-dashboard.html** - Student Dashboard
**Route:** `/student/dashboard`

**Purpose:** Main hub for student learning

**Key Sections:**

**A. Welcome Header**
- Greeting with user name
- Overall progress bar (X of 16 modules completed)
- Quick stats: Total time spent, modules completed, current streak

**B. Continue Learning Card**
- Shows current in-progress module
- Preview of last conversation
- "Continue Conversation" button

**C. Module Grid**
- Cards for all 16 modules
- Each card shows:
  - Module number and title
  - Status (Not Started / In Progress / Completed / Locked)
  - Progress percentage if in-progress
  - Grade if completed
  - Time spent if completed
  - "Start" or "Continue" button
- Lock icon for modules requiring prerequisite completion

**D. Recent Activity**
- List of recent conversations
- Learning summaries
- Achievements/badges

**API Calls:**
```javascript
GET /modules
GET /progress?user_id={user_id}
GET /conversations?user_id={user_id}&limit=5
```

**Interactive Elements:**
- Module search/filter
- Sort by: Recommended / Sequential / Difficulty
- View toggle: Grid / List

---

### 6. **module-intro.html** - Module Introduction
**Route:** `/student/modules/{module_id}`

**Purpose:** Introduce module before starting conversation

**Key Sections:**

**A. Module Header**
- Module number and title
- Description

**B. Learning Objectives**
- Bulleted list of what student will learn
- Estimated time to complete

**C. Learning Resources**
- List of PDFs, readings, external links
- Download/view buttons

**D. About Your AI Tutor**
- Explanation of Socratic method
- What to expect in conversation

**E. Prerequisites** (if applicable)
- List of required modules
- Link to start if not completed

**Buttons:**
- Start Learning (primary) → redirects to chat
- View Resources (secondary)
- Back to Dashboard (tertiary)

**API Calls:**
```javascript
GET /modules/{module_id}
GET /documents?module_id={module_id}
GET /progress?user_id={user_id}&module_id={module_id}
```

---

### 7. **chat.html** - Chat Interface with AI Tutor
**Route:** `/student/modules/{module_id}/chat`

**Purpose:** Main learning interface - conversation with Harv

**Layout:**

**A. Header**
- Module title
- Progress indicator (concepts covered)
- Menu button (access to resources, pause, complete)

**B. Chat Area (Main)**
- Message bubbles:
  - AI messages (left, with Harv avatar)
  - Student messages (right)
  - Timestamps
- Auto-scroll to latest message
- Loading indicator while AI responds

**C. Input Area**
- Text input box (expandable textarea)
- Send button
- Character counter (optional)
- Typing indicator when AI is responding

**D. Side Panel (Collapsible)**
- Resources tab: PDFs, links, references
- Concepts tab: Key concepts covered (checklist)
- Hints tab: Context-sensitive hints
- Summary tab: Learning summary so far

**E. Action Buttons**
- Pause conversation (saves state)
- Complete module (if criteria met)
- View resources
- Request hint

**API Calls:**
```javascript
// Send message
POST /chat/enhanced
{
  "user_id": 1,
  "module_id": 3,
  "message": "What is cultivation theory?",
  "conversation_id": "conv_1_3_20250930"
}

Response:
{
  "reply": "Great question! Before we explore...",
  "conversation_id": "conv_1_3_20250930",
  "memory_metrics": {...},
  "enhanced": true
}

// Load conversation history
GET /conversations/{conversation_id}

// Save progress periodically
PUT /conversations/{conversation_id}
```

**Features:**
- Real-time message rendering
- Markdown support in AI responses
- Code highlighting (if needed)
- Image/link embedding
- Auto-save conversation every 30 seconds
- "AI is thinking..." animation

**Keyboard Shortcuts:**
- Enter to send message
- Shift+Enter for new line
- Ctrl+K to toggle resources panel

---

### 8. **learning-summary.html** - Learning Summary View
**Route:** `/student/learning/summary/{summary_id}`

**Purpose:** Show what student learned after milestone

**Key Sections:**

**A. Header**
- Module title
- Date/time of summary generation

**B. What You've Learned**
- Bulleted list of concepts mastered
- Key insights discovered

**C. How You Learned It**
- Narrative description of learning process
- Socratic method effectiveness

**D. Key Concepts**
- Tag cloud or list of concepts
- Links to course corpus definitions

**E. Understanding Level**
- Visual indicator: Beginner / Intermediate / Advanced
- Progress bar

**F. Next Steps**
- Suggested topics to explore
- Link to continue conversation

**Buttons:**
- Continue Learning (primary)
- View Full Conversation (secondary)
- Download Summary (tertiary)

**API Calls:**
```javascript
GET /memory/summaries/{summary_id}
GET /memory/summaries?user_id={user_id}&module_id={module_id}
```

---

### 9. **module-completion.html** - Module Completion Screen
**Route:** `/student/modules/{module_id}/complete`

**Purpose:** Celebrate module completion and show results

**Key Sections:**

**A. Congratulations Header**
- Celebration animation/confetti
- Module title

**B. Performance Summary**
- Grade (letter grade with color coding)
- Time spent
- Messages exchanged
- Completion date

**C. Key Concepts Mastered**
- Checklist of concepts
- All marked complete

**D. Strengths**
- Positive feedback on learning approach
- Notable insights

**E. Areas for Growth**
- Constructive feedback
- Suggestions for continued learning

**F. What's Next**
- Next module preview
- Unlock notification

**Buttons:**
- Download Certificate (primary)
- Start Next Module (secondary)
- Back to Dashboard (tertiary)
- Review Conversation (link)

**API Calls:**
```javascript
POST /progress
{
  "user_id": 1,
  "module_id": 3,
  "completed": true,
  "grade": "A",
  "time_spent": 67
}

GET /certificates/{user_id}/{module_id}
```

---

### 10. **my-learning.html** - Learning History
**Route:** `/student/learning`

**Purpose:** Review all past conversations and progress

**Key Sections:**

**A. Overall Progress**
- Total modules completed
- Total time spent
- Overall grade average
- Progress visualization (timeline or chart)

**B. Filters**
- Module selector dropdown
- Status filter (All / Completed / In Progress)
- Date range picker

**C. Conversation List**
- Cards for each module completed
- Each card shows:
  - Module title
  - Completion date
  - Grade
  - Time spent
  - Message count
  - Key concepts count
  - Buttons: View Conversation, Review Summary, Download Certificate

**D. Learning Insights** (optional)
- Trends over time
- Strengths across modules
- Learning velocity

**API Calls:**
```javascript
GET /progress?user_id={user_id}
GET /conversations?user_id={user_id}
GET /memory/summaries?user_id={user_id}
```

---

### 11. **resources.html** - Resource Library
**Route:** `/student/resources`

**Purpose:** Access all course documents and materials

**Key Sections:**

**A. Search Bar**
- Full-text search across all documents
- Search button

**B. Filters**
- Module dropdown (All / Module 1 / Module 2 / ...)
- Type dropdown (All / PDF / Video / Link / Exercise)
- Recently accessed checkbox

**C. Resource List**
- Cards or list items for each resource
- Each item shows:
  - Icon (based on type)
  - Title
  - Module association (if any)
  - Type badge
  - Last accessed date
  - View/Download button

**D. Recently Accessed**
- Quick access to last 5 documents

**E. Favorites** (optional)
- Starred resources for quick access

**API Calls:**
```javascript
GET /documents?user_id={user_id}
GET /documents?module_id={module_id}
GET /documents/{id}
```

---

### 12. **profile.html** - Student Profile
**Route:** `/student/profile`

**Purpose:** Manage account settings and preferences

**Key Sections:**

**A. Profile Information**
- Name (editable)
- Email (editable)
- Avatar upload (optional)
- Save button

**B. Learning Preferences**
- Edit onboarding survey responses
- Learning style checkboxes
- Goals textarea
- Update button

**C. Account Settings**
- Change password form
- Email notifications toggle
- Timezone selector
- Language preference

**D. Statistics**
- Total modules completed
- Total time spent
- Join date
- Achievements/badges

**E. Privacy & Data**
- Download all data (GDPR)
- Delete account (with confirmation)

**API Calls:**
```javascript
GET /users/{user_id}
PUT /users/{user_id}
PUT /users/{user_id}/password
GET /onboarding/survey/{user_id}
PUT /onboarding/survey/{user_id}
```

---

### 13. **certificates.html** - Certificate Gallery
**Route:** `/student/certificates`

**Purpose:** View and download completion certificates

**Key Sections:**

**A. Certificate Grid**
- Cards for each completed module
- Each card shows:
  - Module title
  - Completion date
  - Grade
  - Certificate thumbnail preview
  - Download button

**B. Course Completion Certificate** (if all modules done)
- Special certificate for completing all 16 modules
- Large featured card

**C. Share Options** (optional)
- LinkedIn share button
- Twitter share button
- Generate shareable link

**API Calls:**
```javascript
GET /certificates?user_id={user_id}
GET /certificates/{user_id}/{module_id}
```

---

## Admin/Instructor Pages (Authentication Required)

### 14. **admin-dashboard.html** - Instructor Dashboard
**Route:** `/admin/dashboard`

**Purpose:** Overview of course performance and student activity

**Key Sections:**

**A. Overview Stats**
- Total students enrolled
- Active conversations
- Completed modules (across all students)
- Average completion time

**B. Module Performance Grid**
- Cards for all 16 modules
- Each card shows:
  - Module title
  - Student count
  - Average grade
  - Average completion time
  - Completion rate (percentage)
  - Quick action buttons (Edit, View Analytics, Test)

**C. Recent Activity Feed**
- Recent student completions
- New enrollments
- Flagged conversations (optional: struggling students)

**D. Quick Actions**
- Create new module (if supported)
- Upload document
- View all conversations
- Export analytics

**API Calls:**
```javascript
GET /analytics/overview
GET /modules
GET /analytics/modules
GET /conversations?limit=10
```

---

### 15. **admin-modules-list.html** - Module Management List
**Route:** `/admin/modules`

**Purpose:** List and manage all course modules

**Key Sections:**

**A. Actions Bar**
- Create New Module button (optional)
- Search modules
- Filter by status (Configured / Needs Setup)

**B. Module List Table**
- Columns:
  - Module # and Title
  - Description (truncated)
  - Configuration Status (✓ Configured / ⚠ Needs Setup)
  - Student Count
  - Avg Grade
  - Completion Rate
  - Actions (Edit / Test / Analytics / Duplicate / Delete)
- Sortable columns

**C. Bulk Actions** (optional)
- Select multiple modules
- Bulk export/import configurations

**API Calls:**
```javascript
GET /modules
GET /analytics/modules
```

---

### 16. **admin-module-edit.html** - Module Configuration Editor
**Route:** `/admin/modules/{module_id}/edit`

**Purpose:** Configure module teaching strategy and content

**Tabs:**

**Tab 1: Basic Information**
- Module title (text input)
- Description (textarea)
- Learning objectives (textarea or list input)
- Save button

**Tab 2: Socratic Teaching Configuration**
- System Prompt (large textarea with character count)
  - Instructions on how AI should teach
  - Examples and guidance text
- Module Prompt (large textarea)
  - What to focus on
  - Key concepts to cover
- Save button

**Tab 3: System Corpus**
- Read-only view of course-wide knowledge
- Link to edit course corpus

**Tab 4: Module Corpus**
- List of module-specific content entries
- Add buttons: Add Case Study, Add Exercise, Add Example
- Each entry shows:
  - Title
  - Type badge
  - Preview (first 100 chars)
  - Edit/Delete buttons
- Drag-and-drop reordering

**Tab 5: Resources**
- List of documents linked to this module
- Upload button
- Link existing document button

**API Calls:**
```javascript
GET /modules/{module_id}
PUT /modules/{module_id}/config
POST /modules/{module_id}/corpus
GET /modules/{module_id}/corpus
PUT /modules/{module_id}/corpus/{entry_id}
DELETE /modules/{module_id}/corpus/{entry_id}
```

**Features:**
- Auto-save draft (every 30 seconds)
- Discard changes button
- Preview mode (test with sample student question)

---

### 17. **admin-corpus-entry.html** - Add/Edit Corpus Entry
**Route:** `/admin/modules/{module_id}/corpus/add` or `/edit/{entry_id}`

**Purpose:** Create or edit module-specific content

**Form Fields:**

**A. Basic Info**
- Title (text input)
- Type dropdown (Case Study / Exercise / Example / Reading)
- Order index (number input)

**B. Content**
- Rich text editor (supports markdown)
- Character count (recommended 500-1000 words)
- Preview pane (live markdown rendering)

**C. Metadata** (optional)
- Tags (for search/filtering)
- Difficulty level (Beginner / Intermediate / Advanced)
- Estimated reading time

**Buttons:**
- Save (primary)
- Save & Add Another (secondary)
- Cancel (tertiary)

**API Calls:**
```javascript
POST /modules/{module_id}/corpus
{
  "title": "Agenda-Setting: 2016 Election",
  "content": "Media coverage frequency analysis...",
  "type": "case_study",
  "order_index": 1
}

PUT /modules/{module_id}/corpus/{entry_id}
```

---

### 18. **admin-course-corpus.html** - Global Course Corpus Manager
**Route:** `/admin/corpus/course`

**Purpose:** Manage system-wide knowledge base (shared across all modules)

**Key Sections:**

**A. Actions Bar**
- Add New Theory button
- Add New Definition button
- Add New Concept button
- Search/filter

**B. Corpus List**
- Table or cards for each entry
- Columns:
  - Title
  - Type (Theory / Definition / Historical Context / Example)
  - Order
  - Used in X modules (count)
  - Actions (Edit / Delete / Preview)
- Drag-and-drop reordering

**C. Bulk Import** (optional)
- Upload CSV or JSON
- Batch add multiple entries

**API Calls:**
```javascript
GET /corpus/course
POST /corpus/course
PUT /corpus/course/{id}
DELETE /corpus/course/{id}
```

---

### 19. **admin-course-corpus-entry.html** - Add/Edit Course Corpus Entry
**Route:** `/admin/corpus/course/add` or `/edit/{id}`

**Purpose:** Create or edit global knowledge entries

**Form Fields:**

**A. Basic Info**
- Title (text input) - e.g., "Cultivation Theory"
- Type dropdown (Theory / Definition / Historical Context / Example)
- Order index (number input)

**B. Content**
- Rich text editor (supports markdown)
- Character count (recommended 200-500 words)
- Preview pane

**C. Citation** (optional)
- Source (text input)
- Author (text input)
- Year (text input)
- URL (text input)

**Buttons:**
- Save (primary)
- Save & Add Another (secondary)
- Cancel (tertiary)

**API Calls:**
```javascript
POST /corpus/course
{
  "title": "Cultivation Theory",
  "content": "Developed by George Gerbner...",
  "type": "theory",
  "order_index": 2
}
```

---

### 20. **admin-documents.html** - Document Management
**Route:** `/admin/documents`

**Purpose:** Upload and manage course documents

**Key Sections:**

**A. Actions Bar**
- Upload Document button
- Filter by module dropdown
- Search documents

**B. Document List**
- Table or cards for each document
- Columns:
  - Icon (based on file type)
  - Filename
  - Type (PDF / DOC / Link)
  - Module assignment (Global or specific module)
  - Upload date
  - File size
  - Download count (optional)
  - Actions (Edit / Download / Delete)

**C. Upload Dialog** (Modal)
- File picker (drag-and-drop zone)
- Module assignment dropdown (Global / Module 1 / Module 2 / ...)
- Description textarea
- Upload button

**API Calls:**
```javascript
GET /documents
POST /documents/upload (multipart/form-data)
DELETE /documents/{id}
GET /documents/{id} (download)
```

---

### 21. **admin-analytics-overview.html** - Analytics Overview
**Route:** `/admin/analytics/overview`

**Purpose:** High-level course performance metrics

**Key Sections:**

**A. Key Metrics Cards**
- Total Students
- Active Conversations
- Completed Modules (total across all students)
- Average Completion Time
- Overall Completion Rate
- Average Grade

**B. Module Performance Chart**
- Bar chart or table showing:
  - Module name
  - Student count
  - Completion rate
  - Average grade
  - Average time
- Sortable by any column

**C. Student Engagement Chart**
- Line graph: Activity over time
- Metrics: New enrollments, completions, active conversations

**D. Time Analysis**
- Heatmap: Most active days/times
- Average session length
- Messages per conversation

**E. Top Performing Modules**
- Modules with highest grades
- Modules with best completion rates
- Modules with most engagement

**F. Areas for Improvement**
- Modules with low completion rates
- Modules with low average grades
- Modules with high drop-off

**Buttons:**
- Export Report (CSV/PDF)
- View Detailed Analytics (links to module-specific pages)

**API Calls:**
```javascript
GET /analytics/overview
GET /analytics/modules
GET /analytics/engagement
```

---

### 22. **admin-analytics-module.html** - Module-Specific Analytics
**Route:** `/admin/analytics/modules/{module_id}`

**Purpose:** Deep dive into single module performance

**Key Sections:**

**A. Module Header**
- Module title and description
- Edit Module button

**B. Performance Metrics**
- Students enrolled
- Completion rate (with trend)
- Average grade (with distribution chart)
- Average completion time
- Message count average

**C. Student List**
- Table of students who've engaged with this module
- Columns:
  - Student name/email
  - Status (Not Started / In Progress / Completed)
  - Grade
  - Time spent
  - Messages exchanged
  - Last activity
  - Actions (View Conversation / View Summary)
- Export student list button

**D. Common Concepts**
- Word cloud or list of most discussed concepts
- Concept mastery rates

**E. Conversation Quality**
- Average messages to completion
- Teaching effectiveness scores
- Student satisfaction (if feedback collected)

**F. Content Usage**
- Which corpus entries were most referenced
- Which documents were accessed most

**G. Recommendations**
- AI-generated insights on module improvement
- Suggested content additions

**API Calls:**
```javascript
GET /analytics/modules/{module_id}
GET /conversations?module_id={module_id}
GET /progress?module_id={module_id}
```

---

### 23. **admin-analytics-students.html** - Student Performance Overview
**Route:** `/admin/analytics/students`

**Purpose:** View all student performance data

**Key Sections:**

**A. Filters**
- Search by name/email
- Status filter (All / Active / Completed / Inactive)
- Sort by (Name / Progress / Grade / Join Date)

**B. Student List Table**
- Columns:
  - Name/Email
  - Join Date
  - Modules Completed (X of 16)
  - Overall Grade Average
  - Total Time Spent
  - Last Activity
  - Actions (View Profile / View Conversations / Message)
- Pagination

**C. Export Options**
- Export student roster
- Export grades
- Export learning summaries

**API Calls:**
```javascript
GET /analytics/students
GET /progress (all students)
```

---

### 24. **admin-conversations-list.html** - Conversation Browser
**Route:** `/admin/conversations`

**Purpose:** Browse and monitor all student conversations

**Key Sections:**

**A. Filters**
- Student search/dropdown
- Module dropdown
- Status (All / In Progress / Completed)
- Date range

**B. Conversation List**
- Cards or table for each conversation
- Each entry shows:
  - Student name/email
  - Module title
  - Started date
  - Status (In Progress / Completed)
  - Message count
  - Current grade (if in progress)
  - Final grade (if completed)
  - Key concepts discussed
  - Actions (View Conversation / View Summary)

**C. Quick Stats**
- Total conversations
- Active conversations
- Average messages per conversation

**API Calls:**
```javascript
GET /conversations (with filters)
GET /conversations?module_id={module_id}
GET /conversations?user_id={user_id}
```

---

### 25. **admin-conversation-detail.html** - View Conversation Detail
**Route:** `/admin/conversations/{conversation_id}`

**Purpose:** Review specific student-AI conversation

**Key Sections:**

**A. Conversation Header**
- Student name/email
- Module title
- Started/Completed dates
- Status
- Grade
- Link to student profile
- Link to module analytics

**B. Chat Transcript**
- Full message history
- Student messages (left)
- AI responses (right)
- Timestamps
- Indicators for:
  - Memory summary generation points
  - Concept mastery moments
  - Hint requests

**C. Sidebar**
- Conversation Metadata:
  - Message count
  - Time spent
  - Concepts covered
  - Understanding level
- Memory Summaries:
  - Links to all summaries generated during conversation
- AI Context Used:
  - Which corpus entries were referenced
  - Which prior knowledge was used
- Teaching Effectiveness Score

**D. Actions**
- Export conversation (TXT/PDF)
- Flag for review (if concerning)
- Add note (instructor comments)
- View learning summary

**API Calls:**
```javascript
GET /conversations/{conversation_id}
GET /memory/summaries?conversation_id={conversation_id}
```

---

### 26. **admin-module-test.html** - Module Configuration Test
**Route:** `/admin/modules/{module_id}/test`

**Purpose:** Test module configuration before students use it

**Key Sections:**

**A. Configuration Status**
- Checklist:
  - ✓/✗ Module loaded successfully
  - ✓/✗ System prompt configured
  - ✓/✗ Module prompt configured
  - ✓/✗ System corpus loaded (X entries)
  - ✓/✗ Module corpus loaded (X entries)
  - ✓/✗ API endpoint configured
- Configuration score (0-100)

**B. Test Chat Interface**
- Simulated student chat
- Sample question input
- "Send Test Message" button
- AI response preview area
- Context used display:
  - System prompt excerpt
  - Module prompt excerpt
  - Corpus entries referenced

**C. Response Quality Analysis**
- ✓/✗ Response uses Socratic method
- ✓/✗ Response references module content
- ✓/✗ Response is on-topic
- ✓/✗ Response asks guiding questions
- Suggestions for improvement

**D. Sample Questions** (Quick Test)
- Pre-written test questions
- Click to auto-fill and test
- Examples:
  - "What is [main concept]?"
  - "Can you explain [theory]?"
  - "I don't understand [topic]"

**Buttons:**
- Run Full Test Suite
- Save Test Results
- Edit Module Configuration
- Close

**API Calls:**
```javascript
GET /modules/{module_id}/test
POST /chat/enhanced (with test user)
{
  "user_id": 0, // test user
  "module_id": 3,
  "message": "What is cultivation theory?",
  "test_mode": true
}
```

---

## Shared/Utility Pages

### 27. **404.html** - Page Not Found
**Route:** `/404`

**Purpose:** Handle non-existent routes

**Key Sections:**
- 404 error message
- Helpful text: "The page you're looking for doesn't exist"
- Link back to dashboard
- Search box (optional)

---

### 28. **500.html** - Server Error
**Route:** `/500`

**Purpose:** Handle server errors gracefully

**Key Sections:**
- 500 error message
- Apology text: "Something went wrong on our end"
- Contact support button
- Try again button
- Link back to dashboard

---

### 29. **maintenance.html** - Maintenance Mode
**Route:** `/maintenance`

**Purpose:** Display when system is down for maintenance

**Key Sections:**
- Maintenance icon/animation
- "We'll be back soon" message
- Estimated time (if known)
- Status page link (optional)

---

## Component Templates (Reusable)

These are not full pages but reusable components used across multiple pages:

### 30. **navigation.html** - Main Navigation Bar
**Used in:** All authenticated pages

**Elements:**
- Logo (links to dashboard)
- Navigation links (conditional based on role)
  - Student: Dashboard / Modules / My Learning / Resources / Profile
  - Admin: Dashboard / Modules / Corpus / Documents / Analytics / Conversations
- Search bar (global)
- Notifications icon (optional)
- User profile dropdown:
  - Profile
  - Settings
  - Help/Documentation
  - Logout

---

### 31. **footer.html** - Footer
**Used in:** All pages

**Elements:**
- Copyright
- Privacy Policy link
- Terms of Service link
- Contact/Support link
- Social media links (optional)
- Version number (optional)

---

### 32. **loading.html** - Loading Spinner/Skeleton
**Used in:** Various pages during API calls

**Elements:**
- Spinner animation
- Loading text
- Skeleton screens for content-heavy pages

---

### 33. **modal.html** - Generic Modal Dialog
**Used in:** Various pages for confirmations, forms

**Elements:**
- Overlay
- Modal container
- Close button (X)
- Header
- Body (dynamic content)
- Footer with action buttons

---

### 34. **toast.html** - Toast Notifications
**Used in:** All pages for feedback messages

**Elements:**
- Success toast (green)
- Error toast (red)
- Warning toast (yellow)
- Info toast (blue)
- Auto-dismiss timer
- Close button

---

## Summary

### Page Count by Category

**Public Pages:** 3
- Landing, Login, Register

**Student Pages:** 10
- Onboarding, Dashboard, Module Intro, Chat, Learning Summary, Module Completion, My Learning, Resources, Profile, Certificates

**Admin Pages:** 13
- Dashboard, Modules List, Module Edit, Corpus Entry, Course Corpus, Course Corpus Entry, Documents, Analytics Overview, Analytics Module, Analytics Students, Conversations List, Conversation Detail, Module Test

**Utility Pages:** 3
- 404, 500, Maintenance

**Reusable Components:** 5
- Navigation, Footer, Loading, Modal, Toast

**Total HTML Files Needed:** 34

---

## Technical Requirements

### Required JavaScript Libraries

1. **Frontend Framework** (choose one):
   - React.js (recommended for SPA)
   - Vue.js
   - Plain JavaScript with template literals

2. **HTTP Client:**
   - Axios or Fetch API

3. **UI Components:**
   - Tailwind CSS or Bootstrap for styling
   - Chart.js for analytics visualizations
   - Markdown renderer (marked.js or showdown.js)
   - Rich text editor (Quill.js or TinyMCE)

4. **Utilities:**
   - Moment.js or date-fns for date formatting
   - JWT decode for token handling
   - File upload library (Dropzone.js or similar)

### Required CSS/Styling

1. **Responsive Design:**
   - Mobile-first approach
   - Breakpoints for tablet and desktop

2. **Design System:**
   - Consistent color palette
   - Typography scale
   - Spacing system
   - Component library

3. **Accessibility:**
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - Screen reader support
   - Focus indicators

---

## Development Priority

### Phase 1: MVP (Student Learning Flow)
1. login.html
2. register.html
3. onboarding.html
4. student-dashboard.html
5. module-intro.html
6. chat.html
7. module-completion.html

### Phase 2: Admin Setup
8. admin-dashboard.html
9. admin-modules-list.html
10. admin-module-edit.html
11. admin-corpus-entry.html
12. admin-module-test.html

### Phase 3: Enhanced Features
13. my-learning.html
14. learning-summary.html
15. resources.html
16. admin-analytics-overview.html
17. admin-conversations-list.html
18. admin-conversation-detail.html

### Phase 4: Polish & Scale
19. profile.html
20. certificates.html
21. admin-analytics-module.html
22. admin-analytics-students.html
23. All remaining pages

---

## Next Steps

1. **Choose Framework:** React, Vue, or vanilla JS
2. **Create Design System:** Colors, typography, components
3. **Set up Project Structure:**
   ```
   frontend/
   ├── public/
   │   └── index.html
   ├── src/
   │   ├── pages/
   │   ├── components/
   │   ├── services/
   │   ├── utils/
   │   └── styles/
   └── package.json
   ```
4. **Build MVP:** Focus on Phase 1 pages
5. **Connect to Backend:** Implement API calls
6. **Test & Iterate:** User testing and refinement
