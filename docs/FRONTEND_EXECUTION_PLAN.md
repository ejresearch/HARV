# HARV v2.0 Frontend Execution Plan

**Version**: 2.0 Memory-First Architecture
**Date**: 2025-11-13
**Approach**: MVP-First (Memory Inspector) → Phased Rollout
**Timeline**: 2 weeks MVP, then 4 weeks for full redesign

---

## 🎯 EXECUTION STRATEGY

### Recommended Approach: **MVP-First with Phased Rollout**

**Why this approach:**
1. ✅ Get value immediately (2 weeks vs 6-8 weeks)
2. ✅ Validate UX with users before building everything
3. ✅ De-risk - prove concept works before full investment
4. ✅ Can always expand based on feedback

**Phases:**
- **Phase 1** (Week 1-2): MVP Memory Inspector - **HIGH VALUE** 🔥
- **Phase 2** (Week 3-4): Class Hierarchy View - **FOUNDATION**
- **Phase 3** (Week 5-6): Learning Journeys + Polish - **DELIGHT**

---

## 📋 PHASE 1: MVP MEMORY INSPECTOR (Weeks 1-2)

### Goal
Make the v2.0 backend **visible** - show instructors exactly what the AI sees.

### Deliverables
✅ Live Memory Inspector calling real `/memory/enhanced/` endpoint
✅ All 5 layers displayed with collapsible sections
✅ Context metrics visualization
✅ Real-time memory assembly
✅ Copy/download assembled prompt
✅ Color-coded layers with PHASE badges

### Success Criteria
- [ ] Instructor can select Class → Module → Student → Conversation
- [ ] All 5 layers render correctly with real backend data
- [ ] Context metrics show accurate char counts and optimization score
- [ ] Assembled prompt is copyable and matches backend exactly
- [ ] Page loads in < 2 seconds
- [ ] Works on desktop, tablet, mobile

---

## 🛠️ PHASE 1: TECHNICAL TASKS

### Week 1: Core Infrastructure (Days 1-5)

#### Day 1: Setup & Architecture
**Tasks:**
- [ ] Create new `frontend/js/memory_inspector_v2.js` file
- [ ] Set up development environment
- [ ] Design component architecture
- [ ] Create CSS variables for layer colors
- [ ] Set up API client functions

**Files to Create:**
```
frontend/js/memory_inspector_v2.js  (new)
frontend/css/memory_inspector.css   (new)
```

**Deliverable:** Architecture diagram and boilerplate code

---

#### Day 2-3: API Integration
**Tasks:**
- [ ] Create `fetchEnhancedMemory(moduleId, userId, conversationId)` function
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Parse memory layers from response
- [ ] Create data models for layers

**Code Snippet:**
```javascript
async function fetchEnhancedMemory(moduleId, userId, conversationId) {
    const url = `${API_BASE}/memory/enhanced/${moduleId}?user_id=${userId}${conversationId ? `&conversation_id=${conversationId}` : ''}`;

    try {
        const response = await fetch(url, {
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to fetch memory');

        const data = await response.json();

        return {
            assembledPrompt: data.assembled_prompt,
            contextMetrics: data.context_metrics,
            layers: data.memory_layers,
            databaseStatus: data.database_status
        };
    } catch (error) {
        console.error('Memory fetch error:', error);
        throw error;
    }
}
```

**Deliverable:** Working API integration with error handling

---

#### Day 4-5: UI Components
**Tasks:**
- [ ] Build dropdown selectors (Class, Module, Student, Conversation)
- [ ] Create layer card component
- [ ] Build context metrics bar
- [ ] Add loading spinners
- [ ] Style with Tailwind CSS

**Component Structure:**
```javascript
class MemoryLayerCard {
    constructor(layerNumber, title, charCount, status, content) {
        this.layerNumber = layerNumber;
        this.title = title;
        this.charCount = charCount;
        this.status = status; // 'loaded' | 'warning' | 'missing' | 'loading'
        this.content = content;
        this.isExpanded = false;
    }

    render() {
        const colorClass = this.getColorClass();
        const statusIcon = this.getStatusIcon();

        return `
            <div class="memory-layer-card ${colorClass} ${this.isExpanded ? 'expanded' : ''}">
                <div class="layer-header" onclick="toggleLayer(${this.layerNumber})">
                    <div class="layer-title">
                        ${this.getLayerIcon()} Layer ${this.layerNumber}: ${this.title}
                        ${this.getPhasebadge()}
                    </div>
                    <div class="layer-meta">
                        ${statusIcon} ${this.charCount} chars
                    </div>
                </div>
                <div class="layer-content ${this.isExpanded ? 'visible' : 'hidden'}">
                    ${this.renderContent()}
                </div>
            </div>
        `;
    }

    getColorClass() {
        const colors = {
            1: 'layer-blue',    // System
            2: 'layer-green',   // Module
            3: 'layer-yellow',  // Conversation
            4: 'layer-purple',  // Prior Knowledge
            5: 'layer-orange'   // Documents
        };
        return colors[this.layerNumber];
    }

    getLayerIcon() {
        const icons = {
            1: '🔵',
            2: '🟢',
            3: '🟡',
            4: '🟣',
            5: '🟠'
        };
        return icons[this.layerNumber];
    }

    getPhaseBadge() {
        if (this.layerNumber === 2) return '<span class="phase-badge">⭐ PHASE 1 & 2</span>';
        if (this.layerNumber === 3) return '<span class="phase-badge">⭐ PHASE 5</span>';
        if (this.layerNumber === 4) return '<span class="phase-badge">⭐ PHASE 3</span>';
        if (this.layerNumber === 5) return '<span class="phase-badge">⭐ PHASE 4</span>';
        return '';
    }

    renderContent() {
        // Layer-specific rendering logic
        switch(this.layerNumber) {
            case 1: return this.renderSystemData();
            case 2: return this.renderModuleData();
            case 3: return this.renderConversationData();
            case 4: return this.renderPriorKnowledge();
            case 5: return this.renderDocuments();
        }
    }
}
```

**Deliverable:** Reusable UI components library

---

### Week 2: Integration & Polish (Days 6-10)

#### Day 6-7: Layer Rendering
**Tasks:**
- [ ] Implement Layer 1 (System Data) renderer
- [ ] Implement Layer 2 (Module Data) renderer with class inheritance
- [ ] Implement Layer 3 (Conversation) renderer with summarization
- [ ] Implement Layer 4 (Prior Knowledge) renderer
- [ ] Implement Layer 5 (Documents) renderer

**Layer 2 Renderer Example:**
```javascript
renderModuleData() {
    const data = this.content;

    return `
        <div class="layer-section">
            <h4>📚 CLASS CONTEXT ${data.class_context ? '⭐' : ''}</h4>
            ${data.class_context ? `
                <div class="class-context-box">
                    <p><strong>Class:</strong> ${data.class_context.title}</p>
                    <p><strong>Teaching Philosophy:</strong> ${data.class_context.system_prompt}</p>
                    <div class="inheritance-indicator">
                        ⬇️ CASCADES TO ALL MODULES
                    </div>
                </div>
            ` : '<p class="text-gray-500">No class context available</p>'}
        </div>

        <div class="layer-section">
            <h4>📊 CLASS CORPUS ${data.class_corpus?.length > 0 ? '⭐' : ''}</h4>
            ${data.class_corpus?.length > 0 ? `
                <ul class="corpus-list">
                    ${data.class_corpus.map(entry => `
                        <li>
                            <span class="corpus-type">[${entry.type.toUpperCase()}]</span>
                            <strong>${entry.title}:</strong> ${entry.content}
                        </li>
                    `).join('')}
                </ul>
                <div class="inheritance-indicator">
                    ⬇️ SHARED ACROSS ALL MODULES
                </div>
            ` : '<p class="text-gray-500">No class corpus entries</p>'}
        </div>

        <div class="layer-section">
            <h4>📖 MODULE CONTEXT</h4>
            <p><strong>Module:</strong> ${data.module_info.title}</p>
            <p><strong>Description:</strong> ${data.module_info.description}</p>
        </div>
    `;
}
```

**Deliverable:** All 5 layers render correctly with real data

---

#### Day 8: Context Metrics & Final Prompt
**Tasks:**
- [ ] Build context metrics visualization
- [ ] Create progress bar for char count
- [ ] Add optimization score display
- [ ] Render final assembled prompt in code block
- [ ] Add copy to clipboard functionality
- [ ] Add download as .txt functionality

**Metrics Component:**
```javascript
function renderContextMetrics(metrics) {
    const { total_chars, optimization_score, system_weight, module_weight } = metrics;
    const percentage = (total_chars / 5000) * 100;
    const status = total_chars >= 2000 && total_chars <= 5000 ? 'optimal' : 'warning';

    return `
        <div class="context-metrics">
            <h3>📊 CONTEXT METRICS</h3>

            <div class="metrics-bar">
                <div class="bar-label">Total Size:</div>
                <div class="bar-container">
                    <div class="bar-fill ${status}" style="width: ${percentage}%"></div>
                    <div class="bar-markers">
                        <span class="marker min">2K</span>
                        <span class="marker current">${total_chars} chars</span>
                        <span class="marker max">5K</span>
                    </div>
                </div>
                <div class="bar-status ${status}">
                    ${status === 'optimal' ? '✅' : '⚠️'} ${optimization_score.toFixed(1)}% optimal
                </div>
            </div>

            <div class="metrics-breakdown">
                <div class="metric">
                    <span>System Weight:</span>
                    <strong>${system_weight}%</strong>
                </div>
                <div class="metric">
                    <span>Module Weight:</span>
                    <strong>${module_weight}%</strong>
                </div>
            </div>
        </div>
    `;
}
```

**Deliverable:** Context metrics fully functional with visual feedback

---

#### Day 9: Testing & Bug Fixes
**Tasks:**
- [ ] Test with different class/module combinations
- [ ] Test with students who have 0, 1, 3+ completed modules
- [ ] Test with conversations of varying lengths (0, 15, 50+ messages)
- [ ] Test with/without documents
- [ ] Fix any rendering bugs
- [ ] Fix any API integration issues
- [ ] Test responsive design (desktop, tablet, mobile)

**Test Scenarios:**
```
Scenario 1: New Student
- User: New student (no onboarding)
- Module: Any
- Expected: Layer 1 minimal, Layer 4 empty

Scenario 2: Returning Student, Short Conversation
- User: Student with 1 completed module
- Conversation: 10 messages
- Expected: Layer 3 shows full messages, no summary

Scenario 3: Returning Student, Long Conversation
- User: Student with 1 completed module
- Conversation: 30 messages
- Expected: Layer 3 shows last 10 full + summary of older 20

Scenario 4: Advanced Student
- User: Student with 3+ completed modules
- Expected: Layer 4 rich with insights from multiple modules

Scenario 5: No Documents
- Class: No uploaded documents
- Expected: Layer 5 shows empty state message

Scenario 6: Rich Documents
- Class: Syllabus + 2 study guides
- Expected: Layer 5 shows all 3 with chunked previews
```

**Deliverable:** Fully tested Memory Inspector with no major bugs

---

#### Day 10: Polish & Documentation
**Tasks:**
- [ ] Add loading states for slow API calls
- [ ] Add empty states for missing data
- [ ] Add tooltips for helper text
- [ ] Write inline code comments
- [ ] Create user documentation
- [ ] Record demo video (optional)
- [ ] Deploy to production

**Empty State Example:**
```javascript
function renderEmptyState(layerNumber, layerName) {
    const messages = {
        1: 'Select a student to view their profile and learning history.',
        2: 'Select a class and module to view configuration.',
        3: 'Select a conversation to view dialogue history.',
        4: 'This student hasn\'t completed any other modules yet.',
        5: 'No documents uploaded for this class/module.'
    };

    return `
        <div class="empty-state">
            <div class="empty-icon">${getLayerIcon(layerNumber)}</div>
            <p class="empty-message">${messages[layerNumber]}</p>
            ${layerNumber === 5 ? '<button class="btn-primary" onclick="uploadDocument()">Upload Document</button>' : ''}
        </div>
    `;
}
```

**Deliverable:** Production-ready Memory Inspector v2.0

---

## 🎨 CSS STYLING

### Color System
```css
/* Layer Colors */
:root {
    --layer-blue: #3B82F6;      /* Layer 1: System */
    --layer-green: #10B981;     /* Layer 2: Module */
    --layer-yellow: #F59E0B;    /* Layer 3: Conversation */
    --layer-purple: #8B5CF6;    /* Layer 4: Prior Knowledge */
    --layer-orange: #F97316;    /* Layer 5: Documents */

    --status-optimal: #10B981;  /* Green */
    --status-warning: #F59E0B;  /* Yellow */
    --status-error: #EF4444;    /* Red */
}

/* Layer Card */
.memory-layer-card {
    border-left: 4px solid var(--layer-color);
    background: white;
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
}

.memory-layer-card:hover {
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.layer-blue { --layer-color: var(--layer-blue); }
.layer-green { --layer-color: var(--layer-green); }
.layer-yellow { --layer-color: var(--layer-yellow); }
.layer-purple { --layer-color: var(--layer-purple); }
.layer-orange { --layer-color: var(--layer-orange); }

/* Layer Header */
.layer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    cursor: pointer;
    user-select: none;
}

.layer-title {
    font-size: 18px;
    font-weight: 600;
    color: #1F2937;
    display: flex;
    align-items: center;
    gap: 8px;
}

.layer-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: #6B7280;
}

/* Layer Content */
.layer-content {
    padding: 0 16px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
}

.layer-content.visible {
    max-height: 2000px;
    padding: 16px;
    border-top: 1px solid #E5E7EB;
}

/* Phase Badge */
.phase-badge {
    display: inline-block;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
}

/* Context Metrics */
.metrics-bar {
    margin: 16px 0;
}

.bar-container {
    position: relative;
    width: 100%;
    height: 32px;
    background: #E5E7EB;
    border-radius: 16px;
    overflow: hidden;
}

.bar-fill {
    height: 100%;
    transition: width 0.5s ease;
    border-radius: 16px;
}

.bar-fill.optimal {
    background: linear-gradient(90deg, #10B981, #34D399);
}

.bar-fill.warning {
    background: linear-gradient(90deg, #F59E0B, #FBBF24);
}

.bar-markers {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
    pointer-events: none;
}

.marker {
    font-size: 12px;
    font-weight: 600;
    color: #374151;
}

/* Inheritance Indicators */
.inheritance-indicator {
    margin-top: 8px;
    padding: 8px 12px;
    background: #F3F4F6;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    color: #6B7280;
    text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
    .layer-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .metrics-breakdown {
        flex-direction: column;
    }
}
```

---

## 📊 PHASE 1 SUCCESS METRICS

### Quantitative
- [ ] Memory Inspector loads in < 2 seconds
- [ ] API calls succeed 99%+ of the time
- [ ] Zero console errors
- [ ] Works on Chrome, Firefox, Safari, Edge
- [ ] Mobile responsive (works on screens 320px+)

### Qualitative
- [ ] Instructors understand what they're seeing
- [ ] All 5 layers are visually distinct
- [ ] PHASE badges make v2.0 enhancements obvious
- [ ] Users can copy/download prompts easily
- [ ] Empty states are helpful, not confusing

### User Acceptance
- [ ] 3+ instructors test and provide feedback
- [ ] No critical bugs reported
- [ ] Users prefer new inspector over old one
- [ ] Users request features for Phase 2/3 (good sign!)

---

## 📋 PHASE 2: CLASS HIERARCHY VIEW (Weeks 3-4)

### Goal
Visualize class → module inheritance clearly.

### Deliverables
- Tree view showing class/module hierarchy
- Visual inheritance indicators (✅ badges)
- Expandable/collapsible modules
- Real-time preview when editing class
- Memory impact indicators

### Tasks (High-Level)
1. Build tree component
2. Integrate with existing class editor
3. Add split-screen preview
4. Add inheritance badges
5. Test and polish

**Estimated Effort:** 2 weeks (80 hours)

---

## 📋 PHASE 3: LEARNING JOURNEYS + POLISH (Weeks 5-6)

### Goal
Show student cross-module learning progression.

### Deliverables
- Learning journey visualization
- Mastered concepts display
- MemorySummary insights timeline
- Memory Playground (bonus)
- Final polish and bug fixes

### Tasks (High-Level)
1. Build journey flowchart component
2. Integrate with student profiles
3. Display mastered concepts as badges
4. Show learning insights from MemorySummary
5. Build Memory Playground (if time permits)
6. Final QA and deployment

**Estimated Effort:** 2 weeks (80 hours)

---

## 🚀 DEPLOYMENT STRATEGY

### Development Environment
```bash
# Frontend dev server
cd frontend
python3 -m http.server 8080

# Backend dev server
cd backend
uvicorn app.main:app --reload --port 8000
```

### Testing Checklist
- [ ] Unit tests for API functions
- [ ] Integration tests for memory assembly
- [ ] Visual regression tests (screenshots)
- [ ] Cross-browser testing
- [ ] Mobile responsive testing
- [ ] Accessibility testing (WCAG 2.1 AA)

### Production Deployment
1. Merge feature branch to `main`
2. Run full test suite
3. Build production assets (if using build step)
4. Deploy backend first (backward compatible)
5. Deploy frontend second
6. Monitor error logs for 24 hours
7. Collect user feedback

---

## 🛠️ TECH STACK DECISION

### Option A: Vanilla JS (RECOMMENDED FOR MVP)
**Pros:**
- ✅ No build step required
- ✅ Faster to MVP (2 weeks achievable)
- ✅ Consistent with existing codebase
- ✅ Easier to debug

**Cons:**
- ❌ Manual DOM manipulation
- ❌ No component reusability
- ❌ Harder to maintain long-term

**Recommendation:** Use for Phase 1, reassess for Phase 2/3

---

### Option B: React + TypeScript (BETTER LONG-TERM)
**Pros:**
- ✅ Component reusability
- ✅ Better state management
- ✅ TypeScript safety
- ✅ Easier to scale

**Cons:**
- ❌ Requires build step (Vite/Webpack)
- ❌ Adds 1-2 weeks to timeline
- ❌ Learning curve if team isn't familiar

**Recommendation:** Consider for Phase 2+ if MVP succeeds

---

## 📅 TIMELINE SUMMARY

| Phase | Duration | Deliverable | Status |
|-------|----------|-------------|--------|
| Phase 1 | Weeks 1-2 | Memory Inspector MVP | 📋 Ready to start |
| Phase 2 | Weeks 3-4 | Class Hierarchy View | ⏳ Pending Phase 1 |
| Phase 3 | Weeks 5-6 | Learning Journeys | ⏳ Pending Phase 2 |
| **Total** | **6 weeks** | **Full v2.0 Frontend** | 🎯 Goal |

---

## ✅ NEXT STEPS

### Immediate Actions (Today)
1. **Review this plan** - Feedback? Changes?
2. **Choose tech stack** - Vanilla JS or React?
3. **Set up dev environment** - Backend running? Frontend ready?
4. **Create feature branch** - `git checkout -b feature/memory-inspector-v2`
5. **Start Day 1 tasks** - Architecture and setup

### Week 1 Milestones
- **Day 3:** API integration complete and tested
- **Day 5:** UI components built and functional
- **Day 7:** All 5 layers rendering correctly

### Week 2 Milestones
- **Day 9:** Testing complete, bugs fixed
- **Day 10:** Production deployment ✅

---

## 🎯 DEFINITION OF DONE

**Phase 1 is complete when:**
- [ ] All Day 1-10 tasks are checked off
- [ ] All success metrics are met
- [ ] 3+ instructors have tested and approved
- [ ] Code is merged to `main`
- [ ] Deployed to production
- [ ] User documentation written
- [ ] Team is trained on new features

---

## 📞 QUESTIONS FOR DECISION MAKING

**Before we start, let's confirm:**

1. **Approval?** Does this execution plan work for you?
2. **Tech stack?** Vanilla JS (faster) or React (better long-term)?
3. **Timeline?** Is 2 weeks for MVP realistic for your schedule?
4. **Resources?** Will you be coding, or should I generate code for you?
5. **Priority?** Any changes to the Phase 1 scope?

---

**Ready to start Day 1? Let me know and I'll begin! 🚀**

*Execution Plan by: Claude Code*
*Date: 2025-11-13*
*Version: 1.0*
