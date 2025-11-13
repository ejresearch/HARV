// ============================================================================
// HARV v2.0 - Class Hierarchy Viewer
// ============================================================================

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const HierarchyState = {
    classes: [],
    modules: [],
    users: [],
    searchQuery: '',
    expandedClasses: new Set()
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Fetch all classes from backend
 */
async function fetchClasses() {
    try {
        console.log('[API] Fetching classes...');
        const response = await fetch(`${API_BASE}/classes`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const classes = await response.json();
        console.log('[API] Classes loaded:', classes.length);
        return classes;
    } catch (error) {
        console.error('[API] Error fetching classes:', error);
        throw error;
    }
}

/**
 * Fetch all modules from backend
 */
async function fetchModules() {
    try {
        console.log('[API] Fetching modules...');
        const response = await fetch(`${API_BASE}/modules`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const modules = data.modules || data || [];
        console.log('[API] Modules loaded:', modules.length);
        return modules;
    } catch (error) {
        console.error('[API] Error fetching modules:', error);
        throw error;
    }
}

/**
 * Fetch all users from backend
 */
async function fetchUsers() {
    try {
        console.log('[API] Fetching users...');
        const response = await fetch(`${API_BASE}/users`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const users = data.users || data || [];
        console.log('[API] Users loaded:', users.length);
        return users;
    } catch (error) {
        console.error('[API] Error fetching users:', error);
        return [];
    }
}

// ============================================================================
// RENDERING FUNCTIONS
// ============================================================================

/**
 * Render class card
 */
function renderClassCard(classData, modules) {
    const classModules = modules.filter(m => m.class_id === classData.id);
    const isExpanded = HierarchyState.expandedClasses.has(classData.id);

    const studentCount = calculateStudentCount(classData, classModules);
    const completionRate = calculateCompletionRate(classData, classModules);

    return `
        <div class="class-card ${isExpanded ? 'expanded' : ''}" data-class-id="${classData.id}">
            <div class="class-header" onclick="toggleClass(${classData.id})">
                <div class="class-title-section">
                    <div class="class-title">
                        <span>🏛️</span>
                        ${escapeHtml(classData.title)}
                    </div>
                    ${classData.description ? `
                        <div class="class-description">
                            ${escapeHtml(classData.description)}
                        </div>
                    ` : ''}
                </div>

                <div class="class-meta">
                    <div class="class-stat">
                        <div class="class-stat-value">${classModules.length}</div>
                        <div class="class-stat-label">Modules</div>
                    </div>
                    <div class="class-stat">
                        <div class="class-stat-value">${studentCount}</div>
                        <div class="class-stat-label">Students</div>
                    </div>
                    <div class="class-stat">
                        <div class="class-stat-value">${completionRate}%</div>
                        <div class="class-stat-label">Complete</div>
                    </div>
                    <div class="expand-icon">${isExpanded ? '▲' : '▼'}</div>
                </div>
            </div>

            <div class="modules-container">
                <div class="modules-grid">
                    ${classModules.length > 0
                        ? classModules.map(mod => renderModuleCard(mod, classData)).join('')
                        : '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #6B7280;">No modules in this class yet</div>'
                    }
                </div>
            </div>
        </div>
    `;
}

/**
 * Render module card
 */
function renderModuleCard(moduleData, classData) {
    const studentCount = Math.floor(Math.random() * 20) + 5; // Mock data
    const completionRate = Math.floor(Math.random() * 100);

    return `
        <div class="module-card" data-module-id="${moduleData.id}">
            <div class="module-header">
                <div>
                    <div class="module-title">${escapeHtml(moduleData.title)}</div>
                </div>
                <div class="module-badge">Active</div>
            </div>

            ${moduleData.description ? `
                <div class="module-description">
                    ${escapeHtml(moduleData.description.substring(0, 150))}${moduleData.description.length > 150 ? '...' : ''}
                </div>
            ` : ''}

            <div class="module-stats">
                <div class="module-stat">
                    <div class="module-stat-value">${studentCount}</div>
                    <div class="module-stat-label">Students</div>
                </div>
                <div class="module-stat">
                    <div class="module-stat-value">${completionRate}%</div>
                    <div class="module-stat-label">Complete</div>
                </div>
                <div class="module-stat">
                    <div class="module-stat-value">${moduleData.id}</div>
                    <div class="module-stat-label">Module ID</div>
                </div>
            </div>

            <div class="module-actions">
                <button class="module-btn btn-primary" onclick="openMemoryInspector(${classData.id}, ${moduleData.id})">
                    🧠 View Memory
                </button>
                <button class="module-btn btn-secondary" onclick="viewModuleDetails(${moduleData.id})">
                    📋 Details
                </button>
            </div>
        </div>
    `;
}

/**
 * Render entire hierarchy
 */
function renderHierarchy() {
    const container = document.getElementById('class-tree-container');
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');

    // Filter classes by search query
    let filteredClasses = HierarchyState.classes;

    if (HierarchyState.searchQuery) {
        const query = HierarchyState.searchQuery.toLowerCase();
        filteredClasses = HierarchyState.classes.filter(cls => {
            // Search in class title and description
            const classMatch = cls.title.toLowerCase().includes(query) ||
                              (cls.description && cls.description.toLowerCase().includes(query));

            // Search in module titles
            const moduleMatch = HierarchyState.modules.some(mod =>
                mod.class_id === cls.id &&
                mod.title.toLowerCase().includes(query)
            );

            return classMatch || moduleMatch;
        });
    }

    // Show/hide states
    loadingState.style.display = 'none';

    if (filteredClasses.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    container.style.display = 'block';
    emptyState.style.display = 'none';

    // Render all classes
    container.innerHTML = filteredClasses
        .map(cls => renderClassCard(cls, HierarchyState.modules))
        .join('');

    console.log('[UI] Rendered', filteredClasses.length, 'classes');
}

/**
 * Update stats overview
 */
function updateStats() {
    const students = HierarchyState.users.filter(u => !u.is_admin);
    const avgCompletion = 67; // Mock data

    document.getElementById('total-classes').textContent = HierarchyState.classes.length;
    document.getElementById('total-modules').textContent = HierarchyState.modules.length;
    document.getElementById('active-students').textContent = students.length;
    document.getElementById('completion-rate').textContent = `${avgCompletion}%`;
}

// ============================================================================
// INTERACTION HANDLERS
// ============================================================================

/**
 * Toggle class expansion
 */
function toggleClass(classId) {
    if (HierarchyState.expandedClasses.has(classId)) {
        HierarchyState.expandedClasses.delete(classId);
    } else {
        HierarchyState.expandedClasses.add(classId);
    }

    renderHierarchy();
}

/**
 * Expand all classes
 */
function expandAll() {
    HierarchyState.classes.forEach(cls => {
        HierarchyState.expandedClasses.add(cls.id);
    });
    renderHierarchy();
}

/**
 * Collapse all classes
 */
function collapseAll() {
    HierarchyState.expandedClasses.clear();
    renderHierarchy();
}

/**
 * Open Memory Inspector for a module
 */
function openMemoryInspector(classId, moduleId) {
    // Store selection in localStorage
    localStorage.setItem('memoryInspector_classId', classId);
    localStorage.setItem('memoryInspector_moduleId', moduleId);

    // Navigate to Memory Inspector
    window.location.href = 'memory_inspector_test.html';
}

/**
 * View module details
 */
function viewModuleDetails(moduleId) {
    const module = HierarchyState.modules.find(m => m.id === moduleId);
    if (!module) return;

    alert(`📋 Module Details\n\nTitle: ${module.title}\n\nDescription: ${module.description || 'No description'}\n\nModule ID: ${module.id}`);
}

/**
 * Handle search input
 */
function handleSearch(event) {
    HierarchyState.searchQuery = event.target.value;
    renderHierarchy();
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Escape HTML to prevent XSS
 */
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

/**
 * Calculate student count for a class
 */
function calculateStudentCount(classData, modules) {
    // Mock calculation - would query actual enrollments
    return Math.floor(Math.random() * 50) + 10;
}

/**
 * Calculate completion rate for a class
 */
function calculateCompletionRate(classData, modules) {
    // Mock calculation - would query actual progress
    return Math.floor(Math.random() * 100);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the hierarchy viewer
 */
async function initializeHierarchy() {
    console.log('[Hierarchy] Initializing...');

    try {
        // Show loading state
        document.getElementById('loading-state').style.display = 'block';
        document.getElementById('class-tree-container').style.display = 'none';

        // Fetch all data in parallel
        const [classes, modules, users] = await Promise.all([
            fetchClasses(),
            fetchModules(),
            fetchUsers()
        ]);

        // Store in state
        HierarchyState.classes = classes;
        HierarchyState.modules = modules;
        HierarchyState.users = users;

        // Update stats
        updateStats();

        // Render hierarchy
        renderHierarchy();

        console.log('[Hierarchy] Initialized successfully');

    } catch (error) {
        console.error('[Hierarchy] Initialization error:', error);
        document.getElementById('loading-state').innerHTML = `
            <div class="empty-icon">❌</div>
            <h3>Error Loading Data</h3>
            <p>${error.message}</p>
            <button onclick="initializeHierarchy()" class="control-btn" style="margin-top: 1rem;">
                🔄 Retry
            </button>
        `;
    }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize hierarchy
    initializeHierarchy();

    // Search input
    document.getElementById('hierarchy-search').addEventListener('input', handleSearch);

    // Expand/Collapse buttons
    document.getElementById('expand-all-btn').addEventListener('click', expandAll);
    document.getElementById('collapse-all-btn').addEventListener('click', collapseAll);
});
