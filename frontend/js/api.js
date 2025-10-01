/**
 * HARV Frontend API Integration
 * Connects to backend FastAPI endpoints
 */

const API_BASE_URL = 'http://localhost:8000';

// API Helper Functions
const api = {
    /**
     * Generic fetch wrapper with error handling
     */
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('access_token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'API request failed');
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    },

    // Authentication
    async login(email, password) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('is_admin', data.user.is_admin || false);
        return data;
    },

    async register(email, password, name) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name })
        });
    },

    // Modules
    async getModules() {
        return this.request('/modules');
    },

    async getModule(moduleId) {
        return this.request(`/modules/${moduleId}`);
    },

    async createModule(moduleData) {
        return this.request('/modules', {
            method: 'POST',
            body: JSON.stringify(moduleData)
        });
    },

    async updateModule(moduleId, moduleData) {
        return this.request(`/modules/${moduleId}`, {
            method: 'PUT',
            body: JSON.stringify(moduleData)
        });
    },

    async deleteModule(moduleId) {
        return this.request(`/modules/${moduleId}`, {
            method: 'DELETE'
        });
    },

    // Conversations
    async getConversations(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/conversations?${params}`);
    },

    async getConversation(conversationId) {
        return this.request(`/conversations/${conversationId}`);
    },

    async sendMessage(moduleId, message, conversationId = null) {
        return this.request('/chat/enhanced', {
            method: 'POST',
            body: JSON.stringify({
                module_id: moduleId,
                message,
                conversation_id: conversationId
            })
        });
    },

    // Course Corpus
    async getCourseCorpus() {
        return this.request('/course-corpus');
    },

    async createCourseCorpusEntry(entryData) {
        return this.request('/course-corpus', {
            method: 'POST',
            body: JSON.stringify(entryData)
        });
    },

    async updateCourseCorpusEntry(entryId, entryData) {
        return this.request(`/course-corpus/${entryId}`, {
            method: 'PUT',
            body: JSON.stringify(entryData)
        });
    },

    async deleteCourseCorpusEntry(entryId) {
        return this.request(`/course-corpus/${entryId}`, {
            method: 'DELETE'
        });
    },

    // Module Corpus
    async getModuleCorpusEntries(moduleId) {
        return this.request(`/modules/${moduleId}/corpus`);
    },

    async createModuleCorpusEntry(moduleId, entryData) {
        return this.request(`/modules/${moduleId}/corpus`, {
            method: 'POST',
            body: JSON.stringify(entryData)
        });
    },

    async updateModuleCorpusEntry(entryId, entryData) {
        return this.request(`/module-corpus/${entryId}`, {
            method: 'PUT',
            body: JSON.stringify(entryData)
        });
    },

    async deleteModuleCorpusEntry(entryId) {
        return this.request(`/module-corpus/${entryId}`, {
            method: 'DELETE'
        });
    },

    // Documents
    async getDocuments(moduleId = null) {
        const params = moduleId ? `?module_id=${moduleId}` : '';
        return this.request(`/documents${params}`);
    },

    async uploadDocument(file, moduleId = null) {
        const formData = new FormData();
        formData.append('file', file);
        if (moduleId) formData.append('module_id', moduleId);

        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}/documents/upload`, {
            method: 'POST',
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return response.json();
    },

    async deleteDocument(documentId) {
        return this.request(`/documents/${documentId}`, {
            method: 'DELETE'
        });
    },

    // Analytics (Admin)
    async getDashboardStats() {
        return this.request('/analytics/dashboard');
    },

    async getModulesPerformance() {
        return this.request('/analytics/modules/performance');
    },

    async getAnalyticsAlerts() {
        return this.request('/analytics/alerts');
    },

    async getModuleAnalytics(moduleId) {
        return this.request(`/analytics/modules/${moduleId}`);
    },

    async getStudentAnalytics(userId) {
        return this.request(`/analytics/students/${userId}`);
    },

    // Memory Summaries
    async getMemorySummaries(userId, moduleId = null) {
        const params = moduleId ? `?module_id=${moduleId}` : '';
        return this.request(`/memory/${userId}${params}`);
    },

    // User Progress
    async getUserProgress(userId) {
        return this.request(`/progress/${userId}`);
    },

    // Corpus Types (Admin)
    async getCorpusTypes() {
        return this.request('/corpus/types');
    },

    // Auth Helper
    isAdmin() {
        return localStorage.getItem('is_admin') === 'true';
    },

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('is_admin');
    }
};

// Export for use in other scripts
window.HarvAPI = api;
