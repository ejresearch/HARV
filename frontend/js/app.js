// API Configuration
const API_BASE = 'http://localhost:8000';

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
                            <select id="register-role" required>
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
    modules: {
        title: 'Modules',
        description: 'View and update course modules (lessons/units)',
        content: `
            <div class="modules-container">
                <!-- Module Selector -->
                <div class="module-selector">
                    <div class="selector-header">
                        <select id="module-select" onchange="loadModuleData()">
                            <option value="">Select a module...</option>
                        </select>
                        <button class="create-btn" onclick="createNewModule()">+ Create Module</button>
                    </div>
                </div>

                <!-- Module Editor -->
                <div id="module-editor" style="display: none;">
                    <form id="module-form" onsubmit="saveModule(event)">

                        <!-- 1. Module Identity -->
                        <div class="form-section">
                            <h3 class="section-title">1. Module Identity</h3>
                            <p class="section-description">Basic information about this learning module</p>

                            <div class="form-group">
                                <label>Title</label>
                                <input type="text" id="module-title" required placeholder="e.g., Media Effects Theory">
                            </div>

                            <div class="form-group">
                                <label>Description</label>
                                <textarea id="module-description" rows="3" placeholder="What does this module teach?"></textarea>
                            </div>

                            <div class="form-group">
                                <label>Learning Objectives</label>
                                <textarea id="module-objectives" rows="3" placeholder="What will students learn?"></textarea>
                            </div>

                            <div class="form-group">
                                <label>Resources</label>
                                <textarea id="module-resources" rows="3" placeholder="Supplementary materials, links, references"></textarea>
                            </div>
                        </div>

                        <!-- 2. Teaching Instructions -->
                        <div class="form-section">
                            <h3 class="section-title">2. Teaching Instructions (Prompts)</h3>
                            <p class="section-description">How the AI should teach this module</p>

                            <div class="form-group">
                                <label>System Prompt <span class="label-hint">(Cross-module teaching philosophy)</span></label>
                                <textarea id="module-system-prompt" rows="5" placeholder="Core teaching approach, Socratic method guidelines, general behavior..."></textarea>
                            </div>

                            <div class="form-group">
                                <label>Module Prompt <span class="label-hint">(Module-specific instructions)</span></label>
                                <textarea id="module-module-prompt" rows="5" placeholder="How to teach THIS specific module, focus areas, pedagogical approach..."></textarea>
                            </div>
                        </div>

                        <!-- 3. Knowledge Base -->
                        <div class="form-section">
                            <h3 class="section-title">3. Knowledge Base (Corpus)</h3>
                            <p class="section-description">What content the AI should reference when teaching</p>

                            <div class="form-group">
                                <label>System Corpus <span class="label-hint">(Foundation knowledge - reusable)</span></label>
                                <textarea id="module-system-corpus" rows="6" placeholder="Core concepts, definitions, frameworks used across modules..."></textarea>
                            </div>

                            <div class="form-group">
                                <label>Module Corpus <span class="label-hint">(Module-specific content)</span></label>
                                <textarea id="module-module-corpus" rows="6" placeholder="Facts, theories, examples specific to this module..."></textarea>
                            </div>

                            <div class="form-group">
                                <label>Dynamic Corpus <span class="label-hint">(Real-time context - changes per conversation)</span></label>
                                <textarea id="module-dynamic-corpus" rows="6" placeholder="Variables, templates, dynamic content injection patterns..."></textarea>
                            </div>
                        </div>

                        <!-- 4. API Configuration -->
                        <div class="form-section">
                            <h3 class="section-title">4. API Configuration</h3>
                            <p class="section-description">Where to send the assembled context</p>

                            <div class="form-group">
                                <label>API Endpoint</label>
                                <input type="url" id="module-api-endpoint" placeholder="https://api.openai.com/v1/chat/completions">
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="form-actions">
                            <button type="submit" class="save-btn">Save Module</button>
                            <button type="button" class="delete-btn" onclick="deleteModule()">Delete Module</button>
                        </div>
                    </form>
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
                                <span class="feature-item">🤖 9 AI Models</span>
                                <span class="feature-item">💬 Socratic Method</span>
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
        title: 'Memory',
        description: 'Store and retrieve conversation summaries for personalized context',
        content: `
            <div class="memory-container">
                <!-- Filters -->
                <div class="memory-header">
                    <div class="memory-tabs">
                        <button class="memory-tab active" onclick="switchMemoryView('table')">Table View</button>
                        <button class="memory-tab" onclick="switchMemoryView('visualization')">4-Layer Visualization</button>
                    </div>
                    <select id="memory-user-filter" onchange="loadMemorySummaries()">
                        <option value="">All Users</option>
                    </select>
                    <select id="memory-module-filter" onchange="loadMemorySummaries()">
                        <option value="">All Modules</option>
                    </select>
                    <button class="refresh-btn" onclick="loadMemorySummaries()">Refresh</button>
                    <span id="memory-count" class="memory-count">0 summaries</span>
                </div>

                <!-- Memory Table View -->
                <div id="memory-table-view" class="memory-table-container">
                    <table class="memory-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Module</th>
                                <th>What Learned</th>
                                <th>How Learned</th>
                                <th>Key Concepts</th>
                                <th>Understanding</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="memory-table-body">
                            <tr>
                                <td colspan="9" class="no-data">Loading...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- 4-Layer Visualization View -->
                <div id="memory-visualization-view" class="memory-visualization" style="display: none;">
                    <div class="visualization-info">
                        <h3>Memory Assembly Pipeline</h3>
                        <p>When a user sends a chat message, the system queries these tables:</p>
                        <ul>
                            <li><strong>Layer 1:</strong> SELECT from users, onboarding_surveys WHERE user_id = ?</li>
                            <li><strong>Layer 2:</strong> SELECT from modules, course_corpus, module_corpus_entries WHERE module_id = ?</li>
                            <li><strong>Layer 3:</strong> SELECT messages_json from conversations WHERE user_id = ? AND module_id = ?</li>
                            <li><strong>Layer 4:</strong> SELECT * from memory_summaries WHERE user_id = ? ORDER BY created_at DESC</li>
                        </ul>
                        <p class="info-note">All data is concatenated into a single context prompt sent to the AI, enabling personalized, continuous learning experiences across sessions.</p>
                    </div>

                    <div class="layer-stack">
                        <div class="memory-layer layer-1">
                            <div class="layer-header">
                                <span class="layer-number">1</span>
                                <h3>User Profile Data</h3>
                            </div>
                            <div class="layer-content">
                                <div class="layer-item">
                                    <strong>Table: users</strong>
                                    <p><code>name: "Sarah Johnson", email: "sarah@example.com"</code></p>
                                </div>
                                <div class="layer-item">
                                    <strong>Table: onboarding_surveys</strong>
                                    <p><code>learning_style: "visual", familiarity: "beginner", goals: "Understand media theory for journalism career"</code></p>
                                </div>
                            </div>
                            <div class="layer-badge">Who is learning</div>
                        </div>

                        <div class="memory-layer layer-2">
                            <div class="layer-header">
                                <span class="layer-number">2</span>
                                <h3>Module & Corpus Data</h3>
                            </div>
                            <div class="layer-content">
                                <div class="layer-item">
                                    <strong>Table: modules (module_id=2)</strong>
                                    <p><code>title: "Media Uses & Effects", system_prompt: "Guide students to discover cultivation theory through Socratic questioning..."</code></p>
                                </div>
                                <div class="layer-item">
                                    <strong>Table: course_corpus (3 entries)</strong>
                                    <p><code>"Media literacy frameworks", "Critical thinking in communication", "Socratic method principles"</code></p>
                                </div>
                                <div class="layer-item">
                                    <strong>Table: module_corpus_entries (1 entry)</strong>
                                    <p><code>"Cultivation Theory: heavy TV viewers develop worldviews that reflect media content..."</code></p>
                                </div>
                            </div>
                            <div class="layer-badge">What we're teaching</div>
                        </div>

                        <div class="memory-layer layer-3">
                            <div class="layer-header">
                                <span class="layer-number">3</span>
                                <h3>Conversation History</h3>
                            </div>
                            <div class="layer-content">
                                <div class="layer-item">
                                    <strong>Table: conversations (conversation_id=47)</strong>
                                    <p><code>messages_json: [
                                        {"role": "user", "content": "Can you explain cultivation theory?"},
                                        {"role": "assistant", "content": "Before I explain, what do you think happens when people watch a lot of TV?"},
                                        {"role": "user", "content": "Maybe they start thinking the world is like what they see on TV?"},
                                        {"role": "assistant", "content": "Excellent observation! That's the core of cultivation theory..."}
                                    ]</code></p>
                                </div>
                                <div class="layer-item">
                                    <strong>Recent Context Window</strong>
                                    <p><code>Last 8 messages from current session (most recent conversation)</code></p>
                                </div>
                            </div>
                            <div class="layer-badge">Current session</div>
                        </div>

                        <div class="memory-layer layer-4">
                            <div class="layer-header">
                                <span class="layer-number">4</span>
                                <h3>Learning Memory</h3>
                            </div>
                            <div class="layer-content">
                                <div class="layer-item">
                                    <strong>Table: memory_summaries (id=12, module_id=2)</strong>
                                    <p><code>what_learned: "Cultivation theory explains how heavy TV viewing shapes perception of reality", how_learned: "Through Socratic dialogue about media influence", key_concepts: ["media effects", "worldview formation", "heavy viewing"], understanding_level: "intermediate"</code></p>
                                </div>
                                <div class="layer-item">
                                    <strong>Learning Insights</strong>
                                    <p><code>learning_insights: "Student demonstrates strong pattern recognition and can connect theory to real examples", teaching_effectiveness: "Socratic method working well - student discovering concepts independently"</code></p>
                                </div>
                                <div class="layer-item">
                                    <strong>Cross-Module Context (module_id=1)</strong>
                                    <p><code>what_learned: "Communication models show how perception filters reality", key_concepts: ["four worlds theory", "perception", "selective attention"]</code></p>
                                </div>
                            </div>
                            <div class="layer-badge">Past learning</div>
                        </div>
                    </div>
                </div>

                <!-- Memory Detail Modal -->
                <div id="memory-detail-modal" class="modal" style="display: none;">
                    <div class="modal-content large-modal">
                        <h3>Memory Summary Details</h3>
                        <div id="memory-detail-content"></div>
                        <div class="modal-actions">
                            <button class="cancel-btn" onclick="closeMemoryDetail()">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    progress: {
        title: 'Progress',
        description: 'Track student completion and performance across modules',
        content: `
            <div class="progress-container">
                <div class="progress-header">
                    <select id="progress-user-filter" onchange="loadUserProgress()">
                        <option value="">Select User</option>
                    </select>
                    <button class="refresh-btn" onclick="loadUserProgress()">Refresh</button>
                </div>

                <!-- Overall Stats -->
                <div id="progress-overview" class="progress-overview">
                    <div class="stat-card">
                        <div class="stat-icon">💬</div>
                        <div class="stat-info">
                            <div class="stat-value" id="total-conversations">0</div>
                            <div class="stat-label">Total Conversations</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💭</div>
                        <div class="stat-info">
                            <div class="stat-value" id="total-messages">0</div>
                            <div class="stat-label">Total Messages</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📚</div>
                        <div class="stat-info">
                            <div class="stat-value" id="modules-started">0/15</div>
                            <div class="stat-label">Modules Started</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-info">
                            <div class="stat-value" id="completion-rate">0%</div>
                            <div class="stat-label">Completion Rate</div>
                        </div>
                    </div>
                </div>

                <!-- Module Progress Grid -->
                <div class="progress-modules">
                    <h3>Module Progress</h3>
                    <div id="module-progress-grid" class="module-grid">
                        <!-- Module cards will be inserted here -->
                    </div>
                </div>
            </div>
        `
    },
    tableview: {
        title: 'Table View',
        description: 'Real-time view of all database tables',
        content: `
            <div class="table-view-container">
                <div class="table-view-header">
                    <h3>Real-Time Database Tables</h3>
                    <div class="table-controls">
                        <button class="refresh-btn" onclick="loadTableViewData()">🔄 Refresh</button>
                        <label>
                            <input type="checkbox" id="auto-refresh-tables" onchange="toggleAutoRefresh()">
                            Auto-refresh (5s)
                        </label>
                    </div>
                </div>
                <div class="table-timestamp" id="table-timestamp"></div>
                <div id="tables-container">
                    <!-- Tables will be dynamically loaded here -->
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

    // Auto-load table view data when section is opened
    if (sectionName === 'tableview') {
        loadTableViewData();
    }
}

// Authentication Functions
let currentUser = null;
let authToken = null;

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

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                email,
                password,
                is_admin: role === 'admin',
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
            headers: {
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
            }
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
            headers: {
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
            }
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
            headers: {
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
            }
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
    avatar.textContent = role === 'user' ? '👤' : '🤖';

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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                        ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
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

async function loadMemorySummaries() {
    const userFilter = document.getElementById('memory-user-filter')?.value;
    const moduleFilter = document.getElementById('memory-module-filter')?.value;
    const tableBody = document.getElementById('memory-table-body');
    const countElement = document.getElementById('memory-count');

    if (!userFilter) {
        // Show dummy data when no user is selected
        const dummyData = generateDummyMemoryData();
        renderMemoryTable(dummyData, tableBody, countElement);
        return;
    }

    const url = moduleFilter
        ? `${API_BASE}/memory/${userFilter}?module_id=${moduleFilter}`
        : `${API_BASE}/memory/${userFilter}`;

    try {
        const response = await fetch(url, {
            headers: {
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
            }
        });

        if (!response.ok) throw new Error('Failed to load memory summaries');

        const data = await response.json();

        if (!data.summaries || data.summaries.length === 0) {
            // Show dummy data when no summaries found
            const dummyData = generateDummyMemoryData();
            renderMemoryTable(dummyData, tableBody, countElement);
            return;
        }

        renderMemoryTable(data, tableBody, countElement);

    } catch (error) {
        console.error('Error loading memory summaries:', error);
        // Show dummy data on error
        const dummyData = generateDummyMemoryData();
        renderMemoryTable(dummyData, tableBody, countElement);
    }
}

function generateDummyMemoryData() {
    return {
        user_id: 1,
        count: 5,
        summaries: [
            {
                id: 1,
                user_id: 1,
                module_id: 2,
                what_learned: "Cultivation theory explains how heavy TV viewing shapes perception of reality. Heavy viewers tend to perceive the world as more dangerous than it actually is.",
                how_learned: "Through Socratic dialogue about media influence and pattern recognition exercises",
                key_concepts: "media effects, worldview formation, heavy viewing, mean world syndrome",
                understanding_level: "intermediate",
                learning_insights: "Student demonstrates strong pattern recognition and can connect theory to real examples",
                teaching_effectiveness: "Socratic method working well - student discovering concepts independently",
                created_at: "2025-09-28T14:30:00Z"
            },
            {
                id: 2,
                user_id: 1,
                module_id: 1,
                what_learned: "Communication models show how perception filters reality. The four worlds concept illustrates different layers of reality perception.",
                how_learned: "Interactive discussion comparing personal experiences with theoretical frameworks",
                key_concepts: "four worlds theory, perception, selective attention, communication models",
                understanding_level: "advanced",
                learning_insights: "Excellent grasp of abstract concepts, making sophisticated connections",
                teaching_effectiveness: "Student engaged deeply with material, asking probing questions",
                created_at: "2025-09-27T10:15:00Z"
            },
            {
                id: 3,
                user_id: 1,
                module_id: 6,
                what_learned: "News gatekeeping theory describes how editors decide what becomes news. News values include timeliness, proximity, prominence, and human interest.",
                how_learned: "Case study analysis of real news stories and editorial decisions",
                key_concepts: "gatekeeping, news values, editorial judgment, agenda-setting",
                understanding_level: "intermediate",
                learning_insights: "Good analytical skills when examining concrete examples",
                teaching_effectiveness: "Case studies effective for this learner's visual learning style",
                created_at: "2025-09-26T16:45:00Z"
            },
            {
                id: 4,
                user_id: 1,
                module_id: 13,
                what_learned: "Television became dominant medium through programming strategies like dayparting and creating appointment viewing.",
                how_learned: "Historical analysis of TV industry evolution and programming innovations",
                key_concepts: "programming strategies, dayparting, appointment viewing, cultural impact",
                understanding_level: "beginner",
                learning_insights: "Building foundational knowledge, needs more examples",
                teaching_effectiveness: "Historical context helping student understand current media landscape",
                created_at: "2025-09-25T13:20:00Z"
            },
            {
                id: 5,
                user_id: 1,
                module_id: 15,
                what_learned: "Economic forces shape media content through advertising revenue models, ownership concentration, and PR influence.",
                how_learned: "Economic analysis of media business models and industry structure",
                key_concepts: "advertising models, media ownership, public relations, economic influence",
                understanding_level: "intermediate",
                learning_insights: "Strong understanding of economic principles applied to media",
                teaching_effectiveness: "Student connecting business concepts to media studies effectively",
                created_at: "2025-09-24T11:00:00Z"
            }
        ]
    };
}

function renderMemoryTable(data, tableBody, countElement) {
    countElement.textContent = `${data.count} ${data.count === 1 ? 'summary' : 'summaries'}`;

    tableBody.innerHTML = data.summaries.map(mem => {
        const whatLearned = mem.summary_text || mem.what_learned || '-';
        const howLearned = mem.how_learned || '-';
        const keyConcepts = mem.key_concepts || '-';
        const understanding = mem.understanding_level || '-';
        const created = mem.created_at ? new Date(mem.created_at).toLocaleDateString() : '-';

        return `
            <tr>
                <td>${mem.id}</td>
                <td>${data.user_id}</td>
                <td>${mem.module_id || '-'}</td>
                <td class="text-preview">${truncate(whatLearned, 50)}</td>
                <td class="text-preview">${truncate(howLearned, 50)}</td>
                <td class="text-preview">${truncate(keyConcepts, 40)}</td>
                <td><span class="level-badge">${understanding}</span></td>
                <td>${created}</td>
                <td><button class="view-btn" onclick="viewMemoryDetail(${mem.id}, ${data.user_id})">View</button></td>
            </tr>
        `;
    }).join('');
}

function truncate(text, length) {
    if (!text || text === '-') return '-';
    return text.length > length ? text.substring(0, length) + '...' : text;
}

async function viewMemoryDetail(memoryId, userId) {
    const modal = document.getElementById('memory-detail-modal');
    const content = document.getElementById('memory-detail-content');

    try {
        const response = await fetch(`${API_BASE}/memory/${userId}`, {
            headers: {
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
            }
        });

        if (!response.ok) throw new Error('Failed to load memory details');

        const data = await response.json();
        const memory = data.summaries.find(m => m.id === memoryId);

        if (!memory) {
            alert('Memory summary not found');
            return;
        }

        content.innerHTML = `
            <div class="memory-detail">
                <div class="detail-row">
                    <strong>ID:</strong> ${memory.id}
                </div>
                <div class="detail-row">
                    <strong>User ID:</strong> ${memory.user_id || userId}
                </div>
                <div class="detail-row">
                    <strong>Module ID:</strong> ${memory.module_id || 'N/A'}
                </div>
                <div class="detail-row">
                    <strong>What Learned:</strong>
                    <div class="detail-text">${memory.summary_text || memory.what_learned || 'N/A'}</div>
                </div>
                <div class="detail-row">
                    <strong>How Learned:</strong>
                    <div class="detail-text">${memory.how_learned || 'N/A'}</div>
                </div>
                <div class="detail-row">
                    <strong>Key Concepts:</strong>
                    <div class="detail-text">${memory.key_concepts || 'N/A'}</div>
                </div>
                <div class="detail-row">
                    <strong>Learning Insights:</strong>
                    <div class="detail-text">${memory.learning_insights || 'N/A'}</div>
                </div>
                <div class="detail-row">
                    <strong>Teaching Effectiveness:</strong>
                    <div class="detail-text">${memory.teaching_effectiveness || 'N/A'}</div>
                </div>
                <div class="detail-row">
                    <strong>Understanding Level:</strong> ${memory.understanding_level || 'N/A'}
                </div>
                <div class="detail-row">
                    <strong>Context Data:</strong>
                    <div class="detail-text"><pre>${memory.context_data || 'N/A'}</pre></div>
                </div>
                <div class="detail-row">
                    <strong>Created:</strong> ${memory.created_at ? new Date(memory.created_at).toLocaleString() : 'N/A'}
                </div>
                <div class="detail-row">
                    <strong>Updated:</strong> ${memory.updated_at ? new Date(memory.updated_at).toLocaleString() : 'N/A'}
                </div>
            </div>
        `;

        modal.style.display = 'flex';

    } catch (error) {
        console.error('Error loading memory detail:', error);
        alert('Failed to load memory details');
    }
}

function closeMemoryDetail() {
    document.getElementById('memory-detail-modal').style.display = 'none';
}

function switchMemoryView(view) {
    const tableView = document.getElementById('memory-table-view');
    const vizView = document.getElementById('memory-visualization-view');
    const tabs = document.querySelectorAll('.memory-tab');

    tabs.forEach(tab => tab.classList.remove('active'));

    if (view === 'table') {
        tableView.style.display = 'flex';
        vizView.style.display = 'none';
        tabs[0].classList.add('active');
    } else {
        tableView.style.display = 'none';
        vizView.style.display = 'block';
        tabs[1].classList.add('active');
    }
}

// ===== PROGRESS FUNCTIONS =====

async function loadUserProgress() {
    const userSelect = document.getElementById('progress-user-filter');
    const userId = userSelect?.value;

    if (!userId) {
        // Show dummy data when no user selected
        displayProgressData(generateDummyProgressData());
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/progress/${userId}`, {
            headers: {
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
            }
        });

        if (!response.ok) throw new Error('Failed to load progress');

        const data = await response.json();
        displayProgressData(data);

    } catch (error) {
        console.error('Error loading progress:', error);
        // Show dummy data on error
        displayProgressData(generateDummyProgressData());
    }
}

function generateDummyProgressData() {
    return {
        user_id: 1,
        user_name: "Sarah Johnson",
        user_email: "sarah@example.com",
        overall: {
            total_conversations: 47,
            total_messages: 94,
            modules_started: 8,
            modules_total: 15,
            completion_rate: 53.3
        },
        modules: [
            { module_id: 1, module_title: "Your Four Worlds", conversations: 12, messages: 24, completed: true },
            { module_id: 2, module_title: "Media Uses & Effects", conversations: 15, messages: 30, completed: true },
            { module_id: 3, module_title: "Shared Characteristics of Media", conversations: 0, messages: 0, completed: false },
            { module_id: 4, module_title: "Communication Infrastructure", conversations: 5, messages: 10, completed: true },
            { module_id: 5, module_title: "Books: The Birth of Mass Communication", conversations: 0, messages: 0, completed: false },
            { module_id: 6, module_title: "News & Newspapers", conversations: 8, messages: 16, completed: true },
            { module_id: 7, module_title: "Magazines: The Special Interest Medium", conversations: 0, messages: 0, completed: false },
            { module_id: 8, module_title: "Comic Books: Small Business, Big Impact", conversations: 0, messages: 0, completed: false },
            { module_id: 9, module_title: "Photography: Fixing a Shadow", conversations: 0, messages: 0, completed: false },
            { module_id: 10, module_title: "Recordings: From Bach to Rock & Rap", conversations: 0, messages: 0, completed: false },
            { module_id: 11, module_title: "Motion Pictures: The Start of Mass Entertainment", conversations: 0, messages: 0, completed: false },
            { module_id: 12, module_title: "Radio: The Pervasive Medium", conversations: 3, messages: 6, completed: true },
            { module_id: 13, module_title: "Television: The Center of Attention", conversations: 2, messages: 4, completed: true },
            { module_id: 14, module_title: "Video Games: The Newest Mass Medium", conversations: 0, messages: 0, completed: false },
            { module_id: 15, module_title: "Economic Influencers: Advertising, PR, and Ownership", conversations: 2, messages: 4, completed: true }
        ]
    };
}

function displayProgressData(data) {
    // Update overall stats
    document.getElementById('total-conversations').textContent = data.overall.total_conversations;
    document.getElementById('total-messages').textContent = data.overall.total_messages;
    document.getElementById('modules-started').textContent = `${data.overall.modules_started}/${data.overall.modules_total}`;
    document.getElementById('completion-rate').textContent = `${data.overall.completion_rate}%`;

    // Render module grid
    const grid = document.getElementById('module-progress-grid');
    grid.innerHTML = data.modules.map(module => {
        const statusClass = module.completed ? 'completed' : 'not-started';
        const statusIcon = module.completed ? '✓' : '○';
        const progressPercent = module.completed ? 100 : 0;

        return `
            <div class="module-card ${statusClass}">
                <div class="module-card-header">
                    <span class="module-status-icon">${statusIcon}</span>
                    <h4>${module.module_title}</h4>
                </div>
                <div class="module-card-stats">
                    <div class="stat-item">
                        <span class="stat-label">Conversations</span>
                        <span class="stat-value">${module.conversations}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Messages</span>
                        <span class="stat-value">${module.messages}</span>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

// Table View Functions
let autoRefreshInterval = null;

async function loadTableViewData() {
    try {
        const response = await fetch(`${API_BASE}/progress/tables/all`);
        if (!response.ok) throw new Error('Failed to load table data');

        const data = await response.json();
        displayTablesData(data);
    } catch (error) {
        console.error('Error loading table data:', error);
        document.getElementById('tables-container').innerHTML = `
            <div class="error-message">Failed to load table data: ${error.message}</div>
        `;
    }
}

function displayTablesData(data) {
    const timestamp = new Date(data.timestamp).toLocaleString();
    document.getElementById('table-timestamp').textContent = `Last updated: ${timestamp}`;

    const container = document.getElementById('tables-container');
    const tables = data.tables;

    let html = '';

    // Users Table
    html += createTableHTML('Users', tables.users.count, tables.users.data, [
        { key: 'id', label: 'ID' },
        { key: 'email', label: 'Email' },
        { key: 'name', label: 'Name' },
        { key: 'is_admin', label: 'Admin', format: (val) => val ? '✓' : '✗' }
    ]);

    // Modules Table
    html += createTableHTML('Modules', tables.modules.count, tables.modules.data, [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'system_prompt', label: 'System Prompt' },
        { key: 'module_prompt', label: 'Module Prompt' },
        { key: 'resources', label: 'Resources' },
        { key: 'system_corpus', label: 'System Corpus' },
        { key: 'module_corpus', label: 'Module Corpus' },
        { key: 'dynamic_corpus', label: 'Dynamic Corpus' },
        { key: 'api_endpoint', label: 'API Endpoint' },
        { key: 'learning_objectives', label: 'Learning Objectives' }
    ]);

    // Conversations Table
    html += createTableHTML('Conversations', tables.conversations.count, tables.conversations.data, [
        { key: 'id', label: 'ID' },
        { key: 'user_id', label: 'User ID' },
        { key: 'module_id', label: 'Module ID' },
        { key: 'title', label: 'Title' },
        { key: 'message_count', label: 'Messages' },
        { key: 'finalized', label: 'Finalized', format: (val) => val ? '✓' : '✗' },
        { key: 'created_at', label: 'Created' }
    ]);

    // Memory Summaries Table
    html += createTableHTML('Memory Summaries', tables.memory_summaries.count, tables.memory_summaries.data, [
        { key: 'id', label: 'ID' },
        { key: 'user_id', label: 'User ID' },
        { key: 'module_id', label: 'Module ID' },
        { key: 'conversation_id', label: 'Conv ID' },
        { key: 'what_learned', label: 'What Learned' }
    ]);

    // User Progress Table
    html += createTableHTML('User Progress', tables.user_progress.count, tables.user_progress.data, [
        { key: 'id', label: 'ID' },
        { key: 'user_id', label: 'User ID' },
        { key: 'module_id', label: 'Module ID' },
        { key: 'completed', label: 'Completed', format: (val) => val ? '✓' : '✗' },
        { key: 'grade', label: 'Grade' },
        { key: 'time_spent', label: 'Time (min)' },
        { key: 'attempts', label: 'Attempts' }
    ]);

    // Documents Table
    html += createTableHTML('Documents', tables.documents.count, tables.documents.data, [
        { key: 'id', label: 'ID' },
        { key: 'module_id', label: 'Module ID' },
        { key: 'user_id', label: 'User ID' },
        { key: 'filename', label: 'Filename' },
        { key: 'content_length', label: 'Size (chars)' }
    ]);

    // Onboarding Surveys Table
    html += createTableHTML('Onboarding Surveys', tables.onboarding_surveys.count, tables.onboarding_surveys.data, [
        { key: 'id', label: 'ID' },
        { key: 'user_id', label: 'User ID' },
        { key: 'familiarity', label: 'Familiarity' },
        { key: 'learning_style', label: 'Learning Style' }
    ]);

    // Course Corpus Table
    html += createTableHTML('Course Corpus', tables.course_corpus.count, tables.course_corpus.data, [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Title' },
        { key: 'type', label: 'Type' },
        { key: 'order_index', label: 'Order' },
        { key: 'content_length', label: 'Size (chars)' }
    ]);

    // Module Corpus Entries Table
    html += createTableHTML('Module Corpus Entries', tables.module_corpus_entries.count, tables.module_corpus_entries.data, [
        { key: 'id', label: 'ID' },
        { key: 'module_id', label: 'Module ID' },
        { key: 'title', label: 'Title' },
        { key: 'type', label: 'Type' },
        { key: 'content_length', label: 'Size (chars)' }
    ]);

    container.innerHTML = html;
}

function createTableHTML(tableName, count, data, columns) {
    let html = `
        <div class="db-table">
            <div class="db-table-header">
                <h4>${tableName}</h4>
                <span class="record-count">${count} record${count !== 1 ? 's' : ''}</span>
            </div>
    `;

    if (count === 0) {
        html += '<p class="no-data">No records</p>';
    } else {
        html += '<div class="table-wrapper"><table><thead><tr>';
        columns.forEach(col => {
            html += `<th>${col.label}</th>`;
        });
        html += '</tr></thead><tbody>';

        data.forEach(row => {
            html += '<tr>';
            columns.forEach(col => {
                let value = row[col.key];
                if (col.format) {
                    value = col.format(value);
                }
                if (value === null || value === undefined) {
                    value = '-';
                }
                html += `<td>${value}</td>`;
            });
            html += '</tr>';
        });

        html += '</tbody></table></div>';
    }

    html += '</div>';
    return html;
}

function toggleAutoRefresh() {
    const checkbox = document.getElementById('auto-refresh-tables');

    if (checkbox.checked) {
        // Start auto-refresh
        autoRefreshInterval = setInterval(loadTableViewData, 5000);
    } else {
        // Stop auto-refresh
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
            autoRefreshInterval = null;
        }
    }
}
