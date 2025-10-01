/**
 * Module Corpus Entry Page JavaScript
 * Handles module-specific corpus CRUD operations
 */

let currentModuleId = null;
let currentEditingId = null;

// Initialize corpus entry page immediately
(async function() {
    if (!HarvAPI || !HarvAPI.isAdmin()) {
        console.warn('Not authenticated as admin');
        return;
    }

    await loadModulesList();
    await loadCorpusTypes();
    setupEventListeners();
})();

async function loadModulesList() {
    try {
        const modulesData = await HarvAPI.getModules();
        const moduleSelect = document.querySelector('.field select');

        if (moduleSelect && modulesData.modules) {
            moduleSelect.innerHTML = '<option value="">-- Choose a module --</option>';
            modulesData.modules.forEach(module => {
                const option = document.createElement('option');
                option.value = module.id;
                option.textContent = `Module ${module.id}: ${module.title}`;
                moduleSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading modules list:', error);
    }
}

async function loadCorpusTypes() {
    try {
        const data = await HarvAPI.getCorpusTypes();
        const typeSelect = document.querySelector('.card-body select');

        if (typeSelect && data.types) {
            typeSelect.innerHTML = '<option value="">-- Select type --</option>';
            data.types.forEach(type => {
                const option = document.createElement('option');
                option.value = type.value;
                option.textContent = type.label;
                typeSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading corpus types:', error);
    }
}

async function loadModuleCorpusEntries(moduleId) {
    if (!moduleId) return;

    currentModuleId = moduleId;

    try {
        const data = await HarvAPI.getModuleCorpusEntries(moduleId);
        displayModuleCorpusEntries(data);
    } catch (error) {
        console.error('Error loading module corpus entries:', error);
        showError('Failed to load module corpus entries');
    }
}

function displayModuleCorpusEntries(data) {
    const listCard = document.querySelector('.card:last-of-type');
    if (!listCard) return;

    // Update title
    const cardTitle = listCard.querySelector('.card-title');
    if (cardTitle) {
        cardTitle.textContent = `Existing Corpus Entries for ${data.module_title} (${data.entries.length})`;
    }

    // Display entries
    const cardBody = listCard.querySelector('.card-body');
    cardBody.innerHTML = '';

    if (data.entries.length === 0) {
        cardBody.innerHTML = '<div class="alert alert-info">No corpus entries for this module yet. Create one above!</div>';
        return;
    }

    data.entries.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'corpus-entry';
        entryDiv.style = 'border: 1px solid var(--border-color); padding: 15px; border-radius: 4px; margin-bottom: 15px;';

        entryDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                <div>
                    <strong>${escapeHtml(entry.title)}</strong>
                    <span class="badge badge-active" style="margin-left: 10px;">${entry.type}</span>
                </div>
                <div style="display: flex; gap: 5px;">
                    <button class="button button-secondary button-small" onclick="editModuleEntry(${entry.id})">Edit</button>
                    <button class="button button-danger button-small" onclick="deleteModuleEntry(${entry.id}, '${escapeHtml(entry.title)}')">Delete</button>
                </div>
            </div>
            <div style="color: var(--text-secondary); font-size: 14px; margin-bottom: 10px;">
                Order: ${entry.order_index} | Updated: ${new Date(entry.updated_at || entry.created_at).toLocaleDateString()}
            </div>
            <div style="max-height: 100px; overflow: hidden; position: relative;">
                ${escapeHtml(entry.content.substring(0, 300))}${entry.content.length > 300 ? '...' : ''}
            </div>
        `;

        cardBody.appendChild(entryDiv);
    });
}

function setupEventListeners() {
    // Module selector
    const moduleSelect = document.querySelector('.field select');
    if (moduleSelect) {
        moduleSelect.addEventListener('change', async (e) => {
            const moduleId = parseInt(e.target.value);
            if (moduleId) {
                await loadModuleCorpusEntries(moduleId);
            } else {
                // Clear entries display
                const listCard = document.querySelector('.card:last-of-type .card-body');
                if (listCard) {
                    listCard.innerHTML = '<div class="alert alert-info">Select a module to view its corpus entries</div>';
                }
            }
        });
    }

    // Save entry button
    const saveButton = document.querySelector('.button-primary');
    if (saveButton) {
        saveButton.addEventListener('click', handleSaveEntry);
    }

    // Clear form button
    const clearButton = document.querySelectorAll('.button-secondary')[0];
    if (clearButton && clearButton.textContent.includes('Clear')) {
        clearButton.addEventListener('click', clearForm);
    }
}

async function handleSaveEntry() {
    const moduleSelect = document.querySelector('.field select');
    const titleInput = document.querySelector('.card-body input[type="text"]');
    const typeSelect = document.querySelector('.card-body select');
    const contentTextarea = document.querySelector('.card-body textarea');
    const orderInput = document.querySelector('.card-body input[type="number"]');

    // Validation
    if (!moduleSelect.value) {
        showError('Please select a module first');
        return;
    }

    if (!titleInput.value.trim()) {
        showError('Title is required');
        return;
    }

    if (!typeSelect.value) {
        showError('Content type is required');
        return;
    }

    if (!contentTextarea.value.trim()) {
        showError('Content is required');
        return;
    }

    const entryData = {
        title: titleInput.value.trim(),
        type: typeSelect.value,
        content: contentTextarea.value.trim(),
        order_index: parseInt(orderInput.value) || 0
    };

    const moduleId = parseInt(moduleSelect.value);

    try {
        const saveButton = document.querySelector('.button-primary');
        saveButton.disabled = true;
        saveButton.textContent = currentEditingId ? 'Updating...' : 'Saving...';

        if (currentEditingId) {
            // Update existing entry
            await HarvAPI.updateModuleCorpusEntry(currentEditingId, entryData);
            showSuccess('Module corpus entry updated successfully');
            currentEditingId = null;
            saveButton.textContent = 'Save Entry';
        } else {
            // Create new entry
            await HarvAPI.createModuleCorpusEntry(moduleId, entryData);
            showSuccess('Module corpus entry saved successfully');
        }

        clearForm();
        await loadModuleCorpusEntries(moduleId);

        saveButton.disabled = false;

    } catch (error) {
        console.error('Error saving module corpus entry:', error);
        showError('Failed to save module corpus entry');
        const saveButton = document.querySelector('.button-primary');
        saveButton.disabled = false;
        saveButton.textContent = currentEditingId ? 'Update Entry' : 'Save Entry';
    }
}

async function editModuleEntry(entryId) {
    try {
        const data = await HarvAPI.getModuleCorpusEntries(currentModuleId);
        const entry = data.entries.find(e => e.id === entryId);

        if (!entry) {
            showError('Entry not found');
            return;
        }

        // Populate form
        const titleInput = document.querySelector('.card-body input[type="text"]');
        const typeSelect = document.querySelector('.card-body select');
        const contentTextarea = document.querySelector('.card-body textarea');
        const orderInput = document.querySelector('.card-body input[type="number"]');

        titleInput.value = entry.title;
        typeSelect.value = entry.type;
        contentTextarea.value = entry.content;
        orderInput.value = entry.order_index;

        currentEditingId = entryId;

        // Change button text
        const saveButton = document.querySelector('.button-primary');
        saveButton.textContent = 'Update Entry';

        // Scroll to form
        document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error loading entry for editing:', error);
        showError('Failed to load entry');
    }
}

async function deleteModuleEntry(entryId, entryTitle) {
    if (!confirm(`Are you sure you want to delete "${entryTitle}"?\n\nThis action cannot be undone.`)) {
        return;
    }

    try {
        await HarvAPI.deleteModuleCorpusEntry(entryId);
        showSuccess('Module corpus entry deleted successfully');
        await loadModuleCorpusEntries(currentModuleId);
    } catch (error) {
        console.error('Error deleting module corpus entry:', error);
        showError('Failed to delete module corpus entry');
    }
}

function clearForm() {
    const titleInput = document.querySelector('.card-body input[type="text"]');
    const typeSelect = document.querySelector('.card-body select');
    const contentTextarea = document.querySelector('.card-body textarea');
    const orderInput = document.querySelector('.card-body input[type="number"]');

    titleInput.value = '';
    typeSelect.value = '';
    contentTextarea.value = '';
    orderInput.value = '1';

    currentEditingId = null;

    const saveButton = document.querySelector('.button-primary');
    saveButton.textContent = 'Save Entry';
}

function showError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger';
    alert.textContent = message;
    document.querySelector('.alert-info').after(alert);

    setTimeout(() => alert.remove(), 5000);
}

function showSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.textContent = message;
    document.querySelector('.alert-info').after(alert);

    setTimeout(() => alert.remove(), 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions globally accessible for inline onclick
window.editModuleEntry = editModuleEntry;
window.deleteModuleEntry = deleteModuleEntry;
