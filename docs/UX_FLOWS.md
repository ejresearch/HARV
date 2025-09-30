# Harv Platform - UX Flows

## User Roles & Journeys

This document outlines the complete user experience flows for both **Administrators** (instructors building courses) and **Students** (learners using the platform) based on the Harv backend architecture.

---

## Admin User Flow: Building & Managing a Course

### **Phase 1: Initial Setup**

#### **Step 1.1: Admin Registration**
```
Admin visits platform → Register
  ↓
POST /auth/register
{
  "email": "professor@university.edu",
  "password": "secure_password",
  "name": "Dr. Sarah Johnson",
  "role": "instructor"  // Note: Backend doesn't have roles yet
}
  ↓
Receives access token → Logged in
```

**UI Elements:**
- Registration form with email, password, name
- Optional: Role selector (Student/Instructor)
- Terms of service checkbox

---

#### **Step 1.2: View Available Modules**
```
Admin dashboard → View modules list
  ↓
GET /modules
  ↓
Displays 16 pre-loaded communication modules
```

**UI Elements:**
- Module grid or list view
- Each module card shows:
  - Title
  - Description
  - Configuration status (✓ configured / ⚠ needs setup)
  - "Edit" button
- Search/filter by module name
- "Create New Module" button (if supported)

**What Admin Sees:**
```
┌─────────────────────────────────────────┐
│ Module 1: Communication Theory          │
│ Foundational concepts and overview...   │
│ Status: ✓ Configured                    │
│ [Edit] [Test] [View Stats]              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Module 3: Media Theory and Effects      │
│ Understanding how media influences...    │
│ Status: ⚠ Needs Content                 │
│ [Edit] [Test] [View Stats]              │
└─────────────────────────────────────────┘
```

---

### **Phase 2: Course Content Development**

#### **Step 2.1: Configure Module Teaching Strategy**
```
Admin clicks "Edit" on Module 3
  ↓
GET /modules/3
  ↓
Module configuration editor opens
```

**UI Elements - Module Configuration Page:**

**Tab 1: Basic Information**
```
┌────────────────────────────────────────────┐
│ Module Title                                │
│ [Media Theory and Effects            ]     │
│                                             │
│ Description                                 │
│ [Understanding how media influences... ]   │
│                                             │
│ Learning Objectives (optional)              │
│ [Students will understand cultivation  ]   │
│ [theory, agenda-setting, framing...    ]   │
└────────────────────────────────────────────┘
```

**Tab 2: Socratic Teaching Configuration**
```
┌────────────────────────────────────────────┐
│ System Prompt (How AI Should Teach)        │
│ ┌────────────────────────────────────────┐ │
│ │ You are Harv, a Socratic tutor for    │ │
│ │ Media Theory. Guide students to       │ │
│ │ discover major theories through       │ │
│ │ strategic questioning...              │ │
│ └────────────────────────────────────────┘ │
│                                             │
│ Module Prompt (What to Focus On)           │
│ ┌────────────────────────────────────────┐ │
│ │ Focus on:                             │ │
│ │ - Cultivation theory                  │ │
│ │ - Agenda-setting vs framing           │ │
│ │ - Media effects on perception         │ │
│ └────────────────────────────────────────┘ │
│                                             │
│ [Save Configuration]                        │
└────────────────────────────────────────────┘
```

**API Call:**
```
PUT /modules/3/config
{
  "system_prompt": "You are Harv, a Socratic tutor...",
  "module_prompt": "Focus on cultivation theory..."
}
```

---

#### **Step 2.2: Populate Global Course Knowledge Base**
```
Admin navigates to "Course Corpus" section
  ↓
Add foundational theories shared across all modules
```

**UI Elements - Course Corpus Manager:**
```
┌────────────────────────────────────────────────┐
│ Global Course Knowledge Base                    │
│ (Used across all 16 modules)                   │
├────────────────────────────────────────────────┤
│ [+ Add New Theory/Concept]                     │
│                                                 │
│ 1. Shannon-Weaver Model                 [Edit] │
│    Type: Theory | Order: 1                     │
│    Preview: Information Source → Transmitter...│
│                                                 │
│ 2. Cultivation Theory                   [Edit] │
│    Type: Theory | Order: 2                     │
│    Preview: Long-term media exposure shapes... │
│                                                 │
│ 3. Agenda-Setting Theory                [Edit] │
│    Type: Theory | Order: 3                     │
│    Preview: Media tells us what to think...    │
└────────────────────────────────────────────────┘
```

**Add Theory Dialog:**
```
┌────────────────────────────────────────────┐
│ Add Course Corpus Entry                     │
├────────────────────────────────────────────┤
│ Title                                       │
│ [Cultivation Theory                    ]   │
│                                             │
│ Type                                        │
│ [v] Theory                                  │
│     Definition                              │
│     Historical Context                      │
│     Example                                 │
│                                             │
│ Content (200-500 words)                     │
│ ┌─────────────────────────────────────────┐ │
│ │ Developed by George Gerbner in the     │ │
│ │ 1960s. States that long-term exposure  │ │
│ │ to media content shapes viewers'       │ │
│ │ perceptions of reality...              │ │
│ │                                        │ │
│ │ Key concepts:                          │ │
│ │ - Mean World Syndrome                  │ │
│ │ - Heavy vs. light viewers              │ │
│ │ - Cultivation differential             │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Display Order                               │
│ [2]                                         │
│                                             │
│ [Cancel] [Save Theory]                      │
└────────────────────────────────────────────┘
```

**API Call:**
```
POST /course_corpus (endpoint needs to be created)
{
  "title": "Cultivation Theory",
  "content": "Developed by George Gerbner...",
  "type": "theory",
  "order_index": 2
}
```

**Backend Note:** This endpoint doesn't exist yet. Admin would need:
- `POST /corpus/course` - Create course corpus entry
- `GET /corpus/course` - List all course corpus
- `PUT /corpus/course/{id}` - Update entry
- `DELETE /corpus/course/{id}` - Delete entry

---

#### **Step 2.3: Add Module-Specific Content**
```
Admin selects Module 3 → "Add Content"
  ↓
Create case studies, exercises, examples
```

**UI Elements - Module Corpus Manager:**
```
┌────────────────────────────────────────────────┐
│ Module 3: Media Theory - Specific Content      │
│ (Only shown to students in this module)        │
├────────────────────────────────────────────────┤
│ [+ Add Case Study] [+ Add Exercise] [+ Add Example]
│                                                 │
│ Case Studies (2)                                │
│ ├─ Agenda-Setting: 2016 Election      [Edit]  │
│ └─ Cultivation Theory: Crime Perception [Edit] │
│                                                 │
│ Exercises (1)                                   │
│ └─ Compare News Coverage Analysis      [Edit]  │
│                                                 │
│ Examples (3)                                    │
│ ├─ Social Media Echo Chambers          [Edit]  │
│ ├─ Netflix Algorithm Influence         [Edit]  │
│ └─ Political Ad Targeting              [Edit]  │
└────────────────────────────────────────────────┘
```

**Add Case Study Dialog:**
```
┌────────────────────────────────────────────┐
│ Add Module Content                          │
├────────────────────────────────────────────┤
│ Title                                       │
│ [Agenda-Setting: 2016 Election         ]   │
│                                             │
│ Type                                        │
│ [v] Case Study                              │
│     Exercise                                │
│     Example                                 │
│     Reading                                 │
│                                             │
│ Content (500-1000 words)                    │
│ ┌─────────────────────────────────────────┐ │
│ │ Media coverage frequency analysis      │ │
│ │ showing how news outlets set public    │ │
│ │ agenda through story selection and     │ │
│ │ prominence.                            │ │
│ │                                        │ │
│ │ CNN Coverage Breakdown:                │ │
│ │ - Email scandal: 40%                   │ │
│ │ - Immigration: 15%                     │ │
│ │ - Economy: 20%                         │ │
│ │                                        │ │
│ │ Fox News Coverage Breakdown:           │ │
│ │ - Immigration: 35%                     │ │
│ │ - Email scandal: 25%                   │ │
│ │ - Economy: 18%                         │ │
│ │                                        │ │
│ │ Discussion Questions for Students:     │ │
│ │ - What patterns do you notice?         │ │
│ │ - How might this affect voter         │ │
│ │   perceptions of importance?           │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Display Order                               │
│ [1]                                         │
│                                             │
│ [Cancel] [Save Content]                     │
└────────────────────────────────────────────┘
```

**API Call:**
```
POST /modules/3/corpus (endpoint needs to be created)
{
  "module_id": 3,
  "title": "Agenda-Setting: 2016 Election",
  "content": "Media coverage frequency analysis...",
  "type": "case_study",
  "order_index": 1
}
```

**Backend Note:** This endpoint doesn't exist yet. Admin would need:
- `POST /modules/{id}/corpus` - Create module corpus entry
- `GET /modules/{id}/corpus` - List module corpus entries
- `PUT /modules/{id}/corpus/{entry_id}` - Update entry
- `DELETE /modules/{id}/corpus/{entry_id}` - Delete entry

---

#### **Step 2.4: Upload Course Documents**
```
Admin uploads PDFs, readings, reference materials
  ↓
POST /documents/upload (endpoint needs to be created)
  ↓
Documents stored and linked to modules
```

**UI Elements - Document Manager:**
```
┌────────────────────────────────────────────────┐
│ Course Documents                                │
├────────────────────────────────────────────────┤
│ [↑ Upload Document]                            │
│                                                 │
│ Filter by Module: [All Modules v]              │
│                                                 │
│ Global Documents (All Modules)                  │
│ ├─ 📄 Communication_Theory_Primer.pdf   [View] │
│ └─ 📄 Media_Ethics_Guidelines.pdf       [View] │
│                                                 │
│ Module 3: Media Theory Documents                │
│ ├─ 📄 Cultivation_Theory_Research.pdf   [View] │
│ ├─ 📄 Agenda_Setting_Examples.pdf       [View] │
│ └─ 🔗 External: NY Times Media Bias Study      │
└────────────────────────────────────────────────┘
```

**Upload Dialog:**
```
┌────────────────────────────────────────────┐
│ Upload Document                             │
├────────────────────────────────────────────┤
│ File                                        │
│ [Choose File] Cultivation_Theory.pdf       │
│                                             │
│ Assign to Module                            │
│ [v] Module 3: Media Theory                  │
│     Global (All Modules)                    │
│                                             │
│ Description (optional)                      │
│ [Research paper on cultivation theory  ]   │
│                                             │
│ [Cancel] [Upload]                           │
└────────────────────────────────────────────┘
```

**Backend Note:** Document endpoints need to be created:
- `POST /documents/upload` - Upload file
- `GET /documents` - List all documents
- `GET /documents/{id}` - Download document
- `DELETE /documents/{id}` - Delete document

---

#### **Step 2.5: Test Module Configuration**
```
Admin clicks "Test Module" button
  ↓
GET /modules/3/test
  ↓
Verifies all configuration loaded correctly
```

**UI Elements - Test Results:**
```
┌────────────────────────────────────────────┐
│ Module 3 Configuration Test                 │
├────────────────────────────────────────────┤
│ ✓ Module loaded successfully               │
│ ✓ System prompt configured                 │
│ ✓ Module prompt configured                 │
│ ✓ System corpus: 15 theories loaded        │
│ ✓ Module corpus: 6 entries loaded          │
│ ⚠ Dynamic corpus: Empty (generates at      │
│   runtime)                                  │
│ ✓ API endpoint: Configured                 │
│                                             │
│ Configuration Score: 95/100                 │
│                                             │
│ [Test with AI] [Close]                     │
└────────────────────────────────────────────┘
```

**Test with AI Dialog:**
```
┌────────────────────────────────────────────┐
│ Test AI Tutor Response                      │
├────────────────────────────────────────────┤
│ Sample Student Question:                    │
│ [What is cultivation theory?          ]   │
│                                             │
│ [Send Test Message]                        │
│                                             │
│ AI Response Preview:                        │
│ ┌─────────────────────────────────────────┐ │
│ │ Great question! Before we explore       │ │
│ │ that, I'm curious: How many hours do    │ │
│ │ you think you spend watching TV or      │ │
│ │ streaming content per day? And do you   │ │
│ │ think what you watch might influence    │ │
│ │ your perception of the real world?      │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Response Quality: ✓ Socratic                │
│ Context Used: System + Module prompts      │
│                                             │
│ [Close]                                     │
└────────────────────────────────────────────┘
```

---

### **Phase 3: Monitoring & Management**

#### **Step 3.1: View Course Analytics Dashboard**
```
Admin navigates to "Analytics"
  ↓
GET /analytics/overview (endpoint needs to be created)
  ↓
Displays student engagement and progress
```

**UI Elements - Analytics Dashboard:**
```
┌────────────────────────────────────────────────────────┐
│ Course Analytics Dashboard                              │
├────────────────────────────────────────────────────────┤
│ Overview                                                │
│ ├─ Total Students: 47                                  │
│ ├─ Active Conversations: 89                            │
│ ├─ Completed Modules: 312                              │
│ └─ Avg. Completion Time: 45 minutes per module         │
│                                                         │
│ Module Performance                                      │
│ ┌──────────────────────────────────────────────────┐   │
│ │ Module 1: Communication Theory                    │   │
│ │ Students: 42 | Avg Grade: B+ | Avg Time: 38min  │   │
│ │ ████████████████░░░░ 87% completion rate        │   │
│ │                                                   │   │
│ │ Module 3: Media Theory                            │   │
│ │ Students: 38 | Avg Grade: A- | Avg Time: 52min  │   │
│ │ ███████████████████░ 92% completion rate        │   │
│ └──────────────────────────────────────────────────┘   │
│                                                         │
│ Student Engagement                                      │
│ ├─ Most Active Time: 7-9 PM                            │
│ ├─ Avg Messages per Conversation: 18                   │
│ └─ Memory Summaries Generated: 234                     │
│                                                         │
│ [Export Report] [View Details]                         │
└────────────────────────────────────────────────────────┘
```

**Backend Note:** Analytics endpoints need to be created:
- `GET /analytics/overview` - Overall course stats
- `GET /analytics/modules/{id}` - Module-specific stats
- `GET /analytics/students` - Student performance data

---

#### **Step 3.2: Review Student Conversations**
```
Admin clicks "View Details" on Module 3
  ↓
GET /conversations?module_id=3
  ↓
Lists all student conversations in that module
```

**UI Elements - Conversation Browser:**
```
┌────────────────────────────────────────────────────────┐
│ Module 3: Student Conversations                         │
├────────────────────────────────────────────────────────┤
│ Filter: [All Students v] [All Statuses v] [Last 30 days v]
│                                                         │
│ Sarah Chen (sarah@student.edu)                          │
│ ├─ Started: Sep 28, 2025 | Status: In Progress        │
│ ├─ Messages: 15 | Grade: B                             │
│ ├─ Key Concepts: agenda-setting, framing               │
│ └─ [View Conversation] [View Memory Summary]           │
│                                                         │
│ Mike Rodriguez (mike@student.edu)                       │
│ ├─ Started: Sep 29, 2025 | Status: Completed           │
│ ├─ Messages: 22 | Grade: A-                            │
│ ├─ Key Concepts: cultivation theory, media effects     │
│ └─ [View Conversation] [View Memory Summary]           │
│                                                         │
│ [1] [2] [3] ... [8] Next →                            │
└────────────────────────────────────────────────────────┘
```

**View Conversation Detail:**
```
┌────────────────────────────────────────────────────────┐
│ Conversation: Sarah Chen - Module 3                     │
├────────────────────────────────────────────────────────┤
│ Student: What is cultivation theory?                    │
│ 📅 Sep 28, 2025 3:45 PM                                │
│                                                         │
│ Harv: Great question! Before we explore that, I'm      │
│ curious: How many hours do you think you spend         │
│ watching TV or streaming content per day?              │
│ 📅 Sep 28, 2025 3:45 PM                                │
│                                                         │
│ Student: Maybe 3-4 hours, mostly Netflix and YouTube.  │
│ 📅 Sep 28, 2025 3:47 PM                                │
│                                                         │
│ Harv: That's quite common! Now, do you think what you  │
│ watch might influence your perception of the real      │
│ world? For example, do crime dramas make you feel the  │
│ world is more dangerous?                                │
│ 📅 Sep 28, 2025 3:48 PM                                │
│                                                         │
│ [Load More] [Export Conversation] [Close]              │
└────────────────────────────────────────────────────────┘
```

**Backend API:**
```
GET /conversations?module_id=3&user_id=1
GET /conversations/{conversation_id}
```

---

#### **Step 3.3: Review Memory Summaries**
```
Admin clicks "View Memory Summary"
  ↓
GET /memory/summaries?user_id=1&module_id=3
  ↓
Shows what student learned and how
```

**UI Elements - Memory Summary View:**
```
┌────────────────────────────────────────────────────────┐
│ Learning Summary: Sarah Chen - Module 3                 │
├────────────────────────────────────────────────────────┤
│ What Learned                                            │
│ ┌────────────────────────────────────────────────────┐ │
│ │ • Understood cultivation theory - long-term media  │ │
│ │   exposure shapes perception of reality            │ │
│ │ • Differentiated agenda-setting (what to think     │ │
│ │   about) vs framing (how to think about it)        │ │
│ │ • Recognized Mean World Syndrome concept           │ │
│ │ • Connected theory to personal Netflix viewing     │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ How Learned                                             │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Through Socratic questioning about personal media  │ │
│ │ habits. Started with reflection on own viewing     │ │
│ │ patterns, then guided to discover how heavy        │ │
│ │ exposure might distort perception. Used crime TV   │ │
│ │ example to illustrate Mean World Syndrome.         │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ Key Concepts Mastered                                   │
│ [cultivation theory] [agenda-setting] [framing]        │
│ [media effects] [perception]                            │
│                                                         │
│ Understanding Level: Intermediate                       │
│ Teaching Effectiveness: High                            │
│                                                         │
│ Learning Insights                                       │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Student made excellent connection between          │ │
│ │ traditional cultivation theory and modern          │ │
│ │ streaming algorithms. Shows ability to apply       │ │
│ │ classic theories to contemporary media.            │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ Generated: Sep 28, 2025 4:15 PM                        │
│ [Close]                                                 │
└────────────────────────────────────────────────────────┘
```

**Backend API:**
```
GET /memory/summaries?user_id=1&module_id=3
```

**Backend Note:** This endpoint needs to be created:
- `GET /memory/summaries` - List summaries with filters
- `GET /memory/summaries/{id}` - Get specific summary

---

#### **Step 3.4: Update Module Content Based on Analytics**
```
Admin notices low completion rate for Module 7
  ↓
Reviews student feedback and conversation patterns
  ↓
Updates module prompts or adds more examples
  ↓
PUT /modules/7/config
```

**Iteration Loop:**
1. Monitor analytics
2. Identify struggling modules
3. Review student conversations
4. Refine teaching prompts
5. Add more relevant examples
6. Test changes
7. Deploy updates
8. Monitor improvements

---

## Student User Flow: Using the Course

### **Phase 1: Onboarding**

#### **Step 1.1: Registration**
```
Student visits platform → Create Account
  ↓
POST /auth/register
{
  "email": "sarah@student.edu",
  "password": "secure_password",
  "name": "Sarah Chen"
}
  ↓
Receives access token → Logged in
```

**UI Elements:**
```
┌────────────────────────────────────────┐
│ Create Your Account                     │
├────────────────────────────────────────┤
│ Email                                   │
│ [sarah@student.edu              ]      │
│                                         │
│ Password                                │
│ [••••••••••••                   ]      │
│                                         │
│ Confirm Password                        │
│ [••••••••••••                   ]      │
│                                         │
│ Full Name                               │
│ [Sarah Chen                     ]      │
│                                         │
│ ☐ I agree to Terms of Service          │
│                                         │
│ [Create Account]                        │
│                                         │
│ Already have an account? [Log In]      │
└────────────────────────────────────────┘
```

---

#### **Step 1.2: Onboarding Survey**
```
After registration → Onboarding questionnaire
  ↓
POST /onboarding/survey (endpoint needs to be created)
  ↓
Personalizes learning experience
```

**UI Elements - Onboarding Survey:**
```
┌────────────────────────────────────────────┐
│ Welcome to Harv! Let's personalize your    │
│ learning experience.                        │
├────────────────────────────────────────────┤
│ Step 1 of 5                                 │
│                                             │
│ Why are you taking this course?            │
│ ○ Required for my degree                   │
│ ○ Personal interest                        │
│ ○ Professional development                 │
│ ○ Other: [________________]                │
│                                             │
│ [Next]                                      │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ Step 2 of 5                                 │
│                                             │
│ How familiar are you with communication    │
│ theory and media studies?                  │
│ ○ Complete beginner                        │
│ ○ Some background knowledge                │
│ ○ Intermediate level                       │
│ ○ Advanced/Expert                          │
│                                             │
│ [Back] [Next]                              │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ Step 3 of 5                                 │
│                                             │
│ What's your preferred learning style?      │
│ ☐ Visual (diagrams, videos, infographics) │
│ ☐ Hands-on (exercises, projects)          │
│ ☐ Theoretical (concepts, frameworks)       │
│ ☐ Discussion-based (Q&A, dialogue)         │
│                                             │
│ [Back] [Next]                              │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ Step 4 of 5                                 │
│                                             │
│ What are your learning goals?              │
│ ┌────────────────────────────────────────┐ │
│ │ I want to understand how social media  │ │
│ │ algorithms influence what information  │ │
│ │ I see and how that affects my          │ │
│ │ worldview.                             │ │
│ └────────────────────────────────────────┘ │
│                                             │
│ [Back] [Next]                              │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ Step 5 of 5                                 │
│                                             │
│ Tell us about your background              │
│ (education, work, interests)               │
│ ┌────────────────────────────────────────┐ │
│ │ I'm a psychology major with a strong   │ │
│ │ interest in how technology affects     │ │
│ │ human behavior. I spend a lot of time  │ │
│ │ on social media and want to understand │ │
│ │ it better.                             │ │
│ └────────────────────────────────────────┘ │
│                                             │
│ [Back] [Complete Setup]                    │
└────────────────────────────────────────────┘
```

**API Call:**
```
POST /onboarding/survey (endpoint needs to be created)
{
  "user_id": 1,
  "reason": "Personal interest",
  "familiarity": "beginner",
  "learning_style": "visual_and_discussion",
  "goals": "I want to understand how social media algorithms...",
  "background": "I'm a psychology major with a strong interest..."
}
```

**Backend Note:** Onboarding endpoints need to be created:
- `POST /onboarding/survey` - Save survey responses
- `GET /onboarding/survey/{user_id}` - Retrieve survey
- `PUT /onboarding/survey/{user_id}` - Update survey

---

### **Phase 2: Learning Journey**

#### **Step 2.1: View Course Dashboard**
```
Student logs in → Course dashboard
  ↓
GET /modules (list of all modules)
GET /progress/{user_id} (user's progress)
  ↓
Displays modules with progress indicators
```

**UI Elements - Student Dashboard:**
```
┌────────────────────────────────────────────────────────┐
│ Welcome back, Sarah! 👋                                 │
├────────────────────────────────────────────────────────┤
│ Your Progress                                           │
│ ████████░░░░░░░░ 3 of 16 modules completed (19%)       │
│                                                         │
│ Continue Learning                                       │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Module 4: Print Media and Journalism               │ │
│ │ In Progress | 12 messages | Grade: B               │ │
│ │ [Continue Conversation]                            │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ Available Modules                                       │
│                                                         │
│ ┌──────────────────┐ ┌──────────────────┐             │
│ │ Module 1         │ │ Module 2         │             │
│ │ Communication    │ │ Media History    │             │
│ │ Theory           │ │                  │             │
│ │ ✓ Completed      │ │ ✓ Completed      │             │
│ │ Grade: B+        │ │ Grade: A-        │             │
│ │ 45 min           │ │ 38 min           │             │
│ └──────────────────┘ └──────────────────┘             │
│                                                         │
│ ┌──────────────────┐ ┌──────────────────┐             │
│ │ Module 3         │ │ Module 4         │             │
│ │ Media Theory     │ │ Print Media      │             │
│ │ ✓ Completed      │ │ ⏸ In Progress    │             │
│ │ Grade: A         │ │ 52% complete     │             │
│ │ 67 min           │ │ [Continue]       │             │
│ └──────────────────┘ └──────────────────┘             │
│                                                         │
│ ┌──────────────────┐ ┌──────────────────┐             │
│ │ Module 5         │ │ Module 6         │             │
│ │ Broadcasting     │ │ Digital Media    │             │
│ │ 🔒 Locked         │ │ 🔒 Locked         │             │
│ │ Complete Module  │ │ Complete Module  │             │
│ │ 4 first          │ │ 5 first          │             │
│ └──────────────────┘ └──────────────────┘             │
│                                                         │
│ [View All Modules →]                                   │
└────────────────────────────────────────────────────────┘
```

**Backend API:**
```
GET /modules
GET /progress?user_id=1
```

**Backend Note:** Progress endpoint needs to be created:
- `GET /progress` - Get user progress across all modules
- `GET /progress/{user_id}/{module_id}` - Get specific module progress

---

#### **Step 2.2: Start New Module**
```
Student clicks "Start" on Module 3
  ↓
GET /modules/3 (module details)
  ↓
Opens module introduction screen
```

**UI Elements - Module Introduction:**
```
┌────────────────────────────────────────────────────────┐
│ Module 3: Media Theory and Effects                      │
├────────────────────────────────────────────────────────┤
│ Understanding how media influences audiences and society│
│                                                         │
│ What You'll Learn                                       │
│ • Cultivation theory and mean world syndrome           │
│ • Agenda-setting vs. framing                            │
│ • Media effects on perception and behavior             │
│ • Spiral of silence theory                              │
│                                                         │
│ Estimated Time: 45-60 minutes                          │
│                                                         │
│ Learning Resources                                      │
│ 📄 Cultivation Theory Research Paper                   │
│ 📄 Agenda-Setting Case Studies                         │
│ 🔗 External: Media Effects Database                    │
│                                                         │
│ About Your AI Tutor                                     │
│ Harv will guide you through these concepts using       │
│ Socratic questioning. Rather than lecturing, Harv      │
│ will ask strategic questions to help you discover      │
│ the ideas yourself.                                     │
│                                                         │
│ [Start Learning] [Cancel]                              │
└────────────────────────────────────────────────────────┘
```

---

#### **Step 2.3: Chat with AI Tutor**
```
Student clicks "Start Learning"
  ↓
POST /chat/enhanced
{
  "user_id": 1,
  "module_id": 3,
  "message": "Hi, I'm ready to learn about media theory!",
  "conversation_id": null
}
  ↓
Opens chat interface with AI tutor
```

**UI Elements - Chat Interface:**
```
┌────────────────────────────────────────────────────────┐
│ Module 3: Media Theory and Effects          [≡] [✕]   │
├────────────────────────────────────────────────────────┤
│                                                         │
│ 🤖 Harv                                   3:45 PM      │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Welcome, Sarah! I see from your onboarding that │   │
│ │ you're interested in how social media algorithms│   │
│ │ influence information. That's perfect for this  │   │
│ │ module!                                         │   │
│ │                                                 │   │
│ │ Before we dive into media theory, I'm curious:  │   │
│ │ What apps do you use most for news and          │   │
│ │ information? And do you think you see the same  │   │
│ │ information as your friends?                    │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ 👤 You                                    3:47 PM      │
│ ┌─────────────────────────────────────────────────┐   │
│ │ I mostly use TikTok and Instagram. I think we   │   │
│ │ probably see different things because of the    │   │
│ │ algorithm, but I'm not sure how it works.       │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ 🤖 Harv                                   3:48 PM      │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Excellent observation! You've touched on        │   │
│ │ something communication scholars call           │   │
│ │ "selective exposure." Now, let's think about    │   │
│ │ this:                                           │   │
│ │                                                 │   │
│ │ If the algorithm shows you content based on     │   │
│ │ what you've engaged with before, how might that │   │
│ │ affect which issues you think are important?    │   │
│ │ And would you say the algorithm is deciding     │   │
│ │ what you think about or how you think about it? │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ [Type your response...]                    [Send]      │
│                                                         │
├────────────────────────────────────────────────────────┤
│ [📚 Resources] [💡 Hint] [⏸ Pause] [✓ Complete]       │
└────────────────────────────────────────────────────────┘
```

**Chat Features:**

**Side Panel - Resources:**
```
┌────────────────────────────────────┐
│ Module Resources                    │
├────────────────────────────────────┤
│ 📄 Cultivation Theory Paper        │
│ 📄 Agenda-Setting Case Studies     │
│ 🔗 Media Effects Database          │
│                                     │
│ Key Concepts Covered               │
│ ✓ Selective exposure               │
│ ⏳ Agenda-setting                   │
│ ⏳ Cultivation theory               │
│ ⏳ Framing                          │
└────────────────────────────────────┘
```

**Hint System:**
```
┌────────────────────────────────────┐
│ Need help?                          │
├────────────────────────────────────┤
│ Try thinking about:                 │
│ • What topics your feed shows most │
│ • Whether those match what's       │
│   actually important in the world  │
│ • The difference between choosing  │
│   topics vs. choosing perspectives │
└────────────────────────────────────┘
```

**Backend API Flow:**
```
1. Student sends message
   POST /chat/enhanced
   {
     "user_id": 1,
     "module_id": 3,
     "message": "I mostly use TikTok...",
     "conversation_id": "conv_1_3_20250930"
   }

2. Backend assembles 4-layer memory context:
   - Layer 1: Sarah's onboarding (visual learner, interested in algorithms)
   - Layer 2: Module 3 prompts + corpus (cultivation theory, agenda-setting)
   - Layer 3: Current conversation (last 10 messages)
   - Layer 4: Prior knowledge (completed Modules 1, 2 - knows communication models)

3. Backend sends to GPT-4 with assembled context

4. GPT-4 returns Socratic response

5. Backend saves conversation
   POST /conversations (internal)
   {
     "user_id": 1,
     "module_id": 3,
     "messages_json": [{sender: "user", message: "..."}, ...]
   }

6. Backend returns response to frontend
   {
     "reply": "Excellent observation! ...",
     "conversation_id": "conv_1_3_20250930",
     "enhanced": true
   }
```

---

#### **Step 2.4: Learning Progress Tracking**
```
After 5-7 exchanges → System generates memory summary
  ↓
POST /memory/summary (automatic, triggered by backend)
  ↓
Saves what student learned and how
```

**UI Elements - Progress Notification:**
```
┌────────────────────────────────────┐
│ 🎯 Learning Milestone!              │
├────────────────────────────────────┤
│ You've made great progress! Let's  │
│ capture what you've learned so far.│
│                                     │
│ Key Concepts You've Explored:      │
│ • Selective exposure               │
│ • Agenda-setting theory            │
│ • Algorithm influence              │
│                                     │
│ [View Summary] [Continue Learning] │
└────────────────────────────────────┘
```

**View Summary Dialog:**
```
┌────────────────────────────────────────────────────────┐
│ Your Learning Summary                                   │
├────────────────────────────────────────────────────────┤
│ What You've Learned                                     │
│ • Understood that algorithms create "selective         │
│   exposure" by showing content based on past behavior │
│ • Recognized the difference between agenda-setting     │
│   (choosing topics) and framing (choosing perspectives)│
│ • Connected traditional media theory to modern social  │
│   media algorithms                                      │
│                                                         │
│ How You Learned It                                      │
│ Through guided discovery starting with your personal   │
│ TikTok experience. Used Socratic questioning to help   │
│ you realize algorithms function like traditional       │
│ gatekeepers in agenda-setting theory.                  │
│                                                         │
│ Next Steps                                              │
│ Continue exploring cultivation theory and how          │
│ long-term exposure shapes perception.                  │
│                                                         │
│ [Continue Learning]                                     │
└────────────────────────────────────────────────────────┘
```

**Backend (Automatic):**
```
Every 5-7 exchanges, backend calls:
POST /memory/summary
{
  "user_id": 1,
  "module_id": 3,
  "conversation_id": "conv_1_3_20250930",
  "what_learned": "Understood selective exposure...",
  "how_learned": "Through guided discovery...",
  "key_concepts": "selective exposure, agenda-setting, algorithms",
  "understanding_level": "intermediate"
}
```

---

#### **Step 2.5: Complete Module**
```
Student demonstrates understanding → Completes module
  ↓
POST /progress
{
  "user_id": 1,
  "module_id": 3,
  "completed": true,
  "grade": "A",
  "time_spent": 67
}
  ↓
Unlocks next module
```

**UI Elements - Module Completion:**
```
┌────────────────────────────────────────────────────────┐
│ 🎉 Congratulations!                                     │
│ You've completed Module 3: Media Theory and Effects    │
├────────────────────────────────────────────────────────┤
│ Your Performance                                        │
│ Grade: A                                                │
│ Time Spent: 67 minutes                                 │
│ Messages Exchanged: 22                                 │
│                                                         │
│ Key Concepts Mastered                                   │
│ ✓ Cultivation theory                                   │
│ ✓ Agenda-setting vs. framing                           │
│ ✓ Media effects on perception                          │
│ ✓ Selective exposure                                   │
│                                                         │
│ Strengths                                               │
│ • Excellent connection between traditional theory and  │
│   modern social media                                   │
│ • Strong critical thinking and self-reflection         │
│ • Asked insightful follow-up questions                 │
│                                                         │
│ Areas for Growth                                        │
│ • Continue exploring cultivation theory's limitations  │
│ • Consider cultural differences in media effects       │
│                                                         │
│ What's Next?                                            │
│ Module 4: Print Media and Journalism is now unlocked!  │
│                                                         │
│ [View Certificate] [Start Next Module] [Back to Dashboard]
└────────────────────────────────────────────────────────┘
```

**Backend API:**
```
POST /progress (endpoint needs to be created)
{
  "user_id": 1,
  "module_id": 3,
  "completed": true,
  "grade": "A",
  "completion_date": "2025-09-30T16:45:00Z",
  "time_spent": 67,
  "attempts": 1
}
```

**Backend Note:** Progress endpoints need to be created:
- `POST /progress` - Record module completion
- `PUT /progress/{user_id}/{module_id}` - Update progress

---

### **Phase 3: Continued Learning**

#### **Step 3.1: Review Past Conversations**
```
Student navigates to "My Learning"
  ↓
GET /conversations?user_id=1
  ↓
Shows all past conversations
```

**UI Elements - My Learning Page:**
```
┌────────────────────────────────────────────────────────┐
│ My Learning Journey                                     │
├────────────────────────────────────────────────────────┤
│ Overall Progress                                        │
│ ████████░░░░░░░░ 3 of 16 modules completed             │
│                                                         │
│ Filter: [All Modules v] [Completed v] [Last 30 days v] │
│                                                         │
│ Module 3: Media Theory and Effects                      │
│ ├─ Completed: Sep 30, 2025 | Grade: A | 67 min        │
│ ├─ 22 messages | 4 key concepts mastered               │
│ ├─ [View Conversation] [Review Summary]                │
│ └─ [Download Certificate]                              │
│                                                         │
│ Module 2: History and Evolution of Media                │
│ ├─ Completed: Sep 29, 2025 | Grade: A- | 38 min       │
│ ├─ 18 messages | 3 key concepts mastered               │
│ └─ [View Conversation] [Review Summary]                │
│                                                         │
│ Module 1: Introduction to Communication Theory          │
│ ├─ Completed: Sep 28, 2025 | Grade: B+ | 45 min       │
│ ├─ 15 messages | 4 key concepts mastered               │
│ └─ [View Conversation] [Review Summary]                │
└────────────────────────────────────────────────────────┘
```

---

#### **Step 3.2: Access Learning Resources**
```
Student clicks "Resources"
  ↓
GET /documents?user_id=1
  ↓
Shows all course materials
```

**UI Elements - Resource Library:**
```
┌────────────────────────────────────────────────────────┐
│ Course Resources                                        │
├────────────────────────────────────────────────────────┤
│ Search: [cultivation theory___________] [🔍]           │
│                                                         │
│ Filter by Module: [All v] | Type: [All v]              │
│                                                         │
│ Recently Accessed                                       │
│ 📄 Cultivation Theory Research Paper                   │
│    Module 3 | PDF | Accessed: Sep 30, 2025            │
│                                                         │
│ 📄 Agenda-Setting Case Studies                         │
│    Module 3 | PDF | Accessed: Sep 30, 2025            │
│                                                         │
│ All Resources                                           │
│ ├─ 📚 Communication Theory Primer (Global)             │
│ ├─ 📄 Shannon-Weaver Model Explained (Module 1)        │
│ ├─ 📄 Media History Timeline (Module 2)                │
│ ├─ 🔗 External: NY Times Media Bias Study (Module 3)  │
│ └─ 📄 Journalism Ethics Guidelines (Module 4)          │
└────────────────────────────────────────────────────────┘
```

---

#### **Step 3.3: Continue to Next Module**
```
Student starts Module 4
  ↓
Enhanced memory system references Modules 1-3
  ↓
Creates personalized, continuous learning experience
```

**Example Enhanced Context in Module 4:**
```
🤖 Harv: Welcome to Print Media and Journalism, Sarah!

I remember from our previous modules that you're particularly
interested in how information sources shape perception. In
Module 3, you made great connections between agenda-setting
theory and social media algorithms.

Now, let's explore where it all began: How do you think
traditional newspapers and magazines decided what was
"newsworthy" before algorithms existed? And do you think
human editors might have biases similar to algorithmic ones?
```

**What Makes This "Enhanced":**
- References Module 3 learning (agenda-setting theory)
- Connects to student's stated interest (algorithms)
- Uses student's name and learning style
- Builds continuous narrative across modules

---

## Key UX Principles

### **For Admins:**

1. **Intuitive Module Management**
   - Clear hierarchy: Course Corpus → Module Corpus → Conversations
   - Visual configuration editors (no SQL required)
   - Real-time testing and preview

2. **Actionable Analytics**
   - Identify struggling students/modules
   - See actual conversation examples
   - Monitor teaching effectiveness

3. **Iterative Improvement Loop**
   - Easy to update based on student performance
   - A/B testing different prompts (future feature)
   - Version control for module configurations (future feature)

### **For Students:**

1. **Personalized Learning**
   - Adapts to learning style from onboarding
   - References prior knowledge from previous modules
   - Uses personal examples (TikTok, Netflix, etc.)

2. **Guided Discovery (Socratic Method)**
   - Questions, not lectures
   - Builds on existing knowledge
   - Encourages critical thinking

3. **Clear Progress Tracking**
   - Visual completion indicators
   - Learning summaries after milestones
   - Certificates and achievements

4. **Continuous Learning Journey**
   - Each module builds on previous ones
   - AI "remembers" past conversations
   - Consistent narrative across curriculum

---

## Missing Backend Endpoints (Required for Full UX)

### **Admin Endpoints Needed:**

1. **Course Corpus Management**
   - `POST /corpus/course` - Create entry
   - `GET /corpus/course` - List all entries
   - `PUT /corpus/course/{id}` - Update entry
   - `DELETE /corpus/course/{id}` - Delete entry

2. **Module Corpus Management**
   - `POST /modules/{id}/corpus` - Create entry
   - `GET /modules/{id}/corpus` - List entries
   - `PUT /modules/{id}/corpus/{entry_id}` - Update entry
   - `DELETE /modules/{id}/corpus/{entry_id}` - Delete entry

3. **Document Management**
   - `POST /documents/upload` - Upload file
   - `GET /documents` - List documents
   - `GET /documents/{id}` - Download document
   - `DELETE /documents/{id}` - Delete document

4. **Analytics**
   - `GET /analytics/overview` - Overall stats
   - `GET /analytics/modules/{id}` - Module stats
   - `GET /analytics/students` - Student performance
   - `GET /analytics/conversations` - Conversation metrics

5. **Conversation Management**
   - `GET /conversations` - List with filters
   - `GET /conversations/{id}` - Get specific conversation
   - `DELETE /conversations/{id}` - Delete conversation

### **Student Endpoints Needed:**

1. **Onboarding**
   - `POST /onboarding/survey` - Save survey
   - `GET /onboarding/survey/{user_id}` - Get survey
   - `PUT /onboarding/survey/{user_id}` - Update survey

2. **Progress Tracking**
   - `GET /progress` - Get user's overall progress
   - `GET /progress/{user_id}/{module_id}` - Get module progress
   - `POST /progress` - Record completion
   - `PUT /progress/{user_id}/{module_id}` - Update progress

3. **Memory Summaries**
   - `GET /memory/summaries` - List summaries with filters
   - `GET /memory/summaries/{id}` - Get specific summary

4. **Conversations (Student View)**
   - `GET /conversations?user_id={id}` - Student's conversations
   - `GET /conversations/{id}` - View specific conversation

5. **Certificates**
   - `GET /certificates/{user_id}/{module_id}` - Generate certificate
   - `GET /certificates/{user_id}` - List all certificates

---

## Data Flow Summary

### **Admin → Backend → Student**

```
Admin Creates Content
      ↓
┌─────────────────────────┐
│ 1. Configure Module     │
│    - System prompt      │
│    - Module prompt      │
│    - Learning objectives│
└─────────────────────────┘
      ↓
┌─────────────────────────┐
│ 2. Add Course Corpus    │
│    - Theories           │
│    - Definitions        │
│    - Historical context │
└─────────────────────────┘
      ↓
┌─────────────────────────┐
│ 3. Add Module Content   │
│    - Case studies       │
│    - Exercises          │
│    - Examples           │
└─────────────────────────┘
      ↓
┌─────────────────────────┐
│ 4. Upload Documents     │
│    - PDFs               │
│    - Readings           │
│    - External links     │
└─────────────────────────┘
      ↓
[Content stored in database]
      ↓
Student Accesses Content
      ↓
┌─────────────────────────┐
│ 5. Student Chats        │
│    - Sends message      │
│    - Backend assembles  │
│      4-layer context    │
│    - GPT-4 generates    │
│      Socratic response  │
└─────────────────────────┘
      ↓
┌─────────────────────────┐
│ 6. Learning Tracked     │
│    - Conversation saved │
│    - Memory summary     │
│      generated          │
│    - Progress updated   │
└─────────────────────────┘
      ↓
Admin Monitors & Iterates
      ↓
┌─────────────────────────┐
│ 7. Analytics Review     │
│    - View conversations │
│    - Check summaries    │
│    - Identify issues    │
└─────────────────────────┘
      ↓
[Update module content]
      ↓
[Loop continues...]
```

---

## Next Steps for Full Implementation

### **Priority 1: Core Student Experience**
1. Implement onboarding survey endpoints
2. Create progress tracking endpoints
3. Build chat interface with enhanced memory
4. Add learning summary views

### **Priority 2: Admin Management**
1. Create corpus management endpoints (course + module)
2. Build module configuration UI
3. Add document upload functionality
4. Implement basic analytics dashboard

### **Priority 3: Enhanced Features**
1. Real-time conversation monitoring
2. Advanced analytics and insights
3. Certificate generation
4. Student/admin messaging system

### **Priority 4: Polish & Scale**
1. A/B testing for prompts
2. Version control for modules
3. Multi-language support
4. Mobile app API endpoints
