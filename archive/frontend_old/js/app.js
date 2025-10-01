// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}

// Page Navigation
const pageTitles = {
    'dashboard': 'Dashboard',
    'modules': 'Module Management',
    'module-editor': 'Module Editor',
    'corpus-entry': 'Module Corpus Entry',
    'course-corpus': 'Course Corpus',
    'documents': 'Document Management',
    'analytics': 'Analytics Overview',
    'conversations': 'Conversation Browser',
    'testing': 'Module Testing',
    'settings': 'LLM Configuration'
};

async function loadPage(pageId) {
    try {
        const response = await fetch(`pages/${pageId}.html?v=20251001134000`);
        const html = await response.text();
        document.getElementById('mainContent').innerHTML = html;

        // Update page title
        document.getElementById('pageTitle').textContent = pageTitles[pageId] || 'Dashboard';

        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageId}"]`)?.classList.add('active');

        // Wait a tick for DOM to settle before initializing scripts
        setTimeout(() => {
            initPageScripts(pageId);
        }, 0);
    } catch (error) {
        console.error('Error loading page:', error);
        document.getElementById('mainContent').innerHTML = '<p>Error loading page content.</p>';
    }
}

function initPageScripts(pageId) {
    // Initialize tab functionality if tabs exist
    const tabs = document.querySelectorAll('.tab');
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', handleTabClick);
        });
    }

    // Initialize modal triggers
    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            showModal(trigger.dataset.modal);
        });
    });

    // Load page-specific JavaScript
    loadPageSpecificScript(pageId);

    // Initialize charts if charts.js is loaded
    if (window.HarvCharts) {
        window.HarvCharts.initChartsForPage(pageId);
    }
}

function loadPageSpecificScript(pageId) {
    // Remove old page script if exists
    const oldScript = document.getElementById('page-script');
    if (oldScript) {
        oldScript.remove();
    }

    // Map of pages to their script files
    const pageScripts = {
        'dashboard': 'dashboard.js',
        'analytics': 'analytics.js',
        'course-corpus': 'course-corpus.js',
        'corpus-entry': 'corpus-entry.js',
        'documents': 'documents.js',
        'modules': 'modules.js',
        'testing': 'testing.js',
        'module-editor': 'module-editor.js'
    };

    const scriptFile = pageScripts[pageId];
    if (scriptFile) {
        const script = document.createElement('script');
        script.id = 'page-script';
        script.src = `js/${scriptFile}?v=20251001134000`;
        script.onerror = () => console.warn(`Failed to load ${scriptFile}`);
        document.body.appendChild(script);
    }
}

// Tab Navigation
function handleTabClick(e) {
    const tabId = e.target.dataset.tab;

    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Activate clicked tab
    e.target.classList.add('active');

    // Show corresponding content
    const content = document.getElementById(tabId);
    if (content) {
        content.classList.add('active');
    }
}

// Modal Management
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Corpus Entry Expand/Collapse
function toggleExpand(event) {
    const button = event.target;
    const entry = button.closest('.corpus-entry');
    const content = entry.querySelector('.corpus-entry-content');

    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        button.textContent = 'Expand';
    } else {
        content.classList.add('expanded');
        button.textContent = 'Collapse';
    }
}

// LLM Configuration Functions
function updateAPIKeyLabel() {
    const provider = document.getElementById('llmProvider')?.value;
    if (!provider) return;

    const labels = {
        'openai': 'OpenAI API Key',
        'anthropic': 'Anthropic API Key',
        'gemini': 'Google Gemini API Key',
        'grok': 'Grok API Key'
    };

    const models = {
        'openai': ['GPT-4', 'GPT-4 Turbo', 'GPT-3.5 Turbo'],
        'anthropic': ['Claude 3 Opus', 'Claude 3 Sonnet', 'Claude 3 Haiku'],
        'gemini': ['Gemini Pro', 'Gemini Pro Vision', 'Gemini Ultra'],
        'grok': ['Grok-1', 'Grok-1.5']
    };

    const label = document.getElementById('apiKeyLabel');
    if (label) {
        label.textContent = labels[provider];
    }

    const modelSelect = document.getElementById('modelSelect');
    if (modelSelect) {
        modelSelect.innerHTML = '';
        models[provider].forEach(model => {
            const option = document.createElement('option');
            option.value = model.toLowerCase().replace(/\s+/g, '-');
            option.textContent = model;
            modelSelect.appendChild(option);
        });
    }
}

function testConnection() {
    alert('Testing connection to API... (This is a demo)');
}

function saveAPIConfig() {
    const provider = document.getElementById('llmProvider')?.value;
    const modelElement = document.getElementById('modelSelect')?.selectedOptions[0];

    if (provider && modelElement) {
        const currentProvider = document.getElementById('currentProvider');
        const currentModel = document.getElementById('currentModel');

        if (currentProvider) {
            currentProvider.textContent = provider.charAt(0).toUpperCase() + provider.slice(1);
        }
        if (currentModel) {
            currentModel.textContent = modelElement.text;
        }

        alert('API configuration saved successfully!');
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    if (!token) {
        // Redirect to login page
        window.location.href = 'login.html';
        return;
    }

    // Initialize theme
    initTheme();

    // Setup theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Setup navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const page = item.dataset.page;
            if (page) {
                loadPage(page);
            }
        });
    });

    // Setup logout
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
        userAvatar.style.cursor = 'pointer';
        userAvatar.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.clear();
                window.location.href = 'login.html';
            }
        });

        // Update avatar with user initials
        const userName = localStorage.getItem('user_name') || 'Admin';
        const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        userAvatar.textContent = initials;
        userAvatar.title = `${userName} - Click to logout`;
    }

    // Load default page (dashboard)
    loadPage('dashboard');

    // Close modals on background click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
});

// Export functions for use in loaded pages
window.HarvApp = {
    showModal,
    closeModal,
    toggleExpand,
    updateAPIKeyLabel,
    testConnection,
    saveAPIConfig,
    loadPage
};
