// API Configuration
const API_BASE = 'http://localhost:8000';

// Archived legacy sections storage
const archivedModulesHTML = `<p style="text-align: center; padding: 40px; color: var(--text-medium);">Legacy modules section - now managed in <strong>Classes & Modules</strong></p>`;
const archivedCorpusHTML = `<p style="text-align: center; padding: 40px; color: var(--text-medium);">Legacy corpus section - now managed within each Class</p>`;
const archivedDocumentsHTML = `<p style="text-align: center; padding: 40px; color: var(--text-medium);">Legacy documents section - now managed within each Class or Module</p>`;

// Section content definitions
const sections = {
    system: {
        title: 'System',
        description: 'Check if server is running and healthy',
        content: `
            <div class="system-grid">
                <div class="system-card">
                    <h3>Root Endpoint</h3>
                    <p class="endpoint-label">GET /</p>
                    <button class="test-btn" onclick="testRootEndpoint()">Test Endpoint</button>
                    <pre class="result" id="root-result">Click test to run...</pre>
                </div>

                <div class="system-card">
                    <h3>Health Check</h3>
                    <p class="endpoint-label">GET /health</p>
                    <button class="test-btn" onclick="testHealthEndpoint()">Test Endpoint</button>
                    <pre class="result" id="health-result">Click test to run...</pre>
                </div>

                <div class="system-card">
                    <h3>System Status</h3>
                    <p class="endpoint-label">GET /system/status</p>
                    <button class="test-btn" onclick="testStatusEndpoint()">Test Endpoint</button>
                    <pre class="result" id="status-result">Click test to run...</pre>
                </div>
            </div>
        `
    },
    auth: {
        title: 'Authentication',
        description: 'Register new users and log them in to get access tokens',
        content: `
            <div class="auth-container">
                <!-- Login Form -->
                <div class="auth-card" id="login-card">
                    <h3>Login</h3>
                    <form id="login-form" onsubmit="handleLogin(event)">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="login-email" required placeholder="user@example.com">
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="login-password" required placeholder="********">
                        </div>
                        <button type="submit" class="auth-btn">Login</button>
                        <button type="button" class="link-btn" onclick="showRegister()">Create New User</button>
                    </form>
                </div>

                <!-- Register Form -->
                <div class="auth-card" id="register-card" style="display: none;">
                    <h3>Create New User</h3>
                    <form id="register-form" onsubmit="handleRegister(event)">
                        <div class="form-group">
                            <label>Role</label>
                            <select id="register-role" required onchange="toggleStudentFields()">
                                <option value="">Select Role</option>
                                <option value="student">Student</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" id="register-name" required placeholder="John Doe">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="register-email" required placeholder="user@example.com">
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="register-password" required placeholder="Min 8 characters">
                        </div>

                        <!-- Student-specific fields -->
                        <div id="student-fields" style="display: none;">
                            <div class="form-group">
                                <label>Age / Grade Level</label>
                                <input type="text" id="register-age-grade" placeholder="e.g., 10th grade, 16 years old">
                            </div>
                            <div class="form-group">
                                <label>How do you learn best?</label>
                                <textarea id="register-learning-notes" rows="4" placeholder="Tell us anything you'd like the AI to know about how you learn. For example: 'I learn best with visual examples' or 'I need extra time to process new information'"></textarea>
                            </div>
                        </div>

                        <button type="submit" class="auth-btn">Register</button>
                        <button type="button" class="link-btn" onclick="showLogin()">Back to Login</button>
                    </form>
                </div>

                <!-- User Info Display -->
                <div class="user-info-card" id="user-info" style="display: none;">
                    <h3>Authenticated User</h3>
                    <div id="user-details"></div>
                    <button class="logout-btn" onclick="handleLogout()">Logout</button>
                </div>
            </div>
        `
    },
    classes: {
        title: 'Classes & Modules',
        description: 'Manage classes, modules, corpus, and documents in hierarchical structure',
        content: `
            <div class="classes-container">
                <!-- Class Selector Dropdown -->
                <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <label style="font-weight: 600; color: var(--sage-darkest); white-space: nowrap;">Classes:</label>
                        <select id="class-selector" onchange="selectClassFromDropdown()" style="flex: 1; padding: 10px; border: 2px solid var(--sage-light); border-radius: 6px; font-size: 14px; color: var(--sage-darkest); cursor: pointer;">
                            <option value="">Select a class...</option>
                        </select>
                        <button class="create-btn" onclick="createNewClass()" style="padding: 10px 16px; white-space: nowrap;">+ New Class</button>
                    </div>
                </div>

                <!-- Class/Module Editor -->
                <div style="background: white; border-radius: 8px; padding: 30px; overflow-y: auto;" id="class-editor-container">
                    <div style="text-align: center; color: #95a5a6; padding: 100px 20px;">
                        <h3>Select a class to begin</h3>
                        <p>Choose a class from the dropdown above or create a new one</p>
                    </div>
                </div>
            </div>
        `
    },
    analytics: {
        title: 'Analytics',
        description: 'Track and display performance metrics for students, modules, and generate alerts',
        content: `
            <div class="analytics-container">
                <!-- Dashboard Overview -->
                <div class="analytics-section">
                    <h3>Dashboard Overview</h3>
                    <div id="dashboard-metrics" class="metrics-grid">
                        <div class="metric-card">
                            <div class="metric-label">Students Enrolled</div>
                            <div class="metric-value" id="students-enrolled">-</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">Active Conversations</div>
                            <div class="metric-value" id="active-conversations">-</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">Modules Completed</div>
                            <div class="metric-value" id="modules-completed">-</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">Average Grade</div>
                            <div class="metric-value" id="avg-grade">-</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">Completion Rate</div>
                            <div class="metric-value" id="completion-rate">-</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">Avg Time (min)</div>
                            <div class="metric-value" id="avg-time">-</div>
                        </div>
                    </div>
                    <button class="refresh-btn" onclick="loadDashboardAnalytics()">Refresh Data</button>
                </div>

                <!-- Module Performance -->
                <div class="analytics-section">
                    <h3>Module Performance</h3>
                    <div id="module-performance"></div>
                    <button class="refresh-btn" onclick="loadModulePerformance()">Refresh Data</button>
                </div>

                <!-- Alerts -->
                <div class="analytics-section">
                    <h3>Alerts & Attention Needed</h3>
                    <div id="analytics-alerts"></div>
                    <button class="refresh-btn" onclick="loadAnalyticsAlerts()">Refresh Data</button>
                </div>
            </div>
        `
    },
    corpus: {
        title: 'Corpus',
        description: 'Manage course-level and module-specific knowledge base entries',
        content: `
            <div class="corpus-container">
                <div class="corpus-tabs">
                    <button class="corpus-tab active" onclick="switchCorpusTab('course')">Course Corpus</button>
                    <button class="corpus-tab" onclick="switchCorpusTab('module')">Module Corpus</button>
                </div>
                <div id="course-corpus-view" class="corpus-view">
                    <div class="corpus-layout">
                        <div class="corpus-list">
                            <div class="list-header">
                                <h3>Course Entries</h3>
                                <button class="add-btn" onclick="createNewCourseEntry()">+ Add Entry</button>
                            </div>
                            <div id="course-corpus-list">
                                <p class="no-data">Loading...</p>
                            </div>
                        </div>
                        <div class="corpus-form-container" id="course-corpus-form">
                            <div class="empty-state">
                                <h3>No Entry Selected</h3>
                                <p>Select an entry to edit or create a new one</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="module-corpus-view" class="corpus-view" style="display: none;">
                    <div class="module-selector-corpus">
                        <label>Select Module:</label>
                        <select id="corpus-module-select" onchange="loadModuleCorpusEntries()">
                            <option value="">Choose a module...</option>
                        </select>
                    </div>
                    <div class="corpus-layout" id="module-corpus-content" style="display: none;">
                        <div class="corpus-list">
                            <div class="list-header">
                                <h3>Module Entries</h3>
                                <button class="add-btn" onclick="createNewModuleEntry()">+ Add Entry</button>
                            </div>
                            <div id="module-corpus-list">
                                <p class="no-data">Loading...</p>
                            </div>
                        </div>
                        <div class="corpus-form-container" id="module-corpus-form">
                            <div class="empty-state">
                                <h3>No Entry Selected</h3>
                                <p>Select an entry to edit or create a new one</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    conversations: {
        title: 'Conversations',
        description: 'Retrieve chat history with filtering by user, module, or pagination',
        content: `
            <div class="conversations-container">
                <!-- Filters & Search -->
                <div class="conversations-header">
                    <div class="filters">
                        <select id="filter-user" onchange="loadConversations()">
                            <option value="">All Users</option>
                        </select>
                        <select id="filter-module" onchange="loadConversations()">
                            <option value="">All Modules</option>
                        </select>
                        <button class="refresh-btn" onclick="loadConversations()">Refresh</button>
                    </div>
                    <div class="conversation-stats" id="conversation-stats">
                        Total: <strong>0</strong> conversations
                    </div>
                </div>

                <!-- Two-column layout: List + Detail -->
                <div class="conversations-layout">
                    <!-- Left: Conversation List (like ChatGPT sidebar) -->
                    <div class="conversation-list">
                        <div class="list-header">
                            <h3>Conversation History</h3>
                        </div>
                        <div id="conversations-list-content">
                            <p class="no-data">No conversations yet</p>
                        </div>
                    </div>

                    <!-- Right: Conversation Detail (like ChatGPT main view) -->
                    <div class="conversation-detail">
                        <div id="conversation-detail-content">
                            <div class="empty-state">
                                <h3>No Conversation Selected</h3>
                                <p>Select a conversation from the list to view details</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    chat: {
        title: 'Chat',
        description: 'Send messages and have AI-powered conversations within modules',
        content: `
            <div class="chat-page-container">
                <!-- Controls Section -->
                <div class="chat-controls-section">
                    <div class="control-group">
                        <label>Module</label>
                        <select id="chat-module-select">
                            <option value="">Select Module...</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>AI Model</label>
                        <select id="chat-provider-select">
                            <option value="openai-gpt4">Loading models...</option>
                        </select>
                    </div>
                    <button class="new-chat-btn" onclick="startNewChat()">+ New Chat</button>
                </div>

                <!-- Chat Container -->
                <div class="chat-main-container">
                    <!-- Chat Messages Area -->
                    <div class="chat-messages-area" id="chat-messages">
                        <div class="chat-welcome">
                            <h2>Welcome to HARV AI Tutor</h2>
                            <p>Select a module and start learning through Socratic dialogue</p>
                            <div class="chat-features">
                                <span class="feature-item">🧠 4-Layer Memory</span>
                                <span class="feature-item">AI 9 AI Models</span>
                                <span class="feature-item">Chats Socratic Method</span>
                            </div>
                        </div>
                    </div>

                    <!-- Chat Input Area -->
                    <div class="chat-input-section">
                        <form id="chat-form" onsubmit="sendChatMessage(event)">
                            <textarea
                                id="chat-input"
                                placeholder="Ask a question about the module..."
                                rows="2"
                                disabled
                            ></textarea>
                            <div class="chat-input-footer">
                                <span class="chat-status" id="chat-status">Select a module to begin</span>
                                <button type="submit" class="send-btn" id="send-btn" disabled>Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `
    },
    documents: {
        title: 'Documents',
        description: 'Upload and retrieve files associated with modules',
        content: `
            <div class="documents-container">
                <!-- Top Action Bar -->
                <div class="documents-header">
                    <button class="upload-btn" onclick="openUploadDialog()">Upload Document</button>
                    <select id="doc-module-filter" onchange="loadDocuments()">
                        <option value="">All Modules</option>
                    </select>
                    <button class="export-all-btn" onclick="exportAllDocuments()">Export All</button>
                </div>

                <!-- Two-column layout -->
                <div class="documents-layout">
                    <div class="document-list">
                        <div class="list-header">
                            <h3>Documents</h3>
                            <span id="doc-count" class="doc-count">0 files</span>
                        </div>
                        <div id="documents-list-content">
                            <p class="no-data">Loading...</p>
                        </div>
                    </div>

                    <div class="document-viewer" id="document-viewer">
                        <div class="empty-state">
                            <h3>No Document Selected</h3>
                            <p>Select a document to view its content</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Upload Modal -->
            <div id="upload-modal" class="modal" style="display: none;">
                <div class="modal-content">
                    <h3>Upload Document</h3>
                    <div class="form-group">
                        <label>Module (Optional)</label>
                        <select id="upload-module-select">
                            <option value="">No Module (Course-level)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>File</label>
                        <input type="file" id="upload-file-input" accept=".txt,.md,.pdf,.doc,.docx">
                        <p class="help-text">Allowed: .txt, .md, .pdf, .doc, .docx (max 10MB)</p>
                    </div>
                    <div class="modal-actions">
                        <button class="upload-btn" onclick="uploadDocument()">Upload</button>
                        <button class="cancel-btn" onclick="closeUploadDialog()">Cancel</button>
                    </div>
                </div>
            </div>
        `
    },
    memory: {
        title: '4-Layer Memory Inspector',
        description: 'Drill down by Class → Module → Student to see exact prompts and data',
        content: `
            <div class="memory-inspector-container">
                <!-- Hierarchical Selectors -->
                <div style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h3 style="margin: 0 0 20px 0; color: var(--sage-darkest);">🔍 Select Context to Inspect</h3>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 15px;">
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 8px; color: var(--sage-darkest);">1. Class:</label>
                            <select id="inspector-class" onchange="inspectorClassChanged()" style="width: 100%; padding: 10px; border: 2px solid var(--sage-light); border-radius: 6px; font-size: 14px;">
                                <option value="">Select a class...</option>
                            </select>
                        </div>

                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 8px; color: var(--sage-darkest);">2. Module:</label>
                            <select id="inspector-module" onchange="inspectorModuleChanged()" style="width: 100%; padding: 10px; border: 2px solid var(--sage-light); border-radius: 6px; font-size: 14px;" disabled>
                                <option value="">Select class first...</option>
                            </select>
                        </div>

                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 8px; color: var(--sage-darkest);">3. Student:</label>
                            <select id="inspector-student" onchange="inspectorStudentChanged()" style="width: 100%; padding: 10px; border: 2px solid var(--sage-light); border-radius: 6px; font-size: 14px;" disabled>
                                <option value="">Select module first...</option>
                            </select>
                        </div>
                    </div>

                    <div style="display: flex; gap: 10px; align-items: center;">
                        <button onclick="loadInspectorData()" style="background: var(--sage-dark); color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; cursor: pointer; font-weight: 600;">
                            📊 Analyze Memory Context
                        </button>
                        <div style="flex: 1; position: relative;">
                            <input type="text" id="inspector-search" placeholder="🔍 Or search by student name, email, conversation..." style="width: 100%; padding: 10px 40px 10px 15px; border: 2px solid var(--sage-light); border-radius: 6px; font-size: 14px;">
                            <button onclick="searchInspector()" style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%); background: var(--sage-medium); color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Search</button>
                        </div>
                    </div>
                </div>

                <!-- Results Container -->
                <div id="inspector-results" style="display: none;">
                    <!-- Assembled Prompt Section -->
                    <div style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <h3 style="margin: 0 0 15px 0; color: var(--sage-darkest);">📝 Assembled Prompt for LLM</h3>
                        <div id="assembled-prompt-display" style="background: #2d3748; color: #68d391; padding: 20px; border-radius: 8px; overflow-x: auto; white-space: pre-wrap; line-height: 1.6; font-family: monospace; max-height: 500px; overflow-y: auto;">
                            <!-- Prompt will be shown here -->
                        </div>
                    </div>

                    <!-- 4-Layer Data Breakdown -->
                    <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <h3 style="margin: 0 0 20px 0; color: var(--sage-darkest);">🧠 4-Layer Memory Breakdown</h3>

                        <!-- Layer Tabs -->
                        <div style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #ddd;">
                            <button class="inspector-tab active" onclick="showInspectorLayer(1)" data-layer="1" style="background: none; border: none; padding: 12px 20px; cursor: pointer; font-weight: 600; border-bottom: 3px solid var(--sage-dark);">Layer 1: Profile</button>
                            <button class="inspector-tab" onclick="showInspectorLayer(2)" data-layer="2" style="background: none; border: none; padding: 12px 20px; cursor: pointer; font-weight: 600; border-bottom: 3px solid transparent;">Layer 2: Class</button>
                            <button class="inspector-tab" onclick="showInspectorLayer(3)" data-layer="3" style="background: none; border: none; padding: 12px 20px; cursor: pointer; font-weight: 600; border-bottom: 3px solid transparent;">Layer 3: Module</button>
                            <button class="inspector-tab" onclick="showInspectorLayer(4)" data-layer="4" style="background: none; border: none; padding: 12px 20px; cursor: pointer; font-weight: 600; border-bottom: 3px solid transparent;">Layer 4: Conversations</button>
                        </div>

                        <!-- Layer Content -->
                        <div id="inspector-layer-content">
                            <!-- Layer data will be shown here -->
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div id="inspector-empty" style="text-align: center; padding: 60px 20px; color: var(--text-medium);">
                    <h3 style="margin: 0 0 10px 0;">Select a Class, Module, and Student</h3>
                    <p style="margin: 0;">Or use search to find specific conversations and see how the 4-layer memory system builds the LLM prompt</p>
                </div>
            </div>
        `
    }
};

// Load section content
function loadSection(sectionName) {
    const section = sections[sectionName];
    const contentDiv = document.getElementById('content');

    contentDiv.innerHTML = `
        <div class="section-header">
            <h2>${section.title}</h2>
            <p>${section.description}</p>
        </div>
        ${section.content}
    `;

    // Auto-load classes section
    if (sectionName === 'classes') {
        setTimeout(() => loadClassesSection(), 100);
    }

    // Auto-load analytics section
    if (sectionName === 'analytics') {
        setTimeout(() => {
            loadDashboardAnalytics();
            loadModulePerformance();
            loadAnalyticsAlerts();
        }, 100);
    }

    // Auto-load conversations section
    if (sectionName === 'conversations') {
        setTimeout(() => {
            loadConversationFilters();
            loadConversations();
        }, 100);
    }

    // Auto-load chat section
    if (sectionName === 'chat') {
        setTimeout(() => {
            loadModulesList();
            loadChatProviders();
        }, 100);
    }

    // Auto-load memory inspector
    if (sectionName === 'memory') {
        setTimeout(() => {
            loadMemoryInspector();
        }, 100);
    }
}

// Authentication Functions
let currentUser = null;
let authToken = null;

// Helper function to get auth headers
function getAuthHeaders() {
    const token = localStorage.getItem('access_token') || authToken;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Auto-login for testing (remove in production)
async function autoLoginForTesting() {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@harv.com',
                password: 'admin123'
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            currentUser = data.user;
            authToken = data.access_token;
            localStorage.setItem('access_token', data.access_token);  // Save to localStorage for classes.js
            console.log('✅ Auto-logged in as admin for testing');
        } else {
            console.log('⚠️ Auto-login failed, manual login required');
        }
    } catch (error) {
        console.log('⚠️ Auto-login error:', error.message);
    }
}

function showLogin() {
    document.getElementById('login-card').style.display = 'block';
    document.getElementById('register-card').style.display = 'none';
    document.getElementById('register-form').reset();
}

function showRegister() {
    document.getElementById('login-card').style.display = 'none';
    document.getElementById('register-card').style.display = 'block';
    document.getElementById('login-form').reset();
}

function toggleStudentFields() {
    const role = document.getElementById('register-role').value;
    const studentFields = document.getElementById('student-fields');

    if (role === 'student') {
        studentFields.style.display = 'block';
    } else {
        studentFields.style.display = 'none';
    }
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

        const data = await response.json();

        if (response.ok && data.success) {
            currentUser = data.user;
            authToken = data.access_token;
            localStorage.setItem('access_token', data.access_token);  // Save to localStorage for classes.js
            displayUserInfo(data.user, data.access_token);
            document.getElementById('login-form').reset();
        } else {
            alert(data.detail || 'Login failed');
        }
    } catch (error) {
        alert('Login error: ' + error.message);
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const role = document.getElementById('register-role').value;
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    // Get student-specific fields
    const ageGradeLevel = document.getElementById('register-age-grade').value || '';
    const learningNotes = document.getElementById('register-learning-notes').value || '';

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                email,
                password,
                role: role,
                age_grade_level: ageGradeLevel,
                learning_notes: learningNotes,
                reason: '',
                familiarity: '',
                learning_style: '',
                goals: '',
                background: ''
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Registration successful, show login form
            alert(`${role === 'admin' ? 'Admin' : 'Student'} account created successfully! Please log in.`);
            showLogin();
        } else {
            alert(data.detail || 'Registration failed');
        }
    } catch (error) {
        alert('Registration error: ' + error.message);
    }
}

function displayUserInfo(user, token) {
    const userInfoCard = document.getElementById('user-info');
    const userDetails = document.getElementById('user-details');

    userDetails.innerHTML = `
        <div class="user-field"><strong>ID:</strong> ${user.id}</div>
        <div class="user-field"><strong>Name:</strong> ${user.name}</div>
        <div class="user-field"><strong>Email:</strong> ${user.email}</div>
        <div class="user-field"><strong>Role:</strong> ${user.is_admin ? 'Admin' : 'Student'}</div>
        <div class="user-field token-field">
            <strong>Access Token:</strong>
            <div class="token-display">${token}</div>
        </div>
    `;

    userInfoCard.style.display = 'block';
    document.getElementById('login-card').style.display = 'none';
    document.getElementById('register-card').style.display = 'none';
}

function handleLogout() {
    currentUser = null;
    authToken = null;
    localStorage.removeItem('access_token');  // Clear localStorage token
    document.getElementById('user-info').style.display = 'none';
    showLogin();
}

// API Test Functions
async function testRootEndpoint() {
    const resultEl = document.getElementById('root-result');
    resultEl.textContent = 'Testing...';

    try {
        const response = await fetch(`${API_BASE}/`);
        const data = await response.json();
        resultEl.textContent = JSON.stringify(data, null, 2);
        resultEl.classList.add('success');
    } catch (error) {
        resultEl.textContent = `Error: ${error.message}`;
        resultEl.classList.add('error');
    }
}

async function testHealthEndpoint() {
    const resultEl = document.getElementById('health-result');
    resultEl.textContent = 'Testing...';

    try {
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();
        resultEl.textContent = JSON.stringify(data, null, 2);
        resultEl.classList.add('success');
    } catch (error) {
        resultEl.textContent = `Error: ${error.message}`;
        resultEl.classList.add('error');
    }
}

async function testStatusEndpoint() {
    const resultEl = document.getElementById('status-result');
    resultEl.textContent = 'Testing...';

    try {
        const response = await fetch(`${API_BASE}/system/status`);
        const data = await response.json();
        resultEl.textContent = JSON.stringify(data, null, 2);
        resultEl.classList.add('success');
    } catch (error) {
        resultEl.textContent = `Error: ${error.message}`;
        resultEl.classList.add('error');
    }
}

// Analytics Functions
async function loadDashboardAnalytics() {
    try {
        const response = await fetch(`${API_BASE}/analytics/dashboard`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to load analytics - admin auth required');
        }

        const data = await response.json();

        document.getElementById('students-enrolled').textContent = data.students_enrolled || 0;
        document.getElementById('active-conversations').textContent = data.active_conversations || 0;
        document.getElementById('modules-completed').textContent = data.modules_completed || 0;
        document.getElementById('avg-grade').textContent = data.avg_grade || 'N/A';
        document.getElementById('completion-rate').textContent =
            data.completion_rate ? `${(data.completion_rate * 100).toFixed(0)}%` : '0%';
        document.getElementById('avg-time').textContent =
            data.avg_time_minutes && data.avg_time_minutes > 0 ? data.avg_time_minutes : 'N/A';
    } catch (error) {
        console.error('Error loading dashboard analytics:', error);
        alert('Failed to load dashboard analytics. Make sure you are logged in as admin.');
    }
}

async function loadModulePerformance() {
    try {
        const response = await fetch(`${API_BASE}/analytics/modules/performance`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to load module performance');
        }

        const data = await response.json();
        const container = document.getElementById('module-performance');

        if (!data.modules || data.modules.length === 0) {
            container.innerHTML = '<p class="no-data">No module performance data available</p>';
            return;
        }

        let html = '<table class="analytics-table"><thead><tr>' +
            '<th>Module</th>' +
            '<th>Students</th>' +
            '<th>Completion Rate</th>' +
            '<th>Avg Grade</th>' +
            '<th>Avg Time (min)</th>' +
            '<th>Status</th>' +
            '</tr></thead><tbody>';

        data.modules.forEach(module => {
            const statusClass = module.status === 'healthy' ? 'status-good' :
                              module.status === 'warning' ? 'status-warning' : 'status-alert';

            html += `<tr>
                <td>${module.title}</td>
                <td>${module.student_count}</td>
                <td>${(module.completion_rate * 100).toFixed(0)}%</td>
                <td>${module.avg_grade}</td>
                <td>${module.avg_time_minutes}</td>
                <td><span class="status-badge ${statusClass}">${module.status}</span></td>
            </tr>`;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading module performance:', error);
        document.getElementById('module-performance').innerHTML =
            '<p class="error-message">Failed to load module performance data</p>';
    }
}

async function loadAnalyticsAlerts() {
    try {
        const response = await fetch(`${API_BASE}/analytics/alerts`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to load alerts');
        }

        const data = await response.json();
        const container = document.getElementById('analytics-alerts');

        if (!data.alerts || data.alerts.length === 0) {
            container.innerHTML = '<p class="no-data">No alerts - all modules performing well!</p>';
            return;
        }

        let html = '';
        data.alerts.forEach(alert => {
            const severityClass = alert.severity === 'high' ? 'alert-high' : 'alert-medium';

            html += `<div class="alert-card ${severityClass}">
                <div class="alert-header">
                    <strong>${alert.module_title}</strong>
                    <span class="severity-badge">${alert.severity}</span>
                </div>
                <div class="alert-issues">
                    <strong>Issues:</strong>
                    <ul>
                        ${alert.issues.map(issue => `<li>${issue}</li>`).join('')}
                    </ul>
                </div>
                <div class="alert-actions">
                    <strong>Suggested Actions:</strong>
                    <ul>
                        ${alert.suggested_actions.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                </div>
            </div>`;
        });

        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading alerts:', error);
        document.getElementById('analytics-alerts').innerHTML =
            '<p class="error-message">Failed to load alerts</p>';
    }
}

// Chat Functions
let currentChatConversationId = null;
let chatMessages = [];

async function loadChatProviders() {
    try {
        const response = await fetch(`${API_BASE}/providers`);
        const data = await response.json();

        const select = document.getElementById('chat-provider-select');
        select.innerHTML = '';

        data.providers.forEach(provider => {
            const option = document.createElement('option');
            option.value = provider.id;
            option.textContent = `${provider.name}${!provider.available ? ' (unavailable)' : ''}`;
            option.disabled = !provider.available;
            select.appendChild(option);
        });

        // Load modules
        const modulesResponse = await fetch(`${API_BASE}/modules`);
        const modulesData = await modulesResponse.json();

        const moduleSelect = document.getElementById('chat-module-select');
        moduleSelect.innerHTML = '<option value="">Select Module...</option>';

        modulesData.modules.forEach(module => {
            const option = document.createElement('option');
            option.value = module.id;
            option.textContent = module.title;
            moduleSelect.appendChild(option);
        });

        // Enable chat when module is selected
        moduleSelect.addEventListener('change', function() {
            const chatInput = document.getElementById('chat-input');
            const sendBtn = document.getElementById('send-btn');
            const status = document.getElementById('chat-status');

            if (this.value) {
                chatInput.disabled = false;
                sendBtn.disabled = false;
                status.textContent = 'Ready to chat';
                chatInput.focus();
            } else {
                chatInput.disabled = true;
                sendBtn.disabled = true;
                status.textContent = 'Select a module to begin';
            }
        });

    } catch (error) {
        console.error('Error loading chat providers:', error);
    }
}

function startNewChat() {
    currentChatConversationId = null;
    chatMessages = [];

    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML = `
        <div class="chat-welcome">
            <h2>New Conversation Started</h2>
            <p>Ask a question to begin your learning journey</p>
        </div>
    `;
}

function addChatMessage(role, content, isLoading = false) {
    const messagesContainer = document.getElementById('chat-messages');

    // Remove welcome message if exists
    const welcome = messagesContainer.querySelector('.chat-welcome');
    if (welcome) welcome.remove();

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message chat-message-${role}${isLoading ? ' loading' : ''}`;

    const avatar = document.createElement('div');
    avatar.className = 'chat-avatar';
    avatar.textContent = role === 'user' ? 'U' : 'AI';

    const content_div = document.createElement('div');
    content_div.className = 'chat-message-content';
    content_div.textContent = isLoading ? 'Thinking...' : content;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content_div);
    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    return messageDiv;
}

async function sendChatMessage(event) {
    event.preventDefault();

    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    console.log('sendChatMessage called, message:', message);

    if (!message) return;

    const userId = 1; // Fixed user ID
    const moduleId = document.getElementById('chat-module-select').value;
    const provider = document.getElementById('chat-provider-select').value;

    console.log('Sending chat:', { userId, moduleId, provider, message });

    if (!moduleId) {
        alert('Please select a module first');
        return;
    }

    // Add user message
    addChatMessage('user', message);
    chatMessages.push({ role: 'user', content: message });

    // Clear input
    input.value = '';

    // Show loading indicator
    const loadingMsg = addChatMessage('assistant', '', true);

    // Update status
    const status = document.getElementById('chat-status');
    const originalStatus = status.textContent;
    status.textContent = `Asking ${provider}...`;

    try {
        const response = await fetch(`${API_BASE}/chat/enhanced`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify({
                user_id: parseInt(userId),
                module_id: parseInt(moduleId),
                message: message,
                conversation_id: currentChatConversationId,
                provider: provider
            })
        });

        const data = await response.json();

        console.log('Chat response:', response.status, data);

        if (!response.ok) {
            throw new Error(data.detail || 'Chat request failed');
        }

        // Remove loading indicator
        loadingMsg.remove();

        // Add AI response
        console.log('Adding AI response:', data.reply);
        addChatMessage('assistant', data.reply);
        chatMessages.push({ role: 'assistant', content: data.reply });

        // Update conversation ID
        currentChatConversationId = data.conversation_id;

        // Show memory metrics if available
        if (data.memory_metrics) {
            status.textContent = `${provider} | Context: ${data.memory_metrics.total_chars} chars | Score: ${data.memory_metrics.optimization_score}/100`;
        } else {
            status.textContent = originalStatus;
        }

    } catch (error) {
        loadingMsg.remove();
        addChatMessage('assistant', `Error: ${error.message}`);
        status.textContent = 'Error - please try again';
        console.error('Chat error:', error);
    }
}

// Conversation Functions
let selectedConversationId = null;

async function loadConversations() {
    try {
        const userId = document.getElementById('filter-user')?.value || '';
        const moduleId = document.getElementById('filter-module')?.value || '';

        let url = `${API_BASE}/conversations?limit=100`;
        if (userId) url += `&user_id=${userId}`;
        if (moduleId) url += `&module_id=${moduleId}`;

        const response = await fetch(url, {
            headers: {
                ...getAuthHeaders()
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load conversations');
        }

        const data = await response.json();

        // Update stats
        document.getElementById('conversation-stats').innerHTML =
            `Total: <strong>${data.total}</strong> conversations`;

        // Populate list
        const listContent = document.getElementById('conversations-list-content');

        if (!data.conversations || data.conversations.length === 0) {
            listContent.innerHTML = '<p class="no-data">No conversations found</p>';
            return;
        }

        let html = '';
        data.conversations.forEach(conv => {
            const date = conv.created_at ? new Date(conv.created_at).toLocaleDateString() : 'N/A';
            const time = conv.created_at ? new Date(conv.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';

            html += `
                <div class="conversation-item" onclick="loadConversationDetail(${conv.id})">
                    <div class="conv-title">${conv.title}</div>
                    <div class="conv-meta">
                        <span class="conv-user">${conv.user_name}</span>
                        <span class="conv-module">${conv.module_title}</span>
                    </div>
                    <div class="conv-info">
                        <span class="conv-messages">${conv.message_count} messages</span>
                        <span class="conv-date">${date} ${time}</span>
                    </div>
                    ${conv.finalized ? '<span class="conv-badge finalized">Finalized</span>' : ''}
                    ${conv.current_grade ? `<span class="conv-badge grade">Grade: ${conv.current_grade}</span>` : ''}
                </div>
            `;
        });

        listContent.innerHTML = html;

        // Load filters
        await loadConversationFilters();
    } catch (error) {
        console.error('Error loading conversations:', error);
        document.getElementById('conversations-list-content').innerHTML =
            '<p class="error-message">Failed to load conversations</p>';
    }
}

async function loadConversationFilters() {
    // Load users
    try {
        const usersResponse = await fetch(`${API_BASE}/users`, {
            headers: {
                ...getAuthHeaders()
            }
        });

        if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            const userSelect = document.getElementById('filter-user');
            userSelect.innerHTML = '<option value="">All Users</option>';

            if (usersData.users) {
                usersData.users.forEach(user => {
                    userSelect.innerHTML += `<option value="${user.id}">${user.name} (${user.email})</option>`;
                });
            }
        }
    } catch (error) {
        console.error('Error loading users for filter:', error);
    }

    // Load modules
    try {
        const modulesResponse = await fetch(`${API_BASE}/modules`);
        if (modulesResponse.ok) {
            const modulesData = await modulesResponse.json();
            const moduleSelect = document.getElementById('filter-module');
            moduleSelect.innerHTML = '<option value="">All Modules</option>';

            if (modulesData.modules) {
                modulesData.modules.forEach(module => {
                    moduleSelect.innerHTML += `<option value="${module.id}">${module.title}</option>`;
                });
            }
        }
    } catch (error) {
        console.error('Error loading modules for filter:', error);
    }
}

async function loadConversationDetail(conversationId) {
    selectedConversationId = conversationId;

    // Highlight selected conversation
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('selected');
    });
    event.target.closest('.conversation-item')?.classList.add('selected');

    try {
        const response = await fetch(`${API_BASE}/conversations/${conversationId}`, {
            headers: {
                ...getAuthHeaders()
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load conversation detail');
        }

        const conv = await response.json();

        const detailContent = document.getElementById('conversation-detail-content');

        const date = conv.created_at ? new Date(conv.created_at).toLocaleString() : 'N/A';
        const updated = conv.updated_at ? new Date(conv.updated_at).toLocaleString() : 'N/A';

        let html = `
            <div class="conversation-detail-header">
                <div class="detail-title-section">
                    <h2>${conv.title}</h2>
                    <div class="detail-meta">
                        <span><strong>User:</strong> ${conv.user.name} (${conv.user.email})</span>
                        <span><strong>Module:</strong> ${conv.module.title}</span>
                    </div>
                    <div class="detail-meta">
                        <span><strong>Created:</strong> ${date}</span>
                        <span><strong>Updated:</strong> ${updated}</span>
                    </div>
                    <div class="detail-badges">
                        ${conv.finalized ? '<span class="conv-badge finalized">Finalized</span>' : '<span class="conv-badge active">Active</span>'}
                        ${conv.current_grade ? `<span class="conv-badge grade">Grade: ${conv.current_grade}</span>` : ''}
                    </div>
                </div>
            </div>

            <div class="conversation-messages">
                <h3>Messages (${conv.messages.length})</h3>
        `;

        if (conv.messages && conv.messages.length > 0) {
            conv.messages.forEach((msg, idx) => {
                const roleClass = msg.role === 'user' ? 'message-user' : 'message-assistant';
                const roleName = msg.role === 'user' ? 'Student' : 'AI Tutor';

                html += `
                    <div class="message-bubble ${roleClass}">
                        <div class="message-header">
                            <strong>${roleName}</strong>
                        </div>
                        <div class="message-content">${msg.content}</div>
                    </div>
                `;
            });
        } else {
            html += '<p class="no-data">No messages in this conversation</p>';
        }

        html += '</div>';

        if (conv.memory_summary) {
            html += `
                <div class="memory-summary-section">
                    <h3>Memory Summary</h3>
                    <div class="memory-summary-content">${conv.memory_summary}</div>
                </div>
            `;
        }

        detailContent.innerHTML = html;
    } catch (error) {
        console.error('Error loading conversation detail:', error);
        document.getElementById('conversation-detail-content').innerHTML =
            '<div class="error-message">Failed to load conversation details</div>';
    }
}

// Module Management Functions
let currentModuleId = null;

async function loadModulesList() {
    try {
        const response = await fetch(`${API_BASE}/modules`);
        const data = await response.json();

        const select = document.getElementById('module-select');
        select.innerHTML = '<option value="">Select a module...</option>';

        data.modules.forEach(module => {
            const option = document.createElement('option');
            option.value = module.id;
            option.textContent = `${module.title} (ID: ${module.id})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading modules:', error);
        alert('Failed to load modules');
    }
}

async function loadModuleData() {
    const moduleId = document.getElementById('module-select').value;

    if (!moduleId) {
        document.getElementById('module-editor').style.display = 'none';
        return;
    }

    currentModuleId = moduleId;

    try {
        const response = await fetch(`${API_BASE}/modules/${moduleId}`);
        const module = await response.json();

        // Populate form
        document.getElementById('module-title').value = module.title || '';
        document.getElementById('module-description').value = module.description || '';
        document.getElementById('module-objectives').value = module.learning_objectives || '';
        document.getElementById('module-resources').value = module.resources || '';
        document.getElementById('module-system-prompt').value = module.system_prompt || '';
        document.getElementById('module-module-prompt').value = module.module_prompt || '';
        document.getElementById('module-system-corpus').value = module.system_corpus || '';
        document.getElementById('module-module-corpus').value = module.module_corpus || '';
        document.getElementById('module-dynamic-corpus').value = module.dynamic_corpus || '';
        document.getElementById('module-api-endpoint').value = module.api_endpoint || 'https://api.openai.com/v1/chat/completions';

        document.getElementById('module-editor').style.display = 'block';
    } catch (error) {
        console.error('Error loading module:', error);
        alert('Failed to load module data');
    }
}

async function saveModule(event) {
    event.preventDefault();

    if (!currentModuleId) {
        alert('No module selected');
        return;
    }

    const moduleData = {
        title: document.getElementById('module-title').value,
        description: document.getElementById('module-description').value,
        learning_objectives: document.getElementById('module-objectives').value,
        resources: document.getElementById('module-resources').value,
        system_prompt: document.getElementById('module-system-prompt').value,
        module_prompt: document.getElementById('module-module-prompt').value,
        system_corpus: document.getElementById('module-system-corpus').value,
        module_corpus: document.getElementById('module-module-corpus').value,
        dynamic_corpus: document.getElementById('module-dynamic-corpus').value,
        api_endpoint: document.getElementById('module-api-endpoint').value
    };

    try {
        const response = await fetch(`${API_BASE}/modules/${currentModuleId}/config`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(moduleData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Module saved successfully!');
            loadModulesList();
        } else {
            alert(result.detail || 'Failed to save module');
        }
    } catch (error) {
        console.error('Error saving module:', error);
        alert('Failed to save module');
    }
}

async function createNewModule() {
    const title = prompt('Enter new module title:');
    if (!title) return;

    try {
        const response = await fetch(`${API_BASE}/modules`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify({
                title: title,
                description: '',
                resources: '',
                api_endpoint: 'https://api.openai.com/v1/chat/completions'
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert('Module created successfully!');
            await loadModulesList();
            document.getElementById('module-select').value = result.module.id;
            await loadModuleData();
        } else {
            alert(result.detail || 'Failed to create module');
        }
    } catch (error) {
        console.error('Error creating module:', error);
        alert('Failed to create module');
    }
}

async function deleteModule() {
    if (!currentModuleId) return;

    if (!confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/modules/${currentModuleId}`, {
            method: 'DELETE',
            headers: {
                ...getAuthHeaders()
            }
        });

        const result = await response.json();

        if (response.ok) {
            alert('Module deleted successfully!');
            currentModuleId = null;
            document.getElementById('module-editor').style.display = 'none';
            await loadModulesList();
        } else {
            alert(result.detail || 'Failed to delete module');
        }
    } catch (error) {
        console.error('Error deleting module:', error);
        alert('Failed to delete module');
    }
}

// Handle menu clicks
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));

            // Add active class to clicked item
            item.classList.add('active');

            // Load the section
            const section = item.dataset.section;
            loadSection(section);

            // Load data when section is opened
            if (section === 'modules') {
                setTimeout(loadModulesList, 100);
            } else if (section === 'analytics') {
                setTimeout(() => {
                    loadDashboardAnalytics();
                    loadModulePerformance();
                    loadAnalyticsAlerts();
                }, 100);
            } else if (section === 'conversations') {
                setTimeout(async () => {
                    await loadConversationFilters();
                    await loadConversations();
                }, 100);
            } else if (section === 'corpus') {
                setTimeout(async () => {
                    await loadCorpusTypes();
                    await loadCourseCorpusEntries();
                }, 200);
            } else if (section === 'documents') {
                setTimeout(async () => {
                    await populateDocumentModuleFilters();
                    await loadDocuments();
                }, 200);
            } else if (section === 'memory') {
                setTimeout(async () => {
                    await populateMemoryFilters();
                    await loadMemorySummaries();
                }, 200);
            } else if (section === 'chat') {
                setTimeout(loadChatProviders, 100);
            }
        });
    });

    // Load default section (system)
    loadSection('system');

    // Auto-login for testing
    autoLoginForTesting();
});

// ===== CORPUS FUNCTIONS =====
let currentCorpusTab = 'course';
let selectedCourseCorpusId = null;
let selectedModuleCorpusId = null;
let corpusEntryTypes = [];

// Switch between Course and Module corpus tabs
async function switchCorpusTab(tab) {
    currentCorpusTab = tab;

    // Update tab buttons
    document.querySelectorAll('.corpus-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Show/hide views
    if (tab === 'course') {
        document.getElementById('course-corpus-view').style.display = 'block';
        document.getElementById('module-corpus-view').style.display = 'none';
        loadCourseCorpusEntries();
    } else {
        document.getElementById('course-corpus-view').style.display = 'none';
        document.getElementById('module-corpus-view').style.display = 'block';
        // Load modules when switching to module tab
        await loadCorpusModules();
    }
}

// Load corpus entry types
async function loadCorpusTypes() {
    try {
        const response = await fetch(`${API_BASE}/corpus/types`, {
            headers: {
                ...getAuthHeaders()
            }
        });

        if (response.ok) {
            const data = await response.json();
            corpusEntryTypes = data.types;
        }
    } catch (error) {
        console.error('Error loading corpus types:', error);
    }
}

// Load modules for module corpus selector
async function loadCorpusModules() {
    await loadCorpusTypes();

    try {
        const response = await fetch(`${API_BASE}/modules`);
        if (response.ok) {
            const data = await response.json();
            const select = document.getElementById('corpus-module-select');

            if (select) {
                select.innerHTML = '<option value="">Choose a module...</option>';

                data.modules.forEach(module => {
                    select.innerHTML += `<option value="${module.id}">${module.title}</option>`;
                });
            }
        }
    } catch (error) {
        console.error('Error loading modules:', error);
    }
}

// ===== COURSE CORPUS =====

async function loadCourseCorpusEntries() {
    try {
        const listContainer = document.getElementById('course-corpus-list');
        if (!listContainer) {
            console.error('course-corpus-list element not found - DOM not ready');
            return;
        }

        const response = await fetch(`${API_BASE}/course-corpus`, {
            headers: {
                ...getAuthHeaders()
            }
        });

        if (!response.ok) throw new Error('Failed to load course corpus');

        const data = await response.json();

        if (!data.entries || data.entries.length === 0) {
            listContainer.innerHTML = '<p class="no-data">No course corpus entries yet</p>';
            return;
        }

        let html = '';
        data.entries.forEach(entry => {
            html += `
                <div class="corpus-item ${selectedCourseCorpusId === entry.id ? 'selected' : ''}"
                     data-entry-id="${entry.id}"
                     onclick="selectCourseCorpusEntry(${entry.id}, event)">
                    <div class="corpus-item-header">
                        <strong>${entry.title}</strong>
                        <span class="corpus-type-badge">${entry.type}</span>
                    </div>
                    <div class="corpus-item-preview">${entry.content.substring(0, 100)}...</div>
                </div>
            `;
        });

        listContainer.innerHTML = html;

    } catch (error) {
        console.error('Error loading course corpus:', error);
        const listContainer = document.getElementById('course-corpus-list');
        if (listContainer) {
            listContainer.innerHTML = '<p class="error-message">Failed to load corpus entries</p>';
        }
    }
}

async function selectCourseCorpusEntry(entryId, clickEvent = null) {
    selectedCourseCorpusId = entryId;

    // Update selection in list
    document.querySelectorAll('#course-corpus-list .corpus-item').forEach(item => {
        item.classList.remove('selected');
    });

    // If called from a click event, highlight the clicked item
    if (clickEvent && clickEvent.target) {
        clickEvent.target.closest('.corpus-item').classList.add('selected');
    } else {
        // Otherwise, find and highlight by ID
        document.querySelectorAll('#course-corpus-list .corpus-item').forEach(item => {
            if (item.getAttribute('data-entry-id') == entryId) {
                item.classList.add('selected');
            }
        });
    }

    // Load entry data
    try {
        const response = await fetch(`${API_BASE}/course-corpus`, {
            headers: {
                ...getAuthHeaders()
            }
        });

        if (!response.ok) throw new Error('Failed to load entry');

        const data = await response.json();
        const entry = data.entries.find(e => e.id === entryId);

        if (!entry) throw new Error('Entry not found');

        showCourseCorpusForm(entry);

    } catch (error) {
        console.error('Error loading entry:', error);
    }
}

function showCourseCorpusForm(entry = null) {
    const formContainer = document.getElementById('course-corpus-form');

    const isNew = !entry;
    const title = entry ? entry.title : '';
    const content = entry ? entry.content : '';
    const type = entry ? entry.type : 'theory';
    const orderIndex = entry ? entry.order_index : 0;

    let typeOptions = '';
    corpusEntryTypes.forEach(t => {
        typeOptions += `<option value="${t.value}" ${type === t.value ? 'selected' : ''}>${t.label}</option>`;
    });

    formContainer.innerHTML = `
        <div class="corpus-form">
            <h3>${isNew ? 'New' : 'Edit'} Course Corpus Entry</h3>

            <div class="form-group">
                <label>Title</label>
                <input type="text" id="course-corpus-title" value="${title}" placeholder="Entry title...">
            </div>

            <div class="form-group">
                <label>Type</label>
                <select id="course-corpus-type">
                    ${typeOptions}
                </select>
            </div>

            <div class="form-group">
                <label>Order Index</label>
                <input type="number" id="course-corpus-order" value="${orderIndex}" min="0">
            </div>

            <div class="form-group">
                <label>Content</label>
                <textarea id="course-corpus-content" rows="15" placeholder="Entry content...">${content}</textarea>
            </div>

            <div class="form-actions">
                <button class="save-btn" onclick="saveCourseCorpusEntry(${isNew ? 'null' : entry.id})">
                    ${isNew ? 'Create' : 'Update'} Entry
                </button>
                ${!isNew ? `<button class="delete-btn" onclick="deleteCourseCorpusEntry(${entry.id})">Delete</button>` : ''}
                <button class="cancel-btn" onclick="cancelCourseCorpusForm()">Cancel</button>
            </div>
        </div>
    `;
}

function createNewCourseEntry() {
    selectedCourseCorpusId = null;
    document.querySelectorAll('#course-corpus-list .corpus-item').forEach(item => {
        item.classList.remove('selected');
    });
    showCourseCorpusForm();
}

async function saveCourseCorpusEntry(entryId) {
    const title = document.getElementById('course-corpus-title').value;
    const type = document.getElementById('course-corpus-type').value;
    const orderIndex = parseInt(document.getElementById('course-corpus-order').value);
    const content = document.getElementById('course-corpus-content').value;

    if (!title || !content) {
        alert('Title and content are required');
        return;
    }

    const data = { title, type, order_index: orderIndex, content };

    try {
        const url = entryId ? `${API_BASE}/course-corpus/${entryId}` : `${API_BASE}/course-corpus`;
        const method = entryId ? 'PUT' : 'POST';

        console.log('Saving corpus entry:', { url, method, data, hasAuth: !!authToken });

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(data)
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Save failed:', errorData);
            throw new Error('Failed to save entry');
        }

        await loadCourseCorpusEntries();

        const result = await response.json();
        selectedCourseCorpusId = result.id;
        await selectCourseCorpusEntry(result.id);

    } catch (error) {
        console.error('Error saving entry:', error);
        alert('Failed to save entry');
    }
}

async function deleteCourseCorpusEntry(entryId) {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
        const response = await fetch(`${API_BASE}/course-corpus/${entryId}`, {
            method: 'DELETE',
            headers: {
                ...getAuthHeaders()
            }
        });

        if (!response.ok) throw new Error('Failed to delete entry');

        selectedCourseCorpusId = null;
        cancelCourseCorpusForm();
        await loadCourseCorpusEntries();

    } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Failed to delete entry');
    }
}

function cancelCourseCorpusForm() {
    document.getElementById('course-corpus-form').innerHTML = `
        <div class="empty-state">
            <h3>No Entry Selected</h3>
            <p>Select an entry to edit or create a new one</p>
        </div>
    `;
}

// ===== MODULE CORPUS =====

async function loadModuleCorpusEntries() {
    const moduleId = document.getElementById('corpus-module-select').value;

    if (!moduleId) {
        document.getElementById('module-corpus-content').style.display = 'none';
        return;
    }

    document.getElementById('module-corpus-content').style.display = 'block';

    try {
        const response = await fetch(`${API_BASE}/modules/${moduleId}/corpus`, {
            headers: {
                ...getAuthHeaders()
            }
        });

        if (!response.ok) throw new Error('Failed to load module corpus');

        const data = await response.json();
        const listContainer = document.getElementById('module-corpus-list');

        if (!data.entries || data.entries.length === 0) {
            listContainer.innerHTML = '<p class="no-data">No module corpus entries yet</p>';
            return;
        }

        let html = '';
        data.entries.forEach(entry => {
            html += `
                <div class="corpus-item ${selectedModuleCorpusId === entry.id ? 'selected' : ''}"
                     data-entry-id="${entry.id}"
                     onclick="selectModuleCorpusEntry(${entry.id}, event)">
                    <div class="corpus-item-header">
                        <strong>${entry.title}</strong>
                        <span class="corpus-type-badge">${entry.type}</span>
                    </div>
                    <div class="corpus-item-preview">${entry.content.substring(0, 100)}...</div>
                </div>
            `;
        });

        listContainer.innerHTML = html;

    } catch (error) {
        console.error('Error loading module corpus:', error);
        document.getElementById('module-corpus-list').innerHTML =
            '<p class="error-message">Failed to load corpus entries</p>';
    }
}

async function selectModuleCorpusEntry(entryId, clickEvent = null) {
    selectedModuleCorpusId = entryId;

    // Update selection in list
    document.querySelectorAll('#module-corpus-list .corpus-item').forEach(item => {
        item.classList.remove('selected');
    });

    // If called from a click event, highlight the clicked item
    if (clickEvent && clickEvent.target) {
        clickEvent.target.closest('.corpus-item').classList.add('selected');
    } else {
        // Otherwise, find and highlight by ID
        document.querySelectorAll('#module-corpus-list .corpus-item').forEach(item => {
            if (item.getAttribute('data-entry-id') == entryId) {
                item.classList.add('selected');
            }
        });
    }

    const moduleId = document.getElementById('corpus-module-select').value;

    // Load entry data
    try {
        const response = await fetch(`${API_BASE}/modules/${moduleId}/corpus`, {
            headers: {
                ...getAuthHeaders()
            }
        });

        if (!response.ok) throw new Error('Failed to load entry');

        const data = await response.json();
        const entry = data.entries.find(e => e.id === entryId);

        if (!entry) throw new Error('Entry not found');

        showModuleCorpusForm(entry);

    } catch (error) {
        console.error('Error loading entry:', error);
    }
}

function showModuleCorpusForm(entry = null) {
    const formContainer = document.getElementById('module-corpus-form');

    const isNew = !entry;
    const title = entry ? entry.title : '';
    const content = entry ? entry.content : '';
    const type = entry ? entry.type : 'theory';
    const orderIndex = entry ? entry.order_index : 0;

    let typeOptions = '';
    corpusEntryTypes.forEach(t => {
        typeOptions += `<option value="${t.value}" ${type === t.value ? 'selected' : ''}>${t.label}</option>`;
    });

    formContainer.innerHTML = `
        <div class="corpus-form">
            <h3>${isNew ? 'New' : 'Edit'} Module Corpus Entry</h3>

            <div class="form-group">
                <label>Title</label>
                <input type="text" id="module-corpus-form-title" value="${title}" placeholder="Entry title...">
            </div>

            <div class="form-group">
                <label>Type</label>
                <select id="module-corpus-form-type">
                    ${typeOptions}
                </select>
            </div>

            <div class="form-group">
                <label>Order Index</label>
                <input type="number" id="module-corpus-form-order" value="${orderIndex}" min="0">
            </div>

            <div class="form-group">
                <label>Content</label>
                <textarea id="module-corpus-form-content" rows="15" placeholder="Entry content...">${content}</textarea>
            </div>

            <div class="form-actions">
                <button class="save-btn" onclick="saveModuleCorpusEntry(${isNew ? 'null' : entry.id})">
                    ${isNew ? 'Create' : 'Update'} Entry
                </button>
                ${!isNew ? `<button class="delete-btn" onclick="deleteModuleCorpusEntry(${entry.id})">Delete</button>` : ''}
                <button class="cancel-btn" onclick="cancelModuleCorpusForm()">Cancel</button>
            </div>
        </div>
    `;
}

function createNewModuleEntry() {
    const moduleId = document.getElementById('corpus-module-select').value;
    if (!moduleId) {
        alert('Please select a module first');
        return;
    }

    selectedModuleCorpusId = null;
    document.querySelectorAll('#module-corpus-list .corpus-item').forEach(item => {
        item.classList.remove('selected');
    });
    showModuleCorpusForm();
}

async function saveModuleCorpusEntry(entryId) {
    const moduleId = document.getElementById('corpus-module-select').value;

    const title = document.getElementById('module-corpus-form-title')?.value;
    const type = document.getElementById('module-corpus-form-type')?.value;
    const orderIndex = parseInt(document.getElementById('module-corpus-form-order')?.value || 0);
    const content = document.getElementById('module-corpus-form-content')?.value;

    if (!title || !content) {
        alert('Title and content are required');
        return;
    }

    const data = { title, type, order_index: orderIndex, content };

    try {
        const url = entryId ? `${API_BASE}/module-corpus/${entryId}` : `${API_BASE}/modules/${moduleId}/corpus`;
        const method = entryId ? 'PUT' : 'POST';

        console.log('Saving module corpus entry:', { url, method, data, hasAuth: !!authToken });

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(data)
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Save failed:', errorData);
            throw new Error('Failed to save entry');
        }

        const result = await response.json();
        console.log('Save result:', result);

        await loadModuleCorpusEntries();

        selectedModuleCorpusId = result.id;
        console.log('Selecting entry:', result.id);
        await selectModuleCorpusEntry(result.id);

        console.log('Module corpus entry saved successfully!');

    } catch (error) {
        console.error('Error saving module corpus entry:', error);
        alert('Failed to save entry: ' + error.message);
    }
}

async function deleteModuleCorpusEntry(entryId) {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
        const response = await fetch(`${API_BASE}/module-corpus/${entryId}`, {
            method: 'DELETE',
            headers: {
                ...getAuthHeaders()
            }
        });

        if (!response.ok) throw new Error('Failed to delete entry');

        selectedModuleCorpusId = null;
        cancelModuleCorpusForm();
        await loadModuleCorpusEntries();

    } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Failed to delete entry');
    }
}

function cancelModuleCorpusForm() {
    document.getElementById('module-corpus-form').innerHTML = `
        <div class="empty-state">
            <h3>No Entry Selected</h3>
            <p>Select an entry to edit or create a new one</p>
        </div>
    `;
}

// ===== DOCUMENTS =====

let selectedDocumentId = null;

async function populateDocumentModuleFilters() {
    const filterSelect = document.getElementById('doc-module-filter');

    if (window.modulesData && filterSelect) {
        filterSelect.innerHTML = '<option value="">All Modules</option>' +
            window.modulesData.map(m => `<option value="${m.id}">${m.title}</option>`).join('');
    }
}

async function loadDocuments() {
    const moduleFilter = document.getElementById('doc-module-filter')?.value;
    const url = moduleFilter ? `${API_BASE}/documents?module_id=${moduleFilter}` : `${API_BASE}/documents`;

    try {
        const response = await fetch(url, {
            headers: {
                ...getAuthHeaders()
            }
        });

        if (!response.ok) throw new Error('Failed to load documents');

        const data = await response.json();
        const listContainer = document.getElementById('documents-list-content');
        const countElement = document.getElementById('doc-count');

        if (!data.documents || data.documents.length === 0) {
            listContainer.innerHTML = '<p class="no-data">No documents uploaded yet</p>';
            countElement.textContent = '0 files';
            return;
        }

        countElement.textContent = `${data.documents.length} file${data.documents.length !== 1 ? 's' : ''}`;

        listContainer.innerHTML = data.documents.map(doc => {
            const moduleBadge = doc.module_id ? `<span class="module-badge">Module ${doc.module_id}</span>` : '<span class="course-badge">Course</span>';
            const sizeKB = (doc.content_length / 1024).toFixed(1);
            return `
                <div class="document-item" data-doc-id="${doc.id}" onclick="selectDocument(${doc.id}, event)">
                    <div class="doc-info">
                        <div class="doc-name">${doc.filename}</div>
                        <div class="doc-meta">
                            ${moduleBadge}
                            <span class="doc-size">${sizeKB} KB</span>
                            <span class="doc-date">${new Date(doc.uploaded_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error loading documents:', error);
        document.getElementById('documents-list-content').innerHTML = '<p class="error">Failed to load documents</p>';
    }
}

async function selectDocument(docId, clickEvent = null) {
    // Update selection UI
    document.querySelectorAll('#documents-list-content .document-item').forEach(item => {
        item.classList.remove('selected');
    });

    if (clickEvent && clickEvent.target) {
        clickEvent.target.closest('.document-item').classList.add('selected');
    } else {
        document.querySelectorAll('#documents-list-content .document-item').forEach(item => {
            if (item.getAttribute('data-doc-id') == docId) {
                item.classList.add('selected');
            }
        });
    }

    selectedDocumentId = docId;

    // Load full document content
    try {
        const response = await fetch(`${API_BASE}/documents/${docId}`, {
            headers: {
                ...getAuthHeaders()
            }
        });

        if (!response.ok) throw new Error('Failed to load document');

        const doc = await response.json();
        showDocumentViewer(doc);

    } catch (error) {
        console.error('Error loading document:', error);
        alert('Failed to load document');
    }
}

function showDocumentViewer(doc) {
    const viewerContainer = document.getElementById('document-viewer');
    const moduleBadge = doc.module_id ? `<span class="module-badge">Module ${doc.module_id}</span>` : '<span class="course-badge">Course</span>';

    // Check if it's a PDF
    const isPDF = doc.filename.toLowerCase().endsWith('.pdf');
    const isMarkdown = doc.filename.toLowerCase().endsWith('.md');

    let contentHTML = '';

    if (isPDF) {
        // For PDFs, we'll load it via fetch and render with blob URL
        contentHTML = `<canvas id="pdf-canvas" class="pdf-canvas"></canvas>`;

        // Load and render PDF after setting the HTML
        setTimeout(() => renderPDF(doc.id), 100);
    } else if (isMarkdown) {
        // For markdown, show formatted preview
        contentHTML = `<div class="markdown-viewer">${escapeHtml(doc.content)}</div>`;
    } else {
        // For text files, show in textarea
        contentHTML = `<textarea readonly>${doc.content}</textarea>`;
    }

    viewerContainer.innerHTML = `
        <div class="document-content">
            <div class="doc-header">
                <h3>${doc.filename}</h3>
                ${moduleBadge}
            </div>
            <div class="doc-meta-bar">
                <span>Uploaded: ${new Date(doc.uploaded_at).toLocaleDateString()}</span>
                <span>${(doc.content.length / 1024).toFixed(1)} KB</span>
            </div>
            <div class="doc-viewer">
                ${contentHTML}
            </div>
            <div class="doc-actions">
                <button class="export-btn" onclick="exportDocument(${doc.id}, 'txt')">Export as .txt</button>
                <button class="export-btn" onclick="exportDocument(${doc.id}, 'md')">Export as .md</button>
                ${isPDF ? '<button class="export-btn" onclick="exportDocument(' + doc.id + ', \'pdf\')">Download PDF</button>' : ''}
                <button class="delete-btn" onclick="deleteDocument(${doc.id})">Delete</button>
            </div>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function renderPDF(docId) {
    try {
        // Fetch PDF with auth
        const response = await fetch(`${API_BASE}/documents/${docId}/pdf`, {
            headers: {
                ...getAuthHeaders()
            }
        });

        if (!response.ok) throw new Error('Failed to load PDF');

        // Get PDF as blob
        const pdfBlob = await response.blob();
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Use PDF.js to render
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        // Get first page
        const page = await pdf.getPage(1);
        const canvas = document.getElementById('pdf-canvas');
        const context = canvas.getContext('2d');

        // Calculate scale to fit container
        const container = canvas.parentElement;
        const viewport = page.getViewport({ scale: 1.0 });
        const scale = Math.min(
            container.clientWidth / viewport.width,
            container.clientHeight / viewport.height
        ) * 0.95;

        const scaledViewport = page.getViewport({ scale: scale });

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        // Render PDF page
        await page.render({
            canvasContext: context,
            viewport: scaledViewport
        }).promise;

        // Clean up blob URL
        URL.revokeObjectURL(pdfUrl);

    } catch (error) {
        console.error('Error rendering PDF:', error);
        const canvas = document.getElementById('pdf-canvas');
        if (canvas) {
            canvas.parentElement.innerHTML = `
                <div class="pdf-error">
                    <p>Failed to render PDF</p>
                    <p class="help-text">${error.message}</p>
                </div>
            `;
        }
    }
}

function openUploadDialog() {
    document.getElementById('upload-modal').style.display = 'flex';

    // Populate module dropdown
    const select = document.getElementById('upload-module-select');
    if (window.modulesData) {
        select.innerHTML = '<option value="">No Module (Course-level)</option>' +
            window.modulesData.map(m => `<option value="${m.id}">${m.title}</option>`).join('');
    }
}

function closeUploadDialog() {
    document.getElementById('upload-modal').style.display = 'none';
    document.getElementById('upload-file-input').value = '';
}

async function uploadDocument() {
    const fileInput = document.getElementById('upload-file-input');
    const moduleId = document.getElementById('upload-module-select').value;

    if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please select a file');
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    if (moduleId) {
        formData.append('module_id', moduleId);
    }

    try {
        const response = await fetch(`${API_BASE}/documents/upload`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders()
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Upload failed');
        }

        const result = await response.json();
        alert(`Document uploaded successfully: ${result.filename}`);
        closeUploadDialog();
        await loadDocuments();

    } catch (error) {
        console.error('Error uploading document:', error);
        alert('Failed to upload document: ' + error.message);
    }
}

async function deleteDocument(docId) {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
        const response = await fetch(`${API_BASE}/documents/${docId}`, {
            method: 'DELETE',
            headers: {
                ...getAuthHeaders()
            }
        });

        if (!response.ok) throw new Error('Failed to delete document');

        alert('Document deleted successfully');
        selectedDocumentId = null;
        document.getElementById('document-viewer').innerHTML = `
            <div class="empty-state">
                <h3>No Document Selected</h3>
                <p>Select a document to view its content</p>
            </div>
        `;
        await loadDocuments();

    } catch (error) {
        console.error('Error deleting document:', error);
        alert('Failed to delete document');
    }
}

async function exportDocument(docId, format) {
    try {
        const response = await fetch(`${API_BASE}/documents/${docId}`, {
            headers: {
                ...getAuthHeaders()
            }
        });

        if (!response.ok) throw new Error('Failed to load document');

        const doc = await response.json();
        const filename = doc.filename.replace(/\.[^/.]+$/, "") + `.${format}`;
        const blob = new Blob([doc.content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error exporting document:', error);
        alert('Failed to export document');
    }
}

async function exportAllDocuments() {
    const moduleFilter = document.getElementById('doc-module-filter')?.value;
    const url = moduleFilter ? `${API_BASE}/documents?module_id=${moduleFilter}` : `${API_BASE}/documents`;

    try {
        const response = await fetch(url, {
            headers: {
                ...getAuthHeaders()
            }
        });

        if (!response.ok) throw new Error('Failed to load documents');

        const data = await response.json();

        if (!data.documents || data.documents.length === 0) {
            alert('No documents to export');
            return;
        }

        // Fetch full content for all documents
        const fullDocs = await Promise.all(
            data.documents.map(async doc => {
                const res = await fetch(`${API_BASE}/documents/${doc.id}`, {
                    headers: {
                        ...getAuthHeaders()
                    }
                });
                return res.json();
            })
        );

        // Combine all documents into one text file (skip PDFs)
        const combined = fullDocs
            .filter(doc => !doc.content.startsWith('[PDF_BASE64]'))
            .map(doc =>
                `${'='.repeat(80)}\n` +
                `FILE: ${doc.filename}\n` +
                `MODULE: ${doc.module_id || 'Course-level'}\n` +
                `UPLOADED: ${new Date(doc.uploaded_at).toLocaleString()}\n` +
                `${'='.repeat(80)}\n\n` +
                `${doc.content}\n\n`
            ).join('\n');

        if (!combined) {
            alert('No text documents to export (PDFs are skipped in bulk export)');
            return;
        }

        const blob = new Blob([combined], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `all_documents_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error exporting all documents:', error);
        alert('Failed to export documents');
    }
}

// ===== MEMORY =====

async function populateMemoryFilters() {
    const userFilter = document.getElementById('memory-user-filter');
    const moduleFilter = document.getElementById('memory-module-filter');

    // Populate users
    try {
        const response = await fetch(`${API_BASE}/users`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        if (response.ok) {
            const data = await response.json();
            if (userFilter && data.users) {
                userFilter.innerHTML = '<option value="">All Users</option>' +
                    data.users.map(u => `<option value="${u.id}">${u.name} (${u.email})</option>`).join('');
            }
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }

    // Populate modules
    if (moduleFilter && window.modulesData) {
        moduleFilter.innerHTML = '<option value="">All Modules</option>' +
            window.modulesData.map(m => `<option value="${m.id}">${m.title}</option>`).join('');
    }
}

// ===== 4-LAYER MEMORY DASHBOARD FUNCTIONS =====

async function loadMemoryDashboard() {
    // Load all layer data in parallel
    await Promise.all([
        loadLayer1Data(),
        loadLayer2Data(),
        loadLayer3Data(),
        loadLayer4Data()
    ]);

    // Load assembly flow
    loadMemoryAssemblyFlow();
}

async function loadLayer1Data() {
    try {
        const response = await fetch(`${API_BASE}/users`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to load students');
        const users = await response.json();

        // Get onboarding surveys
        const surveysResponse = await fetch(`${API_BASE}/progress/tables/all`, {
            headers: getAuthHeaders()
        });
        const tablesData = await surveysResponse.json();
        const surveys = tablesData.tables?.onboarding_surveys?.data || [];

        const totalStudents = users.length;
        const completedProfiles = surveys.length;

        document.getElementById('layer1-students').textContent = totalStudents;
        document.getElementById('layer1-complete').textContent = completedProfiles;
        document.getElementById('layer1-status').textContent =
            `${completedProfiles}/${totalStudents} complete`;

    } catch (error) {
        console.error('Error loading Layer 1:', error);
        document.getElementById('layer1-status').textContent = 'Error loading';
    }
}

async function loadLayer2Data() {
    try {
        const response = await fetch(`${API_BASE}/classes`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to load classes');
        const classes = await response.json();

        // Get class corpus
        const corpusResponse = await fetch(`${API_BASE}/course-corpus`, {
            headers: getAuthHeaders()
        });
        const corpusData = await corpusResponse.json();
        const corpusEntries = corpusData.entries || [];

        document.getElementById('layer2-classes').textContent = classes.length;
        document.getElementById('layer2-corpus').textContent = corpusEntries.length;
        document.getElementById('layer2-status').textContent =
            `${classes.length} classes, ${corpusEntries.length} corpus`;

    } catch (error) {
        console.error('Error loading Layer 2:', error);
        document.getElementById('layer2-status').textContent = 'Error loading';
    }
}

async function loadLayer3Data() {
    try {
        const response = await fetch(`${API_BASE}/modules`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to load modules');
        const modules = await response.json();

        // Get all module corpus and documents count
        const tablesResponse = await fetch(`${API_BASE}/progress/tables/all`, {
            headers: getAuthHeaders()
        });
        const tablesData = await tablesResponse.json();
        const moduleCorpus = tablesData.tables?.module_corpus_entries?.count || 0;
        const documents = tablesData.tables?.documents?.count || 0;

        document.getElementById('layer3-modules').textContent = modules.length;
        document.getElementById('layer3-resources').textContent = `${moduleCorpus + documents}`;
        document.getElementById('layer3-status').textContent =
            `${modules.length} modules, ${moduleCorpus + documents} resources`;

    } catch (error) {
        console.error('Error loading Layer 3:', error);
        document.getElementById('layer3-status').textContent = 'Error loading';
    }
}

async function loadLayer4Data() {
    try {
        const tablesResponse = await fetch(`${API_BASE}/progress/tables/all`, {
            headers: getAuthHeaders()
        });
        const tablesData = await tablesResponse.json();

        const conversations = tablesData.tables?.conversations?.count || 0;
        const summaries = tablesData.tables?.memory_summaries?.count || 0;

        document.getElementById('layer4-conversations').textContent = conversations;
        document.getElementById('layer4-summaries').textContent = summaries;
        document.getElementById('layer4-status').textContent =
            `${conversations} chats, ${summaries} summaries`;

    } catch (error) {
        console.error('Error loading Layer 4:', error);
        document.getElementById('layer4-status').textContent = 'Error loading';
    }
}

async function expandLayer(layerNum) {
    const detailsDiv = document.getElementById('layer-details');
    detailsDiv.style.display = 'block';
    detailsDiv.innerHTML = '<div style="text-align: center; padding: 40px;">Loading data...</div>';

    const layerInfo = {
        1: {
            title: 'Layer 1: Student Profile Data',
            description: 'Foundation layer built from student onboarding',
            adminAction: 'Configure onboarding questions',
            studentAction: 'Complete onboarding survey'
        },
        2: {
            title: 'Layer 2: Class Architecture',
            description: 'Course-level knowledge built by admin',
            adminAction: 'Create classes, add class corpus entries',
            studentAction: 'Context automatically injected for enrolled classes'
        },
        3: {
            title: 'Layer 3: Module Context',
            description: 'Topic-specific resources built by admin',
            adminAction: 'Create modules, add module corpus, upload documents',
            studentAction: 'Context automatically loaded when chatting in module'
        },
        4: {
            title: 'Layer 4: Conversation Memory',
            description: 'Dynamic learning accumulated from student interactions',
            adminAction: 'Monitor learning progress and memory formation',
            studentAction: 'Chat with AI tutor - memories auto-generated after conversations'
        }
    };

    const info = layerInfo[layerNum];

    // Fetch real data
    try {
        const tablesResponse = await fetch(`${API_BASE}/progress/tables/all`, {
            headers: getAuthHeaders()
        });
        const tablesData = await tablesResponse.json();

        let tablesHTML = '';

        if (layerNum === 1) {
            // Layer 1: Users and Onboarding Surveys
            const users = tablesData.tables?.users?.data || [];
            const surveys = tablesData.tables?.onboarding_surveys?.data || [];

            tablesHTML = `
                <h4 style="margin: 20px 0 10px 0; color: var(--sage-darkest);">Users Table (${users.length} records)</h4>
                ${createLayerTable(users, [
                    { key: 'id', label: 'ID' },
                    { key: 'email', label: 'Email' },
                    { key: 'name', label: 'Name' },
                    { key: 'is_admin', label: 'Admin', format: (val) => val ? 'Yes' : 'No' }
                ])}

                <h4 style="margin: 30px 0 10px 0; color: var(--sage-darkest);">Onboarding Surveys (${surveys.length} records)</h4>
                ${createLayerTable(surveys, [
                    { key: 'id', label: 'ID' },
                    { key: 'user_id', label: 'User ID' },
                    { key: 'familiarity', label: 'Familiarity' },
                    { key: 'learning_style', label: 'Learning Style' },
                    { key: 'goals', label: 'Goals' }
                ])}
            `;
        } else if (layerNum === 2) {
            // Layer 2: Classes and Class Corpus
            const corpusResponse = await fetch(`${API_BASE}/course-corpus`, { headers: getAuthHeaders() });
            const corpusData = await corpusResponse.json();
            const corpus = corpusData.entries || [];

            const classesResponse = await fetch(`${API_BASE}/classes`, { headers: getAuthHeaders() });
            const classes = await classesResponse.json();

            tablesHTML = `
                <h4 style="margin: 20px 0 10px 0; color: var(--sage-darkest);">Classes Table (${classes.length} records)</h4>
                ${createLayerTable(classes, [
                    { key: 'id', label: 'ID' },
                    { key: 'title', label: 'Title' },
                    { key: 'description', label: 'Description' },
                    { key: 'system_prompt', label: 'System Prompt' }
                ])}

                <h4 style="margin: 30px 0 10px 0; color: var(--sage-darkest);">Class Corpus (${corpus.length} records)</h4>
                ${createLayerTable(corpus, [
                    { key: 'id', label: 'ID' },
                    { key: 'title', label: 'Title' },
                    { key: 'type', label: 'Type' },
                    { key: 'content', label: 'Content (truncated)', format: (val) => val?.substring(0, 100) + '...' }
                ])}
            `;
        } else if (layerNum === 3) {
            // Layer 3: Modules, Module Corpus, Documents
            const modulesResponse = await fetch(`${API_BASE}/modules`, { headers: getAuthHeaders() });
            const modules = await modulesResponse.json();

            const moduleCorpus = tablesData.tables?.module_corpus_entries?.data || [];
            const documents = tablesData.tables?.documents?.data || [];

            tablesHTML = `
                <h4 style="margin: 20px 0 10px 0; color: var(--sage-darkest);">Modules Table (${modules.length} records)</h4>
                ${createLayerTable(modules, [
                    { key: 'id', label: 'ID' },
                    { key: 'title', label: 'Title' },
                    { key: 'description', label: 'Description' },
                    { key: 'learning_objectives', label: 'Objectives' }
                ])}

                <h4 style="margin: 30px 0 10px 0; color: var(--sage-darkest);">Module Corpus Entries (${moduleCorpus.length} records)</h4>
                ${createLayerTable(moduleCorpus, [
                    { key: 'id', label: 'ID' },
                    { key: 'module_id', label: 'Module ID' },
                    { key: 'title', label: 'Title' },
                    { key: 'type', label: 'Type' },
                    { key: 'content_length', label: 'Size (chars)' }
                ])}

                <h4 style="margin: 30px 0 10px 0; color: var(--sage-darkest);">Documents (${documents.length} records)</h4>
                ${createLayerTable(documents, [
                    { key: 'id', label: 'ID' },
                    { key: 'module_id', label: 'Module ID' },
                    { key: 'filename', label: 'Filename' },
                    { key: 'content_length', label: 'Size (chars)' }
                ])}
            `;
        } else if (layerNum === 4) {
            // Layer 4: Conversations and Memory Summaries
            const conversations = tablesData.tables?.conversations?.data || [];
            const memories = tablesData.tables?.memory_summaries?.data || [];

            tablesHTML = `
                <h4 style="margin: 20px 0 10px 0; color: var(--sage-darkest);">Conversations (${conversations.length} records)</h4>
                ${createLayerTable(conversations, [
                    { key: 'id', label: 'ID' },
                    { key: 'user_id', label: 'User ID' },
                    { key: 'module_id', label: 'Module ID' },
                    { key: 'title', label: 'Title' },
                    { key: 'message_count', label: 'Messages' },
                    { key: 'finalized', label: 'Finalized', format: (val) => val ? 'Yes' : 'No' }
                ])}

                <h4 style="margin: 30px 0 10px 0; color: var(--sage-darkest);">Memory Summaries (${memories.length} records)</h4>
                ${createLayerTable(memories, [
                    { key: 'id', label: 'ID' },
                    { key: 'user_id', label: 'User ID' },
                    { key: 'module_id', label: 'Module ID' },
                    { key: 'what_learned', label: 'What Learned' },
                    { key: 'understanding_level', label: 'Level' }
                ])}
            `;
        }

        detailsDiv.innerHTML = `
            <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                    <div>
                        <h3 style="margin: 0 0 10px 0; color: var(--sage-darkest);">${info.title}</h3>
                        <p style="margin: 0; color: var(--text-medium);">${info.description}</p>
                    </div>
                    <button onclick="document.getElementById('layer-details').style.display='none'" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-medium);">×</button>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div style="background: var(--sage-lighter); padding: 20px; border-radius: 8px;">
                        <h4 style="margin: 0 0 10px 0; color: var(--sage-darkest);">👨‍💼 Admin Role</h4>
                        <p style="margin: 0; color: var(--text-dark);">${info.adminAction}</p>
                    </div>
                    <div style="background: var(--warm-light); padding: 20px; border-radius: 8px;">
                        <h4 style="margin: 0 0 10px 0; color: var(--sage-darkest);">👨‍🎓 Student Role</h4>
                        <p style="margin: 0; color: var(--text-dark);">${info.studentAction}</p>
                    </div>
                </div>

                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                    <h4 style="margin: 0 0 15px 0; color: var(--sage-darkest);">📊 Real Database Records</h4>
                    ${tablesHTML}
                </div>
            </div>
        `;

    } catch (error) {
        console.error('Error loading layer data:', error);
        detailsDiv.innerHTML = `
            <div style="background: white; border-radius: 12px; padding: 30px;">
                <div style="color: #e74c3c;">Error loading data: ${error.message}</div>
                <button onclick="document.getElementById('layer-details').style.display='none'" style="margin-top: 20px;">Close</button>
            </div>
        `;
    }
}

function createLayerTable(data, columns) {
    if (data.length === 0) {
        return '<p style="color: var(--text-medium); font-style: italic;">No records</p>';
    }

    let html = '<div style="overflow-x: auto; margin-top: 10px;"><table style="width: 100%; border-collapse: collapse;">';
    html += '<thead><tr style="background: var(--sage-lighter);">';
    columns.forEach(col => {
        html += `<th style="padding: 10px; text-align: left; border-bottom: 2px solid var(--sage-light);">${col.label}</th>`;
    });
    html += '</tr></thead><tbody>';

    data.slice(0, 10).forEach(row => {  // Limit to 10 rows
        html += '<tr style="border-bottom: 1px solid #eee;">';
        columns.forEach(col => {
            let value = row[col.key];
            if (col.format) {
                value = col.format(value);
            }
            if (value === null || value === undefined) {
                value = '-';
            }
            // Truncate long values
            if (typeof value === 'string' && value.length > 100) {
                value = value.substring(0, 100) + '...';
            }
            html += `<td style="padding: 10px;">${value}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    if (data.length > 10) {
        html += `<p style="margin-top: 10px; color: var(--text-medium); font-style: italic;">Showing first 10 of ${data.length} records</p>`;
    }
    return html;
}

function loadMemoryAssemblyFlow() {
    const flowDiv = document.getElementById('memory-assembly-flow');

    flowDiv.innerHTML = `
        <div style="position: relative;">
            <p style="color: var(--text-medium); margin-bottom: 20px;">
                When a student sends a message in a chat, the system assembles a personalized context by combining all 4 layers:
            </p>

            <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold;">Layer 1</div>
                    <div style="margin-top: 5px; opacity: 0.9;">Student Profile</div>
                </div>

                <div style="font-size: 30px; color: var(--text-medium);">+</div>

                <div style="flex: 1; min-width: 200px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold;">Layer 2</div>
                    <div style="margin-top: 5px; opacity: 0.9;">Class Architecture</div>
                </div>

                <div style="font-size: 30px; color: var(--text-medium);">+</div>

                <div style="flex: 1; min-width: 200px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold;">Layer 3</div>
                    <div style="margin-top: 5px; opacity: 0.9;">Module Context</div>
                </div>

                <div style="font-size: 30px; color: var(--text-medium);">+</div>

                <div style="flex: 1; min-width: 200px; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold;">Layer 4</div>
                    <div style="margin-top: 5px; opacity: 0.9;">Conversation Memory</div>
                </div>

                <div style="font-size: 30px; color: var(--text-medium);">=</div>

                <div style="flex: 1; min-width: 200px; background: var(--sage-dark); color: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold;">🧠</div>
                    <div style="margin-top: 5px; opacity: 0.9;">AI Context</div>
                </div>
            </div>

            <div style="margin-top: 30px; background: var(--sage-lighter); padding: 20px; border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0; color: var(--sage-darkest);">How It Works</h4>
                <ol style="margin: 0; padding-left: 20px; color: var(--text-dark);">
                    <li>Student sends a message in a module chat</li>
                    <li>System queries all 4 layers from database</li>
                    <li>Data is concatenated into a single prompt</li>
                    <li>AI receives full personalized context</li>
                    <li>AI responds using Socratic method with complete student understanding</li>
                    <li>After conversation, key learnings are distilled into memory summaries (Layer 4)</li>
                </ol>
            </div>

            <div style="margin-top: 20px; text-align: center;">
                <button onclick="viewAssembledPrompt()" style="background: var(--sage-dark); color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; cursor: pointer; font-weight: 600;">
                    📝 View Sample Assembled Prompt
                </button>
            </div>
        </div>
    `;
}

async function viewAssembledPrompt() {
    // Fetch real data from all layers
    try {
        const [usersRes, classesRes, modulesRes, tablesRes] = await Promise.all([
            fetch(`${API_BASE}/users`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/classes`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/modules`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/progress/tables/all`, { headers: getAuthHeaders() })
        ]);

        const users = await usersRes.json();
        const classes = await classesRes.json();
        const modules = await modulesRes.json();
        const tablesData = await tablesRes.json();

        // Get sample data
        const sampleUser = users[0] || { name: 'Sample Student', email: 'student@example.com' };
        const sampleSurvey = tablesData.tables?.onboarding_surveys?.data?.[0];
        const sampleClass = classes[0] || { title: 'Sample Class', system_prompt: 'Use Socratic method...' };
        const sampleModule = modules[0] || { title: 'Sample Module', description: 'Sample description' };
        const sampleConversation = tablesData.tables?.conversations?.data?.[0];
        const sampleMemory = tablesData.tables?.memory_summaries?.data?.[0];

        // Get corpus data
        const corpusRes = await fetch(`${API_BASE}/course-corpus`, { headers: getAuthHeaders() });
        const corpusData = await corpusRes.json();
        const classCorpus = corpusData.entries?.[0];

        // Build the assembled prompt
        let assembledPrompt = `=== HARV DYNAMIC MEMORY CONTEXT ===

🔹 LAYER 1: STUDENT PROFILE
Student Name: ${sampleUser.name}
Email: ${sampleUser.email}
Learning Style: ${sampleSurvey?.learning_style || 'Not specified'}
Familiarity: ${sampleSurvey?.familiarity || 'Not specified'}
Goals: ${sampleSurvey?.goals || 'Not specified'}
Pace Preference: ${sampleSurvey?.pace_preference || 'Not specified'}

🔹 LAYER 2: CLASS ARCHITECTURE
Class: ${sampleClass.title}
Description: ${sampleClass.description || 'No description'}
System Prompt: ${sampleClass.system_prompt || 'Use Socratic questioning...'}
${classCorpus ? `Class Corpus Entry: "${classCorpus.title}" - ${classCorpus.content?.substring(0, 100)}...` : ''}

🔹 LAYER 3: MODULE CONTEXT
Current Module: ${sampleModule.title}
Description: ${sampleModule.description || 'No description'}
Learning Objectives: ${sampleModule.learning_objectives || 'Not specified'}
Module Prompt: ${sampleModule.module_prompt || 'Guide student through discovery...'}

🔹 LAYER 4: CONVERSATION MEMORY
${sampleConversation ? `Recent Conversation: ${sampleConversation.title || 'Untitled'} (${sampleConversation.message_count || 0} messages)` : 'No recent conversations'}
${sampleMemory ? `
Last Memory Summary:
- What Learned: ${sampleMemory.what_learned}
- How Learned: ${sampleMemory.how_learned || 'Through dialogue'}
- Understanding Level: ${sampleMemory.understanding_level || 'intermediate'}` : 'No memory summaries yet'}

=== TEACHING STRATEGY ===
Use the Socratic method to guide ${sampleUser.name} through discovery-based learning.
Consider their ${sampleSurvey?.learning_style || 'visual'} learning style and ${sampleSurvey?.familiarity || 'beginner'} familiarity level.
Build on their existing knowledge and help them connect concepts independently.

=== CURRENT MESSAGE ===
[Student's message would appear here]

Remember: Never give direct answers. Guide through questions and encourage independent thinking.`;

        // Display the prompt in a modal
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;';
        modal.innerHTML = `
            <div style="background: white; border-radius: 12px; max-width: 900px; max-height: 90vh; overflow-y: auto; width: 100%;">
                <div style="background: var(--sage-dark); color: white; padding: 20px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0;">📝 Assembled Prompt Preview</h3>
                    <button onclick="this.closest('div').parentElement.remove()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">×</button>
                </div>
                <div style="padding: 30px;">
                    <p style="margin: 0 0 20px 0; color: var(--text-medium);">
                        This is what gets sent to the AI when a student chats. Real data from your database is assembled into a single context string:
                    </p>
                    <pre style="background: #2d3748; color: #68d391; padding: 20px; border-radius: 8px; overflow-x: auto; white-space: pre-wrap; line-height: 1.6; margin: 0;">${assembledPrompt}</pre>
                    <div style="margin-top: 20px; padding: 15px; background: var(--warm-light); border-radius: 8px;">
                        <strong>💡 Note:</strong> This is a sample using the first available record from each layer. In production, the system selects data specific to the user, class, and module being accessed.
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

    } catch (error) {
        console.error('Error assembling prompt:', error);
        alert('Error loading prompt preview: ' + error.message);
    }
}

// ===== 4-LAYER MEMORY INSPECTOR FUNCTIONS =====

let inspectorData = {
    selectedClass: null,
    selectedModule: null,
    selectedStudent: null,
    currentLayer: 1
};

async function loadMemoryInspector() {
    // Load classes for the dropdown
    try {
        const response = await fetch(`${API_BASE}/classes`, {
            headers: getAuthHeaders()
        });
        const classes = await response.json();

        const classSelect = document.getElementById('inspector-class');
        classSelect.innerHTML = '<option value="">Select a class...</option>';
        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.title;
            classSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading classes:', error);
    }
}

function inspectorClassChanged() {
    const classId = parseInt(document.getElementById('inspector-class').value);
    inspectorData.selectedClass = classId;

    const moduleSelect = document.getElementById('inspector-module');
    const studentSelect = document.getElementById('inspector-student');

    if (!classId) {
        moduleSelect.disabled = true;
        moduleSelect.innerHTML = '<option value="">Select class first...</option>';
        studentSelect.disabled = true;
        studentSelect.innerHTML = '<option value="">Select module first...</option>';
        return;
    }

    // Load modules for this class
    loadInspectorModules(classId);
}

async function loadInspectorModules(classId) {
    try {
        // Note: You'll need to add a filter by class_id to your modules endpoint
        const response = await fetch(`${API_BASE}/modules`, {
            headers: getAuthHeaders()
        });
        const allModules = await response.json();

        // For now, show all modules (you can filter by class_id when that's implemented)
        const moduleSelect = document.getElementById('inspector-module');
        moduleSelect.disabled = false;
        moduleSelect.innerHTML = '<option value="">Select a module...</option>';

        allModules.forEach(mod => {
            const option = document.createElement('option');
            option.value = mod.id;
            option.textContent = mod.title;
            moduleSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading modules:', error);
    }
}

function inspectorModuleChanged() {
    const moduleId = parseInt(document.getElementById('inspector-module').value);
    inspectorData.selectedModule = moduleId;

    if (!moduleId) {
        const studentSelect = document.getElementById('inspector-student');
        studentSelect.disabled = true;
        studentSelect.innerHTML = '<option value="">Select module first...</option>';
        return;
    }

    // Load students
    loadInspectorStudents();
}

async function loadInspectorStudents() {
    try {
        const response = await fetch(`${API_BASE}/users`, {
            headers: getAuthHeaders()
        });
        const users = await response.json();

        const studentSelect = document.getElementById('inspector-student');
        studentSelect.disabled = false;
        studentSelect.innerHTML = '<option value="">Select a student...</option>';

        users.filter(u => !u.is_admin).forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.name} (${user.email})`;
            studentSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

function inspectorStudentChanged() {
    const studentId = parseInt(document.getElementById('inspector-student').value);
    inspectorData.selectedStudent = studentId;
}

async function loadInspectorData() {
    if (!inspectorData.selectedClass) {
        alert('Please select at least a Class');
        return;
    }

    document.getElementById('inspector-empty').style.display = 'none';
    document.getElementById('inspector-results').style.display = 'block';

    // Fetch data based on what's selected
    try {
        const promises = [
            fetch(`${API_BASE}/classes`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/course-corpus`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/progress/tables/all`, { headers: getAuthHeaders() })
        ];

        // Add module data if module is selected
        if (inspectorData.selectedModule) {
            promises.push(fetch(`${API_BASE}/modules`, { headers: getAuthHeaders() }));
            promises.push(fetch(`${API_BASE}/modules/${inspectorData.selectedModule}/corpus`, { headers: getAuthHeaders() }));
            promises.push(fetch(`${API_BASE}/documents?module_id=${inspectorData.selectedModule}`, { headers: getAuthHeaders() }));
        }

        // Add student data if student is selected
        if (inspectorData.selectedStudent) {
            promises.push(fetch(`${API_BASE}/users`, { headers: getAuthHeaders() }));
            if (inspectorData.selectedModule) {
                promises.push(fetch(`${API_BASE}/conversations?user_id=${inspectorData.selectedStudent}&module_id=${inspectorData.selectedModule}`, { headers: getAuthHeaders() }));
            }
            promises.push(fetch(`${API_BASE}/memory?user_id=${inspectorData.selectedStudent}`, { headers: getAuthHeaders() }));
        }

        const responses = await Promise.all(promises);
        const [classRes, corpusRes, tablesRes, ...rest] = responses;

        const classes = await classRes.json();
        const corpusData = await corpusRes.json();
        const tablesData = await tablesRes.json();

        const classObj = classes.find(c => c.id === inspectorData.selectedClass);
        let user = null, module = null, survey = null;
        let moduleCorpus = [], documents = [], conversations = [], memories = [];

        let restIndex = 0;
        if (inspectorData.selectedModule) {
            const modulesData = await rest[restIndex++].json();
            const moduleCorpusData = await rest[restIndex++].json();
            const docsData = await rest[restIndex++].json();

            module = modulesData.find(m => m.id === inspectorData.selectedModule);
            moduleCorpus = moduleCorpusData.entries || [];
            documents = docsData;
        }

        if (inspectorData.selectedStudent) {
            const usersData = await rest[restIndex++].json();
            user = usersData.find(u => u.id === inspectorData.selectedStudent);
            survey = tablesData.tables?.onboarding_surveys?.data?.find(s => s.user_id === inspectorData.selectedStudent);

            if (inspectorData.selectedModule) {
                conversations = await rest[restIndex++].json();
            }
            memories = await rest[restIndex++].json();
        }

        // Store data globally for layer views
        window.inspectorLoadedData = {
            user,
            classObj,
            module,
            survey,
            classCorpus: corpusData.entries || [],
            moduleCorpus,
            documents,
            conversations,
            memories
        };

        // Build and display assembled prompt
        displayAssembledPrompt(user, classObj, module, survey, corpusData.entries, moduleCorpus, conversations, memories);

        // Show appropriate layer by default
        if (inspectorData.selectedStudent) {
            showInspectorLayer(1);
        } else if (inspectorData.selectedModule) {
            showInspectorLayer(3);
        } else {
            showInspectorLayer(2);
        }

    } catch (error) {
        console.error('Error loading inspector data:', error);
        alert('Error loading data: ' + error.message);
    }
}

function displayAssembledPrompt(user, classObj, module, survey, classCorpus, moduleCorpus, conversations, memories) {
    const prompt = `===  HARV 4-LAYER MEMORY CONTEXT ===

🔹 LAYER 1: STUDENT PROFILE
Student Name: ${user?.name || 'Unknown'}
Email: ${user?.email || 'Unknown'}
Learning Style: ${survey?.learning_style || 'Not specified'}
Familiarity: ${survey?.familiarity || 'Not specified'}
Goals: ${survey?.goals || 'Not specified'}
Pace Preference: ${survey?.pace_preference || 'Not specified'}

🔹 LAYER 2: CLASS ARCHITECTURE
Class: ${classObj?.title || 'Unknown'}
Description: ${classObj?.description || 'No description'}
System Prompt: ${classObj?.system_prompt || 'Use Socratic questioning...'}
Class Corpus (${classCorpus?.length || 0} entries):
${classCorpus?.slice(0, 2).map(c => `  - "${c.title}": ${c.content?.substring(0, 80)}...`).join('\n') || '  (none)'}

🔹 LAYER 3: MODULE CONTEXT
Current Module: ${module?.title || 'Unknown'}
Description: ${module?.description || 'No description'}
Learning Objectives: ${module?.learning_objectives || 'Not specified'}
Module Prompt: ${module?.module_prompt || 'Guide student through discovery...'}
Module Corpus (${moduleCorpus?.length || 0} entries):
${moduleCorpus?.slice(0, 2).map(c => `  - "${c.title}" (${c.type})`).join('\n') || '  (none)'}

🔹 LAYER 4: CONVERSATION MEMORY
Recent Conversations: ${conversations?.length || 0} found
${conversations?.slice(0, 2).map(c => `  - "${c.title || 'Untitled'}" (${c.message_count || 0} messages)`).join('\n') || '  (none)'}

Memory Summaries: ${memories?.length || 0} found
${memories?.slice(0, 2).map(m => `  - What Learned: ${m.what_learned}\n    Understanding: ${m.understanding_level || 'intermediate'}`).join('\n') || '  (none)'}

=== TEACHING STRATEGY ===
Use the Socratic method to guide ${user?.name} through discovery-based learning.
Consider their ${survey?.learning_style || 'visual'} learning style and ${survey?.familiarity || 'beginner'} familiarity level.
Build on their existing knowledge and help them connect concepts independently.

=== CURRENT MESSAGE ===
[Student's message would appear here]

Remember: Never give direct answers. Guide through questions and encourage independent thinking.`;

    document.getElementById('assembled-prompt-display').textContent = prompt;
}

function showInspectorLayer(layerNum) {
    inspectorData.currentLayer = layerNum;

    // Update tab styling
    document.querySelectorAll('.inspector-tab').forEach(tab => {
        if (parseInt(tab.getAttribute('data-layer')) === layerNum) {
            tab.style.borderBottom = '3px solid var(--sage-dark)';
            tab.classList.add('active');
        } else {
            tab.style.borderBottom = '3px solid transparent';
            tab.classList.remove('active');
        }
    });

    const data = window.inspectorLoadedData;
    if (!data) return;

    const layerContent = document.getElementById('inspector-layer-content');

    if (layerNum === 1) {
        if (!data.user) {
            layerContent.innerHTML = '<p style="color: var(--text-medium); font-style: italic;">Select a student to view Layer 1 data</p>';
            return;
        }
        layerContent.innerHTML = `
            <h4 style="margin: 0 0 15px 0; color: var(--sage-darkest);">Student: ${data.user?.name || 'Unknown'}</h4>
            ${createLayerTable([data.user], [
                { key: 'id', label: 'ID' },
                { key: 'email', label: 'Email' },
                { key: 'name', label: 'Name' },
                { key: 'created_at', label: 'Created' }
            ])}

            <h4 style="margin: 30px 0 15px 0; color: var(--sage-darkest);">Onboarding Survey</h4>
            ${data.survey ? createLayerTable([data.survey], [
                { key: 'familiarity', label: 'Familiarity' },
                { key: 'learning_style', label: 'Learning Style' },
                { key: 'pace_preference', label: 'Pace' },
                { key: 'goals', label: 'Goals' }
            ]) : '<p>No onboarding survey completed</p>'}
        `;
    } else if (layerNum === 2) {
        layerContent.innerHTML = `
            <h4 style="margin: 0 0 15px 0; color: var(--sage-darkest);">Class: ${data.classObj?.title || 'Unknown'}</h4>
            ${data.classObj ? createLayerTable([data.classObj], [
                { key: 'id', label: 'ID' },
                { key: 'title', label: 'Title' },
                { key: 'description', label: 'Description' },
                { key: 'system_prompt', label: 'System Prompt' }
            ]) : '<p>Class not found</p>'}

            <h4 style="margin: 30px 0 15px 0; color: var(--sage-darkest);">Class Corpus (${data.classCorpus?.length || 0} entries)</h4>
            ${data.classCorpus && data.classCorpus.length > 0 ? createLayerTable(data.classCorpus, [
                { key: 'id', label: 'ID' },
                { key: 'title', label: 'Title' },
                { key: 'type', label: 'Type' },
                { key: 'content', label: 'Content', format: (val) => val?.substring(0, 100) + '...' }
            ]) : '<p>No class corpus entries</p>'}
        `;
    } else if (layerNum === 3) {
        if (!data.module) {
            layerContent.innerHTML = '<p style="color: var(--text-medium); font-style: italic;">Select a module to view Layer 3 data</p>';
            return;
        }
        layerContent.innerHTML = `
            <h4 style="margin: 0 0 15px 0; color: var(--sage-darkest);">Module: ${data.module?.title || 'Unknown'}</h4>
            ${createLayerTable([data.module], [
                { key: 'id', label: 'ID' },
                { key: 'title', label: 'Title' },
                { key: 'description', label: 'Description' },
                { key: 'learning_objectives', label: 'Learning Objectives' },
                { key: 'module_prompt', label: 'Module Prompt' }
            ])}

            <h4 style="margin: 30px 0 15px 0; color: var(--sage-darkest);">Module Corpus (${data.moduleCorpus?.length || 0} entries)</h4>
            ${data.moduleCorpus && data.moduleCorpus.length > 0 ? createLayerTable(data.moduleCorpus, [
                { key: 'id', label: 'ID' },
                { key: 'title', label: 'Title' },
                { key: 'type', label: 'Type' },
                { key: 'content', label: 'Content', format: (val) => val?.substring(0, 100) + '...' }
            ]) : '<p>No module corpus entries</p>'}

            <h4 style="margin: 30px 0 15px 0; color: var(--sage-darkest);">Documents (${data.documents?.length || 0} files)</h4>
            ${data.documents && data.documents.length > 0 ? createLayerTable(data.documents, [
                { key: 'id', label: 'ID' },
                { key: 'filename', label: 'Filename' },
                { key: 'content', label: 'Content', format: (val) => val?.substring(0, 100) + '...' }
            ]) : '<p>No documents</p>'}
        `;
    } else if (layerNum === 4) {
        if (!data.user) {
            layerContent.innerHTML = '<p style="color: var(--text-medium); font-style: italic;">Select a student to view Layer 4 conversation data</p>';
            return;
        }
        layerContent.innerHTML = `
            <h4 style="margin: 0 0 15px 0; color: var(--sage-darkest);">Conversations (${data.conversations?.length || 0} found)</h4>
            ${data.conversations && data.conversations.length > 0 ? createLayerTable(data.conversations, [
                { key: 'id', label: 'ID' },
                { key: 'title', label: 'Title' },
                { key: 'message_count', label: 'Messages' },
                { key: 'finalized', label: 'Finalized', format: (val) => val ? 'Yes' : 'No' },
                { key: 'created_at', label: 'Created' }
            ]) : '<p>No conversations yet</p>'}

            <h4 style="margin: 30px 0 15px 0; color: var(--sage-darkest);">Memory Summaries (${data.memories?.length || 0} found)</h4>
            ${data.memories && data.memories.length > 0 ? createLayerTable(data.memories, [
                { key: 'id', label: 'ID' },
                { key: 'what_learned', label: 'What Learned' },
                { key: 'how_learned', label: 'How Learned' },
                { key: 'understanding_level', label: 'Understanding' },
                { key: 'created_at', label: 'Created' }
            ]) : '<p>No memory summaries yet</p>'}
        `;
    }
}

async function searchInspector() {
    const searchTerm = document.getElementById('inspector-search').value.trim();
    if (!searchTerm) {
        alert('Please enter a search term');
        return;
    }

    // Simple search through all data
    try {
        const [usersRes, convsRes, memsRes] = await Promise.all([
            fetch(`${API_BASE}/users`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/progress/tables/all`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/progress/tables/all`, { headers: getAuthHeaders() })
        ]);

        const users = await usersRes.json();
        const tablesData = await convsRes.json();
        const conversations = tablesData.tables?.conversations?.data || [];
        const memories = tablesData.tables?.memory_summaries?.data || [];

        const lowerSearch = searchTerm.toLowerCase();

        // Search in users
        const matchedUser = users.find(u =>
            u.name?.toLowerCase().includes(lowerSearch) ||
            u.email?.toLowerCase().includes(lowerSearch)
        );

        // Search in conversations
        const matchedConv = conversations.find(c =>
            c.title?.toLowerCase().includes(lowerSearch)
        );

        // Search in memories
        const matchedMem = memories.find(m =>
            m.what_learned?.toLowerCase().includes(lowerSearch)
        );

        if (matchedUser) {
            alert(`Found user: ${matchedUser.name} (${matchedUser.email})\nPlease select their class and module to analyze.`);
            // Auto-select the user
            document.getElementById('inspector-student').value = matchedUser.id;
            inspectorData.selectedStudent = matchedUser.id;
        } else if (matchedConv) {
            alert(`Found conversation: "${matchedConv.title}"\nUser ID: ${matchedConv.user_id}, Module ID: ${matchedConv.module_id}`);
        } else if (matchedMem) {
            alert(`Found memory: "${matchedMem.what_learned}"\nUser ID: ${matchedMem.user_id}`);
        } else {
            alert('No matches found. Try searching by student name, email, or conversation title.');
        }
    } catch (error) {
        console.error('Error searching:', error);
        alert('Error searching: ' + error.message);
    }
}

