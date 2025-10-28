// API Configuration
const API_BASE = 'http://localhost:8001';

// Global State
let currentUser = null;
let authToken = null;
let currentConversation = null;
let currentModuleId = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

// Auto-login and view toggle
let isTeacherView = false;

document.addEventListener('DOMContentLoaded', () => {
    // Auto-login as admin
    autoLogin();
});

// ============================================================================
// AUTH FUNCTIONS
// ============================================================================

function showAuthOverlay() {
    document.getElementById('auth-overlay').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';
}

async function autoLogin() {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@harv.com', password: 'admin123' })
        });

        if (response.ok) {
            const data = await response.json();
            authToken = data.access_token;
            currentUser = data.user;
            showMainApp();
        } else {
            showAuthOverlay();
        }
    } catch (error) {
        console.error('Auto-login failed:', error);
        showAuthOverlay();
    }
}

function showMainApp() {
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';

    // Start in student view
    setStudentView();

    // Show admin tab if user is admin
    if (currentUser.is_admin) {
        document.getElementById('admin-tab').style.display = 'block';
    }

    // Load initial data
    loadModules();
    showSection('chat');
}

function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            showToast(error.detail || 'Login failed', 'error');
            return;
        }

        const data = await response.json();
        authToken = data.access_token;
        currentUser = data.user;

        // Save to localStorage
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        showToast('Login successful!', 'success');
        showMainApp();
    } catch (error) {
        showToast('Login error: ' + error.message, 'error');
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            showToast(error.detail || 'Registration failed', 'error');
            return;
        }

        const data = await response.json();
        authToken = data.access_token;
        currentUser = data.user;

        // Save to localStorage
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        showToast('Registration successful!', 'success');
        showMainApp();
    } catch (error) {
        showToast('Registration error: ' + error.message, 'error');
    }
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    authToken = null;
    currentUser = null;
    currentConversation = null;
    currentModuleId = null;
    showAuthOverlay();
    showToast('Logged out successfully', 'success');
}

// ============================================================================
// NAVIGATION
// ============================================================================

function showSection(sectionName) {
    // Update tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`section-${sectionName}`).classList.add('active');

    // Load section data
    if (sectionName === 'modules') {
        loadModulesGrid();
    } else if (sectionName === 'admin') {
        loadAdminData();
    }
}

// ============================================================================
// MODULE FUNCTIONS
// ============================================================================

async function loadModules() {
    try {
        const response = await fetch(`${API_BASE}/modules`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) throw new Error('Failed to load modules');

        const modules = await response.json();

        // Update module selector in chat
        const moduleList = document.getElementById('module-list');
        if (modules.length === 0) {
            moduleList.innerHTML = '<p class="empty">No modules available</p>';
        } else {
            moduleList.innerHTML = modules.map(mod => `
                <div class="module-item" onclick="startChat(${mod.id}, '${escapeHtml(mod.title)}')">
                    <div class="module-title">${escapeHtml(mod.title)}</div>
                    <div class="module-desc">${escapeHtml(mod.description || '')}</div>
                </div>
            `).join('');
        }
    } catch (error) {
        showToast('Error loading modules: ' + error.message, 'error');
    }
}

async function loadModulesGrid() {
    try {
        const response = await fetch(`${API_BASE}/modules`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) throw new Error('Failed to load modules');

        const modules = await response.json();

        const grid = document.getElementById('modules-grid');
        if (modules.length === 0) {
            grid.innerHTML = '<p class="empty">No modules available</p>';
        } else {
            grid.innerHTML = modules.map(mod => `
                <div class="module-card">
                    <h3>${escapeHtml(mod.title)}</h3>
                    <p>${escapeHtml(mod.description || 'No description')}</p>
                    <button onclick="startChat(${mod.id}, '${escapeHtml(mod.title)}')" class="btn-primary">
                        Start Learning
                    </button>
                </div>
            `).join('');
        }
    } catch (error) {
        showToast('Error loading modules: ' + error.message, 'error');
    }
}

// ============================================================================
// CHAT FUNCTIONS
// ============================================================================

function startChat(moduleId, moduleTitle) {
    currentModuleId = moduleId;
    currentConversation = null;

    // Hide placeholder, show chat
    document.getElementById('chat-placeholder').style.display = 'none';
    document.getElementById('chat-active').style.display = 'flex';

    // Set module title
    document.getElementById('current-module-title').textContent = moduleTitle;

    // Clear messages
    document.getElementById('chat-messages').innerHTML = '';

    // Focus input
    document.getElementById('chat-input').focus();

    // Switch to chat section if not already there
    const chatSection = document.getElementById('section-chat');
    if (!chatSection.classList.contains('active')) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        chatSection.classList.add('active');
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.nav-tab')[0].classList.add('active');
    }
}

function endChat() {
    currentModuleId = null;
    currentConversation = null;

    document.getElementById('chat-placeholder').style.display = 'flex';
    document.getElementById('chat-active').style.display = 'none';
}

async function sendMessage(event) {
    event.preventDefault();

    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message || !currentModuleId) return;

    // Clear input
    input.value = '';

    // Add user message to chat
    addMessageToChat('user', message);

    // Show loading indicator
    const loadingId = addMessageToChat('assistant', 'Thinking...', true);

    try {
        const response = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                module_id: currentModuleId,
                message: message,
                conversation_id: currentConversation
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        const data = await response.json();

        // Update conversation ID
        currentConversation = data.conversation_id;

        // Remove loading message
        document.getElementById(loadingId).remove();

        // Add AI response
        addMessageToChat('assistant', data.response);

    } catch (error) {
        // Remove loading message
        document.getElementById(loadingId).remove();

        showToast('Error: ' + error.message, 'error');
        addMessageToChat('assistant', 'Sorry, I encountered an error. Please try again.');
    }
}

function addMessageToChat(role, content, isLoading = false) {
    const messagesDiv = document.getElementById('chat-messages');
    const messageId = 'msg-' + Date.now();

    const messageEl = document.createElement('div');
    messageEl.id = messageId;
    messageEl.className = `message message-${role}`;
    if (isLoading) messageEl.classList.add('loading');

    messageEl.innerHTML = `
        <div class="message-content">${escapeHtml(content)}</div>
    `;

    messagesDiv.appendChild(messageEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    return messageId;
}

// ============================================================================
// ADMIN FUNCTIONS
// ============================================================================

async function loadAdminData() {
    if (!currentUser.is_admin) return;

    // Load stats
    try {
        const response = await fetch(`${API_BASE}/admin/stats`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            const stats = await response.json();
            document.getElementById('stat-users').textContent = stats.total_users;
            document.getElementById('stat-modules').textContent = stats.total_modules;
            document.getElementById('stat-conversations').textContent = stats.total_conversations;
        }
    } catch (error) {
        showToast('Error loading stats', 'error');
    }

    // Load modules for admin
    await loadAdminModules();

    // Load users
    await loadAdminUsers();
}

async function loadAdminModules() {
    try {
        const response = await fetch(`${API_BASE}/modules`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) throw new Error('Failed to load modules');

        const modules = await response.json();

        const list = document.getElementById('admin-modules-list');
        if (modules.length === 0) {
            list.innerHTML = '<p class="empty">No modules yet</p>';
        } else {
            list.innerHTML = `
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${modules.map(mod => `
                            <tr>
                                <td><strong>${escapeHtml(mod.title)}</strong></td>
                                <td>${escapeHtml(mod.description || 'No description')}</td>
                                <td>
                                    <button onclick="editModule(${mod.id})" class="btn-small">Edit</button>
                                    <button onclick="deleteModule(${mod.id})" class="btn-small btn-danger">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    } catch (error) {
        showToast('Error loading modules: ' + error.message, 'error');
    }
}

async function loadAdminUsers() {
    try {
        const response = await fetch(`${API_BASE}/admin/users`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) throw new Error('Failed to load users');

        const users = await response.json();

        const list = document.getElementById('admin-users-list');
        list.innerHTML = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td><strong>${escapeHtml(user.name)}</strong></td>
                            <td>${escapeHtml(user.email)}</td>
                            <td><span class="badge ${user.is_admin ? 'badge-admin' : 'badge-student'}">
                                ${user.is_admin ? 'Admin' : 'Student'}
                            </span></td>
                            <td>${new Date(user.created_at).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        showToast('Error loading users: ' + error.message, 'error');
    }
}

function showCreateModule() {
    document.getElementById('modal-title').textContent = 'Create Module';
    document.getElementById('module-form').reset();
    document.getElementById('module-id').value = '';
    document.getElementById('module-modal').style.display = 'flex';
}

async function editModule(moduleId) {
    try {
        const response = await fetch(`${API_BASE}/modules/${moduleId}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) throw new Error('Failed to load module');

        const module = await response.json();

        document.getElementById('modal-title').textContent = 'Edit Module';
        document.getElementById('module-id').value = module.id;
        document.getElementById('module-title').value = module.title;
        document.getElementById('module-description').value = module.description || '';
        document.getElementById('module-content').value = module.content || '';
        document.getElementById('module-socratic').value = module.socratic_prompt || '';
        document.getElementById('module-modal').style.display = 'flex';
    } catch (error) {
        showToast('Error loading module: ' + error.message, 'error');
    }
}

async function handleModuleSubmit(event) {
    event.preventDefault();

    const moduleId = document.getElementById('module-id').value;
    const data = {
        title: document.getElementById('module-title').value,
        description: document.getElementById('module-description').value,
        content: document.getElementById('module-content').value,
        socratic_prompt: document.getElementById('module-socratic').value
    };

    try {
        const url = moduleId
            ? `${API_BASE}/modules/${moduleId}`
            : `${API_BASE}/modules`;

        const response = await fetch(url, {
            method: moduleId ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to save module');

        showToast(moduleId ? 'Module updated!' : 'Module created!', 'success');
        closeModuleModal();
        loadAdminModules();
        loadModules();
    } catch (error) {
        showToast('Error saving module: ' + error.message, 'error');
    }
}

async function deleteModule(moduleId) {
    if (!confirm('Are you sure you want to delete this module? This will also delete all conversations for this module.')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/modules/${moduleId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) throw new Error('Failed to delete module');

        showToast('Module deleted', 'success');
        loadAdminModules();
        loadModules();
    } catch (error) {
        showToast('Error deleting module: ' + error.message, 'error');
    }
}

function closeModuleModal() {
    document.getElementById('module-modal').style.display = 'none';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('module-modal');
    if (event.target === modal) {
        closeModuleModal();
    }
}

// ============================================================================
// VIEW TOGGLE
// ============================================================================

function toggleView() {
    if (isTeacherView) {
        setStudentView();
    } else {
        setTeacherView();
    }
}

function setStudentView() {
    isTeacherView = false;
    
    // Hide admin tab
    document.querySelectorAll('.nav-tab').forEach((tab, index) => {
        if (index === 2) { // Admin tab is 3rd (index 2)
            tab.style.display = 'none';
        }
    });
    
    // Update toggle button
    document.getElementById('view-toggle-text').innerHTML = '👩‍🏫 Switch to Teacher View';
    
    // Switch to Chat tab if on Admin
    const activeSection = document.querySelector('.section.active');
    if (activeSection && activeSection.id === 'section-admin') {
        showSection('chat');
        document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.nav-tab')[0].classList.add('active');
    }
}

function setTeacherView() {
    isTeacherView = true;
    
    // Show admin tab
    document.querySelectorAll('.nav-tab').forEach((tab, index) => {
        if (index === 2) { // Admin tab
            tab.style.display = 'block';
        }
    });
    
    // Update toggle button
    document.getElementById('view-toggle-text').innerHTML = '👨‍🎓 Switch to Student View';
    
    // Automatically switch to Admin tab
    showSection('admin');
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-tab')[2].classList.add('active');
}
