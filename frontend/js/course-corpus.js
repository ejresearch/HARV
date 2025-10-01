/**
 * Course Corpus Page JavaScript
 * Handles global corpus CRUD operations
 */

let currentEditingId = null;

// Initialize course corpus page immediately
(async function() {
    if (!HarvAPI || !HarvAPI.isAdmin()) {
        console.warn('Not authenticated as admin');
        return;
    }

    await loadCorpusEntries();
    await loadCorpusTypes();
    setupEventListeners();
})();

async function loadCorpusEntries() {
    try {
        const data = await HarvAPI.getCourseCorpus();
        displayCorpusEntries(data.entries);
    } catch (error) {
        console.error('Error loading corpus entries:', error);
        showError('Failed to load corpus entries');
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

function displayCorpusEntries(entries) {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (entries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No corpus entries yet. Create one above!</td></tr>';
        return;
    }

    // Update count in header
    const headerTitle = document.querySelector('.card:last-of-type .card-title');
    if (headerTitle) {
        headerTitle.textContent = `Global Corpus Entries (${entries.length})`;
    }

    entries.forEach(entry => {
        const row = document.createElement('tr');

        const updatedDate = entry.updated_at
            ? new Date(entry.updated_at).toLocaleDateString()
            : 'N/A';

        row.innerHTML = `
            <td>${escapeHtml(entry.title)}</td>
            <td><span class="badge badge-active">${entry.type}</span></td>
            <td>${entry.order_index}</td>
            <td>${updatedDate}</td>
            <td>
                <button class="button button-secondary button-small" onclick="editEntry(${entry.id})">Edit</button>
                <button class="button button-danger button-small" onclick="deleteEntry(${entry.id}, '${escapeHtml(entry.title)}')">Delete</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function setupEventListeners() {
    // Add entry button
    const addButton = document.querySelector('.button-primary');
    if (addButton) {
        addButton.addEventListener('click', handleAddEntry);
    }

    // Clear form button
    const clearButton = document.querySelector('.button-secondary');
    if (clearButton && clearButton.textContent.includes('Clear')) {
        clearButton.addEventListener('click', clearForm);
    }

    // Search functionality
    const searchInput = document.querySelector('input[placeholder="Search..."]');
    if (searchInput) {
        searchInput.addEventListener('input', filterEntries);
    }

    // Type filter
    const typeFilter = document.querySelector('.card-header select');
    if (typeFilter) {
        typeFilter.addEventListener('change', filterEntries);
    }
}

async function handleAddEntry() {
    const titleInput = document.querySelector('.card-body input[type="text"]');
    const typeSelect = document.querySelector('.card-body select');
    const contentTextarea = document.querySelector('.card-body textarea');
    const orderInput = document.querySelector('.card-body input[type="number"]');

    // Validation
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

    try {
        const addButton = document.querySelector('.button-primary');
        addButton.disabled = true;
        addButton.textContent = currentEditingId ? 'Updating...' : 'Adding...';

        if (currentEditingId) {
            // Update existing entry
            await HarvAPI.updateCourseCorpusEntry(currentEditingId, entryData);
            showSuccess('Corpus entry updated successfully');
            currentEditingId = null;
            addButton.textContent = 'Add to Course Corpus';
        } else {
            // Create new entry
            await HarvAPI.createCourseCorpusEntry(entryData);
            showSuccess('Corpus entry added successfully');
        }

        clearForm();
        await loadCorpusEntries();

        addButton.disabled = false;

    } catch (error) {
        console.error('Error saving corpus entry:', error);
        showError('Failed to save corpus entry');
        const addButton = document.querySelector('.button-primary');
        addButton.disabled = false;
        addButton.textContent = currentEditingId ? 'Update Entry' : 'Add to Course Corpus';
    }
}

async function editEntry(entryId) {
    try {
        const data = await HarvAPI.getCourseCorpus();
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
        const addButton = document.querySelector('.button-primary');
        addButton.textContent = 'Update Entry';

        // Scroll to form
        document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error loading entry for editing:', error);
        showError('Failed to load entry');
    }
}

async function deleteEntry(entryId, entryTitle) {
    if (!confirm(`Are you sure you want to delete "${entryTitle}"?\n\nThis action cannot be undone.`)) {
        return;
    }

    try {
        await HarvAPI.deleteCourseCorpusEntry(entryId);
        showSuccess('Corpus entry deleted successfully');
        await loadCorpusEntries();
    } catch (error) {
        console.error('Error deleting corpus entry:', error);
        showError('Failed to delete corpus entry');
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

    const addButton = document.querySelector('.button-primary');
    addButton.textContent = 'Add to Course Corpus';
}

function filterEntries() {
    const searchTerm = document.querySelector('input[placeholder="Search..."]').value.toLowerCase();
    const typeFilter = document.querySelector('.card-header select').value.toLowerCase();
    const rows = document.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const title = row.cells[0]?.textContent.toLowerCase() || '';
        const type = row.cells[1]?.textContent.toLowerCase() || '';

        const matchesSearch = title.includes(searchTerm);
        const matchesType = !typeFilter || typeFilter === 'all types' || type.includes(typeFilter);

        row.style.display = (matchesSearch && matchesType) ? '' : 'none';
    });
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
window.editEntry = editEntry;
window.deleteEntry = deleteEntry;
