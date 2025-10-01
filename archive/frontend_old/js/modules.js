/**
 * Modules Page JavaScript
 * Displays modules with analytics enhancements
 */

(function() {
console.log('✅ modules.js loading... v20251001131400');

let modulesCache = [];
let performanceCache = {};

// Initialize modules page immediately
(async function() {
    if (!HarvAPI || !HarvAPI.isAdmin()) {
        console.warn('Not authenticated as admin');
        return;
    }

    await loadModulesWithAnalytics();
    setupEventListeners();
})();

async function loadModulesWithAnalytics() {
    try {
        // Load modules and performance data in parallel
        const [modulesData, performanceData] = await Promise.all([
            HarvAPI.getModules(),
            HarvAPI.getModulesPerformance()
        ]);

        modulesCache = modulesData.modules;

        // Create performance lookup
        performanceData.modules.forEach(perf => {
            performanceCache[perf.id] = perf;
        });

        displayModules(modulesCache);

    } catch (error) {
        console.error('Error loading modules:', error);
        showError('Failed to load modules');
    }
}

function displayModules(modules) {
    const cardBody = document.querySelector('.card-body');
    if (!cardBody) return;

    cardBody.innerHTML = '';

    // Update count in header
    const headerTitle = document.querySelector('.card-title');
    if (headerTitle) {
        headerTitle.textContent = `All Modules (${modules.length})`;
    }

    if (modules.length === 0) {
        cardBody.innerHTML = '<div class="alert alert-info">No modules yet. Click "Create New Module" to add one!</div>';
        return;
    }

    modules.forEach(module => {
        const perf = performanceCache[module.id] || {
            completion_rate: 0,
            student_count: 0,
            avg_time_minutes: 0,
            status: 'unknown'
        };

        const moduleCard = document.createElement('div');
        moduleCard.className = 'module-card';
        moduleCard.style.cssText = 'border: 1px solid var(--border-color); padding: 20px; border-radius: 8px; margin-bottom: 15px;';

        // Status badge based on performance
        let statusBadge = '<span class="badge badge-active">Active</span>';
        if (perf.status === 'needs_attention') {
            statusBadge = '<span class="badge badge-warning">Needs Attention</span>';
        } else if (perf.status === 'warning') {
            statusBadge = '<span class="badge badge-draft">Warning</span>';
        }

        // Calculate conversations (approximate from students)
        const conversations = Math.round(perf.student_count * 1.8);

        moduleCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                <div>
                    <div style="font-size: 18px; font-weight: 600; margin-bottom: 5px;">
                        Module ${module.id}: ${escapeHtml(module.title)}
                    </div>
                    ${statusBadge}
                </div>
            </div>
            <div style="color: var(--text-secondary); margin-bottom: 15px;">
                ${escapeHtml(module.description || 'No description available')}
            </div>
            <div style="display: flex; gap: 20px; margin-bottom: 15px; color: var(--text-secondary); font-size: 14px;">
                <span>👥 ${perf.student_count} students</span>
                <span>💬 ${conversations} conversations</span>
                <span>📊 ${Math.round(perf.completion_rate * 100)}% completion</span>
                <span>⏱️ ${perf.avg_time_minutes}min avg</span>
                <span>📈 ${perf.avg_grade || 'N/A'} avg grade</span>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="button button-secondary button-small" onclick="editModule(${module.id})">Edit</button>
                <button class="button button-secondary button-small" onclick="testModule(${module.id})">Test</button>
                <button class="button button-secondary button-small" onclick="viewModuleAnalytics(${module.id})">Analytics</button>
                <button class="button button-danger button-small" onclick="deleteModule(${module.id}, '${escapeHtml(module.title)}')">Delete</button>
            </div>
        `;

        cardBody.appendChild(moduleCard);
    });
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('input[placeholder*="Search"]');
    if (searchInput) {
        searchInput.addEventListener('input', filterModules);
    }

    // Status filter
    const statusFilter = document.querySelector('.card-header select');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterModules);
    }

    // Create module button
    const createBtn = document.querySelector('.button-primary[data-modal="createModuleModal"]');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            if (window.HarvApp && window.HarvApp.loadPage) {
                window.HarvApp.loadPage('module-editor');
                sessionStorage.removeItem('editingModuleId'); // Clear any stored ID for new module
            }
        });
    }
}

function filterModules() {
    const searchTerm = document.querySelector('input[placeholder*="Search"]').value.toLowerCase();
    const statusFilter = document.querySelector('.card-header select').value.toLowerCase();

    const moduleCards = document.querySelectorAll('.module-card');

    moduleCards.forEach(card => {
        const title = card.querySelector('[style*="font-size: 18px"]')?.textContent.toLowerCase() || '';
        const description = card.querySelector('[style*="color: var(--text-secondary)"]')?.textContent.toLowerCase() || '';
        const status = card.querySelector('.badge')?.textContent.toLowerCase() || '';

        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        const matchesStatus = statusFilter === 'all status' ||
                            (statusFilter === 'active' && status.includes('active')) ||
                            (statusFilter === 'draft' && (status.includes('draft') || status.includes('warning')));

        card.style.display = (matchesSearch && matchesStatus) ? '' : 'none';
    });
}

function editModule(moduleId) {
    // Use SPA navigation instead of full page reload
    if (window.HarvApp && window.HarvApp.loadPage) {
        window.HarvApp.loadPage('module-editor');
        // Store module ID for the editor to pick up
        sessionStorage.setItem('editingModuleId', moduleId);
    }
}

function testModule(moduleId) {
    // Use SPA navigation
    if (window.HarvApp && window.HarvApp.loadPage) {
        window.HarvApp.loadPage('testing');
        sessionStorage.setItem('testingModuleId', moduleId);
    }
}

function viewModuleAnalytics(moduleId) {
    // Use SPA navigation
    if (window.HarvApp && window.HarvApp.loadPage) {
        window.HarvApp.loadPage('analytics');
        sessionStorage.setItem('analyticsModuleId', moduleId);
    }
}

async function deleteModule(moduleId, moduleTitle) {
    if (!confirm(`Are you sure you want to delete "${moduleTitle}"?\n\nThis will also delete:\n- All corpus entries\n- All student progress\n- All conversations\n\nThis action cannot be undone.`)) {
        return;
    }

    try {
        await HarvAPI.deleteModule(moduleId);
        showSuccess('Module deleted successfully');
        await loadModulesWithAnalytics();
    } catch (error) {
        console.error('Error deleting module:', error);
        showError('Failed to delete module');
    }
}

function showError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger';
    alert.textContent = message;
    document.querySelector('.card').before(alert);

    setTimeout(() => alert.remove(), 5000);
}

function showSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.textContent = message;
    document.querySelector('.card').before(alert);

    setTimeout(() => alert.remove(), 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions globally accessible
window.editModule = editModule;
window.testModule = testModule;
window.viewModuleAnalytics = viewModuleAnalytics;
window.deleteModule = deleteModule;

console.log('✅ Module navigation functions exported to window');

})(); // Close IIFE
