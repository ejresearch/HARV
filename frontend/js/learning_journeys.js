// ============================================================================
// HARV v2.0 - Learning Journeys Dashboard
// ============================================================================

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const JourneysState = {
    students: [],
    selectedStudent: null,
    modules: [],
    classes: [],
    progress: [],
    conversations: [],
    memorySummaries: [],
    currentFilter: 'all'
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

async function fetchStudents() {
    try {
        const response = await fetch(`${API_BASE}/users`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        const users = data.users || data || [];
        return users.filter(u => !u.is_admin && u.role === 'student');
    } catch (error) {
        console.error('[API] Error fetching students:', error);
        return [];
    }
}

async function fetchModules() {
    try {
        const response = await fetch(`${API_BASE}/modules`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        return data.modules || data || [];
    } catch (error) {
        console.error('[API] Error fetching modules:', error);
        return [];
    }
}

async function fetchClasses() {
    try {
        const response = await fetch(`${API_BASE}/classes`, {
            headers: getAuthHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('[API] Error fetching classes:', error);
        return [];
    }
}

async function fetchProgress(userId) {
    try {
        const response = await fetch(`${API_BASE}/progress?user_id=${userId}`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        return data.progress || data || [];
    } catch (error) {
        console.error('[API] Error fetching progress:', error);
        return [];
    }
}

async function fetchConversations(userId) {
    try {
        const response = await fetch(`${API_BASE}/conversations?user_id=${userId}`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        return data.conversations || data || [];
    } catch (error) {
        console.error('[API] Error fetching conversations:', error);
        return [];
    }
}

async function fetchMemorySummaries(userId) {
    try {
        const response = await fetch(`${API_BASE}/memory-summaries?user_id=${userId}`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        return data.summaries || data || [];
    } catch (error) {
        console.error('[API] Error fetching memory summaries:', error);
        return [];
    }
}

// ============================================================================
// RENDERING FUNCTIONS
// ============================================================================

function renderStudentOverview(student) {
    const progress = JourneysState.progress;
    const conversations = JourneysState.conversations;
    const summaries = JourneysState.memorySummaries;

    // Calculate stats
    const totalModules = JourneysState.modules.length;
    const completedModules = progress.filter(p => p.status === 'completed').length;
    const hoursSpent = Math.floor(Math.random() * 50) + 10; // Mock data

    // Update student info
    document.getElementById('student-name').textContent = student.name;
    document.getElementById('student-email').textContent = student.email;
    document.getElementById('student-level').textContent = student.familiarity || 'Beginner';
    document.getElementById('student-style').textContent = student.learning_style || 'Visual Learner';

    // Update stats
    document.getElementById('total-modules-enrolled').textContent = totalModules;
    document.getElementById('modules-completed').textContent = completedModules;
    document.getElementById('hours-spent').textContent = `${hoursSpent}h`;

    // Calculate overall progress
    const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
    document.getElementById('overall-progress').textContent = `${overallProgress}%`;
    document.getElementById('overall-progress-bar').style.width = `${overallProgress}%`;

    // Calculate average score (mock)
    const avgScore = Math.floor(Math.random() * 30) + 70;
    document.getElementById('average-score').textContent = `${avgScore}%`;
    document.getElementById('score-trend').textContent = avgScore > 80 ? '↑ Above average' : '→ On track';

    // Calculate streak (mock)
    const currentStreak = Math.floor(Math.random() * 15) + 1;
    const longestStreak = Math.max(currentStreak, Math.floor(Math.random() * 30) + 5);
    document.getElementById('current-streak').textContent = `${currentStreak} days`;
    document.getElementById('longest-streak').textContent = `Longest: ${longestStreak} days`;

    // Memory insights count
    document.getElementById('insights-count').textContent = summaries.length;
}

function renderTimeline() {
    const container = document.getElementById('timeline-container');
    const filter = JourneysState.currentFilter;

    // Get all modules with progress info
    const moduleProgress = JourneysState.modules.map(module => {
        const progress = JourneysState.progress.find(p => p.module_id === module.id);
        const classData = JourneysState.classes.find(c => c.id === module.class_id);

        return {
            module,
            classData,
            progress: progress ? progress.progress_percentage : 0,
            status: progress?.status || 'not-started',
            completedAt: progress?.completed_at,
            conversations: JourneysState.conversations.filter(c => c.module_id === module.id).length
        };
    });

    // Filter by status
    const filtered = filter === 'all'
        ? moduleProgress
        : moduleProgress.filter(mp => mp.status === filter);

    // Sort: in-progress first, then completed, then not-started
    filtered.sort((a, b) => {
        const order = { 'in-progress': 0, 'completed': 1, 'not-started': 2 };
        return (order[a.status] || 2) - (order[b.status] || 2);
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #6B7280;">
                No modules match this filter
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(item => renderTimelineItem(item)).join('');
}

function renderTimelineItem({ module, classData, progress, status, completedAt, conversations }) {
    const statusColors = {
        'completed': 'completed',
        'in-progress': 'in-progress',
        'not-started': 'not-started'
    };

    const statusIcons = {
        'completed': '✓',
        'in-progress': '⟳',
        'not-started': '○'
    };

    const badgeClass = {
        'completed': 'badge-completed',
        'in-progress': 'badge-in-progress',
        'not-started': 'badge-not-started'
    };

    const badgeText = {
        'completed': 'Completed',
        'in-progress': 'In Progress',
        'not-started': 'Not Started'
    };

    const score = status === 'completed' ? Math.floor(Math.random() * 20) + 80 : status === 'in-progress' ? Math.floor(Math.random() * 50) + 30 : 0;

    return `
        <div class="timeline-item" data-module-id="${module.id}">
            <div class="timeline-marker ${statusColors[status]}">
                ${statusIcons[status]}
            </div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <div>
                        <div class="timeline-title">${escapeHtml(module.title)}</div>
                        <div class="timeline-class">${classData ? escapeHtml(classData.title) : 'Unknown Class'}</div>
                    </div>
                    <div class="timeline-badge ${badgeClass[status]}">
                        ${badgeText[status]}
                    </div>
                </div>

                <div class="timeline-stats">
                    <div class="timeline-stat">
                        <div class="timeline-stat-value">${progress}%</div>
                        <div class="timeline-stat-label">Progress</div>
                    </div>
                    <div class="timeline-stat">
                        <div class="timeline-stat-value">${score}%</div>
                        <div class="timeline-stat-label">Score</div>
                    </div>
                    <div class="timeline-stat">
                        <div class="timeline-stat-value">${conversations}</div>
                        <div class="timeline-stat-label">Sessions</div>
                    </div>
                </div>

                <div class="timeline-progress">
                    <div class="timeline-progress-fill" style="width: ${progress}%"></div>
                </div>

                <div class="timeline-actions">
                    <button class="timeline-btn btn-view-memory" onclick="viewModuleMemory(${classData?.id || 0}, ${module.id})">
                        🧠 View Memory
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderInsights() {
    const container = document.getElementById('insights-container');
    const summaries = JourneysState.memorySummaries;

    if (summaries.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #6B7280;">
                <p>No learning insights yet</p>
                <small>Insights will appear as the student completes modules</small>
            </div>
        `;
        return;
    }

    // Generate mock insights
    const insights = [
        {
            title: '💡 Strong Performance',
            text: `${JourneysState.selectedStudent.name} shows excellent understanding across cognitive psychology concepts.`
        },
        {
            title: '📚 Learning Pattern',
            text: 'Consistent engagement with visual learning materials. Performs best with diagram-based explanations.'
        },
        {
            title: '🎯 Recommendation',
            text: 'Ready for advanced modules in social psychology. Consider introducing group discussion activities.'
        }
    ];

    container.innerHTML = insights.map(insight => `
        <div class="insight-item">
            <div class="insight-title">${insight.title}</div>
            <div class="insight-text">${insight.text}</div>
        </div>
    `).join('');
}

function renderActivity() {
    const container = document.getElementById('activity-container');
    const conversations = JourneysState.conversations;

    if (conversations.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #6B7280;">
                No recent activity
            </div>
        `;
        return;
    }

    // Generate mock recent activity
    const activities = [
        { icon: '💬', title: 'Completed conversation session', time: '2 hours ago' },
        { icon: '📝', title: 'Submitted module quiz', time: '1 day ago' },
        { icon: '🎯', title: 'Achieved 90% on assessment', time: '2 days ago' },
        { icon: '🔥', title: 'Maintained 7-day streak', time: '3 days ago' },
        { icon: '📊', title: 'Memory summary generated', time: '4 days ago' }
    ];

    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

// ============================================================================
// INTERACTION HANDLERS
// ============================================================================

async function onStudentChange(event) {
    const studentId = parseInt(event.target.value);
    if (!studentId) {
        document.getElementById('dashboard-content').style.display = 'none';
        document.getElementById('empty-state').style.display = 'block';
        return;
    }

    const student = JourneysState.students.find(s => s.id === studentId);
    if (!student) return;

    JourneysState.selectedStudent = student;

    // Show loading
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('loading-state').style.display = 'block';
    document.getElementById('dashboard-content').style.display = 'none';

    try {
        // Fetch student data
        const [progress, conversations, summaries] = await Promise.all([
            fetchProgress(studentId),
            fetchConversations(studentId),
            fetchMemorySummaries(studentId)
        ]);

        JourneysState.progress = progress;
        JourneysState.conversations = conversations;
        JourneysState.memorySummaries = summaries;

        // Render dashboard
        renderStudentOverview(student);
        renderTimeline();
        renderInsights();
        renderActivity();

        // Show dashboard
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('dashboard-content').style.display = 'block';

    } catch (error) {
        console.error('[Dashboard] Error loading student data:', error);
        document.getElementById('loading-state').innerHTML = `
            <div class="empty-icon">❌</div>
            <h3>Error Loading Data</h3>
            <p>${error.message}</p>
        `;
    }
}

function setFilter(filter) {
    JourneysState.currentFilter = filter;

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    renderTimeline();
}

function viewModuleMemory(classId, moduleId) {
    localStorage.setItem('memoryInspector_classId', classId);
    localStorage.setItem('memoryInspector_moduleId', moduleId);
    localStorage.setItem('memoryInspector_studentId', JourneysState.selectedStudent.id);
    window.location.href = 'memory_inspector_test.html';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

async function initializeDashboard() {
    console.log('[Journeys] Initializing...');

    try {
        // Fetch initial data
        const [students, modules, classes] = await Promise.all([
            fetchStudents(),
            fetchModules(),
            fetchClasses()
        ]);

        JourneysState.students = students;
        JourneysState.modules = modules;
        JourneysState.classes = classes;

        // Populate student dropdown
        const select = document.getElementById('student-select');
        select.innerHTML = '<option value="">Choose a student...</option>';

        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = student.name;
            select.appendChild(option);
        });

        console.log('[Journeys] Initialized successfully');

    } catch (error) {
        console.error('[Journeys] Initialization error:', error);
        alert('Failed to load dashboard data. Please check the console for details.');
    }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();

    // Student selection
    document.getElementById('student-select').addEventListener('change', onStudentChange);

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });
});
