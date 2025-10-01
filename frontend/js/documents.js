/**
 * Documents Page JavaScript
 * Handles document upload and management
 */

let documentsCache = [];

// Initialize documents page immediately
(async function() {
    if (!HarvAPI || !HarvAPI.isAdmin()) {
        console.warn('Not authenticated as admin');
        return;
    }

    await loadDocuments();
    await loadModulesList();
    setupEventListeners();
})();

async function loadDocuments(moduleId = null) {
    try {
        const data = await HarvAPI.getDocuments(moduleId);
        documentsCache = data.documents;
        displayDocuments(data.documents);
        updateDocumentStats(data.documents);
    } catch (error) {
        console.error('Error loading documents:', error);
        showError('Failed to load documents');
    }
}

async function loadModulesList() {
    try {
        const modulesData = await HarvAPI.getModules();
        const select = document.querySelector('.card-header select');

        if (select && modulesData.modules) {
            select.innerHTML = '<option value="">All Modules</option><option value="global">Global Documents</option>';
            modulesData.modules.forEach(module => {
                const option = document.createElement('option');
                option.value = module.id;
                option.textContent = `Module ${module.id}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading modules list:', error);
    }
}

function displayDocuments(documents) {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Update count in header
    const headerTitle = document.querySelector('.card-title');
    if (headerTitle) {
        headerTitle.textContent = `All Documents (${documents.length})`;
    }

    if (documents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No documents uploaded yet. Click "Upload Document" to add one!</td></tr>';
        return;
    }

    documents.forEach(doc => {
        const row = document.createElement('tr');

        const moduleLabel = doc.module_id ? `Module ${doc.module_id}` : 'Global';
        const uploadedDate = doc.uploaded_at
            ? new Date(doc.uploaded_at).toLocaleDateString()
            : 'N/A';
        const size = formatFileSize(doc.content_length);

        row.innerHTML = `
            <td>📄 ${escapeHtml(doc.filename)}</td>
            <td>${moduleLabel}</td>
            <td>${size}</td>
            <td>${uploadedDate}</td>
            <td>
                <button class="button button-secondary button-small" onclick="viewDocument(${doc.id})">View</button>
                <button class="button button-danger button-small" onclick="deleteDocument(${doc.id}, '${escapeHtml(doc.filename)}')">Delete</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function updateDocumentStats(documents) {
    const statsCards = document.querySelectorAll('.stat-card');

    if (statsCards[0]) {
        statsCards[0].querySelector('.stat-value').textContent = documents.length;
    }

    if (statsCards[1]) {
        const totalSize = documents.reduce((sum, doc) => sum + (doc.content_length || 0), 0);
        statsCards[1].querySelector('.stat-value').textContent = formatFileSize(totalSize);
    }

    if (statsCards[2]) {
        const mostViewed = documents.length > 0 ? documents[0].filename : 'N/A';
        statsCards[2].querySelector('.stat-value').textContent = mostViewed;
    }
}

function setupEventListeners() {
    // Upload button (opens modal)
    const uploadBtn = document.querySelector('.button-primary[data-modal="uploadDocumentModal"]');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            // Modal would be handled by app.js
            showUploadForm();
        });
    }

    // Search functionality
    const searchInput = document.querySelector('input[placeholder*="Search"]');
    if (searchInput) {
        searchInput.addEventListener('input', filterDocuments);
    }

    // Module filter
    const moduleFilter = document.querySelector('.card-header select');
    if (moduleFilter) {
        moduleFilter.addEventListener('change', async (e) => {
            const moduleId = e.target.value === 'global' ? null : parseInt(e.target.value) || null;
            await loadDocuments(moduleId);
        });
    }
}

function showUploadForm() {
    // Create a simple upload modal/form
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;';

    modal.innerHTML = `
        <div style="background: var(--bg-primary); padding: 30px; border-radius: 8px; max-width: 500px; width: 90%;">
            <h2 style="margin-top: 0;">Upload Document</h2>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px;">Select Module (optional)</label>
                <select id="uploadModuleSelect" style="width: 100%;">
                    <option value="">Global (All Modules)</option>
                </select>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px;">Choose File</label>
                <input type="file" id="uploadFileInput" accept=".pdf,.txt,.md,.doc,.docx" style="width: 100%;">
                <div style="color: var(--text-secondary); font-size: 12px; margin-top: 5px;">
                    Supported: PDF, TXT, MD, DOC, DOCX (Max 10MB)
                </div>
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button class="button button-secondary" onclick="closeUploadModal()">Cancel</button>
                <button class="button button-primary" onclick="handleUpload()">Upload</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Load modules into select
    HarvAPI.getModules().then(data => {
        const select = document.getElementById('uploadModuleSelect');
        data.modules.forEach(module => {
            const option = document.createElement('option');
            option.value = module.id;
            option.textContent = `Module ${module.id}: ${module.title}`;
            select.appendChild(option);
        });
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeUploadModal();
        }
    });
}

async function handleUpload() {
    const fileInput = document.getElementById('uploadFileInput');
    const moduleSelect = document.getElementById('uploadModuleSelect');

    if (!fileInput.files || !fileInput.files[0]) {
        alert('Please select a file');
        return;
    }

    const file = fileInput.files[0];
    const moduleId = moduleSelect.value ? parseInt(moduleSelect.value) : null;

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
    }

    try {
        const uploadBtn = document.querySelector('.modal-overlay .button-primary');
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';

        await HarvAPI.uploadDocument(file, moduleId);

        showSuccess('Document uploaded successfully');
        closeUploadModal();
        await loadDocuments();

    } catch (error) {
        console.error('Error uploading document:', error);
        alert('Failed to upload document: ' + error.message);

        const uploadBtn = document.querySelector('.modal-overlay .button-primary');
        if (uploadBtn) {
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Upload';
        }
    }
}

function closeUploadModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

async function viewDocument(documentId) {
    try {
        const doc = await HarvAPI.getDocument(documentId);

        // Create view modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;';

        modal.innerHTML = `
            <div style="background: var(--bg-primary); padding: 30px; border-radius: 8px; max-width: 800px; width: 90%; max-height: 80vh; overflow: auto;">
                <h2 style="margin-top: 0;">${escapeHtml(doc.filename)}</h2>
                <div style="color: var(--text-secondary); margin-bottom: 20px;">
                    Module: ${doc.module_id ? `Module ${doc.module_id}` : 'Global'} |
                    Uploaded: ${new Date(doc.uploaded_at).toLocaleDateString()}
                </div>
                <div style="white-space: pre-wrap; background: var(--bg-secondary); padding: 20px; border-radius: 4px; max-height: 400px; overflow: auto;">
                    ${escapeHtml(doc.content.substring(0, 5000))}${doc.content.length > 5000 ? '\n\n... (content truncated)' : ''}
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                    <button class="button button-secondary" onclick="closeViewModal()">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeViewModal();
            }
        });

    } catch (error) {
        console.error('Error viewing document:', error);
        showError('Failed to load document content');
    }
}

function closeViewModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

async function deleteDocument(documentId, filename) {
    if (!confirm(`Are you sure you want to delete "${filename}"?\n\nThis action cannot be undone.`)) {
        return;
    }

    try {
        await HarvAPI.deleteDocument(documentId);
        showSuccess('Document deleted successfully');
        await loadDocuments();
    } catch (error) {
        console.error('Error deleting document:', error);
        showError('Failed to delete document');
    }
}

function filterDocuments() {
    const searchTerm = document.querySelector('input[placeholder*="Search"]').value.toLowerCase();
    const rows = document.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const filename = row.cells[0]?.textContent.toLowerCase() || '';
        const matches = filename.includes(searchTerm);
        row.style.display = matches ? '' : 'none';
    });
}

function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
window.viewDocument = viewDocument;
window.deleteDocument = deleteDocument;
window.handleUpload = handleUpload;
window.closeUploadModal = closeUploadModal;
window.closeViewModal = closeViewModal;
