# Harv Database Schema Documentation

## Overview
SQLite database (`harv.db`) for the Harv AI Socratic tutoring platform focused on Communication Media & Society course.

---

## Current Database State

| Count | Table Name                  | Status  |
|-------|-----------------------------|---------|
| 0     | Users                       | Active  |
| 16    | Modules                     | Active  |
| 0     | Conversations               | Active  |
| 0     | Memory Summaries            | Active  |
| 0     | Documents                   | Active  |
| 0     | User Progress               | Active  |
| 0     | Onboarding Surveys          | Active  |
| 0     | Course Corpus               | Active  |
| 0     | Module Corpus Entries       | Active  |
| 6     | Users (Archived)            | Archive |
| 51    | Conversations (Archived)    | Archive |
| 2     | Memory Summaries (Archived) | Archive |

---

## Table Descriptions

### **Users**
Student accounts with authentication credentials and profile information.

**Fields:**
- `id` (INTEGER, PRIMARY KEY): Unique user identifier
- `email` (VARCHAR, UNIQUE, NOT NULL): User email for login
- `hashed_password` (VARCHAR, NOT NULL): Bcrypt hashed password
- `name` (VARCHAR): User's display name
- `username` (TEXT): Optional username
- `onboarding_data` (TEXT): JSON data from onboarding
- `created_at` (TEXT): Account creation timestamp

**Purpose:** Stores user authentication and basic profile data

**Relationships:**
- One-to-many with Conversations
- One-to-many with Memory Summaries
- One-to-many with User Progress
- One-to-one with Onboarding Surveys
- One-to-many with Documents

---

### **Modules**
Course content modules that structure the learning curriculum.

**Fields:**
- `id` (INTEGER, PRIMARY KEY): Unique module identifier
- `title` (STRING, NOT NULL): Module name
- `description` (TEXT): Module overview
- `resources` (TEXT): Additional learning resources
- `system_prompt` (TEXT): Socratic teaching instructions for AI
- `module_prompt` (TEXT): Specific learning objectives and focus areas
- `system_corpus` (TEXT): Core theoretical knowledge base
- `module_corpus` (TEXT): Module-specific content
- `dynamic_corpus` (TEXT): Runtime-generated context
- `api_endpoint` (STRING): OpenAI API endpoint URL
- `learning_objectives` (TEXT): Structured learning goals

**Purpose:** Contains 16 communication theory modules with Socratic teaching prompts and knowledge bases

**Current Modules:**
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

**Relationships:**
- One-to-many with Conversations
- One-to-many with User Progress
- One-to-many with Module Corpus Entries

---

### **Conversations**
Chat history between users and the AI tutor for each module.

**Fields:**
- `id` (INTEGER, PRIMARY KEY): Unique conversation identifier
- `user_id` (INTEGER, FOREIGN KEY → users.id): Associated user
- `module_id` (INTEGER, FOREIGN KEY → modules.id): Associated module
- `messages_json` (TEXT): Full chat history as JSON array
- `created_at` (DATETIME): Conversation start timestamp
- `updated_at` (DATETIME): Last message timestamp
- `title` (TEXT): Conversation title (default: "New Conversation")
- `current_grade` (TEXT): Current performance grade
- `memory_summary` (TEXT): Extracted learning summary
- `finalized` (BOOLEAN): Whether conversation is completed
- `message` (TEXT): Additional message field

**Purpose:** Stores full dialogue history, grades, and conversation state

**Relationships:**
- Many-to-one with Users
- Many-to-one with Modules
- One-to-many with Memory Summaries

---

### **Memory Summaries**
Learning progress summaries extracted from conversations.

**Fields:**
- `id` (INTEGER, PRIMARY KEY): Unique summary identifier
- `user_id` (INTEGER, FOREIGN KEY → users.id): Associated user
- `module_id` (INTEGER, FOREIGN KEY → modules.id): Associated module
- `conversation_id` (INTEGER, FOREIGN KEY → conversations.id): Source conversation
- `what_learned` (TEXT): Content knowledge acquired
- `how_learned` (TEXT): Learning process and methodology
- `key_concepts` (TEXT): Core concepts mastered
- `learning_insights` (TEXT): Deeper understanding achieved
- `teaching_effectiveness` (TEXT): Assessment of tutoring quality
- `understanding_level` (TEXT): Student comprehension level
- `created_at` (DATETIME): Summary creation timestamp
- `updated_at` (DATETIME): Last update timestamp

**Purpose:** Captures what students learned, how they learned it, and their comprehension level for the enhanced memory system

**Relationships:**
- Many-to-one with Users
- Many-to-one with Modules
- Many-to-one with Conversations

---

### **Documents**
User-uploaded or module-specific educational materials.

**Fields:**
- `id` (INTEGER, PRIMARY KEY): Unique document identifier
- `user_id` (INTEGER, FOREIGN KEY → users.id): User who uploaded (nullable)
- `module_id` (INTEGER, FOREIGN KEY → modules.id): Associated module
- `filename` (STRING): Original filename
- `content` (TEXT): Document content or file path
- `uploaded_at` (DATETIME): Upload timestamp

**Purpose:** Stores PDFs, reading materials, or reference documents

**Relationships:**
- Many-to-one with Users
- Many-to-one with Modules

---

### **User Progress**
Tracking of student advancement through modules.

**Fields:**
- `id` (INTEGER, PRIMARY KEY): Unique progress record identifier
- `user_id` (INTEGER, FOREIGN KEY → users.id): Associated user
- `module_id` (INTEGER, FOREIGN KEY → modules.id): Associated module
- `completed` (BOOLEAN): Whether module is completed
- `grade` (STRING): Final grade for module
- `completion_date` (DATETIME): When module was completed
- `time_spent` (INTEGER): Total minutes spent in module
- `attempts` (INTEGER): Number of attempts at module
- `created_at` (DATETIME): Record creation timestamp
- `updated_at` (DATETIME): Last update timestamp

**Purpose:** Records completion status, grades, time spent, and attempt counts per module

**Relationships:**
- Many-to-one with Users
- Many-to-one with Modules

---

### **Onboarding Surveys**
Student learning preferences and background collected during signup.

**Fields:**
- `id` (INTEGER, PRIMARY KEY): Unique survey identifier
- `user_id` (INTEGER, FOREIGN KEY → users.id): Associated user
- `reason` (TEXT): Why student is taking the course
- `familiarity` (STRING): Prior knowledge level
- `learning_style` (STRING): Preferred learning method
- `goals` (TEXT): Student's learning objectives
- `background` (TEXT): Educational/professional background
- `created_at` (DATETIME): Survey completion timestamp

**Purpose:** Captures why students are taking the course, prior knowledge, preferred learning methods, and goals to personalize the Socratic tutoring approach

**Relationships:**
- One-to-one with Users

---

### **Course Corpus**
System-wide knowledge base shared across all modules.

**Fields:**
- `id` (INTEGER, PRIMARY KEY): Unique corpus entry identifier
- `title` (STRING, NOT NULL): Content title
- `content` (TEXT, NOT NULL): Full text content
- `type` (STRING, NOT NULL): Content type (e.g., "theory", "definition", "example")
- `order_index` (INTEGER): Display/retrieval order
- `created_at` (DATETIME): Creation timestamp
- `updated_at` (DATETIME): Last update timestamp

**Purpose:** Global communication theory concepts, definitions, and frameworks available across all modules

**Relationships:** None (standalone knowledge base)

---

### **Module Corpus Entries**
Module-specific knowledge and reference materials.

**Fields:**
- `id` (INTEGER, PRIMARY KEY): Unique entry identifier
- `module_id` (INTEGER, FOREIGN KEY → modules.id): Associated module
- `title` (STRING, NOT NULL): Content title
- `content` (TEXT, NOT NULL): Full text content
- `type` (STRING, NOT NULL): Content type (e.g., "case_study", "example", "theory")
- `order_index` (INTEGER): Display/retrieval order
- `created_at` (DATETIME): Creation timestamp
- `updated_at` (DATETIME): Last update timestamp

**Purpose:** Detailed content, examples, and case studies specific to each module topic

**Relationships:**
- Many-to-one with Modules

---

## Archive Tables

### **users_archive**
Archived user accounts with timestamp.

**Additional Field:**
- `archived_at` (DATETIME): When user was archived

### **conversations_archive**
Archived conversation history with timestamp.

**Additional Field:**
- `archived_at` (DATETIME): When conversation was archived

### **memory_summaries_archive**
Archived learning summaries with timestamp.

**Additional Field:**
- `archived_at` (DATETIME): When summary was archived

---

## Enhanced Memory System

The database supports a **4-layer dynamic memory system**:

1. **System Data Layer**: Cross-course learning profile from `onboarding_surveys` and `users`
2. **Module Data Layer**: Subject-specific context from `modules` (system_prompt, module_prompt, system_corpus)
3. **Conversation Data Layer**: Current dialogue state from `conversations` (messages_json, memory_summary)
4. **Prior Knowledge Layer**: Cross-module insights from `memory_summaries` and `user_progress`

These layers are dynamically assembled by `app/memory_context_enhanced.py::DynamicMemoryAssembler` to create optimized context for GPT-4 Socratic tutoring.

---

## Best-Case Data Population Guide

### **Optimal Data Flow for Maximum Learning Effectiveness**

#### **Phase 1: User Registration & Onboarding**
```
1. User registers via /auth/register
   → Creates entry in `users` table

2. User completes onboarding survey
   → Creates entry in `onboarding_surveys`

Example:
{
  "reason": "Required for my communication studies degree",
  "familiarity": "beginner",
  "learning_style": "visual_and_interactive",
  "goals": "Understand media theory and apply it to modern social media",
  "background": "Psychology major with interest in digital communication"
}
```

#### **Phase 2: Course Corpus Setup (Admin/Instructor)**
```
Populate global knowledge base in `course_corpus`:

INSERT INTO course_corpus (title, content, type, order_index) VALUES
(
  'Shannon-Weaver Model',
  'The Shannon-Weaver model (1948) describes communication as: Information Source → Transmitter → Channel → Receiver → Destination. Key concept: Noise interferes at any stage.',
  'theory',
  1
),
(
  'Cultivation Theory',
  'Developed by George Gerbner. States that long-term exposure to media content shapes viewers perceptions of reality. Heavy TV viewers develop a worldview consistent with TV portrayals.',
  'theory',
  2
);

Best practices:
- Add 20-30 foundational theories/concepts
- Use type: "theory", "definition", "historical_context"
- Order by conceptual progression
```

#### **Phase 3: Module Corpus Enrichment**
```
Add module-specific examples and case studies to `module_corpus_entries`:

For Module 3 (Media Theory and Effects):
INSERT INTO module_corpus_entries (module_id, title, content, type, order_index) VALUES
(
  3,
  'Agenda-Setting Case Study: 2016 Election',
  'Media coverage frequency analysis showing how news outlets set public agenda through story selection and prominence. CNN focused 40% coverage on email scandal, Fox News 35% on immigration...',
  'case_study',
  1
),
(
  3,
  'Cultivation Theory Exercise: Crime Perception',
  'Compare crime statistics vs. TV crime portrayal. Ask students: How might heavy TV viewing affect fear of crime? What does data show about actual crime rates vs. perceived rates?',
  'exercise',
  2
);

Best practices:
- 5-10 entries per module
- Mix types: "case_study", "example", "exercise", "reading"
- Keep content detailed (500-1000 words)
- Link to current events when possible
```

#### **Phase 4: Learning Journey (Student Interaction)**
```
1. Student starts module conversation
   → POST /chat/enhanced
   → Creates entry in `conversations` with messages_json

2. Conversation progresses (10-20 exchanges)
   → Updates `conversations.messages_json`
   → AI uses Socratic method drawing from:
     - Module system_prompt + module_prompt
     - Module system_corpus
     - Module corpus entries
     - Course corpus
     - User onboarding data

3. After significant learning milestone (every 5-7 exchanges):
   → System generates entry in `memory_summaries`

Example memory_summary:
{
  "what_learned": "Understood difference between agenda-setting and framing. Agenda-setting = what to think about, framing = how to think about it.",
  "how_learned": "Through guided discovery comparing news coverage of same event across outlets. Identified patterns independently.",
  "key_concepts": "agenda-setting, framing, media bias, gatekeeping",
  "understanding_level": "intermediate",
  "learning_insights": "Student made connection to personal social media experience - recognized algorithmic curation as modern agenda-setting",
  "teaching_effectiveness": "high - student engaged with Socratic questions, minimal direct answers needed"
}

4. Module completion triggers:
   → Entry in `user_progress` with grade, time_spent
   → Conversation marked finalized=TRUE
```

#### **Phase 5: Cross-Module Learning (Enhanced Memory System)**
```
As student progresses through modules, the system builds context:

When student starts Module 7 (Social Media):
- System pulls memory_summaries from Modules 1, 2, 3, 6
- Identifies related concepts: "agenda-setting" → "algorithmic curation"
- Adapts teaching: "You previously explored agenda-setting in traditional media. How might algorithms serve a similar function in social platforms?"

This creates continuity and personalized learning paths.
```

### **Sample Complete User Journey**

```
Day 1: Registration
├─ users: sarah@university.edu
├─ onboarding_surveys: "Visual learner, beginner level, wants to understand social media influence"
└─ user_progress: 0 modules started

Day 2-3: Module 1 (Communication Theory)
├─ conversations: 15-message dialogue about Shannon-Weaver model
├─ memory_summaries: "Understands linear vs transactional models"
├─ user_progress: Module 1 completed, Grade: B+, 45 minutes
└─ Enhanced memory: Stores that Sarah prefers concrete examples over abstract theory

Day 4-6: Module 3 (Media Theory)
├─ conversations: 22-message dialogue, references previous learning
├─ System retrieves: Sarah's preference for examples + prior knowledge of communication models
├─ AI adapts: Uses Instagram algorithm as example to teach agenda-setting
├─ memory_summaries: "Connected cultivation theory to social media echo chambers"
└─ user_progress: Module 3 completed, Grade: A-, 67 minutes

Day 7-10: Module 7 (Social Media)
├─ conversations: Deep dive, system references all prior learning
├─ System assembles context from: Modules 1, 3 memory + onboarding + progress patterns
├─ AI creates personalized path: "Given your interest in algorithms from Module 3..."
└─ Result: Highly contextualized, continuous learning experience
```

### **Data Quality Best Practices**

#### **For Course Corpus:**
- ✅ Cite sources and dates for theories
- ✅ Include seminal works and modern applications
- ✅ Keep entries 200-500 words
- ❌ Don't duplicate content across course_corpus and module_corpus_entries

#### **For Module Corpus Entries:**
- ✅ Use real case studies with data
- ✅ Include discussion questions for Socratic method
- ✅ Link to external readings/videos (store URLs in resources field)
- ❌ Don't provide direct answers - frame as guided discovery

#### **For Memory Summaries:**
- ✅ Generated automatically after every 5-7 exchanges
- ✅ Focus on understanding depth, not just facts memorized
- ✅ Track learning *process* (how they figured it out)
- ❌ Don't just list topics discussed

#### **For Conversations:**
- ✅ Store full message history with timestamps
- ✅ Include both user and AI messages
- ✅ Tag with current_grade as conversation progresses
- ✅ Generate descriptive titles based on topics covered

---

## Database Location
`/Users/elle_jansick/Harv_2/backend/harv.db`

## ORM Models
Defined in: `app/models.py`

## Database Configuration
Defined in: `app/database.py`
