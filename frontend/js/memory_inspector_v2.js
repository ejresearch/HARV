// ============================================================================
// HARV v2.0 - Memory Inspector
// ============================================================================
//
// This module provides a live view of the enhanced 4-layer + document
// intelligence memory system. It calls the real /memory/enhanced/ endpoint
// and displays exactly what the AI sees.
//
// Architecture:
// - MemoryInspectorV2: Main controller
// - MemoryLayerCard: Reusable component for each layer
// - API client functions for fetching data
// - State management for selections
//
// Author: Claude Code (HARV v2.0)
// Date: 2025-11-13
// ============================================================================

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const MemoryInspectorState = {
    selectedClass: null,
    selectedModule: null,
    selectedStudent: null,
    selectedConversation: null,
    memoryData: null,
    isLoading: false,
    error: null
};

// ============================================================================
// DATA VALIDATION & PARSING
// ============================================================================

/**
 * Validate and parse memory response from backend
 * @param {Object} data - Raw response data
 * @returns {Object} Validated and parsed memory data
 */
function validateMemoryResponse(data) {
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid response: data is not an object');
    }

    // Validate required fields
    if (!data.assembled_prompt) {
        console.warn('Missing assembled_prompt in response');
    }

    if (!data.memory_layers) {
        throw new Error('Invalid response: missing memory_layers');
    }

    // Validate context metrics
    const metrics = data.context_metrics || {};
    if (!metrics.total_chars || typeof metrics.total_chars !== 'number') {
        console.warn('Invalid or missing context_metrics.total_chars');
        metrics.total_chars = 0;
    }

    // Ensure all layer data exists
    const layers = data.memory_layers;
    if (!layers.system_data) layers.system_data = {};
    if (!layers.module_data) layers.module_data = {};
    if (!layers.conversation_data) layers.conversation_data = {};
    if (!layers.prior_knowledge) layers.prior_knowledge = {};
    if (!layers.document_data) layers.document_data = {};

    return {
        assembledPrompt: data.assembled_prompt || '',
        contextMetrics: {
            total_chars: metrics.total_chars || 0,
            optimization_score: metrics.optimization_score || 0,
            system_weight: metrics.system_weight || 0,
            module_weight: metrics.module_weight || 0,
            conversation_weight: metrics.conversation_weight || 0,
            prior_weight: metrics.prior_weight || 0
        },
        layers: {
            systemData: layers.system_data,
            moduleData: layers.module_data,
            conversationData: layers.conversation_data,
            priorKnowledge: layers.prior_knowledge,
            documentData: layers.document_data
        },
        databaseStatus: data.database_status || {},
        conversationId: data.conversation_id
    };
}

/**
 * Calculate character count for a layer
 * @param {Object} layerData - Layer data object
 * @returns {number} Estimated character count
 */
function calculateLayerCharCount(layerData) {
    if (!layerData) return 0;

    try {
        const jsonString = JSON.stringify(layerData);
        return jsonString.length;
    } catch (error) {
        console.error('Error calculating char count:', error);
        return 0;
    }
}

/**
 * Determine layer status based on data availability
 * @param {Object} layerData - Layer data
 * @param {boolean} dbStatus - Database status flag
 * @returns {string} Status: 'loaded' | 'warning' | 'missing' | 'loading'
 */
function determineLayerStatus(layerData, dbStatus) {
    if (!layerData) return 'missing';
    if (!dbStatus) return 'warning';

    // Check if layer has meaningful data
    const keys = Object.keys(layerData);
    if (keys.length === 0) return 'missing';

    // Check for empty nested objects
    const hasData = keys.some(key => {
        const value = layerData[key];
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'object' && value !== null) {
            return Object.keys(value).length > 0;
        }
        return value !== null && value !== undefined && value !== '';
    });

    return hasData ? 'loaded' : 'warning';
}

// ============================================================================
// API CLIENT FUNCTIONS
// ============================================================================

/**
 * Fetch enhanced memory data from backend
 * @param {number} moduleId - Module ID
 * @param {number} userId - User/Student ID
 * @param {number|null} conversationId - Optional conversation ID
 * @returns {Promise<Object>} Memory data with all 5 layers
 */
async function fetchEnhancedMemory(moduleId, userId, conversationId = null) {
    // Validate inputs
    if (!moduleId || !userId) {
        throw new Error('moduleId and userId are required');
    }

    const url = `${API_BASE}/memory/enhanced/${moduleId}?user_id=${userId}${conversationId ? `&conversation_id=${conversationId}` : ''}`;

    console.log(`[API] Fetching memory: ${url}`);

    try {
        const response = await fetch(url, {
            headers: getAuthHeaders()
        });

        // Handle HTTP errors
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Memory data not found. Module or user may not exist.');
            } else if (response.status === 401) {
                throw new Error('Unauthorized. Please log in again.');
            } else if (response.status === 500) {
                throw new Error('Server error. Please try again later.');
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        }

        const data = await response.json();
        console.log('[API] Memory data received:', data);

        // Validate and parse response
        const validatedData = validateMemoryResponse(data);
        console.log('[API] Memory data validated:', validatedData);

        return validatedData;

    } catch (error) {
        // Enhanced error logging
        console.error('[API] Memory fetch error:', error);

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error. Please check your connection.');
        }

        throw error;
    }
}

/**
 * Fetch list of classes
 * @returns {Promise<Array>} Array of class objects
 */
async function fetchClasses() {
    try {
        const response = await fetch(`${API_BASE}/classes`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch classes');
        return await response.json();
    } catch (error) {
        console.error('Error fetching classes:', error);
        return [];
    }
}

/**
 * Fetch modules for a class
 * @param {number} classId - Class ID
 * @returns {Promise<Array>} Array of module objects
 */
async function fetchModulesForClass(classId) {
    try {
        const response = await fetch(`${API_BASE}/modules`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch modules');

        const data = await response.json();
        const allModules = Array.isArray(data) ? data : (data.modules || []);

        // Filter by class_id
        return allModules.filter(mod => mod.class_id === classId);
    } catch (error) {
        console.error('Error fetching modules:', error);
        return [];
    }
}

/**
 * Fetch list of students (non-admin users)
 * @returns {Promise<Array>} Array of student objects
 */
async function fetchStudents() {
    try {
        const response = await fetch(`${API_BASE}/users`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch users');

        const data = await response.json();
        const users = Array.isArray(data) ? data : (data.users || []);

        // Filter for students only
        return users.filter(u => !u.is_admin);
    } catch (error) {
        console.error('Error fetching students:', error);
        return [];
    }
}

/**
 * Fetch conversations for a student and module
 * @param {number} userId - Student ID
 * @param {number} moduleId - Module ID
 * @returns {Promise<Array>} Array of conversation objects
 */
async function fetchConversationsForStudent(userId, moduleId) {
    try {
        const response = await fetch(
            `${API_BASE}/conversations?user_id=${userId}&module_id=${moduleId}`,
            { headers: getAuthHeaders() }
        );
        if (!response.ok) throw new Error('Failed to fetch conversations');

        const data = await response.json();
        return Array.isArray(data) ? data : (data.conversations || []);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return [];
    }
}

// ============================================================================
// MEMORY LAYER CARD COMPONENT
// ============================================================================

class MemoryLayerCard {
    /**
     * Create a memory layer card
     * @param {number} layerNumber - Layer number (1-5)
     * @param {string} title - Layer title
     * @param {number} charCount - Character count
     * @param {string} status - Status: 'loaded' | 'warning' | 'missing' | 'loading'
     * @param {Object} content - Layer content data
     */
    constructor(layerNumber, title, charCount, status, content) {
        this.layerNumber = layerNumber;
        this.title = title;
        this.charCount = charCount;
        this.status = status;
        this.content = content;
        this.isExpanded = false;
    }

    /**
     * Get color class for this layer
     * @returns {string} CSS class name
     */
    getColorClass() {
        const colors = {
            1: 'layer-blue',    // System
            2: 'layer-green',   // Module
            3: 'layer-yellow',  // Conversation
            4: 'layer-purple',  // Prior Knowledge
            5: 'layer-orange'   // Documents
        };
        return colors[this.layerNumber] || 'layer-default';
    }

    /**
     * Get icon emoji for this layer
     * @returns {string} Emoji icon
     */
    getLayerIcon() {
        const icons = {
            1: '🔵',
            2: '🟢',
            3: '🟡',
            4: '🟣',
            5: '🟠'
        };
        return icons[this.layerNumber] || '⚪';
    }

    /**
     * Get phase badge HTML if applicable
     * @returns {string} HTML for phase badge
     */
    getPhaseBadge() {
        const badges = {
            2: '<span class="phase-badge">⭐ PHASE 1 & 2</span>',
            3: '<span class="phase-badge">⭐ PHASE 5</span>',
            4: '<span class="phase-badge">⭐ PHASE 3</span>',
            5: '<span class="phase-badge">⭐ PHASE 4</span>'
        };
        return badges[this.layerNumber] || '';
    }

    /**
     * Get status icon
     * @returns {string} Status icon
     */
    getStatusIcon() {
        const icons = {
            loaded: '✅',
            warning: '⚠️',
            missing: '❌',
            loading: '🔄'
        };
        return icons[this.status] || '⚪';
    }

    /**
     * Render the layer card HTML
     * @returns {string} HTML string
     */
    render() {
        const colorClass = this.getColorClass();
        const statusIcon = this.getStatusIcon();
        const icon = this.getLayerIcon();
        const phaseBadge = this.getPhaseBadge();

        return `
            <div class="memory-layer-card ${colorClass} ${this.isExpanded ? 'expanded' : ''}" data-layer="${this.layerNumber}">
                <div class="layer-header" onclick="toggleMemoryLayer(${this.layerNumber})">
                    <div class="layer-title">
                        <span class="layer-icon">${icon}</span>
                        <span class="layer-name">Layer ${this.layerNumber}: ${this.title}</span>
                        ${phaseBadge}
                    </div>
                    <div class="layer-meta">
                        <span class="status-icon">${statusIcon}</span>
                        <span class="char-count">${this.charCount} chars</span>
                        <span class="expand-icon">${this.isExpanded ? '▲' : '▼'}</span>
                    </div>
                </div>
                <div class="layer-content ${this.isExpanded ? 'visible' : 'hidden'}">
                    ${this.renderContent()}
                </div>
            </div>
        `;
    }

    /**
     * Render layer-specific content
     * @returns {string} HTML for layer content
     */
    renderContent() {
        if (this.status === 'missing') {
            return this.renderEmptyState();
        }

        switch (this.layerNumber) {
            case 1: return this.renderSystemData();
            case 2: return this.renderModuleData();
            case 3: return this.renderConversationData();
            case 4: return this.renderPriorKnowledge();
            case 5: return this.renderDocuments();
            default: return '<p>Unknown layer</p>';
        }
    }

    /**
     * Render empty state
     * @returns {string} HTML for empty state
     */
    renderEmptyState() {
        const messages = {
            1: 'Select a student to view their profile and learning history.',
            2: 'Select a class and module to view configuration.',
            3: 'Select a conversation to view dialogue history.',
            4: 'This student hasn\'t completed any other modules yet.',
            5: 'No documents uploaded for this class/module.'
        };

        return `
            <div class="empty-state">
                <div class="empty-icon">${this.getLayerIcon()}</div>
                <p class="empty-message">${messages[this.layerNumber]}</p>
            </div>
        `;
    }

    // ========================================================================
    // LAYER-SPECIFIC RENDERERS
    // ========================================================================

    /**
     * Render Layer 1: System Data (Onboarding + User Profile)
     * Shows student's onboarding responses and learning preferences
     */
    renderSystemData() {
        if (!this.content || Object.keys(this.content).length === 0) {
            return this.renderEmptyState();
        }

        const data = this.content;
        let html = '<div class="layer-data">';

        // User Profile Section
        if (data.user_profile) {
            const profile = data.user_profile;
            html += `
                <div class="layer-section">
                    <h4>👤 User Profile</h4>
                    <div class="profile-grid">
                        ${profile.name ? `<div class="profile-item"><span class="label">Name:</span> <strong>${this.escapeHtml(profile.name)}</strong></div>` : ''}
                        ${profile.email ? `<div class="profile-item"><span class="label">Email:</span> <strong>${this.escapeHtml(profile.email)}</strong></div>` : ''}
                        ${profile.role ? `<div class="profile-item"><span class="label">Role:</span> <strong>${this.escapeHtml(profile.role)}</strong></div>` : ''}
                        ${profile.created_at ? `<div class="profile-item"><span class="label">Member Since:</span> <strong>${new Date(profile.created_at).toLocaleDateString()}</strong></div>` : ''}
                    </div>
                </div>
            `;
        }

        // Onboarding Data Section
        if (data.onboarding_data) {
            const onboarding = data.onboarding_data;
            html += `
                <div class="layer-section">
                    <h4>📋 Onboarding Responses</h4>
                    <div class="onboarding-responses">
            `;

            // Render each onboarding question/answer pair
            if (typeof onboarding === 'object') {
                for (const [question, answer] of Object.entries(onboarding)) {
                    if (answer && answer !== '') {
                        html += `
                            <div class="response-card">
                                <div class="question">${this.escapeHtml(question)}</div>
                                <div class="answer">${this.escapeHtml(answer)}</div>
                            </div>
                        `;
                    }
                }
            }

            html += `
                    </div>
                </div>
            `;
        }

        // Learning Preferences Section
        if (data.learning_preferences) {
            const prefs = data.learning_preferences;
            html += `
                <div class="layer-section">
                    <h4>⚙️ Learning Preferences</h4>
                    <div class="preferences-list">
            `;

            if (typeof prefs === 'object') {
                for (const [key, value] of Object.entries(prefs)) {
                    html += `
                        <div class="preference-item">
                            <span class="pref-key">${this.formatKey(key)}</span>
                            <span class="pref-value">${this.escapeHtml(String(value))}</span>
                        </div>
                    `;
                }
            }

            html += `
                    </div>
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    /**
     * Render Layer 2: Module Data (with Class Inheritance)
     * Shows class system prompt, module instructions, and class context
     */
    renderModuleData() {
        if (!this.content || Object.keys(this.content).length === 0) {
            return this.renderEmptyState();
        }

        const data = this.content;
        let html = '<div class="layer-data">';

        // Class Context (PHASE 1: Inheritance)
        if (data.class_context) {
            const classCtx = data.class_context;
            html += `
                <div class="layer-section">
                    <div class="class-context-box">
                        <h4>🏛️ Class Context (Inherited)</h4>
                        <div class="inheritance-indicator">
                            ⭐ PHASE 1: Class-level context inherited by all modules
                        </div>
                        ${classCtx.class_name ? `<div class="class-name"><strong>${this.escapeHtml(classCtx.class_name)}</strong></div>` : ''}
                        ${classCtx.system_prompt ? `<div class="system-prompt"><pre>${this.escapeHtml(classCtx.system_prompt)}</pre></div>` : ''}
                    </div>
                </div>
            `;
        }

        // Module Instructions
        if (data.module_instructions) {
            html += `
                <div class="layer-section">
                    <h4>📚 Module Instructions</h4>
                    <div class="module-instructions">
                        <pre>${this.escapeHtml(data.module_instructions)}</pre>
                    </div>
                </div>
            `;
        }

        // Module Metadata
        if (data.module_metadata) {
            const meta = data.module_metadata;
            html += `
                <div class="layer-section">
                    <h4>ℹ️ Module Information</h4>
                    <div class="metadata-grid">
                        ${meta.title ? `<div class="meta-item"><span class="label">Title:</span> <strong>${this.escapeHtml(meta.title)}</strong></div>` : ''}
                        ${meta.description ? `<div class="meta-item"><span class="label">Description:</span> <span>${this.escapeHtml(meta.description)}</span></div>` : ''}
                        ${meta.difficulty ? `<div class="meta-item"><span class="label">Difficulty:</span> <span class="badge">${this.escapeHtml(meta.difficulty)}</span></div>` : ''}
                    </div>
                </div>
            `;
        }

        // ClassCorpus (PHASE 2: Shared Knowledge)
        if (data.class_corpus) {
            html += `
                <div class="layer-section">
                    <h4>📖 Class Corpus (Shared Knowledge)</h4>
                    <div class="inheritance-indicator">
                        ⭐ PHASE 2: Shared knowledge base for all students
                    </div>
                    <ul class="corpus-list">
            `;

            const corpus = Array.isArray(data.class_corpus) ? data.class_corpus : [data.class_corpus];
            corpus.forEach(item => {
                if (typeof item === 'object' && item.content) {
                    html += `
                        <li>
                            ${item.type ? `<span class="corpus-type">${this.escapeHtml(item.type)}</span>` : ''}
                            ${this.escapeHtml(item.content)}
                        </li>
                    `;
                } else if (typeof item === 'string') {
                    html += `<li>${this.escapeHtml(item)}</li>`;
                }
            });

            html += `
                    </ul>
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    /**
     * Render Layer 3: Conversation Data (with Summarization)
     * Shows conversation summary and recent messages
     */
    renderConversationData() {
        if (!this.content || Object.keys(this.content).length === 0) {
            return this.renderEmptyState();
        }

        const data = this.content;
        let html = '<div class="layer-data">';

        // Conversation Summary (PHASE 5: Summarization)
        if (data.conversation_summary) {
            html += `
                <div class="layer-section">
                    <h4>📝 Conversation Summary</h4>
                    <div class="inheritance-indicator">
                        ⭐ PHASE 5: AI-generated conversation summarization
                    </div>
                    <div class="summary-box">
                        <pre>${this.escapeHtml(data.conversation_summary)}</pre>
                    </div>
                </div>
            `;
        }

        // Recent Messages
        if (data.recent_messages) {
            const messages = Array.isArray(data.recent_messages) ? data.recent_messages : [];
            html += `
                <div class="layer-section">
                    <h4>💬 Recent Messages (${messages.length})</h4>
                    <div class="messages-list">
            `;

            messages.forEach((msg, idx) => {
                const role = msg.role || 'unknown';
                const roleClass = role === 'user' ? 'msg-user' : role === 'assistant' ? 'msg-assistant' : 'msg-system';
                const roleIcon = role === 'user' ? '👤' : role === 'assistant' ? '🤖' : '⚙️';

                html += `
                    <div class="message-card ${roleClass}">
                        <div class="msg-header">
                            <span class="msg-role">${roleIcon} ${this.capitalizeFirst(role)}</span>
                            ${msg.timestamp ? `<span class="msg-time">${new Date(msg.timestamp).toLocaleString()}</span>` : ''}
                        </div>
                        <div class="msg-content">${this.escapeHtml(msg.content || msg.message || '')}</div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        }

        // Conversation Metadata
        if (data.conversation_metadata) {
            const meta = data.conversation_metadata;
            html += `
                <div class="layer-section">
                    <h4>📊 Conversation Stats</h4>
                    <div class="stats-grid">
                        ${meta.message_count ? `<div class="stat-item"><span class="stat-value">${meta.message_count}</span><span class="stat-label">Messages</span></div>` : ''}
                        ${meta.turn_count ? `<div class="stat-item"><span class="stat-value">${meta.turn_count}</span><span class="stat-label">Turns</span></div>` : ''}
                        ${meta.started_at ? `<div class="stat-item"><span class="stat-value">${new Date(meta.started_at).toLocaleDateString()}</span><span class="stat-label">Started</span></div>` : ''}
                    </div>
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    /**
     * Render Layer 4: Prior Knowledge (Cross-Module Learning)
     * Shows insights from MemorySummary and learning patterns
     */
    renderPriorKnowledge() {
        if (!this.content || Object.keys(this.content).length === 0) {
            return this.renderEmptyState();
        }

        const data = this.content;
        let html = '<div class="layer-data">';

        // Memory Summary (PHASE 3: Real Learning Insights)
        if (data.memory_summary) {
            html += `
                <div class="layer-section">
                    <h4>🧠 Learning Insights</h4>
                    <div class="inheritance-indicator">
                        ⭐ PHASE 3: AI-generated learning insights from completed modules
                    </div>
                    <div class="insights-box">
                        <pre>${this.escapeHtml(data.memory_summary)}</pre>
                    </div>
                </div>
            `;
        }

        // Cross-Module Insights
        if (data.cross_module_insights) {
            const insights = Array.isArray(data.cross_module_insights) ? data.cross_module_insights : [data.cross_module_insights];
            html += `
                <div class="layer-section">
                    <h4>🔗 Cross-Module Connections</h4>
                    <ul class="insights-list">
            `;

            insights.forEach(insight => {
                if (typeof insight === 'object') {
                    html += `
                        <li>
                            ${insight.module_name ? `<strong>${this.escapeHtml(insight.module_name)}:</strong> ` : ''}
                            ${this.escapeHtml(insight.insight || insight.content || JSON.stringify(insight))}
                        </li>
                    `;
                } else if (typeof insight === 'string') {
                    html += `<li>${this.escapeHtml(insight)}</li>`;
                }
            });

            html += `
                    </ul>
                </div>
            `;
        }

        // Learning Patterns
        if (data.learning_patterns) {
            const patterns = data.learning_patterns;
            html += `
                <div class="layer-section">
                    <h4>📈 Learning Patterns</h4>
                    <div class="patterns-grid">
            `;

            if (typeof patterns === 'object') {
                for (const [key, value] of Object.entries(patterns)) {
                    html += `
                        <div class="pattern-item">
                            <div class="pattern-label">${this.formatKey(key)}</div>
                            <div class="pattern-value">${this.escapeHtml(String(value))}</div>
                        </div>
                    `;
                }
            }

            html += `
                    </div>
                </div>
            `;
        }

        // Completed Modules
        if (data.completed_modules) {
            const modules = Array.isArray(data.completed_modules) ? data.completed_modules : [];
            html += `
                <div class="layer-section">
                    <h4>✅ Completed Modules (${modules.length})</h4>
                    <div class="completed-modules-list">
            `;

            modules.forEach(mod => {
                html += `
                    <div class="module-badge">
                        ${typeof mod === 'object' ? this.escapeHtml(mod.title || mod.name || JSON.stringify(mod)) : this.escapeHtml(String(mod))}
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    /**
     * Render Layer 5: Document Intelligence
     * Shows relevant document excerpts and metadata
     */
    renderDocuments() {
        if (!this.content || Object.keys(this.content).length === 0) {
            return this.renderEmptyState();
        }

        const data = this.content;
        let html = '<div class="layer-data">';

        // Document Intelligence Header
        html += `
            <div class="layer-section">
                <div class="inheritance-indicator">
                    ⭐ PHASE 4: Automatic document injection based on relevance
                </div>
            </div>
        `;

        // Document Excerpts
        if (data.document_excerpts) {
            const excerpts = Array.isArray(data.document_excerpts) ? data.document_excerpts : [data.document_excerpts];
            html += `
                <div class="layer-section">
                    <h4>📄 Relevant Document Excerpts (${excerpts.length})</h4>
            `;

            excerpts.forEach((excerpt, idx) => {
                if (typeof excerpt === 'object') {
                    html += `
                        <div class="document-card">
                            ${excerpt.title ? `<div class="doc-title">📄 ${this.escapeHtml(excerpt.title)}</div>` : ''}
                            ${excerpt.relevance_score ? `<div class="relevance-badge">Relevance: ${Math.round(excerpt.relevance_score * 100)}%</div>` : ''}
                            <div class="doc-excerpt">
                                <pre>${this.escapeHtml(excerpt.content || excerpt.excerpt || '')}</pre>
                            </div>
                            ${excerpt.page_number ? `<div class="doc-meta">Page ${excerpt.page_number}</div>` : ''}
                        </div>
                    `;
                } else if (typeof excerpt === 'string') {
                    html += `
                        <div class="document-card">
                            <div class="doc-excerpt">
                                <pre>${this.escapeHtml(excerpt)}</pre>
                            </div>
                        </div>
                    `;
                }
            });

            html += `</div>`;
        }

        // Document Metadata
        if (data.documents_metadata) {
            const docs = Array.isArray(data.documents_metadata) ? data.documents_metadata : [data.documents_metadata];
            html += `
                <div class="layer-section">
                    <h4>📚 Source Documents</h4>
                    <div class="documents-list">
            `;

            docs.forEach(doc => {
                html += `
                    <div class="doc-meta-card">
                        ${doc.filename ? `<div class="doc-filename">📎 ${this.escapeHtml(doc.filename)}</div>` : ''}
                        <div class="doc-info">
                            ${doc.type ? `<span class="doc-type">${this.escapeHtml(doc.type)}</span>` : ''}
                            ${doc.pages ? `<span class="doc-pages">${doc.pages} pages</span>` : ''}
                            ${doc.uploaded_at ? `<span class="doc-date">${new Date(doc.uploaded_at).toLocaleDateString()}</span>` : ''}
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    // ========================================================================
    // HELPER METHODS FOR RENDERING
    // ========================================================================

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
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
     * Format key for display (snake_case to Title Case)
     */
    formatKey(key) {
        return key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Capitalize first letter
     */
    capitalizeFirst(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// ============================================================================
// MAIN MEMORY INSPECTOR CONTROLLER
// ============================================================================

class MemoryInspectorV2 {
    constructor() {
        this.state = MemoryInspectorState;
        this.layers = [];
    }

    /**
     * Initialize the memory inspector
     */
    async initialize() {
        console.log('[MemoryInspectorV2] Initializing...');

        // Load dropdown options
        await this.loadClassOptions();

        // Set up event listeners
        this.setupEventListeners();

        console.log('[MemoryInspectorV2] Initialized successfully');
    }

    /**
     * Load class options into dropdown
     */
    async loadClassOptions() {
        const classes = await fetchClasses();
        const selectEl = document.getElementById('inspector-class-select');

        if (!selectEl) return;

        selectEl.innerHTML = '<option value="">Select a class...</option>';
        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.title;
            selectEl.appendChild(option);
        });
    }

    /**
     * Set up event listeners for dropdowns
     */
    setupEventListeners() {
        // Class selection
        const classSelect = document.getElementById('inspector-class-select');
        if (classSelect) {
            classSelect.addEventListener('change', (e) => this.onClassChange(e));
        }

        // Module selection
        const moduleSelect = document.getElementById('inspector-module-select');
        if (moduleSelect) {
            moduleSelect.addEventListener('change', (e) => this.onModuleChange(e));
        }

        // Student selection
        const studentSelect = document.getElementById('inspector-student-select');
        if (studentSelect) {
            studentSelect.addEventListener('change', (e) => this.onStudentChange(e));
        }

        // Conversation selection
        const convSelect = document.getElementById('inspector-conversation-select');
        if (convSelect) {
            convSelect.addEventListener('change', (e) => this.onConversationChange(e));
        }

        // Reload button
        const reloadBtn = document.getElementById('reload-memory-btn');
        if (reloadBtn) {
            reloadBtn.addEventListener('click', () => this.loadMemoryData());
        }
    }

    /**
     * Handle class selection change
     */
    async onClassChange(event) {
        const classId = parseInt(event.target.value);
        this.state.selectedClass = classId;
        this.state.selectedModule = null;
        this.state.selectedStudent = null;
        this.state.selectedConversation = null;

        if (classId) {
            await this.loadModuleOptions(classId);
            await this.loadStudentOptions();
        } else {
            this.clearModuleOptions();
            this.clearStudentOptions();
        }

        this.clearMemoryDisplay();
    }

    /**
     * Handle module selection change
     */
    async onModuleChange(event) {
        const moduleId = parseInt(event.target.value);
        this.state.selectedModule = moduleId;
        this.state.selectedConversation = null;

        if (moduleId && this.state.selectedStudent) {
            await this.loadConversationOptions();
            await this.loadMemoryData();
        } else {
            this.clearConversationOptions();
            this.clearMemoryDisplay();
        }
    }

    /**
     * Handle student selection change
     */
    async onStudentChange(event) {
        const studentId = parseInt(event.target.value);
        this.state.selectedStudent = studentId;
        this.state.selectedConversation = null;

        if (studentId && this.state.selectedModule) {
            await this.loadConversationOptions();
            await this.loadMemoryData();
        } else {
            this.clearConversationOptions();
            this.clearMemoryDisplay();
        }
    }

    /**
     * Handle conversation selection change
     */
    async onConversationChange(event) {
        const conversationId = parseInt(event.target.value) || null;
        this.state.selectedConversation = conversationId;

        if (this.state.selectedModule && this.state.selectedStudent) {
            await this.loadMemoryData();
        }
    }

    /**
     * Load module options for selected class
     */
    async loadModuleOptions(classId) {
        const modules = await fetchModulesForClass(classId);
        const selectEl = document.getElementById('inspector-module-select');

        if (!selectEl) return;

        selectEl.disabled = false;
        selectEl.innerHTML = '<option value="">Select a module...</option>';

        modules.forEach(mod => {
            const option = document.createElement('option');
            option.value = mod.id;
            option.textContent = mod.title;
            selectEl.appendChild(option);
        });
    }

    /**
     * Load student options
     */
    async loadStudentOptions() {
        const students = await fetchStudents();
        const selectEl = document.getElementById('inspector-student-select');

        if (!selectEl) return;

        selectEl.disabled = false;
        selectEl.innerHTML = '<option value="">Select a student...</option>';

        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.name} (${student.email})`;
            selectEl.appendChild(option);
        });
    }

    /**
     * Load conversation options for selected student and module
     */
    async loadConversationOptions() {
        if (!this.state.selectedStudent || !this.state.selectedModule) return;

        const conversations = await fetchConversationsForStudent(
            this.state.selectedStudent,
            this.state.selectedModule
        );

        const selectEl = document.getElementById('inspector-conversation-select');

        if (!selectEl) return;

        selectEl.disabled = false;
        selectEl.innerHTML = '<option value="">Latest conversation</option>';

        conversations.forEach(conv => {
            const option = document.createElement('option');
            option.value = conv.id;
            option.textContent = `Conversation #${conv.id} (${conv.message_count || 0} messages)`;
            selectEl.appendChild(option);
        });
    }

    /**
     * Clear module dropdown
     */
    clearModuleOptions() {
        const selectEl = document.getElementById('inspector-module-select');
        if (selectEl) {
            selectEl.disabled = true;
            selectEl.innerHTML = '<option value="">Select class first...</option>';
        }
    }

    /**
     * Clear student dropdown
     */
    clearStudentOptions() {
        const selectEl = document.getElementById('inspector-student-select');
        if (selectEl) {
            selectEl.disabled = true;
            selectEl.innerHTML = '<option value="">Select class first...</option>';
        }
    }

    /**
     * Clear conversation dropdown
     */
    clearConversationOptions() {
        const selectEl = document.getElementById('inspector-conversation-select');
        if (selectEl) {
            selectEl.disabled = true;
            selectEl.innerHTML = '<option value="">Select module and student first...</option>';
        }
    }

    /**
     * Clear memory display
     */
    clearMemoryDisplay() {
        const container = document.getElementById('memory-layers-container');
        if (container) {
            container.innerHTML = `
                <div class="empty-state-main">
                    <div class="empty-icon">🧠</div>
                    <h3>Select Class → Module → Student</h3>
                    <p>Choose from the dropdowns above to inspect memory context</p>
                </div>
            `;
        }
    }

    /**
     * Load memory data from backend
     */
    async loadMemoryData() {
        if (!this.state.selectedModule || !this.state.selectedStudent) {
            console.warn('[MemoryInspectorV2] Cannot load memory: module or student not selected');
            return;
        }

        // Show loading state
        this.state.isLoading = true;
        this.showLoadingState();

        try {
            // Fetch memory data
            const memoryData = await fetchEnhancedMemory(
                this.state.selectedModule,
                this.state.selectedStudent,
                this.state.selectedConversation
            );

            this.state.memoryData = memoryData;
            this.state.error = null;

            // Render memory display
            this.renderMemoryDisplay(memoryData);

        } catch (error) {
            console.error('[MemoryInspectorV2] Error loading memory:', error);
            this.state.error = error;
            this.showErrorState(error);
        } finally {
            this.state.isLoading = false;
        }
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        const container = document.getElementById('memory-layers-container');
        if (container) {
            container.style.display = 'block';
            container.innerHTML = `
                <div class="loading-state">
                    <div class="spinner"></div>
                    <p>Loading memory context...</p>
                </div>
            `;
        }

        // Show skeleton loaders for context metrics
        const metricsContainer = document.getElementById('context-metrics-container');
        if (metricsContainer) {
            metricsContainer.style.display = 'block';
            metricsContainer.innerHTML = `
                <div class="skeleton-card">
                    <div class="skeleton skeleton-header"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text-short"></div>
                </div>
            `;
        }
    }

    /**
     * Show error state
     */
    showErrorState(error) {
        const container = document.getElementById('memory-layers-container');
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">❌</div>
                    <h3>Error Loading Memory</h3>
                    <p>${error.message}</p>
                    <button onclick="memoryInspectorInstance.loadMemoryData()" class="retry-btn">
                        Retry
                    </button>
                </div>
            `;
        }
    }

    /**
     * Render memory display with all layers
     */
    renderMemoryDisplay(memoryData) {
        console.log('[MemoryInspectorV2] Rendering memory display with data:', memoryData);

        const container = document.getElementById('memory-layers-container');
        if (!container) {
            console.error('Memory layers container not found');
            return;
        }

        container.style.display = 'block';

        // Render context metrics
        this.renderContextMetrics(memoryData.contextMetrics);

        // Create layer cards
        const layers = memoryData.layers;
        const dbStatus = memoryData.databaseStatus;

        // Layer 1: System Data
        const layer1CharCount = calculateLayerCharCount(layers.systemData);
        const layer1Status = determineLayerStatus(layers.systemData, dbStatus.onboarding);
        const layer1 = new MemoryLayerCard(
            1,
            'System Data',
            layer1CharCount,
            layer1Status,
            layers.systemData
        );

        // Layer 2: Module Data
        const layer2CharCount = calculateLayerCharCount(layers.moduleData);
        const layer2Status = determineLayerStatus(layers.moduleData, dbStatus.module_config);
        const layer2 = new MemoryLayerCard(
            2,
            'Module Data',
            layer2CharCount,
            layer2Status,
            layers.moduleData
        );

        // Layer 3: Conversation Data
        const layer3CharCount = calculateLayerCharCount(layers.conversationData);
        const layer3Status = determineLayerStatus(layers.conversationData, dbStatus.conversation_analysis);
        const layer3 = new MemoryLayerCard(
            3,
            'Conversation Data',
            layer3CharCount,
            layer3Status,
            layers.conversationData
        );

        // Layer 4: Prior Knowledge
        const layer4CharCount = calculateLayerCharCount(layers.priorKnowledge);
        const layer4Status = determineLayerStatus(layers.priorKnowledge, dbStatus.cross_module);
        const layer4 = new MemoryLayerCard(
            4,
            'Prior Knowledge',
            layer4CharCount,
            layer4Status,
            layers.priorKnowledge
        );

        // Layer 5: Documents
        const layer5CharCount = calculateLayerCharCount(layers.documentData);
        const layer5Status = determineLayerStatus(layers.documentData, dbStatus.documents);
        const layer5 = new MemoryLayerCard(
            5,
            'Document Intelligence',
            layer5CharCount,
            layer5Status,
            layers.documentData
        );

        // Store layer instances
        this.layers = [layer1, layer2, layer3, layer4, layer5];

        // Render all layers
        container.innerHTML = this.layers.map(layer => layer.render()).join('');

        // Render assembled prompt
        this.renderAssembledPrompt(memoryData.assembledPrompt);

        console.log('[MemoryInspectorV2] Memory display rendered successfully');
    }

    /**
     * Render context metrics visualization
     */
    renderContextMetrics(metrics) {
        const metricsContainer = document.getElementById('context-metrics-container');
        if (!metricsContainer) {
            console.warn('Context metrics container not found');
            return;
        }

        metricsContainer.style.display = 'block';

        const totalChars = metrics.total_chars || 0;
        const score = metrics.optimization_score || 0;
        const percentage = Math.min((totalChars / 5000) * 100, 100);

        // Determine status
        let status = 'optimal';
        if (totalChars < 2000 || totalChars > 5000) {
            status = 'warning';
        }
        if (totalChars < 1000 || totalChars > 7000) {
            status = 'error';
        }

        metricsContainer.innerHTML = `
            <div class="context-metrics">
                <h3>📊 CONTEXT METRICS</h3>

                <div class="metrics-bar">
                    <div class="bar-label">Total Size:</div>
                    <div class="bar-container">
                        <div class="bar-fill ${status}" style="width: ${percentage}%">
                            ${totalChars} chars
                        </div>
                        <div class="bar-markers">
                            <span class="marker min">2K</span>
                            <span class="marker max">5K</span>
                        </div>
                    </div>
                    <div class="bar-status ${status}">
                        ${status === 'optimal' ? '✅' : status === 'warning' ? '⚠️' : '❌'}
                        ${score.toFixed(1)}% optimal
                    </div>
                </div>

                <div class="metrics-breakdown">
                    <div class="metric">
                        <span>System Weight:</span>
                        <strong>${metrics.system_weight || 0}%</strong>
                    </div>
                    <div class="metric">
                        <span>Module Weight:</span>
                        <strong>${metrics.module_weight || 0}%</strong>
                    </div>
                    <div class="metric">
                        <span>Conversation Weight:</span>
                        <strong>${metrics.conversation_weight || 0}%</strong>
                    </div>
                    <div class="metric">
                        <span>Prior Weight:</span>
                        <strong>${metrics.prior_weight || 0}%</strong>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render assembled prompt display
     */
    renderAssembledPrompt(prompt) {
        const promptContainer = document.getElementById('assembled-prompt-container');
        if (!promptContainer) {
            console.warn('Assembled prompt container not found');
            return;
        }

        promptContainer.style.display = 'block';

        promptContainer.innerHTML = `
            <div class="assembled-prompt-section">
                <div class="prompt-header">
                    <h3>📝 FINAL ASSEMBLED PROMPT (Sent to AI)</h3>
                    <div class="prompt-actions">
                        <button onclick="copyPromptToClipboard(\`${prompt.replace(/`/g, '\\`')}\`)">
                            📋 Copy
                        </button>
                        <button onclick="downloadPrompt(\`${prompt.replace(/`/g, '\\`')}\`)">
                            💾 Download
                        </button>
                    </div>
                </div>
                <pre class="prompt-display">${this.escapeHtml(prompt)}</pre>
            </div>
        `;
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================

const NotificationSystem = {
    /**
     * Show success notification
     * @param {string} message - Success message
     */
    success(message) {
        this.show(message, 'success');
    },

    /**
     * Show error notification
     * @param {string} message - Error message
     */
    error(message) {
        this.show(message, 'error');
    },

    /**
     * Show notification
     * @param {string} message - Message text
     * @param {string} type - 'success' or 'error'
     */
    show(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 24px',
            background: type === 'success' ? '#10B981' : '#EF4444',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: '9999',
            fontSize: '14px',
            fontWeight: '600',
            animation: 'slideIn 0.3s ease-out'
        });

        // Add to page
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Add notification animations to document
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Toggle layer expansion
 * @param {number} layerNumber - Layer number to toggle
 */
function toggleMemoryLayer(layerNumber) {
    const card = document.querySelector(`[data-layer="${layerNumber}"]`);
    if (!card) return;

    const content = card.querySelector('.layer-content');
    const isExpanded = card.classList.contains('expanded');

    if (isExpanded) {
        card.classList.remove('expanded');
        content.classList.remove('visible');
        content.classList.add('hidden');
    } else {
        card.classList.add('expanded');
        content.classList.add('visible');
        content.classList.remove('hidden');
    }
}

/**
 * Copy assembled prompt to clipboard
 * @param {string} prompt - Assembled prompt text
 */
function copyPromptToClipboard(prompt) {
    navigator.clipboard.writeText(prompt).then(() => {
        NotificationSystem.success('Prompt copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        NotificationSystem.error('Failed to copy prompt');
    });
}

/**
 * Download assembled prompt as text file
 * @param {string} prompt - Assembled prompt text
 */
function downloadPrompt(prompt) {
    const blob = new Blob([prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `harv-memory-prompt-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    NotificationSystem.success('Prompt downloaded!');
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Global instance
let memoryInspectorInstance = null;

/**
 * Initialize memory inspector when DOM is ready
 */
function initializeMemoryInspectorV2() {
    console.log('[MemoryInspectorV2] Starting initialization...');

    memoryInspectorInstance = new MemoryInspectorV2();
    memoryInspectorInstance.initialize();
}

// Auto-initialize if we're on the memory inspector page
document.addEventListener('DOMContentLoaded', () => {
    const inspectorContainer = document.getElementById('memory-inspector-v2-container');
    if (inspectorContainer) {
        initializeMemoryInspectorV2();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MemoryInspectorV2,
        MemoryLayerCard,
        fetchEnhancedMemory
    };
}
