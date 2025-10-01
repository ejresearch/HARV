/**
 * Analytics Page JavaScript
 * Handles overview, per-module, and per-student analytics
 */

let currentModuleId = null;
let currentUserId = null;

// Initialize analytics page immediately
(async function() {
    if (!HarvAPI || !HarvAPI.isAdmin()) {
        console.warn('Not authenticated as admin');
        return;
    }

    await loadOverviewData();
    await loadModulesList();
    setupEventListeners();
})();

async function loadOverviewData() {
    try {
        const statsData = await HarvAPI.getDashboardStats();
        updateOverviewStats(statsData);
    } catch (error) {
        console.error('Error loading overview data:', error);
    }
}

function updateOverviewStats(stats) {
    const overviewTab = document.getElementById('overview');
    const cards = overviewTab.querySelectorAll('.stat-card');

    if (cards[0]) {
        cards[0].querySelector('.stat-value').textContent = stats.students_enrolled;
        cards[0].querySelector('.stat-change').textContent = `↑ ${stats.students_trend} this week`;
    }

    if (cards[1]) {
        cards[1].querySelector('.stat-value').textContent = stats.active_conversations;
    }

    if (cards[2]) {
        cards[2].querySelector('.stat-value').textContent = stats.modules_completed;
        cards[2].querySelector('.stat-change').textContent = `↑ ${stats.modules_trend} today`;
    }

    if (cards[3]) {
        cards[3].querySelector('.stat-value').textContent = `${stats.avg_time_minutes} min`;
    }

    if (cards[4]) {
        cards[4].querySelector('.stat-value').textContent = stats.avg_grade;
    }

    if (cards[5]) {
        cards[5].querySelector('.stat-value').textContent = `${Math.round(stats.completion_rate * 100)}%`;
    }
}

async function loadModulesList() {
    try {
        const modulesData = await HarvAPI.getModules();
        const select = document.querySelector('#perModule select');

        if (select && modulesData.modules) {
            select.innerHTML = '<option value="">Select a module...</option>';
            modulesData.modules.forEach(module => {
                const option = document.createElement('option');
                option.value = module.id;
                option.textContent = `Module ${module.id}: ${module.title}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading modules list:', error);
    }
}

async function loadModuleAnalytics(moduleId) {
    try {
        const data = await HarvAPI.getModuleAnalytics(moduleId);
        updateModuleAnalytics(data);
    } catch (error) {
        console.error('Error loading module analytics:', error);
        showError('Failed to load module analytics');
    }
}

function updateModuleAnalytics(data) {
    const perModuleTab = document.getElementById('perModule');
    const cards = perModuleTab.querySelectorAll('.stat-card');

    if (cards[0]) {
        cards[0].querySelector('.stat-value').textContent = data.metrics.total_students;
    }

    if (cards[1]) {
        cards[1].querySelector('.stat-value').textContent =
            `${Math.round(data.metrics.completion_rate * 100)}%`;
    }

    if (cards[2]) {
        // Grade calculation would need more data
        cards[2].querySelector('.stat-value').textContent = 'N/A';
    }

    if (cards[3]) {
        cards[3].querySelector('.stat-value').textContent =
            `${data.metrics.avg_time_minutes} min`;
    }
}

async function loadStudentAnalytics(userId) {
    try {
        const data = await HarvAPI.getStudentAnalytics(userId);
        updateStudentAnalytics(data);
    } catch (error) {
        console.error('Error loading student analytics:', error);
        showError('Failed to load student analytics');
    }
}

function updateStudentAnalytics(data) {
    const perStudentTab = document.getElementById('perStudent');

    // Update header
    const cardTitle = perStudentTab.querySelector('.card-title');
    if (cardTitle) {
        cardTitle.textContent = `Student: ${data.user.name} (${data.user.email})`;
    }

    // Update stat cards
    const cards = perStudentTab.querySelectorAll('.stat-card');

    if (cards[0]) {
        cards[0].querySelector('.stat-value').textContent =
            `${data.metrics.modules_completed}/${data.metrics.modules_started}`;
    }

    if (cards[1]) {
        cards[1].querySelector('.stat-value').textContent =
            data.metrics.gpa > 0 ? data.metrics.gpa.toFixed(2) : 'N/A';
    }

    if (cards[2]) {
        const hours = Math.floor(data.metrics.total_time_minutes / 60);
        const mins = data.metrics.total_time_minutes % 60;
        cards[2].querySelector('.stat-value').textContent = `${hours}h ${mins}m`;
    }

    if (cards[3]) {
        cards[3].querySelector('.stat-value').textContent = 'Recent';
    }

    // Update table
    const tbody = perStudentTab.querySelector('tbody');
    if (tbody && data.module_progress) {
        tbody.innerHTML = '';

        data.module_progress.forEach(progress => {
            const row = document.createElement('tr');

            const statusBadge = progress.completed
                ? '<span class="badge badge-active">Completed</span>'
                : '<span class="badge badge-warning">In Progress</span>';

            const grade = progress.grade || '-';
            const time = progress.time_spent_minutes ? `${progress.time_spent_minutes} min` : '-';
            const completed = progress.completion_date
                ? new Date(progress.completion_date).toLocaleDateString()
                : '-';

            row.innerHTML = `
                <td>${progress.module_title}</td>
                <td>${statusBadge}</td>
                <td>${grade}</td>
                <td>${time}</td>
                <td>${completed}</td>
            `;

            tbody.appendChild(row);
        });
    }
}

function setupEventListeners() {
    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Module selector
    const moduleSelect = document.querySelector('#perModule select');
    if (moduleSelect) {
        moduleSelect.addEventListener('change', async (e) => {
            const moduleId = parseInt(e.target.value);
            if (moduleId) {
                currentModuleId = moduleId;
                await loadModuleAnalytics(moduleId);
            }
        });
    }

    // Student search (simplified - would need actual search endpoint)
    const studentSearch = document.querySelector('#perStudent input[type="text"]');
    if (studentSearch) {
        studentSearch.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                // In a real implementation, you'd search for users by email/name
                // For now, just use a hardcoded user ID for testing
                const userId = 1; // Would come from search results
                await loadStudentAnalytics(userId);
            }
        });
    }

    // Check URL params for direct navigation
    const urlParams = new URLSearchParams(window.location.search);
    const moduleParam = urlParams.get('module');
    const studentParam = urlParams.get('student');

    if (moduleParam) {
        // Switch to per-module tab and load data
        document.querySelector('[data-tab="perModule"]').click();
        const moduleSelect = document.querySelector('#perModule select');
        if (moduleSelect) {
            moduleSelect.value = moduleParam;
            loadModuleAnalytics(parseInt(moduleParam));
        }
    }

    if (studentParam) {
        // Switch to per-student tab and load data
        document.querySelector('[data-tab="perStudent"]').click();
        loadStudentAnalytics(parseInt(studentParam));
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.textContent = message;
    document.querySelector('.tabs').after(errorDiv);

    setTimeout(() => errorDiv.remove(), 5000);
}
