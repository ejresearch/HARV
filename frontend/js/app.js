// API Configuration
const API_BASE = 'http://localhost:8000';

// Archived legacy sections storage
const archivedModulesHTML = `<p style="text-align: center; padding: 40px; color: var(--text-medium);">Legacy modules section - now managed in <strong>Classes & Modules</strong></p>`;
const archivedCorpusHTML = `<p style="text-align: center; padding: 40px; color: var(--text-medium);">Legacy corpus section - now managed within each Class</p>`;
const archivedDocumentsHTML = `<p style="text-align: center; padding: 40px; color: var(--text-medium);">Legacy documents section - now managed within each Class or Module</p>`;

// Section content definitions
const sections = {
    'admin-dashboard': {
        title: 'Admin Dashboard',
        description: 'System overview and course management',
        content: `
            <div class="p-6 space-y-6">
                <!-- Quick Actions Bar -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button class="bg-white border-2 border-gray-300 rounded-lg p-4 hover:border-sage-medium hover:shadow-md transition-all text-left" onclick="switchSection('classes')">
                        <div class="flex items-center gap-2 mb-2">
                            <i data-lucide="book-open" style="width: 20px; height: 20px; color: #C07047;"></i>
                            <div class="font-bold text-gray-900">Manage Classes</div>
                        </div>
                        <div class="text-sm text-gray-600">Create & edit courses</div>
                    </button>
                    <button class="bg-white border-2 border-gray-300 rounded-lg p-4 hover:border-sage-medium hover:shadow-md transition-all text-left" onclick="switchSection('class-hierarchy')">
                        <div class="flex items-center gap-2 mb-2">
                            <i data-lucide="folder-tree" style="width: 20px; height: 20px; color: #9CAA5A;"></i>
                            <div class="font-bold text-gray-900">Class Hierarchy</div>
                        </div>
                        <div class="text-sm text-gray-600">Browse course structure</div>
                    </button>
                    <button class="bg-white border-2 border-gray-300 rounded-lg p-4 hover:border-sage-medium hover:shadow-md transition-all text-left" onclick="switchSection('learning-journeys')">
                        <div class="flex items-center gap-2 mb-2">
                            <i data-lucide="graduation-cap" style="width: 20px; height: 20px; color: #C07047;"></i>
                            <div class="font-bold text-gray-900">Learning Journeys</div>
                        </div>
                        <div class="text-sm text-gray-600">Track student progress</div>
                    </button>
                    <button class="bg-white border-2 border-gray-300 rounded-lg p-4 hover:border-sage-medium hover:shadow-md transition-all text-left" onclick="switchSection('memory')">
                        <div class="flex items-center gap-2 mb-2">
                            <i data-lucide="brain" style="width: 20px; height: 20px; color: #9CAA5A;"></i>
                            <div class="font-bold text-gray-900">Memory Inspector</div>
                        </div>
                        <div class="text-sm text-gray-600">Visualize 5-layer memory</div>
                    </button>
                    <button class="bg-white border-2 border-gray-300 rounded-lg p-4 hover:border-sage-medium hover:shadow-md transition-all text-left" onclick="switchSection('conversations')">
                        <div class="flex items-center gap-2 mb-2">
                            <i data-lucide="message-square" style="width: 20px; height: 20px; color: #C07047;"></i>
                            <div class="font-bold text-gray-900">Student Activity</div>
                        </div>
                        <div class="text-sm text-gray-600">View conversations</div>
                    </button>
                    <button class="bg-white border-2 border-gray-300 rounded-lg p-4 hover:border-sage-medium hover:shadow-md transition-all text-left" onclick="switchSection('chat')">
                        <div class="flex items-center gap-2 mb-2">
                            <i data-lucide="message-circle" style="width: 20px; height: 20px; color: #9CAA5A;"></i>
                            <div class="font-bold text-gray-900">Test Chat</div>
                        </div>
                        <div class="text-sm text-gray-600">Try the AI tutor</div>
                    </button>
                </div>

                <!-- Administrators Section -->
                <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 overflow-hidden">
                    <div class="p-4 border-b-2 border-gray-300 flex justify-between items-center" style="background: linear-gradient(135deg, #B5C080 0%, #9CAA5A 100%);">
                        <div>
                            <h3 class="text-lg font-bold text-white">Administrators</h3>
                            <p class="text-sm text-white/90 mt-1">System administrators with full access</p>
                        </div>
                        <button onclick="showAddUserModal('admin')" class="bg-white text-sage-dark px-4 py-2 rounded-lg hover:bg-sage-lightest transition-colors font-semibold border-2 border-white shadow-md">
                            + Add Admin
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Name</th>
                                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Email</th>
                                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Classes Created</th>
                                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Modules Created</th>
                                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200" id="admin-admins-table">
                                <tr>
                                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">Loading administrators...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Student Management Section -->
                <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 overflow-hidden">
                    <div class="p-4 border-b-2 border-gray-300 flex justify-between items-center" style="background: linear-gradient(135deg, #B5C080 0%, #9CAA5A 100%);">
                        <div>
                            <h3 class="text-lg font-bold text-white">Student Management</h3>
                            <p class="text-sm text-white/90 mt-1">View and manage all registered students</p>
                        </div>
                        <button onclick="showAddUserModal('student')" class="bg-white text-sage-dark px-4 py-2 rounded-lg hover:bg-sage-lightest transition-colors font-semibold border-2 border-white shadow-md">
                            + Add Student
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Name</th>
                                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Email</th>
                                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Learning Profile</th>
                                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Progress</th>
                                    <th class="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200" id="admin-students-table">
                                <tr>
                                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">Loading students...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `
    },
    'student-dashboard': {
        title: 'My Classes',
        description: 'Your learning journey',
        content: `
            <div class="p-6 space-y-6">
                <!-- Welcome Card -->
                <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 overflow-hidden">
                    <div class="p-6" style="background: linear-gradient(135deg, #B5C080 0%, #9CAA5A 100%);">
                        <h2 class="text-3xl font-bold text-white mb-2">Welcome back, <span id="student-name">Student</span>!</h2>
                        <p class="text-white/90 text-lg" id="student-subtitle">Keep learning, keep growing</p>
                    </div>
                </div>

                <!-- My Classes Section -->
                <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 overflow-hidden">
                    <div class="p-4 border-b-2 border-gray-300 flex justify-between items-center" style="background: linear-gradient(135deg, #B5C080 0%, #9CAA5A 100%);">
                        <div>
                            <h3 class="text-lg font-bold text-white">My Classes</h3>
                            <p class="text-sm text-white/90 mt-1">Your enrolled courses and learning materials</p>
                        </div>
                        <button onclick="showJoinClassModal()" class="bg-white text-sage-dark px-4 py-2 rounded-lg hover:bg-sage-lightest transition-colors font-semibold border-2 border-white shadow-md">
                            + Join Class
                        </button>
                    </div>
                    <div class="p-6">
                        <div id="student-classes-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div class="col-span-full text-center py-12 text-gray-500">
                                <p>Loading your classes...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    system: {
        title: 'System Settings & Health',
        description: 'Configure API keys and monitor system health',
        content: `
            <div class="p-6 space-y-6">
                <!-- API Key Configuration -->
                <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 overflow-hidden">
                    <div class="p-6 border-b border-gray-200" style="background: linear-gradient(135deg, #B5C080 0%, #9CAA5A 100%);">
                        <h3 class="text-xl font-bold text-white">API Key Configuration</h3>
                        <p class="text-sm text-white/90 mt-1">Configure API keys for AI service providers</p>
                    </div>
                    <div class="p-6 space-y-4" id="api-keys-container">
                        <p class="text-gray-500 text-center">Loading API key settings...</p>
                    </div>
                </div>

                <!-- Health Checks -->
                <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 overflow-hidden">
                    <div class="p-6 border-b border-gray-200" style="background: linear-gradient(135deg, #B5C080 0%, #9CAA5A 100%);">
                        <h3 class="text-xl font-bold text-white">System Health Checks</h3>
                        <p class="text-sm text-white/90 mt-1">Monitor backend endpoints and system status</p>
                    </div>
                    <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="border-2 border-gray-200 rounded-lg p-4">
                            <h4 class="font-bold text-gray-900 mb-2">Root Endpoint</h4>
                            <p class="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded-lg mb-3">GET /</p>
                            <button class="w-full bg-sage-medium text-white px-3 py-2 rounded-lg hover:bg-sage-dark transition-colors font-medium text-sm mb-3" onclick="testRootEndpoint()">Test</button>
                            <pre class="bg-gray-50 p-2 rounded-lg text-xs text-gray-700 overflow-x-auto border border-gray-200 max-h-32" id="root-result">Click test...</pre>
                        </div>

                        <div class="border-2 border-gray-200 rounded-lg p-4">
                            <h4 class="font-bold text-gray-900 mb-2">Health Check</h4>
                            <p class="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded-lg mb-3">GET /health</p>
                            <button class="w-full bg-sage-medium text-white px-3 py-2 rounded-lg hover:bg-sage-dark transition-colors font-medium text-sm mb-3" onclick="testHealthEndpoint()">Test</button>
                            <pre class="bg-gray-50 p-2 rounded-lg text-xs text-gray-700 overflow-x-auto border border-gray-200 max-h-32" id="health-result">Click test...</pre>
                        </div>

                        <div class="border-2 border-gray-200 rounded-lg p-4">
                            <h4 class="font-bold text-gray-900 mb-2">System Status</h4>
                            <p class="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded-lg mb-3">GET /system/status</p>
                            <button class="w-full bg-sage-medium text-white px-3 py-2 rounded-lg hover:bg-sage-dark transition-colors font-medium text-sm mb-3" onclick="testStatusEndpoint()">Test</button>
                            <pre class="bg-gray-50 p-2 rounded-lg text-xs text-gray-700 overflow-x-auto border border-gray-200 max-h-32" id="status-result">Click test...</pre>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    auth: {
        title: 'Authentication',
        description: 'Register new users and log them in to get access tokens',
        content: `
            <div class="p-6 max-w-md mx-auto">
                <!-- Login Form -->
                <div class="bg-white rounded-lg shadow-sm p-8" id="login-card">
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">Login</h3>
                    <form id="login-form" onsubmit="handleLogin(event)" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" id="login-email" required placeholder="user@example.com"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" id="login-password" required placeholder="********"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none">
                        </div>
                        <button type="submit" class="w-full bg-sage-medium text-white px-4 py-3 rounded-lg hover:bg-sage-dark transition-colors font-medium">Login</button>
                        <button type="button" class="w-full text-sage-medium hover:text-sage-dark transition-colors font-medium" onclick="showRegister()">Create New User</button>
                    </form>
                </div>

                <!-- Register Form -->
                <div class="bg-white rounded-lg shadow-sm p-8" id="register-card" style="display: none;">
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">Create New User</h3>
                    <form id="register-form" onsubmit="handleRegister(event)" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select id="register-role" required onchange="toggleStudentFields()"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none">
                                <option value="">Select Role</option>
                                <option value="student">Student</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input type="text" id="register-name" required placeholder="John Doe"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" id="register-email" required placeholder="user@example.com"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" id="register-password" required placeholder="Min 8 characters"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none">
                        </div>

                        <!-- Student-specific fields -->
                        <div id="student-fields" style="display: none;" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Age / Grade Level</label>
                                <input type="text" id="register-age-grade" placeholder="e.g., 10th grade, 16 years old"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">How do you learn best?</label>
                                <textarea id="register-learning-notes" rows="4" placeholder="Tell us anything you'd like the AI to know about how you learn. For example: 'I learn best with visual examples' or 'I need extra time to process new information'"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none resize-none"></textarea>
                            </div>
                        </div>

                        <button type="submit" class="w-full bg-sage-medium text-white px-4 py-3 rounded-lg hover:bg-sage-dark transition-colors font-medium">Register</button>
                        <button type="button" class="w-full text-sage-medium hover:text-sage-dark transition-colors font-medium" onclick="showLogin()">Back to Login</button>
                    </form>
                </div>

                <!-- User Info Display -->
                <div class="bg-white rounded-lg shadow-sm p-8" id="user-info" style="display: none;">
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">Authenticated User</h3>
                    <div id="user-details" class="mb-6"></div>
                    <button class="w-full bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium" onclick="handleLogout()">Logout</button>
                </div>
            </div>
        `
    },
    classes: {
        title: 'Classes & Modules',
        description: 'Manage classes, modules, corpus, and documents in hierarchical structure',
        content: `
            <div class="p-6 space-y-6">
                <!-- Class Selector Dropdown -->
                <div class="bg-white rounded-lg shadow-sm p-5">
                    <div class="flex items-center gap-4">
                        <label class="font-semibold text-gray-900 whitespace-nowrap">Classes:</label>
                        <select id="class-selector" onchange="selectClassFromDropdown()"
                            class="flex-1 px-4 py-2 border-2 border-sage-light rounded-lg text-sm text-gray-900 cursor-pointer focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none">
                            <option value="">Select a class...</option>
                        </select>
                        <button onclick="createNewClass()"
                            class="bg-sage-medium text-white px-4 py-2 rounded-lg hover:bg-sage-dark transition-colors font-medium whitespace-nowrap">+ New Class</button>
                    </div>
                </div>

                <!-- Class/Module Editor -->
                <div class="bg-white rounded-lg shadow-sm p-8 min-h-[400px]" id="class-editor-container">
                    <div class="text-center text-gray-400 py-20">
                        <h3 class="text-xl font-semibold mb-2">Select a class to begin</h3>
                        <p class="text-gray-500">Choose a class from the dropdown above or create a new one</p>
                    </div>
                </div>
            </div>
        `
    },
    // analytics: ARCHIVED - Now covered by Admin Dashboard
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
            <div class="p-6 space-y-6">
                <!-- Filters & Search -->
                <div class="bg-white rounded-lg shadow-sm p-5">
                    <div class="flex flex-wrap gap-4 items-center justify-between">
                        <div class="flex gap-3 flex-1 flex-wrap">
                            <select id="filter-user" onchange="loadConversations()"
                                class="px-4 py-2 border-2 border-sage-light rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none">
                                <option value="">All Users</option>
                            </select>
                            <select id="filter-module" onchange="loadConversations()"
                                class="px-4 py-2 border-2 border-sage-light rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none">
                                <option value="">All Modules</option>
                            </select>
                            <button onclick="loadConversations()"
                                class="bg-sage-medium text-white px-4 py-2 rounded-lg hover:bg-sage-dark transition-colors font-medium">Refresh</button>
                        </div>
                        <div class="text-gray-600" id="conversation-stats">
                            Total: <strong>0</strong> conversations
                        </div>
                    </div>
                </div>

                <!-- Two-column layout: List + Detail -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
                    <!-- Left: Conversation List (like ChatGPT sidebar) -->
                    <div class="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                        <div class="p-4 text-white" style="background: linear-gradient(135deg, #B5C080 0%, #9CAA5A 100%);">
                            <h3 class="text-lg font-bold">Conversation History</h3>
                        </div>
                        <div id="conversations-list-content" class="flex-1 overflow-y-auto p-4">
                            <p class="text-gray-500 text-center py-8">No conversations yet</p>
                        </div>
                    </div>

                    <!-- Right: Conversation Detail (like ChatGPT main view) -->
                    <div class="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                        <div id="conversation-detail-content" class="flex-1 overflow-y-auto p-6">
                            <div class="text-center text-gray-400 py-20">
                                <h3 class="text-2xl font-bold mb-2">No Conversation Selected</h3>
                                <p class="text-gray-500">Select a conversation from the list to view details</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    chat: {
        title: 'Chat Interface',
        description: 'AI-powered Socratic tutoring with enhanced memory and context',
        content: `
            <div class="flex h-[calc(100vh-80px)]">
                <!-- Left Sidebar: Conversations & Controls -->
                <div class="w-80 text-white flex flex-col border-r border-gray-300" style="background: linear-gradient(180deg, #B5C080 0%, #9CAA5A 100%);">
                    <div class="p-4 border-b border-white/20 flex items-center justify-between">
                        <h3 class="text-lg font-bold">Conversations</h3>
                        <button onclick="startNewChat()" title="Start new conversation"
                            class="bg-terracotta-500 hover:bg-terracotta-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-md">
                            <span class="text-xl font-bold">+</span>
                        </button>
                    </div>

                    <!-- Class, Module & Model Selection -->
                    <div class="p-4 space-y-3 border-b border-white/20">
                        <div>
                            <label class="block text-sm font-medium mb-1 text-white">Class</label>
                            <select id="chat-class-select" onchange="chatClassChanged()"
                                class="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-terracotta-500 outline-none backdrop-blur-sm">
                                <option value="">All Classes</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1 text-white">Module</label>
                            <select id="chat-module-select" onchange="chatModuleChanged()"
                                class="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-terracotta-500 outline-none backdrop-blur-sm">
                                <option value="">Select Module...</option>
                            </select>
                        </div>
                        <div id="chat-model-selector-container">
                            <label class="block text-sm font-medium mb-1 text-white">AI Model</label>
                            <select id="chat-provider-select"
                                class="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-terracotta-500 outline-none backdrop-blur-sm">
                                <option value="openai-gpt5">GPT-5 (OpenAI)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Conversation History -->
                    <div class="flex-1 overflow-y-auto p-4">
                        <div class="text-sm font-semibold mb-2 text-white">Recent Chats</div>
                        <div id="chat-history-list">
                            <div class="text-white/70 text-sm py-4 text-center">No conversations yet</div>
                        </div>
                    </div>

                    <!-- Memory Context Indicator -->
                    <div class="p-4 border-t border-white/20" style="background: rgba(0,0,0,0.1);">
                        <div class="text-sm font-semibold mb-2 text-white">Memory Context</div>
                        <div class="space-y-1 text-xs" id="chat-memory-stats">
                            <div class="flex justify-between text-white/80">
                                <span>Profile:</span>
                                <span class="font-mono" id="memory-profile-status">—</span>
                            </div>
                            <div class="flex justify-between text-white/80">
                                <span>Module Data:</span>
                                <span class="font-mono" id="memory-module-status">—</span>
                            </div>
                            <div class="flex justify-between text-white/80">
                                <span>Conversations:</span>
                                <span class="font-mono" id="memory-conv-status">—</span>
                            </div>
                            <div class="flex justify-between text-white/80">
                                <span>Context Size:</span>
                                <span class="font-mono" id="memory-size-status">—</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Chat Area -->
                <div class="flex-1 flex flex-col bg-gray-50">
                    <!-- Chat Header -->
                    <div class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <div>
                            <h2 class="text-xl font-bold text-gray-900" id="chat-module-title">HARV AI Tutor</h2>
                            <p class="text-sm text-gray-600" id="chat-module-description">Select a module to begin learning</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="toggleMemoryPanel()" title="View memory context"
                                class="px-4 py-2 bg-sage-medium text-white rounded-lg hover:bg-sage-dark transition-colors font-medium text-sm">
                                Memory
                            </button>
                            <button onclick="exportConversation()" title="Export conversation"
                                class="px-4 py-2 bg-sage-medium text-white rounded-lg hover:bg-sage-dark transition-colors font-medium text-sm">
                                Export
                            </button>
                        </div>
                    </div>

                    <!-- Chat Messages -->
                    <div class="flex-1 overflow-y-auto p-6" id="chat-messages">
                        <div class="max-w-3xl mx-auto text-center py-12">
                            <div class="w-20 h-20 mx-auto mb-6 bg-sage-medium rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                HARV
                            </div>
                            <h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome to HARV</h2>
                            <p class="text-gray-600 mb-8">Your AI-Powered Socratic Tutor</p>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div class="bg-white rounded-lg p-6 shadow-sm">
                                    <strong class="block text-gray-900 mb-1">4-Layer Memory</strong>
                                    <span class="text-sm text-gray-600">Personalized learning context</span>
                                </div>
                                <div class="bg-white rounded-lg p-6 shadow-sm">
                                    <strong class="block text-gray-900 mb-1">Socratic Method</strong>
                                    <span class="text-sm text-gray-600">Learn through guided discovery</span>
                                </div>
                                <div class="bg-white rounded-lg p-6 shadow-sm">
                                    <strong class="block text-gray-900 mb-1">Context-Aware</strong>
                                    <span class="text-sm text-gray-600">Remembers your progress</span>
                                </div>
                            </div>
                            <div class="bg-white rounded-lg p-6 shadow-sm text-left max-w-md mx-auto">
                                <h4 class="font-bold text-gray-900 mb-3">Getting Started:</h4>
                                <ol class="space-y-2 text-gray-700">
                                    <li class="flex gap-3">
                                        <span class="font-bold text-sage-medium">1.</span>
                                        <span>Select a module from the dropdown above</span>
                                    </li>
                                    <li class="flex gap-3">
                                        <span class="font-bold text-sage-medium">2.</span>
                                        <span>Choose your preferred AI model</span>
                                    </li>
                                    <li class="flex gap-3">
                                        <span class="font-bold text-sage-medium">3.</span>
                                        <span>Ask questions and explore the topic through dialogue</span>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <!-- Chat Input -->
                    <div class="bg-white border-t border-gray-200 p-4">
                        <form id="chat-form" onsubmit="sendChatMessage(event)">
                            <div class="max-w-3xl mx-auto">
                                <div class="flex gap-2 items-end">
                                    <textarea
                                        id="chat-input"
                                        placeholder="Ask a question about the module..."
                                        rows="1"
                                        disabled
                                        class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none resize-none disabled:bg-gray-100"
                                    ></textarea>
                                    <button type="submit" id="send-btn" disabled title="Send message"
                                        class="bg-sage-medium text-white px-6 py-3 rounded-lg hover:bg-sage-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                                        <span class="text-xl">→</span>
                                    </button>
                                </div>
                                <div class="flex justify-between items-center mt-2 text-sm">
                                    <span class="flex items-center gap-2 text-gray-600" id="chat-status">
                                        <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
                                        Select a module to begin
                                    </span>
                                    <span class="flex items-center gap-2 text-gray-600" id="active-model-badge">
                                        <span>Model:</span>
                                        <span class="font-medium" id="active-model-name">No model selected</span>
                                    </span>
                                </div>
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
                            <button onclick="openPDFViewer(1, 'Chapter 1 - What is Art History.pdf')" style="padding: 6px 12px; background: #C07047; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; margin-right: 8px;">🧪 Test PDF</button>
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
        title: '🧠 Memory Inspector v2.0',
        description: 'Visualize the 5-layer memory architecture with real-time context assembly',
        content: `
            <div class="p-6 space-y-6">
                <!-- Selector Card -->
                <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Select Context to Inspect</h3>
                    <p class="text-sm text-gray-600 mb-5">Choose a class, module, student, and optionally a specific conversation to see how HARV builds memory context.</p>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Class</label>
                            <select id="inspector-class-select" onchange="window.inspectorV2_classChanged?.()"
                                class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-sage-medium outline-none transition-all">
                                <option value="">Select a class...</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Module</label>
                            <select id="inspector-module-select" onchange="window.inspectorV2_moduleChanged?.()" disabled
                                class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-sage-medium outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-all">
                                <option value="">Select a module...</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Student</label>
                            <select id="inspector-student-select" onchange="window.inspectorV2_studentChanged?.()" disabled
                                class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-sage-medium outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-all">
                                <option value="">Select a student...</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Conversation</label>
                            <select id="inspector-conversation-select" disabled
                                class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-sage-medium outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-all">
                                <option value="">No filter (all)</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex gap-3">
                        <button id="load-memory-btn" onclick="window.inspectorV2_loadMemory?.()" disabled
                            class="bg-sage-medium text-white px-6 py-3 rounded-lg hover:bg-sage-dark transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                            <i data-lucide="brain" style="width: 20px; height: 20px;"></i>
                            Load Memory System
                        </button>
                        <div class="text-sm text-gray-500 flex items-center">
                            <span id="inspector-status-text">Select a class to begin</span>
                        </div>
                    </div>
                </div>

                <!-- Memory Inspector v2 Container -->
                <div id="memory-inspector-v2-container">
                    <!-- Context Metrics (rendered by JS) -->
                    <div id="context-metrics-container" style="display: none;"></div>

                    <!-- 5-Layer Memory Display (rendered by JS) -->
                    <div id="memory-layers-container" style="display: none;"></div>

                    <!-- Assembled Prompt (rendered by JS) -->
                    <div id="assembled-prompt-container" style="display: none;"></div>
                </div>

                <!-- Empty State -->
                <div id="memory-inspector-empty" class="bg-white rounded-lg shadow-sm border-2 border-gray-300 p-12 text-center">
                    <div class="text-6xl mb-4">🧠</div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">Welcome to Memory Inspector v2.0</h3>
                    <p class="text-gray-600 max-w-2xl mx-auto">
                        Select a class, module, and student above to visualize how HARV's 5-layer memory architecture
                        assembles personalized learning contexts in real-time.
                    </p>
                    <div class="mt-6 grid grid-cols-5 gap-4 max-w-3xl mx-auto text-left">
                        <div class="p-3 bg-blue-50 rounded-lg">
                            <div class="font-semibold text-blue-900 text-sm">Layer 1: System</div>
                            <div class="text-xs text-blue-700 mt-1">User profile & preferences</div>
                        </div>
                        <div class="p-3 bg-green-50 rounded-lg">
                            <div class="font-semibold text-green-900 text-sm">Layer 2: Module</div>
                            <div class="text-xs text-green-700 mt-1">Module context & goals</div>
                        </div>
                        <div class="p-3 bg-yellow-50 rounded-lg">
                            <div class="font-semibold text-yellow-900 text-sm">Layer 3: Conversation</div>
                            <div class="text-xs text-yellow-700 mt-1">Session history</div>
                        </div>
                        <div class="p-3 bg-purple-50 rounded-lg">
                            <div class="font-semibold text-purple-900 text-sm">Layer 4: Prior Knowledge</div>
                            <div class="text-xs text-purple-700 mt-1">Learning progress</div>
                        </div>
                        <div class="p-3 bg-orange-50 rounded-lg">
                            <div class="font-semibold text-orange-900 text-sm">Layer 5: Documents</div>
                            <div class="text-xs text-orange-700 mt-1">Reference materials</div>
                        </div>
                    </div>
                </div>
            </div>

            <script>
            // Load Memory Inspector v2 JavaScript
            (function() {
                if (window.memoryInspectorV2Loaded) {
                    console.log('[Memory Inspector] Already loaded, re-initializing...');
                    if (window.inspectorV2_init) window.inspectorV2_init();
                    return;
                }

                const script = document.createElement('script');
                script.src = 'js/memory_inspector_v2.js?v=' + Date.now();
                script.onload = function() {
                    console.log('[Memory Inspector] v2 JavaScript loaded successfully');
                    window.memoryInspectorV2Loaded = true;
                    // Initialize icons
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                };
                script.onerror = function() {
                    console.error('[Memory Inspector] Failed to load v2 JavaScript');
                    document.getElementById('memory-inspector-empty').innerHTML = \`
                        <div class="text-center py-12">
                            <div class="text-6xl mb-4">⚠️</div>
                            <h3 class="text-xl font-bold text-red-600 mb-2">Failed to Load Memory Inspector</h3>
                            <p class="text-gray-600">Could not load required JavaScript file. Please refresh the page.</p>
                        </div>
                    \`;
                };
                document.head.appendChild(script);
            })();
            </script>
        `
    },
    'class-hierarchy': {
        title: '🏛️ Class Hierarchy',
        description: 'Navigate your course structure with expandable class and module cards',
        content: `
            <div class="p-6 space-y-6">
                <!-- Controls Card -->
                <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 p-6">
                    <div class="flex flex-wrap gap-4 items-center justify-between">
                        <div class="flex-1 min-w-[300px]">
                            <div class="relative">
                                <input
                                    type="text"
                                    id="hierarchy-search"
                                    placeholder="Search classes or modules..."
                                    class="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-sage-medium outline-none transition-all"
                                />
                                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔍</span>
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <button id="expand-all-btn" onclick="window.hierarchyExpandAll?.()"
                                class="bg-sage-medium text-white px-4 py-3 rounded-lg hover:bg-sage-dark transition-colors font-semibold flex items-center gap-2">
                                <span>📖</span> Expand All
                            </button>
                            <button id="collapse-all-btn" onclick="window.hierarchyCollapseAll?.()"
                                class="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center gap-2">
                                <span>📕</span> Collapse All
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Stats Overview -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 p-6 text-center">
                        <div class="text-3xl font-bold text-sage-dark mb-1" id="total-classes">0</div>
                        <div class="text-sm text-gray-600 font-semibold uppercase tracking-wide">Total Classes</div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 p-6 text-center">
                        <div class="text-3xl font-bold text-terracotta mb-1" id="total-modules">0</div>
                        <div class="text-sm text-gray-600 font-semibold uppercase tracking-wide">Total Modules</div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 p-6 text-center">
                        <div class="text-3xl font-bold text-sage-dark mb-1" id="active-students">0</div>
                        <div class="text-sm text-gray-600 font-semibold uppercase tracking-wide">Active Students</div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 p-6 text-center">
                        <div class="text-3xl font-bold text-terracotta mb-1" id="completion-rate">0%</div>
                        <div class="text-sm text-gray-600 font-semibold uppercase tracking-wide">Avg Completion</div>
                    </div>
                </div>

                <!-- Class Tree Container -->
                <div id="class-tree-container" class="space-y-4">
                    <!-- Classes will be rendered here by JS -->
                </div>

                <!-- Empty State -->
                <div id="hierarchy-empty-state" class="bg-white rounded-lg shadow-sm border-2 border-gray-300 p-12 text-center" style="display: none;">
                    <div class="text-6xl mb-4">📚</div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">No Classes Found</h3>
                    <p class="text-gray-600">No classes match your search criteria</p>
                </div>

                <!-- Loading State -->
                <div id="hierarchy-loading-state" class="bg-white rounded-lg shadow-sm border-2 border-gray-300 p-12 text-center">
                    <div class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-sage-medium border-r-transparent mb-4"></div>
                    <p class="text-gray-600">Loading class hierarchy...</p>
                </div>
            </div>

            <script>
            // Load Class Hierarchy JavaScript
            (function() {
                if (window.classHierarchyLoaded) {
                    console.log('[Class Hierarchy] Already loaded, re-initializing...');
                    if (window.hierarchyInit) window.hierarchyInit();
                    return;
                }

                const script = document.createElement('script');
                script.src = 'js/class_hierarchy.js?v=' + Date.now();
                script.onload = function() {
                    console.log('[Class Hierarchy] JavaScript loaded successfully');
                    window.classHierarchyLoaded = true;
                };
                script.onerror = function() {
                    console.error('[Class Hierarchy] Failed to load JavaScript');
                    document.getElementById('hierarchy-loading-state').innerHTML = \`
                        <div class="text-center py-12">
                            <div class="text-6xl mb-4">⚠️</div>
                            <h3 class="text-xl font-bold text-red-600 mb-2">Failed to Load Class Hierarchy</h3>
                            <p class="text-gray-600">Could not load required JavaScript file. Please refresh the page.</p>
                        </div>
                    \`;
                };
                document.head.appendChild(script);
            })();
            </script>
        `
    },
    'learning-journeys': {
        title: '🎓 Learning Journeys',
        description: 'Track student progress, performance metrics, and learning insights',
        content: `
            <div class="p-6 space-y-6">
                <!-- Student Selector Card -->
                <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Select Student</h3>
                    <p class="text-sm text-gray-600 mb-4">Choose a student to view their learning journey, progress timeline, and insights.</p>

                    <div class="flex gap-4 items-center">
                        <div class="flex-1">
                            <select id="student-select" onchange="window.journeysStudentChanged?.()"
                                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-sage-medium outline-none transition-all text-lg">
                                <option value="">Choose a student...</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Dashboard Content (Hidden until student selected) -->
                <div id="dashboard-content" style="display: none;">
                    <!-- Student Overview -->
                    <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 p-6 mb-6">
                        <div class="flex items-start gap-6">
                            <div class="text-6xl">👤</div>
                            <div class="flex-1">
                                <h2 class="text-2xl font-bold text-gray-900 mb-1" id="student-name">Student Name</h2>
                                <p class="text-gray-600 mb-2" id="student-email">email@example.com</p>
                                <div class="text-sm text-gray-500">
                                    <span id="student-level">Beginner</span> • <span id="student-style">Visual Learner</span>
                                </div>
                            </div>
                            <div class="flex gap-6">
                                <div class="text-center">
                                    <div class="text-3xl font-bold text-sage-dark" id="total-modules-enrolled">0</div>
                                    <div class="text-xs text-gray-600 font-semibold uppercase">Modules</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-3xl font-bold text-terracotta" id="modules-completed">0</div>
                                    <div class="text-xs text-gray-600 font-semibold uppercase">Completed</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-3xl font-bold text-sage-dark" id="hours-spent">0h</div>
                                    <div class="text-xs text-gray-600 font-semibold uppercase">Time Spent</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Progress Metrics -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 p-6">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="text-3xl">📊</div>
                                <div>
                                    <div class="text-sm text-gray-600 font-semibold">Overall Progress</div>
                                    <div class="text-2xl font-bold text-sage-dark" id="overall-progress">0%</div>
                                </div>
                            </div>
                            <div class="bg-gray-200 rounded-full h-2">
                                <div class="bg-sage-medium rounded-full h-2 transition-all duration-500" id="overall-progress-bar" style="width: 0%"></div>
                            </div>
                        </div>

                        <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 p-6">
                            <div class="flex items-center gap-3">
                                <div class="text-3xl">⭐</div>
                                <div>
                                    <div class="text-sm text-gray-600 font-semibold">Average Score</div>
                                    <div class="text-2xl font-bold text-terracotta" id="average-score">0%</div>
                                    <div class="text-xs text-gray-500" id="score-trend">No data yet</div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 p-6">
                            <div class="flex items-center gap-3">
                                <div class="text-3xl">🔥</div>
                                <div>
                                    <div class="text-sm text-gray-600 font-semibold">Current Streak</div>
                                    <div class="text-2xl font-bold text-sage-dark" id="current-streak">0 days</div>
                                    <div class="text-xs text-gray-500" id="longest-streak">Longest: 0 days</div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 p-6">
                            <div class="flex items-center gap-3">
                                <div class="text-3xl">🧠</div>
                                <div>
                                    <div class="text-sm text-gray-600 font-semibold">Memory Insights</div>
                                    <div class="text-2xl font-bold text-terracotta" id="insights-count">0</div>
                                    <div class="text-xs text-gray-500">Generated summaries</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Module Progress Timeline -->
                    <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 p-6 mb-6">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-xl font-bold text-gray-900">📚 Module Progress Timeline</h3>
                            <div class="flex gap-2">
                                <button class="filter-btn px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-sage-medium text-white" data-filter="all" onclick="window.journeysSetFilter?.('all')">All</button>
                                <button class="filter-btn px-4 py-2 rounded-lg text-sm font-semibold transition-colors border-2 border-gray-300 text-gray-700 hover:border-sage-medium" data-filter="in-progress" onclick="window.journeysSetFilter?.('in-progress')">In Progress</button>
                                <button class="filter-btn px-4 py-2 rounded-lg text-sm font-semibold transition-colors border-2 border-gray-300 text-gray-700 hover:border-sage-medium" data-filter="completed" onclick="window.journeysSetFilter?.('completed')">Completed</button>
                            </div>
                        </div>
                        <div id="timeline-container">
                            <!-- Timeline items will be rendered here -->
                        </div>
                    </div>

                    <!-- Insights and Activity -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 p-6">
                            <h3 class="text-xl font-bold text-gray-900 mb-4">💡 Learning Insights</h3>
                            <div id="insights-container">
                                <!-- Insights will be rendered here -->
                            </div>
                        </div>

                        <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 p-6">
                            <h3 class="text-xl font-bold text-gray-900 mb-4">📈 Recent Activity</h3>
                            <div id="activity-container">
                                <!-- Activity will be rendered here -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State (Before student selection) -->
                <div id="empty-state" class="bg-white rounded-lg shadow-sm border-2 border-gray-300 p-12 text-center">
                    <div class="text-6xl mb-4">🎓</div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Select a Student to View Their Learning Journey</h2>
                    <p class="text-gray-600 max-w-2xl mx-auto">Choose a student from the dropdown above to see their progress, insights, and achievements</p>
                </div>

                <!-- Loading State -->
                <div id="loading-state" class="bg-white rounded-lg shadow-sm border-2 border-gray-300 p-12 text-center" style="display: none;">
                    <div class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-sage-medium border-r-transparent mb-4"></div>
                    <p class="text-gray-600">Loading learning journey...</p>
                </div>
            </div>

            <script>
            // Load Learning Journeys JavaScript
            (function() {
                if (window.learningJourneysLoaded) {
                    console.log('[Learning Journeys] Already loaded, re-initializing...');
                    if (window.journeysInit) window.journeysInit();
                    return;
                }

                const script = document.createElement('script');
                script.src = 'js/learning_journeys.js?v=' + Date.now();
                script.onload = function() {
                    console.log('[Learning Journeys] JavaScript loaded successfully');
                    window.learningJourneysLoaded = true;
                };
                script.onerror = function() {
                    console.error('[Learning Journeys] Failed to load JavaScript');
                    document.getElementById('empty-state').innerHTML = \`
                        <div class="text-center py-12">
                            <div class="text-6xl mb-4">⚠️</div>
                            <h3 class="text-xl font-bold text-red-600 mb-2">Failed to Load Learning Journeys</h3>
                            <p class="text-gray-600">Could not load required JavaScript file. Please refresh the page.</p>
                        </div>
                    \`;
                };
                document.head.appendChild(script);
            })();
            </script>
        `
    }
};

// Load section content
function loadSection(sectionName) {
    const section = sections[sectionName];
    const contentDiv = document.getElementById('content');

    contentDiv.innerHTML = `
        <div class="bg-white rounded-lg border-2 border-gray-300 px-6 py-4 mb-6 shadow-sm">
            <h2 class="text-2xl font-bold text-gray-900">${section.title}</h2>
            <p class="text-gray-600 mt-1">${section.description}</p>
        </div>
        ${section.content}
    `;

    // Auto-load admin dashboard
    if (sectionName === 'admin-dashboard') {
        setTimeout(() => {
            loadAdminDashboard();
            // Initialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 100);
    }

    // Auto-load student dashboard
    if (sectionName === 'student-dashboard') {
        setTimeout(() => loadStudentDashboard(), 100);
    }

    // Auto-load classes section
    if (sectionName === 'classes') {
        setTimeout(() => loadClassesSection(), 100);
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
            loadChatProviders();
        }, 100);
    }

    // Auto-load memory inspector
    if (sectionName === 'memory') {
        setTimeout(() => {
            loadMemoryInspector();
        }, 100);
    }

    // Auto-load system settings
    if (sectionName === 'system') {
        setTimeout(() => {
            loadApiKeySettings();
        }, 100);
    }
}

// Authentication Functions
let currentUser = null;
let authToken = null;
let isAuthenticated = false;

// Helper function to get auth headers
function getAuthHeaders() {
    // Check both 'access_token' (used by app) and 'authToken' (used by v2 components)
    const token = localStorage.getItem('access_token') || localStorage.getItem('authToken') || authToken;

    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

// Initialize app - check for existing authentication
async function initializeApp() {
    const storedToken = localStorage.getItem('access_token');

    if (storedToken) {
        // Try to validate the token and get user info
        try {
            const response = await fetch(`${API_BASE}/users/me`, {
                headers: { 'Authorization': `Bearer ${storedToken}` }
            });

            if (response.ok) {
                const user = await response.json();
                currentUser = user;
                authToken = storedToken;
                isAuthenticated = true;

                // Hide auth overlay, show main app
                document.getElementById('auth-overlay').style.display = 'none';
                document.getElementById('main-app').style.display = 'block';

                // Set user name in top bar
                document.getElementById('user-name').textContent = user.name || user.email;

                // Build navigation menu based on role
                buildNavigationMenu();

                // Navigate to appropriate dashboard
                const targetSection = user.is_admin ? 'admin-dashboard' : 'student-dashboard';
                switchSection(targetSection);

                // Initialize Lucide icons
                setTimeout(() => {
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }, 200);

                return;
            }
        } catch (error) {
            console.log('Token validation failed:', error);
        }

        // If token validation failed, clear it
        localStorage.removeItem('access_token');
    }

    // Show auth overlay if not authenticated
    document.getElementById('auth-overlay').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';
}

// Auth overlay functions
function showAuthLogin() {
    document.getElementById('auth-login-card').style.display = 'block';
    document.getElementById('auth-register-card').style.display = 'none';
    document.getElementById('auth-register-form').reset();
}

function showAuthRegister() {
    document.getElementById('auth-login-card').style.display = 'none';
    document.getElementById('auth-register-card').style.display = 'block';
    document.getElementById('auth-login-form').reset();
}

function toggleAuthStudentFields() {
    const role = document.getElementById('auth-register-role').value;
    const studentFields = document.getElementById('auth-student-fields');
    studentFields.style.display = role === 'student' ? 'block' : 'none';
}

async function handleAuthLogin(event) {
    event.preventDefault();

    const email = document.getElementById('auth-login-email').value;
    const password = document.getElementById('auth-login-password').value;

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
            isAuthenticated = true;
            localStorage.setItem('access_token', data.access_token);

            // Hide auth overlay, show main app
            document.getElementById('auth-overlay').style.display = 'none';
            document.getElementById('main-app').style.display = 'block';

            // Set user name in top bar
            document.getElementById('user-name').textContent = data.user.name || data.user.email;

            // Build navigation menu based on role
            buildNavigationMenu();

            // Navigate to appropriate dashboard
            const targetSection = data.user.is_admin ? 'admin-dashboard' : 'student-dashboard';
            switchSection(targetSection);

            // Initialize Lucide icons
            setTimeout(() => {
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }, 200);

            NotificationSystem.success(`Welcome back, ${data.user.name}!`);
            document.getElementById('auth-login-form').reset();
        } else {
            NotificationSystem.error(data.detail || 'Login failed');
        }
    } catch (error) {
        NotificationSystem.error('Login error: ' + error.message);
    }
}

async function handleAuthRegister(event) {
    event.preventDefault();

    const role = document.getElementById('auth-register-role').value;
    const name = document.getElementById('auth-register-name').value;
    const email = document.getElementById('auth-register-email').value;
    const password = document.getElementById('auth-register-password').value;
    const ageGrade = document.getElementById('auth-register-age-grade').value;
    const learningNotes = document.getElementById('auth-register-learning-notes').value;

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
                name,
                role,
                age_grade_level: ageGrade,
                learning_notes: learningNotes
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            NotificationSystem.success('Account created! Please log in.');
            showAuthLogin();
            // Pre-fill email for convenience
            document.getElementById('auth-login-email').value = email;
        } else {
            NotificationSystem.error(data.detail || 'Registration failed');
        }
    } catch (error) {
        NotificationSystem.error('Registration error: ' + error.message);
    }
}

function handleAppLogout() {
    currentUser = null;
    authToken = null;
    isAuthenticated = false;
    localStorage.removeItem('access_token');

    // Show auth overlay, hide main app
    document.getElementById('auth-overlay').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';

    // Reset to login screen
    showAuthLogin();

    NotificationSystem.info('Logged out successfully');
}

// Auto-login for testing (remove in production)
async function autoLoginForTesting(role = 'admin') {
    try {
        const credentials = role === 'student'
            ? { email: 'student@harv.com', password: 'student123' }
            : { email: 'admin@harv.com', password: 'admin123' };

        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            currentUser = data.user;
            authToken = data.access_token;
            localStorage.setItem('access_token', data.access_token);  // Save to localStorage for classes.js
            console.log(`✅ Auto-logged in as ${role} for testing`);
        } else {
            console.log('Auto-login failed, manual login required');
        }
    } catch (error) {
        console.log('Auto-login error:', error.message);
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
            NotificationSystem.error(data.detail || 'Login failed');
        }
    } catch (error) {
        NotificationSystem.error('Login error: ' + error.message);
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
            NotificationSystem.success(`${role === 'admin' ? 'Admin' : 'Student'} account created successfully! Please log in.`);
            showLogin();
        } else {
            NotificationSystem.error(data.detail || 'Registration failed');
        }
    } catch (error) {
        NotificationSystem.error('Registration error: ' + error.message);
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

// API Key Management Functions
async function loadApiKeySettings() {
    const container = document.getElementById('api-keys-container');
    container.innerHTML = '<p class="text-gray-500 text-center">Loading API key settings...</p>';

    try {
        const response = await fetch(`${API_BASE}/system/api-keys`);
        if (!response.ok) throw new Error('Failed to load API keys');

        const providers = await response.json();

        let html = '<div class="space-y-4">';
        for (const [providerId, provider] of Object.entries(providers)) {
            html += `
                <div class="border-2 border-gray-200 rounded-lg p-4">
                    <div class="flex items-start justify-between mb-3">
                        <div>
                            <h4 class="font-bold text-gray-900 text-lg">${provider.name}</h4>
                            <p class="text-sm text-gray-600 mt-1">${provider.description}</p>
                        </div>
                        <span class="px-3 py-1 rounded-full text-xs font-medium ${provider.key ? 'bg-sage-lighter text-sage-darkest' : 'bg-gray-100 text-gray-600'}">
                            ${provider.key ? 'Configured' : 'Not Set'}
                        </span>
                    </div>
                    <div class="flex gap-2">
                        <input
                            type="password"
                            id="api-key-${providerId}"
                            placeholder="${provider.key ? 'Enter new key to replace' : 'Enter API key'}"
                            value="${provider.key || ''}"
                            class="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-sage-medium focus:outline-none text-sm"
                        >
                        <button
                            onclick="toggleApiKeyVisibility('${providerId}')"
                            class="px-3 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            title="Toggle visibility"
                        >
                            Show
                        </button>
                        <button
                            onclick="saveApiKey('${providerId}')"
                            class="px-4 py-2 bg-sage-medium text-white rounded-lg hover:bg-sage-dark transition-colors font-medium text-sm"
                        >
                            Save
                        </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">Environment variable: <code class="bg-gray-100 px-2 py-1 rounded">${provider.env_var}</code></p>
                </div>
            `;
        }
        html += '</div>';

        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading API keys:', error);
        container.innerHTML = '<p class="text-red-500 text-center">Failed to load API key settings</p>';
    }
}

function toggleApiKeyVisibility(providerId) {
    const input = document.getElementById(`api-key-${providerId}`);
    input.type = input.type === 'password' ? 'text' : 'password';
}

async function saveApiKey(providerId) {
    const input = document.getElementById(`api-key-${providerId}`);
    const apiKey = input.value.trim();

    if (!apiKey) {
        NotificationSystem.warning('Please enter an API key');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/system/api-keys`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                provider: providerId,
                api_key: apiKey
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to save API key');
        }

        const result = await response.json();
        NotificationSystem.success(`${providerId.toUpperCase()} API key saved successfully`);

        // Update the input to show masked key
        input.value = result.masked_key;
        input.type = 'password';

        // Reload the settings to show updated status
        setTimeout(() => loadApiKeySettings(), 1000);
    } catch (error) {
        console.error('Error saving API key:', error);
        NotificationSystem.error(`Failed to save API key: ${error.message}`);
    }
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
        NotificationSystem.error('Failed to load dashboard analytics. Make sure you are logged in as admin.');
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

// ===== DASHBOARD FUNCTIONS =====

async function loadAdminDashboard() {
    try {
        const response = await fetch(`${API_BASE}/users`, { headers: getAuthHeaders() });
        const data = await response.json();
        const users = Array.isArray(data) ? data : (data.users || []);

        const adminsTableBody = document.getElementById('admin-admins-table');
        const studentsTableBody = document.getElementById('admin-students-table');

        // Split users into admins and students
        const admins = users.filter(u => u.is_admin);
        const students = users.filter(u => !u.is_admin);

        // Render admins table
        if (admins.length === 0) {
            adminsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">No administrators found</td>
                </tr>
            `;
        } else {
            adminsTableBody.innerHTML = admins.map(user => `
                <tr class="hover:bg-gray-50 transition-colors" id="user-row-${user.id}">
                    <td class="px-6 py-4">
                        <input type="text"
                            id="name-${user.id}"
                            value="${user.name || ''}"
                            class="w-full border-2 border-gray-300 rounded-lg px-2 py-1 text-sm font-medium text-gray-900 focus:border-terracotta-500 focus:outline-none"
                            onchange="updateUserField(${user.id}, 'name', this.value)"
                        />
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm text-gray-700">${user.email}</div>
                    </td>
                    <td class="px-6 py-4 text-center">
                        <div class="text-2xl font-bold text-terracotta-600">${user.classes_created || 0}</div>
                        <div class="text-xs text-gray-500">classes</div>
                    </td>
                    <td class="px-6 py-4 text-center">
                        <div class="text-2xl font-bold text-terracotta-600">${user.modules_created || 0}</div>
                        <div class="text-xs text-gray-500">modules</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <button onclick="viewStudentConversations(${user.id})" class="text-terracotta-600 hover:text-terracotta-800 font-medium mr-2">
                            View History
                        </button>
                        <button onclick="deleteUser(${user.id}, '${user.name}', 'admin')" class="text-red-600 hover:text-red-800 font-medium">
                            Delete
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        // Render students table
        if (students.length === 0) {
            studentsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">No students registered yet</td>
                </tr>
            `;
        } else {
            studentsTableBody.innerHTML = students.map(user => `
                <tr class="hover:bg-gray-50 transition-colors" id="user-row-${user.id}">
                    <td class="px-6 py-4">
                        <input type="text"
                            id="name-${user.id}"
                            value="${user.name || ''}"
                            class="w-full border-2 border-gray-300 rounded-lg px-2 py-1 text-sm font-medium text-gray-900 focus:border-terracotta-500 focus:outline-none"
                            onchange="updateUserField(${user.id}, 'name', this.value)"
                        />
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm text-gray-700">${user.email}</div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm space-y-1">
                            ${user.age_grade_level ? `<div><span class="font-medium text-gray-600">Age/Grade:</span> <span class="text-gray-800">${user.age_grade_level}</span></div>` : ''}
                            ${user.learning_style ? `<div><span class="font-medium text-gray-600">Style:</span> <span class="text-gray-800">${user.learning_style}</span></div>` : ''}
                            ${user.familiarity ? `<div><span class="font-medium text-gray-600">Familiarity:</span> <span class="text-gray-800">${user.familiarity}</span></div>` : ''}
                            ${user.goals ? `<div class="text-xs text-gray-500 italic mt-1">"${user.goals.substring(0, 50)}${user.goals.length > 50 ? '...' : ''}"</div>` : ''}
                            ${!user.age_grade_level && !user.learning_style && !user.familiarity && !user.goals ? '<span class="text-gray-400">No profile data</span>' : ''}
                        </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                        <div class="flex gap-4 justify-center">
                            <div>
                                <div class="text-2xl font-bold text-terracotta-600">${user.classes_completed || 0}</div>
                                <div class="text-xs text-gray-500">classes</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-terracotta-600">${user.modules_completed || 0}</div>
                                <div class="text-xs text-gray-500">modules</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <button onclick="viewStudentConversations(${user.id})" class="text-terracotta-600 hover:text-terracotta-800 font-medium mr-2">
                            View History
                        </button>
                        <button onclick="deleteUser(${user.id}, '${user.name}', 'student')" class="text-red-600 hover:text-red-800 font-medium">
                            Delete
                        </button>
                    </td>
                </tr>
            `).join('');
        }

    } catch (error) {
        console.error('Error loading admin dashboard:', error);
        const adminsTableBody = document.getElementById('admin-admins-table');
        const studentsTableBody = document.getElementById('admin-students-table');
        adminsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-4 text-center text-red-500">Failed to load administrators</td>
            </tr>
        `;
        studentsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-4 text-center text-red-500">Failed to load students</td>
            </tr>
        `;
    }
}

// View student conversation history
async function viewStudentConversations(userId) {
    try {
        const response = await fetch(`${API_BASE}/conversations?user_id=${userId}`, { headers: getAuthHeaders() });
        const data = await response.json();
        const conversations = Array.isArray(data) ? data : (data.conversations || []);

        // Switch to conversations view and filter by user
        switchSection('conversations');
        setTimeout(() => {
            // Trigger filter if the conversations section supports it
            const filterInput = document.querySelector('#conversation-filter');
            if (filterInput) {
                filterInput.value = userId;
                filterInput.dispatchEvent(new Event('input'));
            }
        }, 100);
    } catch (error) {
        console.error('Error viewing student conversations:', error);
        NotificationSystem.error('Failed to load student conversations');
    }
}

// Delete student
async function deleteStudent(userId, userName) {
    ModalSystem.confirm(
        'Delete Student',
        `Are you sure you want to delete ${userName}? This will permanently delete all their conversations, progress, and memory data.`,
        async () => {
            try {
                ModalSystem.loading('Deleting student...');

                const response = await fetch(`${API_BASE}/users/${userId}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders()
                });

                if (!response.ok) throw new Error('Failed to delete student');

                ModalSystem.close();
                NotificationSystem.success(`Student ${userName} deleted successfully`);
                loadAdminDashboard(); // Reload the dashboard
            } catch (error) {
                console.error('Error deleting student:', error);
                ModalSystem.close();
                NotificationSystem.error('Failed to delete student');
            }
        }
    );
}

// Show add student modal
function showAddStudentModal() {
    ModalSystem.prompt(
        'Add New Student',
        'This feature requires backend support for creating users. Use the registration page instead.',
        '',
        () => {
            switchSection('auth');
        }
    );
}

async function loadStudentDashboard() {
    try {
        // Get current user info
        const userRes = await fetch(`${API_BASE}/users/me`, { headers: getAuthHeaders() });
        const user = await userRes.json();

        // Update welcome message
        document.getElementById('student-name').textContent = user.name || 'Student';

        // Get student's survey data if available
        let surveyData = null;
        const surveyRes = await fetch(`${API_BASE}/surveys/${user.id}`, { headers: getAuthHeaders() });
        if (surveyRes.ok) {
            surveyData = await surveyRes.json();
            document.getElementById('student-subtitle').textContent =
                `${surveyData.age_grade_level || 'Student'} • ${surveyData.learning_style || 'Visual learner'}`;
        } else {
            document.getElementById('student-subtitle').textContent = 'Complete your learning profile to get started';
        }

        // Get all classes, student's conversations, and modules
        const [classesRes, convsRes, modulesRes] = await Promise.all([
            fetch(`${API_BASE}/classes`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/conversations?user_id=${user.id}`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/modules`, { headers: getAuthHeaders() })
        ]);

        const classesData = await classesRes.json();
        const convsData = await convsRes.json();
        const modulesData = await modulesRes.json();

        const classes = Array.isArray(classesData) ? classesData : (classesData.classes || []);
        const conversations = Array.isArray(convsData) ? convsData : (convsData.conversations || []);
        const allModules = Array.isArray(modulesData) ? modulesData : (modulesData.modules || []);

        // Build classes grid with cards
        const classesContainer = document.getElementById('student-classes-grid');

        if (classes.length === 0) {
            classesContainer.innerHTML = `
                <div style="text-align: center; grid-column: 1 / -1; padding: 60px 20px; color: #6b7280;">
                    <p style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">No classes yet</p>
                    <p style="font-size: 14px;">Join a class to start learning!</p>
                </div>
            `;
            return;
        }

        // Group conversations by module
        const moduleProgress = {};
        conversations.forEach(conv => {
            if (conv.module_id) {
                moduleProgress[conv.module_id] = (moduleProgress[conv.module_id] || 0) + 1;
            }
        });

        classesContainer.innerHTML = classes.map(cls => {
            const classModules = cls.modules || [];
            const completedModules = classModules.filter(m => moduleProgress[m.id]).length;
            const totalModules = classModules.length;
            const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

            return `
                <div style="background: white; border-radius: 16px; border: 2px solid #C9C4B6; overflow: hidden; transition: all 0.3s; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.05);"
                     onmouseover="this.style.borderColor='#9CAA5A'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.1)'"
                     onmouseout="this.style.borderColor='#C9C4B6'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.05)'"
                     onclick="navigateTo('chat')">

                    <!-- Card Header -->
                    <div style="background: linear-gradient(135deg, #9CAA5A 0%, #88954D 100%); padding: 24px; color: white;">
                        <h4 style="font-size: 20px; font-weight: 700; margin: 0 0 8px 0; color: white;">${cls.title}</h4>
                        <p style="font-size: 14px; opacity: 0.95; margin: 0; color: white;">${totalModules} module${totalModules !== 1 ? 's' : ''}</p>
                    </div>

                    <!-- Card Body -->
                    <div style="padding: 24px;">
                        <!-- Progress -->
                        <div style="margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span style="font-size: 14px; font-weight: 600; color: #88826F;">Progress</span>
                                <span style="font-size: 24px; font-weight: 800; color: #9CAA5A;">${progressPercent}%</span>
                            </div>
                            <div style="width: 100%; height: 8px; background: #E3DEC9; border-radius: 999px; overflow: hidden;">
                                <div style="height: 100%; background: #9CAA5A; border-radius: 999px; width: ${progressPercent}%; transition: width 0.3s;"></div>
                            </div>
                            <div style="font-size: 12px; color: #9F9A8A; margin-top: 6px;">
                                ${completedModules} of ${totalModules} completed
                            </div>
                        </div>

                        <!-- Description -->
                        ${cls.description ? `
                            <p style="font-size: 14px; color: #6E685A; margin: 0 0 16px 0; line-height: 1.6;">
                                ${cls.description.length > 100 ? cls.description.substring(0, 100) + '...' : cls.description}
                            </p>
                        ` : ''}

                        <!-- Action Button -->
                        <button style="width: 100%; background: #9CAA5A; color: white; padding: 12px; border: none; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s;"
                                onmouseover="this.style.background='#88954D'"
                                onmouseout="this.style.background='#9CAA5A'">
                            ${progressPercent === 0 ? 'Start Learning →' : 'Continue Learning →'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error loading student dashboard:', error);
        const classesContainer = document.getElementById('student-classes-grid');
        if (classesContainer) {
            classesContainer.innerHTML = `
                <div style="text-align: center; grid-column: 1 / -1; padding: 60px 20px; color: #ef4444;">
                    <p style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Failed to load classes</p>
                    <p style="font-size: 14px;">Please refresh the page and try again.</p>
                </div>
            `;
        }
        NotificationSystem.error('Failed to load student dashboard');
    }
}

// Show join class modal
function showJoinClassModal() {
    NotificationSystem.info('Join Class feature coming soon! For now, admins can assign you to classes.');
}

// Show student settings modal
async function showStudentSettings() {
    try {
        // Get current user info
        const userRes = await fetch(`${API_BASE}/users/me`, { headers: getAuthHeaders() });
        const user = await userRes.json();

        // Get survey data
        const surveyRes = await fetch(`${API_BASE}/surveys/${user.id}`, { headers: getAuthHeaders() });
        const survey = surveyRes.ok ? await surveyRes.json() : {};

        // Create settings modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        `;

        modal.innerHTML = `
            <h3 style="margin: 0 0 20px 0; color: #1f1f1f; font-size: 24px; font-weight: 700;">Profile Settings</h3>

            <form id="student-settings-form" style="display: flex; flex-direction: column; gap: 16px;">
                <div>
                    <label style="display: block; font-weight: 600; color: #2f2f2f; margin-bottom: 6px; font-size: 14px;">Name</label>
                    <input type="text" id="settings-name" value="${user.name || ''}"
                        style="width: 100%; padding: 10px 12px; border: 2px solid #d4d4d4; border-radius: 8px; font-size: 14px;" />
                </div>

                <div>
                    <label style="display: block; font-weight: 600; color: #2f2f2f; margin-bottom: 6px; font-size: 14px;">Email</label>
                    <input type="email" value="${user.email}" disabled
                        style="width: 100%; padding: 10px 12px; border: 2px solid #d4d4d4; border-radius: 8px; font-size: 14px; background: #f5f5f5; color: #8f8f8f;" />
                    <p style="font-size: 12px; color: #8f8f8f; margin-top: 4px;">Email cannot be changed</p>
                </div>

                <div>
                    <label style="display: block; font-weight: 600; color: #2f2f2f; margin-bottom: 6px; font-size: 14px;">Age/Grade Level</label>
                    <input type="text" id="settings-age" value="${survey.age_grade_level || ''}" placeholder="e.g., 10th grade, Adult learner"
                        style="width: 100%; padding: 10px 12px; border: 2px solid #d4d4d4; border-radius: 8px; font-size: 14px;" />
                </div>

                <div>
                    <label style="display: block; font-weight: 600; color: #2f2f2f; margin-bottom: 6px; font-size: 14px;">Learning Style</label>
                    <select id="settings-learning-style"
                        style="width: 100%; padding: 10px 12px; border: 2px solid #d4d4d4; border-radius: 8px; font-size: 14px;">
                        <option value="visual" ${survey.learning_style === 'visual' ? 'selected' : ''}>Visual</option>
                        <option value="auditory" ${survey.learning_style === 'auditory' ? 'selected' : ''}>Auditory</option>
                        <option value="reading" ${survey.learning_style === 'reading' ? 'selected' : ''}>Reading/Writing</option>
                        <option value="kinesthetic" ${survey.learning_style === 'kinesthetic' ? 'selected' : ''}>Kinesthetic</option>
                    </select>
                </div>

                <div>
                    <label style="display: block; font-weight: 600; color: #2f2f2f; margin-bottom: 6px; font-size: 14px;">Familiarity Level</label>
                    <select id="settings-familiarity"
                        style="width: 100%; padding: 10px 12px; border: 2px solid #d4d4d4; border-radius: 8px; font-size: 14px;">
                        <option value="beginner" ${survey.familiarity === 'beginner' ? 'selected' : ''}>Beginner</option>
                        <option value="intermediate" ${survey.familiarity === 'intermediate' ? 'selected' : ''}>Intermediate</option>
                        <option value="advanced" ${survey.familiarity === 'advanced' ? 'selected' : ''}>Advanced</option>
                    </select>
                </div>

                <div>
                    <label style="display: block; font-weight: 600; color: #2f2f2f; margin-bottom: 6px; font-size: 14px;">Learning Goals</label>
                    <textarea id="settings-goals" rows="3" placeholder="What do you want to achieve?"
                        style="width: 100%; padding: 10px 12px; border: 2px solid #d4d4d4; border-radius: 8px; font-size: 14px; resize: vertical;">${survey.goals || ''}</textarea>
                </div>

                <div>
                    <label style="display: block; font-weight: 600; color: #2f2f2f; margin-bottom: 6px; font-size: 14px;">Additional Notes</label>
                    <textarea id="settings-notes" rows="3" placeholder="Anything else we should know?"
                        style="width: 100%; padding: 10px 12px; border: 2px solid #d4d4d4; border-radius: 8px; font-size: 14px; resize: vertical;">${survey.learning_notes || ''}</textarea>
                </div>

                <div style="display: flex; gap: 10px; justify-content: flex-end; padding-top: 16px; border-top: 1px solid #d4d4d4;">
                    <button type="button" id="modal-cancel" style="
                        padding: 10px 20px;
                        border: 2px solid #d4d4d4;
                        background: white;
                        color: #2f2f2f;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 600;
                    ">Cancel</button>
                    <button type="submit" style="
                        padding: 10px 20px;
                        border: none;
                        background: #9CAA5A;
                        color: white;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 600;
                    ">Save Changes</button>
                </div>
            </form>
        `;

        modal.querySelector('#modal-cancel').onclick = () => ModalSystem.close();
        modal.querySelector('#student-settings-form').onsubmit = async (e) => {
            e.preventDefault();
            await saveStudentSettings(user.id);
        };

        ModalSystem.open(modal);

    } catch (error) {
        console.error('Error loading settings:', error);
        NotificationSystem.error('Failed to load settings');
    }
}

// Save student settings
async function saveStudentSettings(userId) {
    try {
        ModalSystem.loading('Saving settings...');

        const settingsData = {
            age_grade_level: document.getElementById('settings-age').value,
            learning_style: document.getElementById('settings-learning-style').value,
            familiarity: document.getElementById('settings-familiarity').value,
            goals: document.getElementById('settings-goals').value,
            learning_notes: document.getElementById('settings-notes').value
        };

        // Update survey data
        const response = await fetch(`${API_BASE}/surveys/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(settingsData)
        });

        if (!response.ok) throw new Error('Failed to update settings');

        ModalSystem.close();
        NotificationSystem.success('Settings updated successfully!');

        // Reload dashboard to show updated info
        loadStudentDashboard();

    } catch (error) {
        console.error('Error saving settings:', error);
        ModalSystem.close();
        NotificationSystem.error('Failed to save settings');
    }
}

// Load Students Table
// Update user field (inline editing)
async function updateUserField(userId, field, value) {
    try {
        const response = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify({ [field]: value })
        });

        if (!response.ok) {
            throw new Error('Failed to update user');
        }

        NotificationSystem.success(`User ${field} updated successfully`);
    } catch (error) {
        console.error('Error updating user:', error);
        NotificationSystem.error(`Failed to update user ${field}`);
        // Reload the table to revert the change
        loadAdminDashboard();
    }
}

// Show modal to add new user (admin or student)
function showAddUserModal(role) {
    const isAdmin = role === 'admin';
    const title = isAdmin ? 'Add New Administrator' : 'Add New Student';
    const buttonColor = isAdmin ? '#C07047' : '#C07047';

    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 24px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    `;

    modal.innerHTML = `
        <h3 style="margin: 0 0 20px 0; color: #1f1f1f; font-size: 20px; font-weight: 700;">${title}</h3>
        <form id="add-user-form" style="display: flex; flex-direction: column; gap: 16px;">
            <div>
                <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 6px;">Name</label>
                <input type="text" id="new-user-name" required placeholder="Full name"
                    style="width: 100%; padding: 10px 12px; border: 2px solid #d4d4d4; border-radius: 8px; font-size: 14px; box-sizing: border-box;">
            </div>
            <div>
                <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 6px;">Email</label>
                <input type="email" id="new-user-email" required placeholder="user@example.com"
                    style="width: 100%; padding: 10px 12px; border: 2px solid #d4d4d4; border-radius: 8px; font-size: 14px; box-sizing: border-box;">
            </div>
            <div>
                <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 6px;">Password</label>
                <input type="password" id="new-user-password" required placeholder="Minimum 6 characters"
                    style="width: 100%; padding: 10px 12px; border: 2px solid #d4d4d4; border-radius: 8px; font-size: 14px; box-sizing: border-box;">
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px;">
                <button type="button" id="modal-cancel" style="
                    padding: 10px 20px;
                    border: 2px solid #d4d4d4;
                    background: white;
                    color: #2f2f2f;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                ">Cancel</button>
                <button type="submit" style="
                    padding: 10px 20px;
                    border: none;
                    background: ${buttonColor};
                    color: white;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                ">Create ${isAdmin ? 'Admin' : 'Student'}</button>
            </div>
        </form>
    `;

    modal.querySelector('#modal-cancel').onclick = () => ModalSystem.close();
    modal.querySelector('#add-user-form').onsubmit = async (e) => {
        e.preventDefault();

        const name = document.getElementById('new-user-name').value.trim();
        const email = document.getElementById('new-user-email').value.trim();
        const password = document.getElementById('new-user-password').value;

        try {
            ModalSystem.loading(`Creating ${role}...`);

            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    is_admin: isAdmin
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to create user');
            }

            ModalSystem.close();
            NotificationSystem.success(`${isAdmin ? 'Administrator' : 'Student'} created successfully!`);
            loadAdminDashboard();
        } catch (error) {
            ModalSystem.close();
            NotificationSystem.error(error.message);
        }
    };

    ModalSystem.open(modal);
    setTimeout(() => document.getElementById('new-user-name').focus(), 100);
}

// Delete user (works for both students and admins)
function deleteUser(userId, userName, role) {
    const roleLabel = role === 'admin' ? 'administrator' : 'student';

    ModalSystem.confirm(
        `Delete ${roleLabel}`,
        `Are you sure you want to delete ${roleLabel} "${userName}"? This action cannot be undone and will remove all their data.`,
        async () => {
            try {
                ModalSystem.loading('Deleting user...');

                const response = await fetch(`${API_BASE}/users/${userId}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders()
                });

                if (!response.ok) {
                    throw new Error('Failed to delete user');
                }

                ModalSystem.close();
                NotificationSystem.success(`${roleLabel} deleted successfully`);
                loadAdminDashboard();
            } catch (error) {
                ModalSystem.close();
                NotificationSystem.error(`Failed to delete ${roleLabel}: ${error.message}`);
            }
        }
    );
}

// Chat Functions
let currentChatConversationId = null;
let chatMessages = [];
let currentModuleData = null;

// Enhanced Chat Functions
async function chatModuleChanged() {
    const moduleSelect = document.getElementById('chat-module-select');
    const selectedModuleId = moduleSelect.value;

    if (!selectedModuleId) {
        resetChatInterface();
        return;
    }

    try {
        // Load module details
        const moduleRes = await fetch(`${API_BASE}/modules/${selectedModuleId}`, {
            headers: getAuthHeaders()
        });
        currentModuleData = await moduleRes.json();

        // Update chat header
        document.getElementById('chat-module-title').textContent = currentModuleData.title || 'Module';
        document.getElementById('chat-module-description').textContent = currentModuleData.description || '';

        // Enable chat input
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        chatInput.disabled = false;
        sendBtn.disabled = false;

        // Update status
        document.getElementById('chat-status').innerHTML = '<span class="w-2 h-2 bg-terracotta-500 rounded-full"></span> Ready to chat';

        // Update active model badge
        const providerSelect = document.getElementById('chat-provider-select');
        if (providerSelect && providerSelect.selectedIndex >= 0) {
            const selectedProvider = providerSelect.options[providerSelect.selectedIndex].text;
            document.getElementById('active-model-name').textContent = selectedProvider;
        }

        // Load memory stats (don't fail if this errors)
        loadChatMemoryStats(selectedModuleId).catch(err => {
            console.warn('Could not load memory stats:', err);
        });

        // Load conversation history for this module (don't fail if this errors)
        loadChatHistory(selectedModuleId).catch(err => {
            console.warn('Could not load chat history:', err);
        });

        // Clear welcome message and show empty chat
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = '<div style="text-align: center; padding: 60px 20px; color: var(--text-medium);"><p>Start a conversation about <strong>' + currentModuleData.title + '</strong></p></div>';

    } catch (error) {
        console.error('Error loading module:', error);
        NotificationSystem.error('Failed to load module details: ' + error.message);
    }
}

async function loadChatMemoryStats(moduleId) {
    try {
        const userRes = await fetch(`${API_BASE}/users/me`, { headers: getAuthHeaders() });
        const user = await userRes.json();

        // Update profile status
        document.getElementById('memory-profile-status').textContent = user.name || 'Loaded';

        // Load module data
        document.getElementById('memory-module-status').textContent = 'Active';

        // Load conversation count
        const convsRes = await fetch(`${API_BASE}/conversations?user_id=${user.id}&module_id=${moduleId}`, {
            headers: getAuthHeaders()
        });
        const convsData = await convsRes.json();
        const convCount = convsData.conversations ? convsData.conversations.length : 0;
        document.getElementById('memory-conv-status').textContent = convCount;

        // Estimate context size
        document.getElementById('memory-size-status').textContent = '~2.5KB';

    } catch (error) {
        console.error('Error loading memory stats:', error);
    }
}

async function loadChatHistory(moduleId) {
    try {
        const userRes = await fetch(`${API_BASE}/users/me`, { headers: getAuthHeaders() });
        const user = await userRes.json();

        const convsRes = await fetch(`${API_BASE}/conversations?user_id=${user.id}&module_id=${moduleId}`, {
            headers: getAuthHeaders()
        });
        const convsData = await convsRes.json();
        const conversations = convsData.conversations || [];

        const historyList = document.getElementById('chat-history-list');
        if (conversations.length === 0) {
            historyList.innerHTML = '<div class="no-conversations">No conversations yet</div>';
            return;
        }

        historyList.innerHTML = conversations.slice(0, 10).map(conv => `
            <div class="conversation-item" onclick="loadConversationMessages(${conv.id})">
                <div class="conversation-item-title">${conv.title || 'Untitled'}</div>
                <div class="conversation-item-meta">${conv.message_count || 0} messages • ${new Date(conv.created_at).toLocaleDateString()}</div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

function resetChatInterface() {
    document.getElementById('chat-module-title').textContent = 'HARV AI Tutor';
    document.getElementById('chat-module-description').textContent = 'Select a module to begin learning';

    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    chatInput.disabled = true;
    sendBtn.disabled = true;
    chatInput.value = '';

    document.getElementById('chat-status').innerHTML = '<span class="w-2 h-2 bg-gray-400 rounded-full"></span> Select a module to begin';
    document.getElementById('active-model-name').textContent = 'No model selected';

    // Reset memory stats
    document.getElementById('memory-profile-status').textContent = '—';
    document.getElementById('memory-module-status').textContent = '—';
    document.getElementById('memory-conv-status').textContent = '—';
    document.getElementById('memory-size-status').textContent = '—';

    // Clear history
    document.getElementById('chat-history-list').innerHTML = '<div class="no-conversations">No conversations yet</div>';

    currentModuleData = null;
    currentChatConversationId = null;
}

async function toggleMemoryPanel() {
    if (!currentModuleData) {
        NotificationSystem.warning('Please select a module first');
        return;
    }

    try {
        const userRes = await fetch(`${API_BASE}/users/me`, { headers: getAuthHeaders() });
        const user = await userRes.json();

        // Fetch memory data
        const [memoryRes, convsRes, moduleRes] = await Promise.all([
            fetch(`${API_BASE}/memory/${user.id}`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/conversations?user_id=${user.id}&module_id=${currentModuleData.id}`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/modules/${currentModuleData.id}/corpus`, { headers: getAuthHeaders() })
        ]);

        const memories = await memoryRes.json();
        const conversations = await convsRes.json();
        const moduleCorpus = await moduleRes.json();

        const memoryHtml = `
            <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Memory Context for ${currentModuleData.title}</h3>

                <div class="bg-sage-lightest rounded-lg p-4">
                    <h4 class="font-bold text-sage-darkest mb-2">Your Profile</h4>
                    <div class="text-sm text-gray-700">
                        <p><strong>Name:</strong> ${user.name}</p>
                        <p><strong>Email:</strong> ${user.email}</p>
                    </div>
                </div>

                <div class="bg-terracotta-50 rounded-lg p-4">
                    <h4 class="font-bold text-terracotta-900 mb-2">Memories (${memories.length})</h4>
                    <div class="space-y-2 max-h-40 overflow-y-auto">
                        ${memories.length > 0 ? memories.map(m => `
                            <div class="text-sm bg-white rounded-lg p-2">
                                <strong>${m.what_learned}</strong>
                                <p class="text-gray-600 text-xs mt-1">${m.notes || 'No notes'}</p>
                            </div>
                        `).join('') : '<p class="text-sm text-gray-600">No memories yet</p>'}
                    </div>
                </div>

                <div class="bg-terracotta-50 rounded-lg p-4">
                    <h4 class="font-bold text-terracotta-900 mb-2">Conversations (${conversations.length})</h4>
                    <div class="space-y-2 max-h-40 overflow-y-auto">
                        ${conversations.length > 0 ? conversations.slice(0, 5).map(c => `
                            <div class="text-sm bg-white rounded-lg p-2">
                                <strong>${c.title || 'Untitled'}</strong>
                                <p class="text-gray-600 text-xs">${new Date(c.created_at).toLocaleDateString()}</p>
                            </div>
                        `).join('') : '<p class="text-sm text-gray-600">No conversations yet</p>'}
                    </div>
                </div>

                <div class="bg-terracotta-50 rounded-lg p-4">
                    <h4 class="font-bold text-terracotta-900 mb-2">Module Corpus (${moduleCorpus.entries ? moduleCorpus.entries.length : 0})</h4>
                    <p class="text-sm text-gray-700">Knowledge base entries loaded for this module</p>
                </div>
            </div>
        `;

        ModalSystem.custom('Memory Context', memoryHtml);

    } catch (error) {
        console.error('Error loading memory context:', error);
        NotificationSystem.error('Failed to load memory context');
    }
}

function exportConversation() {
    if (!chatMessages || chatMessages.length === 0) {
        NotificationSystem.warning('No conversation to export');
        return;
    }

    const conversation = {
        module: currentModuleData?.title || 'Unknown Module',
        date: new Date().toISOString(),
        messages: chatMessages
    };

    const dataStr = JSON.stringify(conversation, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `harv-conversation-${Date.now()}.json`;
    link.click();
}

async function loadConversationMessages(conversationId) {
    try {
        const response = await fetch(`${API_BASE}/conversations/${conversationId}`, {
            headers: getAuthHeaders()
        });
        const conversation = await response.json();

        currentChatConversationId = conversationId;
        chatMessages = conversation.messages || [];

        // Display messages
        const messagesArea = document.getElementById('chat-messages');
        messagesArea.innerHTML = chatMessages.map(msg => `
            <div class="chat-message ${msg.role}-message">
                <div class="message-avatar">${msg.role === 'user' ? 'U' : 'H'}</div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-role">${msg.role === 'user' ? 'You' : 'HARV'}</span>
                    </div>
                    <div class="message-text">${msg.content}</div>
                </div>
            </div>
        `).join('');

        // Scroll to bottom
        messagesArea.scrollTop = messagesArea.scrollHeight;

        // Highlight active conversation
        document.querySelectorAll('.conversation-item').forEach(item => item.classList.remove('active'));
        event.currentTarget?.classList.add('active');

    } catch (error) {
        console.error('Error loading conversation messages:', error);
        NotificationSystem.error('Failed to load conversation');
    }
}

// Store all modules globally for filtering
let allChatModules = [];
let selectedChatClass = null;

async function loadChatProviders() {
    try {
        // Check if user is admin or student
        const userRes = await fetch(`${API_BASE}/users/me`, { headers: getAuthHeaders() });
        const user = await userRes.json();

        // Hide AI model selector for students (only admins can choose the model)
        const modelContainer = document.getElementById('chat-model-selector-container');
        if (user && !user.is_admin) {
            modelContainer.style.display = 'none';
        } else {
            modelContainer.style.display = 'block';
        }

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

        // Load classes
        const classesResponse = await fetch(`${API_BASE}/classes`, { headers: getAuthHeaders() });
        const classesData = await classesResponse.json();

        const classSelect = document.getElementById('chat-class-select');
        classSelect.innerHTML = '<option value="">All Classes</option>';

        classesData.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.title;
            classSelect.appendChild(option);
        });

        // Load modules
        const modulesResponse = await fetch(`${API_BASE}/modules`, { headers: getAuthHeaders() });
        const modulesData = await modulesResponse.json();

        // Store all modules for filtering
        allChatModules = modulesData.modules || modulesData;

        // Populate module dropdown (initially show all)
        updateChatModuleDropdown();

        // Enable chat when module is selected
        const moduleSelect = document.getElementById('chat-module-select');
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

function chatClassChanged() {
    const classSelect = document.getElementById('chat-class-select');
    selectedChatClass = classSelect.value ? parseInt(classSelect.value) : null;
    updateChatModuleDropdown();
}

function updateChatModuleDropdown() {
    const moduleSelect = document.getElementById('chat-module-select');
    const currentModuleId = moduleSelect.value;

    // Filter modules by class if a class is selected
    const filteredModules = selectedChatClass
        ? allChatModules.filter(m => m.class_id === selectedChatClass)
        : allChatModules;

    moduleSelect.innerHTML = '<option value="">Select Module...</option>';

    filteredModules.forEach(module => {
        const option = document.createElement('option');
        option.value = module.id;
        option.textContent = module.title;
        // Restore selection if the module is still in the filtered list
        if (module.id == currentModuleId) {
            option.selected = true;
        }
        moduleSelect.appendChild(option);
    });

    // If no modules after filtering, show message
    if (filteredModules.length === 0) {
        moduleSelect.innerHTML = '<option value="">No modules in this class</option>';
    }

    // Trigger change event to update chat state
    moduleSelect.dispatchEvent(new Event('change'));
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
    const welcome = messagesContainer.querySelector('.chat-welcome, .max-w-3xl');
    if (welcome) welcome.remove();

    const messageDiv = document.createElement('div');
    const isUser = role === 'user';
    messageDiv.className = `flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`;

    const avatar = document.createElement('div');
    avatar.className = `w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${isUser ? 'bg-terracotta-500 order-2' : 'bg-sage-medium'}`;
    avatar.textContent = isUser ? 'U' : 'AI';

    const content_div = document.createElement('div');
    content_div.className = `max-w-xl px-4 py-3 rounded-lg ${isUser ? 'bg-sage-lightest text-gray-900' : 'bg-white border border-gray-200 text-gray-700'}`;
    content_div.textContent = isLoading ? 'Thinking...' : content;
    if (isLoading) {
        content_div.classList.add('animate-pulse');
    }

    if (isUser) {
        messageDiv.appendChild(content_div);
        messageDiv.appendChild(avatar);
    } else {
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content_div);
    }

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
        NotificationSystem.warning('Please select a module first');
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
            listContent.innerHTML = '<p class="text-gray-500 text-center py-8">No conversations found</p>';
            return;
        }

        let html = '';
        data.conversations.forEach(conv => {
            const date = conv.created_at ? new Date(conv.created_at).toLocaleDateString() : 'N/A';
            const time = conv.created_at ? new Date(conv.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';

            html += `
                <div class="p-3 hover:bg-sage-lightest rounded-lg cursor-pointer transition-colors border-b border-gray-100 last:border-0" onclick="loadConversationDetail(${conv.id})">
                    <div class="font-semibold text-gray-900 mb-1">${conv.title}</div>
                    <div class="flex gap-2 text-xs text-gray-600 mb-2">
                        <span class="bg-gray-100 px-2 py-1 rounded">${conv.user_name}</span>
                        <span class="bg-sage-light px-2 py-1 rounded">${conv.module_title}</span>
                    </div>
                    <div class="flex justify-between items-center text-xs text-gray-500">
                        <span>${conv.message_count} messages</span>
                        <span>${date} ${time}</span>
                    </div>
                    <div class="flex gap-2 mt-2">
                        ${conv.finalized ? '<span class="text-xs bg-terracotta-100 text-terracotta-800 px-2 py-1 rounded">Finalized</span>' : ''}
                        ${conv.current_grade ? `<span class="text-xs bg-terracotta-100 text-terracotta-800 px-2 py-1 rounded">Grade: ${conv.current_grade}</span>` : ''}
                    </div>
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
            <div class="border-b border-gray-200 pb-4 mb-4">
                <h2 class="text-2xl font-bold text-gray-900 mb-3">${conv.title}</h2>
                <div class="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div><strong class="text-gray-700">User:</strong> <span class="text-gray-600">${conv.user.name} (${conv.user.email})</span></div>
                    <div><strong class="text-gray-700">Module:</strong> <span class="text-gray-600">${conv.module.title}</span></div>
                    <div><strong class="text-gray-700">Created:</strong> <span class="text-gray-600">${date}</span></div>
                    <div><strong class="text-gray-700">Updated:</strong> <span class="text-gray-600">${updated}</span></div>
                </div>
                <div class="flex gap-2">
                    ${conv.finalized ? '<span class="text-xs bg-terracotta-100 text-terracotta-800 px-3 py-1 rounded-full">Finalized</span>' : '<span class="text-xs bg-terracotta-100 text-terracotta-800 px-3 py-1 rounded-full">Active</span>'}
                    ${conv.current_grade ? `<span class="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">Grade: ${conv.current_grade}</span>` : ''}
                </div>
            </div>

            <div class="space-y-4">
                <h3 class="text-lg font-bold text-gray-900">Messages (${conv.messages.length})</h3>
        `;

        if (conv.messages && conv.messages.length > 0) {
            conv.messages.forEach((msg, idx) => {
                const isUser = msg.role === 'user';
                const bgColor = isUser ? 'bg-sage-lightest' : 'bg-white border border-gray-200';
                const roleName = isUser ? 'Student' : 'AI Tutor';
                const roleColor = isUser ? 'text-sage-dark' : 'text-terracotta-600';

                html += `
                    <div class="${bgColor} rounded-lg p-4">
                        <div class="font-semibold ${roleColor} mb-2">${roleName}</div>
                        <div class="text-gray-700 whitespace-pre-wrap">${msg.content}</div>
                    </div>
                `;
            });
        } else {
            html += '<p class="text-gray-500 text-center py-8">No messages in this conversation</p>';
        }

        html += '</div>';

        if (conv.memory_summary) {
            html += `
                <div class="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 class="text-lg font-bold text-gray-900 mb-3">Memory Summary</h3>
                    <div class="text-gray-700 whitespace-pre-wrap">${conv.memory_summary}</div>
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
        NotificationSystem.error('Failed to load modules');
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
        NotificationSystem.error('Failed to load module data');
    }
}

async function saveModule(event) {
    event.preventDefault();

    if (!currentModuleId) {
        NotificationSystem.warning('No module selected');
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
            NotificationSystem.success('Module saved successfully!');
            loadModulesList();
        } else {
            NotificationSystem.error(result.detail || 'Failed to save module');
        }
    } catch (error) {
        console.error('Error saving module:', error);
        NotificationSystem.error('Failed to save module');
    }
}

async function createNewModule() {
    ModalSystem.prompt('Create New Module', 'Enter new module title:', '', async (title) => {
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
                NotificationSystem.success('Module created successfully!');
                await loadModulesList();
                document.getElementById('module-select').value = result.module.id;
                await loadModuleData();
            } else {
                NotificationSystem.error(result.detail || 'Failed to create module');
            }
        } catch (error) {
            console.error('Error creating module:', error);
            NotificationSystem.error('Failed to create module');
        }
    });
}

async function deleteModule() {
    if (!currentModuleId) return;

    ModalSystem.confirm('Delete Module', 'Are you sure you want to delete this module? This action cannot be undone.', async () => {

    try {
        const response = await fetch(`${API_BASE}/modules/${currentModuleId}`, {
            method: 'DELETE',
            headers: {
                ...getAuthHeaders()
            }
        });

        const result = await response.json();

        if (response.ok) {
            NotificationSystem.success('Module deleted successfully!');
            currentModuleId = null;
            document.getElementById('module-editor').style.display = 'none';
            await loadModulesList();
        } else {
            NotificationSystem.error(result.detail || 'Failed to delete module');
        }
    } catch (error) {
        console.error('Error deleting module:', error);
        NotificationSystem.error('Failed to delete module');
    }
    });
}

// Resume a conversation (student dashboard)
async function resumeConversation(conversationId, moduleId) {
    // Switch to chat section
    switchSection('chat');

    // Wait for section to load, then set the module and load conversation
    setTimeout(async () => {
        // Set the module
        const moduleSelect = document.getElementById('chat-module-select');
        if (moduleSelect) {
            moduleSelect.value = moduleId;
        }

        // Load the conversation (this would need to be implemented in the chat section)
        console.log(`Resume conversation ${conversationId} in module ${moduleId}`);
        // TODO: Implement conversation loading in chat section
    }, 200);
}

// View a specific conversation (admin dashboard)
async function viewConversation(conversationId) {
    // Switch to conversations section
    switchSection('conversations');

    // Wait for section to load, then highlight/show the conversation
    setTimeout(async () => {
        console.log(`View conversation ${conversationId}`);
        // The conversations section will load all conversations
        // We could enhance it to filter/highlight this specific one
    }, 200);
}

// View conversations for a specific student (admin dashboard)
async function viewStudentConversations(userId) {
    // Switch to conversations section
    switchSection('conversations');

    // Wait for section to load, then filter by user
    setTimeout(async () => {
        // Set the user filter if it exists
        const userFilter = document.getElementById('filter-user');
        if (userFilter) {
            userFilter.value = userId;
            // Trigger filter update
            loadConversations();
        }
        console.log(`View conversations for user ${userId}`);
    }, 200);
}

// Switch to a different section programmatically (for button clicks)
function switchSection(sectionName) {
    // Find and update active menu item
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Load the section
    loadSection(sectionName);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// NEW NAVIGATION SYSTEM
// ============================================

function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    const overlay = document.getElementById('menu-overlay');
    const isOpen = menu.style.left === '0px';

    if (isOpen) {
        menu.style.left = '-320px';
        overlay.style.display = 'none';
    } else {
        menu.style.left = '0px';
        overlay.style.display = 'block';
    }
}

function buildNavigationMenu() {
    const menuItems = document.getElementById('menu-items');

    if (!currentUser) {
        menuItems.innerHTML = '<p style="padding: 20px; color: rgba(255,255,255,0.8);">Loading...</p>';
        return;
    }

    const isAdmin = currentUser.is_admin;

    let menuHTML = '';

    if (isAdmin) {
        // Admin menu
        menuHTML = `
            <button class="menu-nav-item" onclick="navigateTo('admin-dashboard')">
                <i data-lucide="layout-dashboard" style="width: 20px; height: 20px;"></i>
                <span>Dashboard</span>
            </button>
            <button class="menu-nav-item" onclick="navigateTo('classes')">
                <i data-lucide="book-open" style="width: 20px; height: 20px;"></i>
                <span>Classes & Modules</span>
            </button>
            <button class="menu-nav-item" onclick="navigateTo('class-hierarchy')">
                <i data-lucide="folder-tree" style="width: 20px; height: 20px;"></i>
                <span>Class Hierarchy</span>
            </button>
            <button class="menu-nav-item" onclick="navigateTo('learning-journeys')">
                <i data-lucide="graduation-cap" style="width: 20px; height: 20px;"></i>
                <span>Learning Journeys</span>
            </button>
            <button class="menu-nav-item" onclick="navigateTo('memory')">
                <i data-lucide="brain" style="width: 20px; height: 20px;"></i>
                <span>Memory Inspector</span>
            </button>
            <button class="menu-nav-item" onclick="navigateTo('conversations')">
                <i data-lucide="message-square" style="width: 20px; height: 20px;"></i>
                <span>Student Activity</span>
            </button>
            <button class="menu-nav-item" onclick="navigateTo('chat')">
                <i data-lucide="message-circle" style="width: 20px; height: 20px;"></i>
                <span>Test Chat</span>
            </button>
            <button class="menu-nav-item" onclick="navigateTo('system')">
                <i data-lucide="settings" style="width: 20px; height: 20px;"></i>
                <span>System Settings</span>
            </button>
        `;
    } else {
        // Student menu - simplified
        menuHTML = `
            <button class="menu-nav-item" onclick="navigateTo('student-dashboard')">
                <i data-lucide="home" style="width: 20px; height: 20px;"></i>
                <span>My Classes</span>
            </button>
            <button class="menu-nav-item" onclick="navigateTo('chat')">
                <i data-lucide="graduation-cap" style="width: 20px; height: 20px;"></i>
                <span>Study</span>
            </button>
        `;
    }

    menuItems.innerHTML = menuHTML;

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function navigateTo(sectionName) {
    // Close menu
    toggleMenu();

    // Load section
    switchSection(sectionName);
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

    // Initialize app - check authentication and show appropriate screen
    initializeApp();
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
        NotificationSystem.warning('Title and content are required');
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
        NotificationSystem.error('Failed to save entry');
    }
}

async function deleteCourseCorpusEntry(entryId) {
    ModalSystem.confirm('Delete Entry', 'Are you sure you want to delete this entry?', async () => {
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
            NotificationSystem.error('Failed to delete entry');
        }
    });
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
        NotificationSystem.warning('Please select a module first');
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
        NotificationSystem.warning('Title and content are required');
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
        NotificationSystem.error('Failed to save entry: ' + error.message);
    }
}

async function deleteModuleCorpusEntry(entryId) {
    ModalSystem.confirm('Delete Entry', 'Are you sure you want to delete this entry?', async () => {
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
            NotificationSystem.error('Failed to delete entry');
        }
    });
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
            const isPDF = doc.filename.toLowerCase().endsWith('.pdf');
            return `
                <div class="document-item ${isPDF ? 'clickable' : ''}" data-doc-id="${doc.id}" ${isPDF ? `onclick="openPDFViewer(${doc.id}, '${doc.filename.replace(/'/g, "\\'")}')"` : ''}>
                    <div class="doc-info" style="flex: 1; pointer-events: none;">
                        <div class="doc-name">${doc.filename}</div>
                        <div class="doc-meta">
                            ${moduleBadge}
                            <span class="doc-size">${sizeKB} KB</span>
                            <span class="doc-date">${new Date(doc.uploaded_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                    ${isPDF ? `<button onclick="event.stopPropagation(); openPDFViewer(${doc.id}, '${doc.filename.replace(/'/g, "\\'")}')" style="padding: 8px 16px; background: #9CAA5A; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; white-space: nowrap; pointer-events: auto;">📄 Open</button>` : ''}
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
        NotificationSystem.error('Failed to load document');
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
        NotificationSystem.warning('Please select a file');
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
        NotificationSystem.success(`Document uploaded successfully: ${result.filename}`);
        closeUploadDialog();
        await loadDocuments();

    } catch (error) {
        console.error('Error uploading document:', error);
        NotificationSystem.error('Failed to upload document: ' + error.message);
    }
}

async function deleteDocument(docId) {
    ModalSystem.confirm('Delete Document', 'Are you sure you want to delete this document?', async () => {
        try {
            const response = await fetch(`${API_BASE}/documents/${docId}`, {
                method: 'DELETE',
                headers: {
                    ...getAuthHeaders()
                }
            });

            if (!response.ok) throw new Error('Failed to delete document');

            NotificationSystem.success('Document deleted successfully');
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
            NotificationSystem.error('Failed to delete document');
        }
    });
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
        NotificationSystem.error('Failed to export document');
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
            NotificationSystem.warning('No documents to export');
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
            NotificationSystem.warning('No text documents to export (PDFs are skipped in bulk export)');
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
        NotificationSystem.error('Failed to export documents');
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
                        <h4 style="margin: 0 0 10px 0; color: var(--sage-darkest);">Admin Role</h4>
                        <p style="margin: 0; color: var(--text-dark);">${info.adminAction}</p>
                    </div>
                    <div style="background: var(--warm-light); padding: 20px; border-radius: 8px;">
                        <h4 style="margin: 0 0 10px 0; color: var(--sage-darkest);">Student Role</h4>
                        <p style="margin: 0; color: var(--text-dark);">${info.studentAction}</p>
                    </div>
                </div>

                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                    <h4 style="margin: 0 0 15px 0; color: var(--sage-darkest);">Real Database Records</h4>
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
                    <div style="font-size: 24px; font-weight: bold;"></div>
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
                <button onclick="viewAssembledPrompt()" style="background: var(--sage-dark); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer; font-weight: 600;">
                    View Sample Assembled Prompt
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

LAYER 1: STUDENT PROFILE
Student Name: ${sampleUser.name}
Email: ${sampleUser.email}
Learning Style: ${sampleSurvey?.learning_style || 'Not specified'}
Familiarity: ${sampleSurvey?.familiarity || 'Not specified'}
Goals: ${sampleSurvey?.goals || 'Not specified'}
Pace Preference: ${sampleSurvey?.pace_preference || 'Not specified'}

LAYER 2: CLASS ARCHITECTURE
Class: ${sampleClass.title}
Description: ${sampleClass.description || 'No description'}
System Prompt: ${sampleClass.system_prompt || 'Use Socratic questioning...'}
${classCorpus ? `Class Corpus Entry: "${classCorpus.title}" - ${classCorpus.content?.substring(0, 100)}...` : ''}

LAYER 3: MODULE CONTEXT
Current Module: ${sampleModule.title}
Description: ${sampleModule.description || 'No description'}
Learning Objectives: ${sampleModule.learning_objectives || 'Not specified'}
Module Prompt: ${sampleModule.module_prompt || 'Guide student through discovery...'}

LAYER 4: CONVERSATION MEMORY
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
                    <h3 style="margin: 0;">Assembled Prompt Preview</h3>
                    <button onclick="this.closest('div').parentElement.remove()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">×</button>
                </div>
                <div style="padding: 30px;">
                    <p style="margin: 0 0 20px 0; color: var(--text-medium);">
                        This is what gets sent to the AI when a student chats. Real data from your database is assembled into a single context string:
                    </p>
                    <pre style="background: #2d3748; color: #68d391; padding: 20px; border-radius: 8px; overflow-x: auto; white-space: pre-wrap; line-height: 1.6; margin: 0;">${assembledPrompt}</pre>
                    <div style="margin-top: 20px; padding: 15px; background: var(--warm-light); border-radius: 8px;">
                        <strong>Note:</strong> This is a sample using the first available record from each layer. In production, the system selects data specific to the user, class, and module being accessed.
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

    } catch (error) {
        console.error('Error assembling prompt:', error);
        NotificationSystem.error('Error loading prompt preview: ' + error.message);
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
    inspectorData.selectedModule = null;
    inspectorData.selectedStudent = null;

    const moduleSelect = document.getElementById('inspector-module');
    const studentSelect = document.getElementById('inspector-student');

    if (!classId || isNaN(classId)) {
        moduleSelect.disabled = true;
        moduleSelect.innerHTML = '<option value="">Select class first...</option>';
        studentSelect.disabled = true;
        studentSelect.innerHTML = '<option value="">Select module first...</option>';
        return;
    }

    // Reset dependent dropdowns
    studentSelect.disabled = true;
    studentSelect.innerHTML = '<option value="">Select module first...</option>';

    // Load modules for this class
    loadInspectorModules(classId);
}

async function loadInspectorModules(classId) {
    try {
        const response = await fetch(`${API_BASE}/modules`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to load modules');

        const data = await response.json();
        // Handle both array format and {modules: []} format
        const allModules = Array.isArray(data) ? data : (data.modules || []);

        // Filter modules by class_id if available
        const filteredModules = allModules.filter(mod => mod.class_id === classId);
        const modulesToShow = filteredModules.length > 0 ? filteredModules : allModules;

        const moduleSelect = document.getElementById('inspector-module');
        moduleSelect.disabled = false;
        moduleSelect.innerHTML = '<option value="">Select a module...</option>';

        if (modulesToShow.length === 0) {
            moduleSelect.innerHTML = '<option value="">No modules found</option>';
            moduleSelect.disabled = true;
            return;
        }

        modulesToShow.forEach(mod => {
            const option = document.createElement('option');
            option.value = mod.id;
            option.textContent = mod.title;
            moduleSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading modules:', error);
        NotificationSystem.error('Failed to load modules');
        const moduleSelect = document.getElementById('inspector-module');
        moduleSelect.disabled = true;
        moduleSelect.innerHTML = '<option value="">Error loading modules</option>';
    }
}

function inspectorModuleChanged() {
    const moduleId = parseInt(document.getElementById('inspector-module').value);
    inspectorData.selectedModule = moduleId;
    inspectorData.selectedStudent = null;

    const studentSelect = document.getElementById('inspector-student');

    if (!moduleId || isNaN(moduleId)) {
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

        if (!response.ok) throw new Error('Failed to load users');

        const data = await response.json();
        // Handle both array format and {users: []} format
        const users = Array.isArray(data) ? data : (data.users || []);
        const students = users.filter(u => !u.is_admin);

        const studentSelect = document.getElementById('inspector-student');
        studentSelect.disabled = false;
        studentSelect.innerHTML = '<option value="">Select a student...</option>';

        if (students.length === 0) {
            studentSelect.innerHTML = '<option value="">No students found</option>';
            studentSelect.disabled = true;
            return;
        }

        students.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.name} (${user.email})`;
            studentSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading students:', error);
        NotificationSystem.error('Failed to load students');
        const studentSelect = document.getElementById('inspector-student');
        studentSelect.disabled = true;
        studentSelect.innerHTML = '<option value="">Error loading students</option>';
    }
}

function inspectorStudentChanged() {
    const studentId = parseInt(document.getElementById('inspector-student').value);
    inspectorData.selectedStudent = studentId;
}

async function loadInspectorData() {
    if (!inspectorData.selectedClass) {
        NotificationSystem.warning('Please select at least a Class');
        return;
    }

    document.getElementById('inspector-empty').style.display = 'none';
    document.getElementById('inspector-results').style.display = 'block';

    // Fetch data based on what's selected
    try {
        // Fetch required data
        const [classesData, corpusDataRaw] = await Promise.all([
            fetch(`${API_BASE}/classes`, { headers: getAuthHeaders() }).then(r => r.json()),
            fetch(`${API_BASE}/course-corpus`, { headers: getAuthHeaders() }).then(r => r.json()).catch(() => ({ entries: [] }))
        ]);

        const corpusData = corpusDataRaw;

        // Handle API response formats
        const classes = Array.isArray(classesData) ? classesData : (classesData.classes || []);
        const classObj = classes.find(c => c.id === inspectorData.selectedClass);

        let user = null, module = null, survey = null;
        let moduleCorpus = [], documents = [], conversations = [], memories = [];

        // Fetch module data if module is selected
        if (inspectorData.selectedModule) {
            try {
                const [modulesDataRaw, moduleCorpusDataRaw, docsDataRaw] = await Promise.all([
                    fetch(`${API_BASE}/modules`, { headers: getAuthHeaders() }).then(r => r.json()),
                    fetch(`${API_BASE}/modules/${inspectorData.selectedModule}/corpus`, { headers: getAuthHeaders() }).then(r => r.json()).catch(() => ({ entries: [] })),
                    fetch(`${API_BASE}/documents?module_id=${inspectorData.selectedModule}`, { headers: getAuthHeaders() }).then(r => r.json()).catch(() => [])
                ]);

                // Handle API response formats
                const modulesData = Array.isArray(modulesDataRaw) ? modulesDataRaw : (modulesDataRaw.modules || []);
                module = modulesData.find(m => m.id === inspectorData.selectedModule);
                moduleCorpus = moduleCorpusDataRaw.entries || moduleCorpusDataRaw || [];
                documents = Array.isArray(docsDataRaw) ? docsDataRaw : (docsDataRaw.documents || []);
            } catch (error) {
                console.warn('Error loading module data:', error);
            }
        }

        // Fetch student data if student is selected
        if (inspectorData.selectedStudent) {
            try {
                const usersDataRaw = await fetch(`${API_BASE}/users`, { headers: getAuthHeaders() }).then(r => r.json());
                const usersData = Array.isArray(usersDataRaw) ? usersDataRaw : (usersDataRaw.users || []);
                user = usersData.find(u => u.id === inspectorData.selectedStudent);

                // Try to fetch survey data (optional)
                try {
                    const surveyRes = await fetch(`${API_BASE}/surveys/${inspectorData.selectedStudent}`, { headers: getAuthHeaders() });
                    if (surveyRes.ok) {
                        survey = await surveyRes.json();
                    }
                } catch (e) {
                    console.warn('Survey data not available');
                }

                // Fetch conversations if module is selected (optional)
                if (inspectorData.selectedModule) {
                    try {
                        const convsData = await fetch(`${API_BASE}/conversations?user_id=${inspectorData.selectedStudent}&module_id=${inspectorData.selectedModule}`, { headers: getAuthHeaders() }).then(r => r.json());
                        conversations = Array.isArray(convsData) ? convsData : (convsData.conversations || []);
                    } catch (e) {
                        console.warn('Conversations data not available');
                    }
                }

                // Fetch memories (optional)
                try {
                    const memoriesData = await fetch(`${API_BASE}/memory/${inspectorData.selectedStudent}`, { headers: getAuthHeaders() }).then(r => r.json());
                    memories = Array.isArray(memoriesData) ? memoriesData : (memoriesData.memories || []);
                } catch (e) {
                    console.warn('Memories data not available');
                    memories = [];
                }
            } catch (error) {
                console.warn('Error loading student data:', error);
            }
        }

        // Store data globally for layer views
        window.inspectorLoadedData = {
            user,
            classObj,
            module,
            survey,
            classCorpus: corpusData.entries || corpusData || [],
            moduleCorpus,
            documents,
            conversations,
            memories
        };

        // Build and display assembled prompt
        const classCorpus = corpusData.entries || corpusData || [];
        displayAssembledPrompt(user, classObj, module, survey, classCorpus, moduleCorpus, conversations, memories);

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
        NotificationSystem.error('Error loading data: ' + error.message);
    }
}

function displayAssembledPrompt(user, classObj, module, survey, classCorpus, moduleCorpus, conversations, memories) {
    const prompt = `===  HARV 4-LAYER MEMORY CONTEXT ===

LAYER 1: STUDENT PROFILE
Student Name: ${user?.name || 'Unknown'}
Email: ${user?.email || 'Unknown'}
Learning Style: ${survey?.learning_style || 'Not specified'}
Familiarity: ${survey?.familiarity || 'Not specified'}
Goals: ${survey?.goals || 'Not specified'}
Pace Preference: ${survey?.pace_preference || 'Not specified'}

LAYER 2: CLASS ARCHITECTURE
Class: ${classObj?.title || 'Unknown'}
Description: ${classObj?.description || 'No description'}
System Prompt: ${classObj?.system_prompt || 'Use Socratic questioning...'}
Class Corpus (${classCorpus?.length || 0} entries):
${classCorpus?.slice(0, 2).map(c => `  - "${c.title}": ${c.content?.substring(0, 80)}...`).join('\n') || '  (none)'}

LAYER 3: MODULE CONTEXT
Current Module: ${module?.title || 'Unknown'}
Description: ${module?.description || 'No description'}
Learning Objectives: ${module?.learning_objectives || 'Not specified'}
Module Prompt: ${module?.module_prompt || 'Guide student through discovery...'}
Module Corpus (${moduleCorpus?.length || 0} entries):
${moduleCorpus?.slice(0, 2).map(c => `  - "${c.title}" (${c.type})`).join('\n') || '  (none)'}

LAYER 4: CONVERSATION MEMORY
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
        NotificationSystem.warning('Please enter a search term');
        return;
    }

    // Simple search through all data
    try {
        const [usersRes, convsRes, memsRes] = await Promise.all([
            fetch(`${API_BASE}/users`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/progress/tables/all`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/progress/tables/all`, { headers: getAuthHeaders() })
        ]);

        const usersData = await usersRes.json();
        const users = Array.isArray(usersData) ? usersData : (usersData.users || []);
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
            NotificationSystem.success(`Found user: ${matchedUser.name} (${matchedUser.email})\nPlease select their class and module to analyze.`);
            // Auto-select the user
            document.getElementById('inspector-student').value = matchedUser.id;
            inspectorData.selectedStudent = matchedUser.id;
        } else if (matchedConv) {
            NotificationSystem.success(`Found conversation: "${matchedConv.title}"\nUser ID: ${matchedConv.user_id}, Module ID: ${matchedConv.module_id}`);
        } else if (matchedMem) {
            NotificationSystem.success(`Found memory: "${matchedMem.what_learned}"\nUser ID: ${matchedMem.user_id}`);
        } else {
            NotificationSystem.info('No matches found. Try searching by student name, email, or conversation title.');
        }
    } catch (error) {
        console.error('Error searching:', error);
        NotificationSystem.error('Error searching: ' + error.message);
    }
}

