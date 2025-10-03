// ===== CLASSES & MODULES MANAGEMENT =====

let currentClass = null;
let currentModule = null;

// Load all classes on section load
async function loadClassesSection() {
    await loadClassesList();
}

// Load classes list into dropdown
async function loadClassesList() {
    try {
        const response = await fetch(`${API_BASE}/classes`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
        });

        if (!response.ok) throw new Error('Failed to load classes');

        const classes = await response.json();

        const selector = document.getElementById('class-selector');
        if (!selector) return;

        // Clear existing options except the first one
        selector.innerHTML = '<option value="">Select a class...</option>';

        // Add class options
        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = `${cls.title} (${cls.modules?.length || 0} modules)`;
            if (currentClass?.id === cls.id) {
                option.selected = true;
            }
            selector.appendChild(option);
        });

    } catch (error) {
        console.error('Error loading classes:', error);
    }
}

// Select class from dropdown
function selectClassFromDropdown() {
    const selector = document.getElementById('class-selector');
    const classId = parseInt(selector.value);
    if (classId) {
        selectClass(classId);
    }
}

// Select and load a class
async function selectClass(classId) {
    try {
        const response = await fetch(`${API_BASE}/classes/${classId}`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
        });

        if (!response.ok) throw new Error('Failed to load class');

        currentClass = await response.json();
        currentModule = null;

        await loadClassesList();  // Refresh list to show selection
        renderClassEditor();

    } catch (error) {
        console.error('Error loading class:', error);
        NotificationSystem.error('Failed to load class');
    }
}

// Render class editor
function renderClassEditor() {
    const container = document.getElementById('class-editor-container');

    container.innerHTML = `
        <!-- Class Header -->
        <div class="mb-6 pb-5 border-b-2 border-sage-lighter">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">${currentClass.title}</h2>
            <p class="text-gray-600">${currentClass.description || 'No description'}</p>
        </div>

        <!-- Tabs -->
        <div class="flex gap-2 mb-6 border-b-2 border-gray-200">
            <button class="tab-btn px-4 py-2 font-semibold border-b-2 border-sage-dark text-sage-dark" onclick="showClassTab('details')">Class Details</button>
            <button class="tab-btn px-4 py-2 font-semibold border-b-2 border-transparent text-gray-600 hover:text-sage-dark transition-colors" onclick="showClassTab('corpus')">Class Corpus</button>
            <button class="tab-btn px-4 py-2 font-semibold border-b-2 border-transparent text-gray-600 hover:text-sage-dark transition-colors" onclick="showClassTab('documents')">Class Documents</button>
            <button class="tab-btn px-4 py-2 font-semibold border-b-2 border-transparent text-gray-600 hover:text-sage-dark transition-colors" onclick="showClassTab('modules')">Modules</button>
        </div>

        <!-- Tab Content -->
        <div id="class-tab-content"></div>
    `;

    showClassTab('details');
}

// Show class tab
function showClassTab(tab) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('border-sage-dark', 'text-sage-dark');
        btn.classList.add('border-transparent', 'text-gray-600');
    });
    event?.target?.classList.remove('border-transparent', 'text-gray-600');
    event?.target?.classList.add('border-sage-dark', 'text-sage-dark');

    const content = document.getElementById('class-tab-content');

    switch(tab) {
        case 'details':
            content.innerHTML = renderClassDetailsTab();
            break;
        case 'corpus':
            content.innerHTML = renderClassCorpusTab();
            loadClassCorpus();
            break;
        case 'documents':
            content.innerHTML = renderClassDocumentsTab();
            loadClassDocuments();
            break;
        case 'modules':
            content.innerHTML = renderClassModulesTab();
            break;
    }
}

// Render class details tab
function renderClassDetailsTab() {
    return `
        <form id="class-form" onsubmit="saveClass(event)" class="space-y-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Class Information</h3>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Class Title</label>
                <input type="text" id="class-title" value="${currentClass.title || ''}" required
                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea id="class-description" rows="3"
                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none resize-none">${currentClass.description || ''}</textarea>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Outline</label>
                <textarea id="class-outline" rows="8" placeholder="Course outline, topics covered..."
                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none font-mono text-sm">${currentClass.outline || ''}</textarea>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Learning Objectives</label>
                <textarea id="class-objectives" rows="6" placeholder="What students will learn..."
                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none font-mono text-sm">${currentClass.learning_objectives || ''}</textarea>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">System Prompt</label>
                <textarea id="class-system-prompt" rows="8" placeholder="Teaching philosophy for this class..."
                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none font-mono text-sm">${currentClass.system_prompt || ''}</textarea>
            </div>

            <div class="flex gap-3 items-center pt-6 border-t border-gray-200">
                <button type="submit" class="bg-sage-medium text-white px-6 py-3 rounded-lg hover:bg-sage-dark transition-colors font-medium">
                    💾 Save Class
                </button>
                <button type="button" onclick="deleteClass()" class="ml-auto bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium">
                    🗑️ Delete Class
                </button>
            </div>
        </form>
    `;
}

// Render class corpus tab
function renderClassCorpusTab() {
    return `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Corpus List -->
            <div class="bg-sage-lightest rounded-lg p-4">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-bold text-gray-900">Corpus Entries</h4>
                    <button onclick="createClassCorpus()" class="bg-sage-medium text-white px-3 py-1 rounded text-sm hover:bg-sage-dark transition-colors">
                        + Add
                    </button>
                </div>
                <div id="class-corpus-list" class="space-y-2"></div>
            </div>

            <!-- Corpus Editor -->
            <div id="class-corpus-editor" class="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
                <p class="text-center text-gray-400 py-10">Select a corpus entry or create a new one</p>
            </div>
        </div>
    `;
}

// Render class documents tab
function renderClassDocumentsTab() {
    return `
        <div>
            <div class="flex justify-between items-center mb-5">
                <h4 class="text-lg font-bold text-gray-900">Class Documents</h4>
                <button onclick="uploadClassDocument()" class="bg-sage-medium text-white px-4 py-2 rounded-lg hover:bg-sage-dark transition-colors font-medium">
                    📤 Upload Document
                </button>
            </div>
            <div id="class-documents-list" class="space-y-3"></div>
        </div>
    `;
}

// Render modules tab
function renderClassModulesTab() {
    return `
        <div>
            <div class="flex justify-between items-center mb-5">
                <h4 class="text-lg font-bold text-gray-900">Modules in ${currentClass.title}</h4>
                <button onclick="createModuleInClass()" class="bg-sage-medium text-white px-4 py-2 rounded-lg hover:bg-sage-dark transition-colors font-medium">
                    + Add Module
                </button>
            </div>
            <div id="class-modules-list">
                ${renderModulesList()}
            </div>
        </div>
    `;
}

// Render modules list
function renderModulesList() {
    if (!currentClass.modules || currentClass.modules.length === 0) {
        return '<p class="text-center text-gray-400 py-10">No modules yet. Click "Add Module" to create one.</p>';
    }

    return `
        <div class="space-y-4">
            ${currentClass.modules.map((module, index) => `
                <div class="bg-sage-lightest rounded-lg p-5 border-l-4 border-sage-medium hover:shadow-md transition-shadow">
                    <div class="flex justify-between items-start gap-4">
                        <div class="flex-1">
                            <h5 class="text-lg font-bold text-gray-900 mb-2">${index + 1}. ${module.title}</h5>
                            <p class="text-sm text-gray-600 mb-3">${module.description || 'No description'}</p>
                            ${module.learning_objectives ? `
                                <div class="text-xs text-gray-500 bg-white rounded px-3 py-2">
                                    <strong>Objectives:</strong> ${module.learning_objectives.substring(0, 150)}${module.learning_objectives.length > 150 ? '...' : ''}
                                </div>
                            ` : ''}
                        </div>
                        <div class="flex gap-2 flex-shrink-0">
                            <button onclick="editModule(${module.id})" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                                ✏️ Edit
                            </button>
                            <button onclick="deleteModule(${module.id})" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Save class
async function saveClass(event) {
    event.preventDefault();

    const classData = {
        title: document.getElementById('class-title').value,
        description: document.getElementById('class-description').value,
        outline: document.getElementById('class-outline').value,
        learning_objectives: document.getElementById('class-objectives').value,
        system_prompt: document.getElementById('class-system-prompt').value
    };

    try {
        const response = await fetch(`${API_BASE}/classes/${currentClass.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify(classData)
        });

        if (!response.ok) throw new Error('Failed to save class');

        currentClass = await response.json();
        await loadClassesList();
        NotificationSystem.success('Class saved successfully!');

    } catch (error) {
        console.error('Error saving class:', error);
        NotificationSystem.error('Failed to save class');
    }
}

// Create new class
async function createNewClass() {
    ModalSystem.prompt(
        'Create New Class',
        'Enter a title for your new class:',
        '',
        async (title) => {
            try {
                ModalSystem.loading('Creating class...');

                const response = await fetch(`${API_BASE}/classes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    },
                    body: JSON.stringify({ title, description: '' })
                });

                if (!response.ok) throw new Error('Failed to create class');

                const newClass = await response.json();
                await loadClassesList();
                await selectClass(newClass.id);

                ModalSystem.close();
                NotificationSystem.success(`Class "${title}" created successfully!`);

            } catch (error) {
                console.error('Error creating class:', error);
                ModalSystem.close();
                NotificationSystem.error('Failed to create class');
            }
        }
    );
}

// Delete class
async function deleteClass() {
    ModalSystem.confirm(
        'Delete Class',
        `Are you sure you want to delete "${currentClass.title}"? This will permanently delete all modules, corpus entries, and documents associated with this class.`,
        async () => {
            try {
                ModalSystem.loading('Deleting class...');

                const response = await fetch(`${API_BASE}/classes/${currentClass.id}`, {
                    method: 'DELETE',
                    headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
                });

                if (!response.ok) throw new Error('Failed to delete class');

                const classTitle = currentClass.title;
                currentClass = null;
                await loadClassesList();
                document.getElementById('class-editor-container').innerHTML = `
                    <div style="text-align: center; color: #95a5a6; padding: 100px 20px;">
                        <h3>Select a class to begin</h3>
                        <p>Choose a class from the dropdown above or create a new one</p>
                    </div>
                `;

                ModalSystem.close();
                NotificationSystem.success(`Class "${classTitle}" deleted successfully`);

            } catch (error) {
                console.error('Error deleting class:', error);
                ModalSystem.close();
                NotificationSystem.error('Failed to delete class');
            }
        }
    );
}

// Load class corpus
async function loadClassCorpus() {
    try {
        const response = await fetch(`${API_BASE}/classes/${currentClass.id}/corpus`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
        });

        if (!response.ok) throw new Error('Failed to load corpus');

        const corpusEntries = await response.json();

        const listHTML = corpusEntries.map(entry => `
            <div onclick="selectClassCorpus(${entry.id})"
                 style="padding: 10px; margin-bottom: 6px; background: white; border-radius: 4px; cursor: pointer; border-left: 2px solid var(--sage-medium);">
                <div style="font-weight: 600; font-size: 13px; color: var(--sage-darkest);">${entry.title}</div>
                <div style="font-size: 11px; color: var(--text-light); margin-top: 2px;">${entry.type}</div>
            </div>
        `).join('');

        document.getElementById('class-corpus-list').innerHTML = listHTML || '<p style="text-align: center; color: #95a5a6; font-size: 12px;">No entries</p>';

    } catch (error) {
        console.error('Error loading corpus:', error);
    }
}

// Load class documents
async function loadClassDocuments() {
    try {
        const response = await fetch(`${API_BASE}/classes/${currentClass.id}/documents`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
        });

        if (!response.ok) throw new Error('Failed to load documents');

        const documents = await response.json();

        const listHTML = documents.map(doc => `
            <div style="padding: 15px; margin-bottom: 10px; background: var(--sage-lighter); border-radius: 6px;">
                <div style="font-weight: 600; color: var(--sage-darkest); margin-bottom: 4px;">${doc.filename}</div>
                <div style="font-size: 12px; color: var(--text-medium);">Uploaded: ${new Date(doc.uploaded_at).toLocaleDateString()}</div>
            </div>
        `).join('');

        document.getElementById('class-documents-list').innerHTML = listHTML || '<p style="text-align: center; color: #95a5a6;">No documents</p>';

    } catch (error) {
        console.error('Error loading documents:', error);
    }
}

// Create module in class
function createModuleInClass() {
    ModalSystem.prompt('Create Module', 'Enter module title:', '', (title) => {
        // Module creation logic here
        NotificationSystem.info('Module creation will be implemented with full form');
    });
}

// Create class corpus entry
function createClassCorpus() {
    const editor = document.getElementById('class-corpus-editor');
    editor.innerHTML = `
        <h4 style="margin: 0 0 20px 0;">Create Corpus Entry</h4>
        <form id="corpus-form" onsubmit="saveClassCorpus(event)">
            <div class="form-group">
                <label>Title</label>
                <input type="text" id="corpus-title" required>
            </div>
            <div class="form-group">
                <label>Type</label>
                <select id="corpus-type" required>
                    <option value="theory">Theory</option>
                    <option value="concept">Concept</option>
                    <option value="example">Example</option>
                    <option value="guideline">Guideline</option>
                    <option value="definition">Definition</option>
                    <option value="framework">Framework</option>
                </select>
            </div>
            <div class="form-group">
                <label>Content</label>
                <textarea id="corpus-content" rows="10" required></textarea>
            </div>
            <div class="form-group">
                <label>Order</label>
                <input type="number" id="corpus-order" value="0" min="0">
            </div>
            <button type="submit" class="save-btn">Save Corpus Entry</button>
        </form>
    `;
}

async function selectClassCorpus(id) {
    try {
        const response = await fetch(`${API_BASE}/classes/${currentClass.id}/corpus`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
        });

        if (!response.ok) throw new Error('Failed to load corpus');

        const corpusEntries = await response.json();
        const entry = corpusEntries.find(e => e.id === id);

        if (!entry) return;

        const editor = document.getElementById('class-corpus-editor');
        editor.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h4 style="margin: 0;">Edit Corpus Entry</h4>
                <button class="delete-btn" onclick="deleteClassCorpus(${id})" style="padding: 6px 12px; font-size: 13px;">Delete</button>
            </div>
            <form id="corpus-form" onsubmit="updateClassCorpus(event, ${id})">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" id="corpus-title" value="${entry.title}" required>
                </div>
                <div class="form-group">
                    <label>Type</label>
                    <select id="corpus-type" required>
                        <option value="theory" ${entry.type === 'theory' ? 'selected' : ''}>Theory</option>
                        <option value="concept" ${entry.type === 'concept' ? 'selected' : ''}>Concept</option>
                        <option value="example" ${entry.type === 'example' ? 'selected' : ''}>Example</option>
                        <option value="guideline" ${entry.type === 'guideline' ? 'selected' : ''}>Guideline</option>
                        <option value="definition" ${entry.type === 'definition' ? 'selected' : ''}>Definition</option>
                        <option value="framework" ${entry.type === 'framework' ? 'selected' : ''}>Framework</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Content</label>
                    <textarea id="corpus-content" rows="10" required>${entry.content}</textarea>
                </div>
                <div class="form-group">
                    <label>Order</label>
                    <input type="number" id="corpus-order" value="${entry.order_index}" min="0">
                </div>
                <button type="submit" class="save-btn">Update Corpus Entry</button>
            </form>
        `;
    } catch (error) {
        console.error('Error loading corpus entry:', error);
        NotificationSystem.error('Failed to load corpus entry');
    }
}

async function saveClassCorpus(event) {
    event.preventDefault();

    const data = {
        title: document.getElementById('corpus-title').value,
        type: document.getElementById('corpus-type').value,
        content: document.getElementById('corpus-content').value,
        order_index: parseInt(document.getElementById('corpus-order').value)
    };

    try {
        const response = await fetch(`${API_BASE}/classes/${currentClass.id}/corpus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to create corpus entry');

        await loadClassCorpus();
        document.getElementById('class-corpus-editor').innerHTML = '<p style="text-align: center; color: #95a5a6;">Corpus entry created!</p>';
        NotificationSystem.success('Corpus entry created successfully!');

    } catch (error) {
        console.error('Error creating corpus:', error);
        NotificationSystem.error('Failed to create corpus entry');
    }
}

async function updateClassCorpus(event, id) {
    event.preventDefault();

    const data = {
        title: document.getElementById('corpus-title').value,
        type: document.getElementById('corpus-type').value,
        content: document.getElementById('corpus-content').value,
        order_index: parseInt(document.getElementById('corpus-order').value)
    };

    try {
        const response = await fetch(`${API_BASE}/classes/corpus/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to update corpus entry');

        await loadClassCorpus();
        NotificationSystem.success('Corpus entry updated successfully!');

    } catch (error) {
        console.error('Error updating corpus:', error);
        NotificationSystem.error('Failed to update corpus entry');
    }
}

async function deleteClassCorpus(id) {
    ModalSystem.confirm(
        'Delete Corpus Entry',
        'Are you sure you want to delete this corpus entry? This action cannot be undone.',
        async () => {
            try {
                ModalSystem.loading('Deleting corpus entry...');

                const response = await fetch(`${API_BASE}/classes/corpus/${id}`, {
                    method: 'DELETE',
                    headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
                });

                if (!response.ok) throw new Error('Failed to delete corpus entry');

                await loadClassCorpus();
                document.getElementById('class-corpus-editor').innerHTML = '<p style="text-align: center; color: #95a5a6;">Select a corpus entry or create a new one</p>';

                ModalSystem.close();
                NotificationSystem.success('Corpus entry deleted successfully');

            } catch (error) {
                console.error('Error deleting corpus:', error);
                ModalSystem.close();
                NotificationSystem.error('Failed to delete corpus entry');
            }
        }
    );
}

function uploadClassDocument() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md,.pdf';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('class_id', currentClass.id);

        try {
            const response = await fetch(`${API_BASE}/documents/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Failed to upload document');

            await loadClassDocuments();
            NotificationSystem.success(`Document "${file.name}" uploaded successfully!`);

        } catch (error) {
            console.error('Error uploading document:', error);
            NotificationSystem.error('Failed to upload document');
        }
    };
    input.click();
}

async function createModuleInClass() {
    const editor = document.getElementById('class-modules-list');
    editor.innerHTML = `
        <h4 style="margin: 0 0 20px 0;">Create Module</h4>
        <form id="module-form" onsubmit="saveModule(event)">
            <div class="form-group">
                <label>Module Title</label>
                <input type="text" id="module-title" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="module-description" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label>Outline</label>
                <textarea id="module-outline" rows="4" placeholder="Module topics, lessons..."></textarea>
            </div>
            <div class="form-group">
                <label>Learning Objectives</label>
                <textarea id="module-objectives" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label>System Prompt</label>
                <textarea id="module-system-prompt" rows="5" placeholder="Teaching approach for this module..."></textarea>
            </div>
            <div style="display: flex; gap: 10px;">
                <button type="submit" class="save-btn">Create Module</button>
                <button type="button" class="cancel-btn" onclick="showClassTab('modules')">Cancel</button>
            </div>
        </form>
    `;
}

async function saveModule(event) {
    event.preventDefault();

    const data = {
        class_id: currentClass.id,
        title: document.getElementById('module-title').value,
        description: document.getElementById('module-description').value,
        outline: document.getElementById('module-outline').value,
        learning_objectives: document.getElementById('module-objectives').value,
        system_prompt: document.getElementById('module-system-prompt').value
    };

    try {
        const response = await fetch(`${API_BASE}/modules`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to create module');

        // Reload the class to get updated modules
        await selectClass(currentClass.id);
        showClassTab('modules');
        NotificationSystem.success('Module created successfully!');

    } catch (error) {
        console.error('Error creating module:', error);
        NotificationSystem.error('Failed to create module');
    }
}

async function editModule(id) {
    try {
        const response = await fetch(`${API_BASE}/modules/${id}`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
        });

        if (!response.ok) throw new Error('Failed to load module');

        currentModule = await response.json();
        renderModuleEditor();

    } catch (error) {
        console.error('Error loading module:', error);
        NotificationSystem.error('Failed to load module');
    }
}

function renderModuleEditor() {
    const container = document.getElementById('class-modules-list');

    container.innerHTML = `
        <!-- Module Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid var(--sage-lighter);">
            <div>
                <h3 style="margin: 0 0 5px 0; color: var(--sage-darkest);">${currentModule.title}</h3>
                <p style="margin: 0; color: var(--text-medium); font-size: 14px;">${currentModule.description || 'No description'}</p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="cancel-btn" onclick="showClassTab('modules')" style="padding: 8px 16px;">Back to Modules</button>
                <button class="delete-btn" onclick="deleteModule(${currentModule.id})" style="padding: 8px 16px;">Delete Module</button>
            </div>
        </div>

        <!-- Module Tabs -->
        <div class="flex gap-2 mb-6 border-b-2 border-gray-200">
            <button class="tab-btn px-6 py-3 font-semibold text-gray-600 border-b-2 border-transparent hover:text-sage-dark hover:border-sage-light transition-all"
                onclick="showModuleTab('details')">Module Details</button>
            <button class="tab-btn px-6 py-3 font-semibold text-gray-600 border-b-2 border-transparent hover:text-sage-dark hover:border-sage-light transition-all"
                onclick="showModuleTab('corpus')">Module Corpus</button>
            <button class="tab-btn px-6 py-3 font-semibold text-gray-600 border-b-2 border-transparent hover:text-sage-dark hover:border-sage-light transition-all"
                onclick="showModuleTab('documents')">Documents</button>
        </div>

        <!-- Module Tab Content -->
        <div id="module-tab-content" class="py-4"></div>
    `;

    showModuleTab('details');
}

function showModuleTab(tab) {
    // Update active tab styling
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('text-sage-dark', 'border-sage-medium');
        btn.classList.add('text-gray-600', 'border-transparent');
    });

    event?.target?.classList.remove('text-gray-600', 'border-transparent');
    event?.target?.classList.add('text-sage-dark', 'border-sage-medium');

    const content = document.getElementById('module-tab-content');

    switch(tab) {
        case 'details':
            content.innerHTML = renderModuleDetailsTab();
            break;
        case 'corpus':
            content.innerHTML = renderModuleCorpusTab();
            loadModuleCorpus();
            break;
        case 'documents':
            content.innerHTML = renderModuleDocumentsTab();
            loadModuleDocuments();
            break;
    }
}

function renderModuleDetailsTab() {
    return `
        <form id="module-form" onsubmit="updateModule(event)" class="max-w-4xl space-y-6">
            <!-- Module Title -->
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Module Title</label>
                <input type="text" id="module-title" value="${currentModule.title || ''}" required
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none text-base">
            </div>

            <!-- Description -->
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea id="module-description" rows="4"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none text-sm leading-relaxed resize-y">${currentModule.description || ''}</textarea>
            </div>

            <!-- Outline -->
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Outline</label>
                <textarea id="module-outline" rows="8"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none font-mono text-sm leading-relaxed resize-y">${currentModule.outline || ''}</textarea>
                <p class="text-xs text-gray-500 mt-1">Topics and structure for this module</p>
            </div>

            <!-- Learning Objectives -->
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Learning Objectives</label>
                <textarea id="module-objectives" rows="6"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none text-sm leading-relaxed resize-y">${currentModule.learning_objectives || ''}</textarea>
                <p class="text-xs text-gray-500 mt-1">What students should learn from this module</p>
            </div>

            <!-- System Prompt -->
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">System Prompt</label>
                <textarea id="module-system-prompt" rows="8"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none font-mono text-sm leading-relaxed resize-y bg-gray-50">${currentModule.system_prompt || ''}</textarea>
                <p class="text-xs text-gray-500 mt-1">AI tutor instructions for this module</p>
            </div>

            <!-- Save Button -->
            <div class="pt-4 border-t border-gray-200">
                <button type="submit"
                    class="px-6 py-3 bg-sage-medium text-white rounded-lg hover:bg-sage-dark transition-colors font-semibold shadow-sm">
                    💾 Save Module
                </button>
            </div>
        </form>
    `;
}

function renderModuleCorpusTab() {
    return `
        <div class="grid grid-cols-[350px_1fr] gap-6">
            <!-- Module Corpus List -->
            <div class="bg-sage-lightest rounded-lg p-4">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-bold text-gray-900">Corpus Entries</h4>
                    <button onclick="createModuleCorpus()"
                        class="px-3 py-1.5 bg-sage-medium text-white rounded-md hover:bg-sage-dark transition-colors text-sm font-medium">
                        + Add
                    </button>
                </div>
                <div id="module-corpus-list" class="space-y-2"></div>
            </div>

            <!-- Module Corpus Editor -->
            <div id="module-corpus-editor" class="bg-white border-2 border-gray-200 rounded-lg p-6">
                <p class="text-center text-gray-400 py-12">Select a corpus entry or create a new one</p>
            </div>
        </div>
    `;
}

function renderModuleDocumentsTab() {
    return `
        <div>
            <div class="flex justify-between items-center mb-6">
                <h4 class="text-lg font-bold text-gray-900">Module Documents</h4>
                <button onclick="uploadModuleDocument()"
                    class="px-5 py-2.5 bg-sage-medium text-white rounded-lg hover:bg-sage-dark transition-colors font-medium">
                    📤 Upload Document
                </button>
            </div>
            <div id="module-documents-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
        </div>
    `;
}

async function updateModule(event) {
    event.preventDefault();

    const data = {
        title: document.getElementById('module-title').value,
        description: document.getElementById('module-description').value,
        outline: document.getElementById('module-outline').value,
        learning_objectives: document.getElementById('module-objectives').value,
        system_prompt: document.getElementById('module-system-prompt').value
    };

    try {
        const response = await fetch(`${API_BASE}/modules/${currentModule.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to update module');

        NotificationSystem.success('Module updated successfully!');
        currentModule = { ...currentModule, ...data };

    } catch (error) {
        console.error('Error updating module:', error);
        NotificationSystem.error('Failed to update module');
    }
}

async function deleteModule(id) {
    ModalSystem.confirm(
        'Delete Module',
        'Are you sure you want to delete this module? This will also delete all associated corpus entries and documents.',
        async () => {
            try {
                ModalSystem.loading('Deleting module...');

                const response = await fetch(`${API_BASE}/modules/${id}`, {
                    method: 'DELETE',
                    headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
                });

                if (!response.ok) throw new Error('Failed to delete module');

                await selectClass(currentClass.id);
                showClassTab('modules');

                ModalSystem.close();
                NotificationSystem.success('Module deleted successfully');

            } catch (error) {
                console.error('Error deleting module:', error);
                ModalSystem.close();
                NotificationSystem.error('Failed to delete module');
            }
        }
    );
}

// ===== MODULE CORPUS FUNCTIONS =====

async function loadModuleCorpus() {
    try {
        const response = await fetch(`${API_BASE}/modules/${currentModule.id}/corpus`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
        });

        if (!response.ok) throw new Error('Failed to load module corpus');

        const corpusData = await response.json();
        const corpusEntries = corpusData.entries || corpusData;

        const listHTML = corpusEntries.map(entry => `
            <div onclick="selectModuleCorpus(${entry.id})"
                 style="padding: 10px; margin-bottom: 6px; background: white; border-radius: 4px; cursor: pointer; border-left: 2px solid var(--sage-medium);">
                <div style="font-weight: 600; font-size: 13px; color: var(--sage-darkest);">${entry.title}</div>
                <div style="font-size: 11px; color: var(--text-light); margin-top: 2px;">${entry.type}</div>
            </div>
        `).join('');

        document.getElementById('module-corpus-list').innerHTML = listHTML || '<p style="text-align: center; color: #95a5a6; font-size: 12px;">No entries</p>';

    } catch (error) {
        console.error('Error loading module corpus:', error);
    }
}

function createModuleCorpus() {
    const editor = document.getElementById('module-corpus-editor');
    editor.innerHTML = `
        <h4 class="text-lg font-bold text-gray-900 mb-6">Create Module Corpus Entry</h4>
        <form id="module-corpus-form" onsubmit="saveModuleCorpus(event)" class="space-y-5">
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input type="text" id="m-corpus-title" required
                    class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none">
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                <select id="m-corpus-type" required
                    class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none bg-white">
                    <option value="theory">Theory</option>
                    <option value="concept">Concept</option>
                    <option value="example">Example</option>
                    <option value="guideline">Guideline</option>
                    <option value="definition">Definition</option>
                    <option value="case_study">Case Study</option>
                </select>
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                <textarea id="m-corpus-content" rows="12" required
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none text-sm leading-relaxed resize-y"></textarea>
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Order</label>
                <input type="number" id="m-corpus-order" value="0" min="0"
                    class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none">
                <p class="text-xs text-gray-500 mt-1">Display order (lower numbers appear first)</p>
            </div>

            <div class="pt-4 border-t border-gray-200">
                <button type="submit"
                    class="px-6 py-3 bg-sage-medium text-white rounded-lg hover:bg-sage-dark transition-colors font-semibold shadow-sm">
                    💾 Save Corpus Entry
                </button>
            </div>
        </form>
    `;
}

async function selectModuleCorpus(id) {
    try {
        const response = await fetch(`${API_BASE}/modules/${currentModule.id}/corpus`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
        });

        if (!response.ok) throw new Error('Failed to load module corpus');

        const corpusData = await response.json();
        const corpusEntries = corpusData.entries || corpusData;
        const entry = corpusEntries.find(e => e.id === id);

        if (!entry) return;

        const editor = document.getElementById('module-corpus-editor');
        editor.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h4 class="text-lg font-bold text-gray-900">Edit Module Corpus Entry</h4>
                <button onclick="deleteModuleCorpus(${id})"
                    class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
                    🗑️ Delete
                </button>
            </div>
            <form id="module-corpus-form" onsubmit="updateModuleCorpus(event, ${id})" class="space-y-5">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                    <input type="text" id="m-corpus-title" value="${entry.title}" required
                        class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none">
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                    <select id="m-corpus-type" required
                        class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none bg-white">
                        <option value="theory" ${entry.type === 'theory' ? 'selected' : ''}>Theory</option>
                        <option value="concept" ${entry.type === 'concept' ? 'selected' : ''}>Concept</option>
                        <option value="example" ${entry.type === 'example' ? 'selected' : ''}>Example</option>
                        <option value="guideline" ${entry.type === 'guideline' ? 'selected' : ''}>Guideline</option>
                        <option value="definition" ${entry.type === 'definition' ? 'selected' : ''}>Definition</option>
                        <option value="case_study" ${entry.type === 'case_study' ? 'selected' : ''}>Case Study</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                    <textarea id="m-corpus-content" rows="12" required
                        class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none text-sm leading-relaxed resize-y">${entry.content}</textarea>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Order</label>
                    <input type="number" id="m-corpus-order" value="${entry.order_index}" min="0"
                        class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-medium focus:border-transparent outline-none">
                    <p class="text-xs text-gray-500 mt-1">Display order (lower numbers appear first)</p>
                </div>

                <div class="pt-4 border-t border-gray-200">
                    <button type="submit"
                        class="px-6 py-3 bg-sage-medium text-white rounded-lg hover:bg-sage-dark transition-colors font-semibold shadow-sm">
                        💾 Update Corpus Entry
                    </button>
                </div>
            </form>
        `;
    } catch (error) {
        console.error('Error loading module corpus entry:', error);
        NotificationSystem.error('Failed to load corpus entry');
    }
}

async function saveModuleCorpus(event) {
    event.preventDefault();

    const data = {
        title: document.getElementById('m-corpus-title').value,
        type: document.getElementById('m-corpus-type').value,
        content: document.getElementById('m-corpus-content').value,
        order_index: parseInt(document.getElementById('m-corpus-order').value)
    };

    try {
        const response = await fetch(`${API_BASE}/modules/${currentModule.id}/corpus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to create module corpus entry');

        await loadModuleCorpus();
        document.getElementById('module-corpus-editor').innerHTML = '<p style="text-align: center; color: #95a5a6;">Corpus entry created!</p>';
        NotificationSystem.success('Module corpus entry created successfully!');

    } catch (error) {
        console.error('Error creating module corpus:', error);
        NotificationSystem.error('Failed to create corpus entry');
    }
}

async function updateModuleCorpus(event, id) {
    event.preventDefault();

    const data = {
        title: document.getElementById('m-corpus-title').value,
        type: document.getElementById('m-corpus-type').value,
        content: document.getElementById('m-corpus-content').value,
        order_index: parseInt(document.getElementById('m-corpus-order').value)
    };

    try {
        const response = await fetch(`${API_BASE}/module-corpus/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to update module corpus entry');

        await loadModuleCorpus();
        NotificationSystem.success('Corpus entry updated successfully!');

    } catch (error) {
        console.error('Error updating module corpus:', error);
        NotificationSystem.error('Failed to update corpus entry');
    }
}

async function deleteModuleCorpus(id) {
    ModalSystem.confirm(
        'Delete Module Corpus Entry',
        'Are you sure you want to delete this corpus entry? This action cannot be undone.',
        async () => {
            try {
                ModalSystem.loading('Deleting corpus entry...');

                const response = await fetch(`${API_BASE}/module-corpus/${id}`, {
                    method: 'DELETE',
                    headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
                });

                if (!response.ok) throw new Error('Failed to delete module corpus entry');

                await loadModuleCorpus();
                document.getElementById('module-corpus-editor').innerHTML = '<p style="text-align: center; color: #95a5a6;">Select a corpus entry or create a new one</p>';

                ModalSystem.close();
                NotificationSystem.success('Corpus entry deleted successfully');

            } catch (error) {
                console.error('Error deleting module corpus:', error);
                ModalSystem.close();
                NotificationSystem.error('Failed to delete corpus entry');
            }
        }
    );
}

// ===== MODULE DOCUMENTS FUNCTIONS =====

async function loadModuleDocuments() {
    try {
        const response = await fetch(`${API_BASE}/documents?module_id=${currentModule.id}`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}
        });

        if (!response.ok) throw new Error('Failed to load module documents');

        const data = await response.json();
        const documents = data.documents || data;

        const listHTML = documents.map(doc => `
            <div style="padding: 15px; margin-bottom: 10px; background: var(--sage-lighter); border-radius: 6px;">
                <div style="font-weight: 600; color: var(--sage-darkest); margin-bottom: 4px;">${doc.filename}</div>
                <div style="font-size: 12px; color: var(--text-medium);">Uploaded: ${new Date(doc.uploaded_at).toLocaleDateString()}</div>
            </div>
        `).join('');

        document.getElementById('module-documents-list').innerHTML = listHTML || '<p style="text-align: center; color: #95a5a6;">No documents</p>';

    } catch (error) {
        console.error('Error loading module documents:', error);
    }
}

function uploadModuleDocument() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md,.pdf';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('module_id', currentModule.id);

        try {
            const response = await fetch(`${API_BASE}/documents/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Failed to upload document');

            await loadModuleDocuments();
            NotificationSystem.success(`Document "${file.name}" uploaded successfully!`);

        } catch (error) {
            console.error('Error uploading document:', error);
            NotificationSystem.error('Failed to upload document');
        }
    };
    input.click();
}

// Initialize when classes section loads
document.addEventListener('DOMContentLoaded', () => {
    // Hook into section loading
    const originalLoadSection = window.loadSection;
    window.loadSection = function(section) {
        originalLoadSection?.call(this, section);
        if (section === 'classes') {
            setTimeout(loadClassesSection, 100);
        }
    };
});
