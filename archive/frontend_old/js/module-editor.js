/**
 * Module Editor Page JavaScript
 * Loads and edits module configuration
 */

(function() {
console.log('✅ module-editor.js loading... v20251001131400');

let currentModule = null;
let allModules = [];

// Initialize when DOM is ready
async function initModuleEditor() {
    console.log('Initializing module editor...');

    if (!HarvAPI || !HarvAPI.isAdmin()) {
        console.warn('Not authenticated as admin');
        return;
    }

    await loadModules();

    // Check if we should auto-load a specific module
    const moduleId = sessionStorage.getItem('editingModuleId');
    if (moduleId) {
        console.log(`Auto-loading module ${moduleId} from sessionStorage`);
        const select = document.getElementById('moduleSelect');
        if (select) {
            select.value = moduleId;
            await loadModuleData(parseInt(moduleId));
        } else {
            console.warn('moduleSelect dropdown not found yet, waiting...');
            setTimeout(async () => {
                const selectRetry = document.getElementById('moduleSelect');
                if (selectRetry) {
                    selectRetry.value = moduleId;
                    await loadModuleData(parseInt(moduleId));
                }
            }, 100);
        }
        sessionStorage.removeItem('editingModuleId'); // Clear after use
    }

    setupEventListeners();
}

// Wait a tick for DOM to settle
setTimeout(initModuleEditor, 100);

async function loadModules() {
    try {
        const data = await HarvAPI.getModules();
        allModules = data.modules || data;

        // Populate module dropdown
        const select = document.getElementById('moduleSelect');
        if (select) {
            select.innerHTML = '<option value="">-- Choose a module --</option>';
            allModules.forEach(module => {
                const option = document.createElement('option');
                option.value = module.id;
                option.textContent = `Module ${module.id}: ${module.title}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading modules:', error);
        showError('Failed to load modules');
    }
}

function setupEventListeners() {
    // Module select dropdown
    const select = document.getElementById('moduleSelect');
    if (select) {
        select.addEventListener('change', async (e) => {
            const moduleId = parseInt(e.target.value);
            if (moduleId) {
                await loadModuleData(moduleId);
            }
        });
    }

    // Save button
    const saveBtn = document.getElementById('saveModuleBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveModule);
    }

    // Tab switching - re-populate fields when tabs change
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Wait for tab content to be visible, then re-populate
            setTimeout(() => {
                if (currentModule) {
                    populateFields(currentModule);
                }
            }, 50);
        });
    });
}

function populateFields(module) {
    console.log('Populating fields with module data:', module.title);

    // Debug: log what's actually in the DOM
    console.log('🔍 DOM DEBUG:');
    const mainContent = document.getElementById('mainContent');
    console.log('  #mainContent HTML length:', mainContent?.innerHTML.length || 0);
    console.log('  #mainContent contains "moduleTitle"?', mainContent?.innerHTML.includes('moduleTitle'));
    console.log('  #mainContent FULL HTML:', mainContent?.innerHTML);
    console.log('  Total inputs:', document.querySelectorAll('input').length);
    console.log('  Total textareas:', document.querySelectorAll('textarea').length);
    console.log('  Input IDs:', Array.from(document.querySelectorAll('input')).map(el => el.id || '(no id)'));
    console.log('  Textarea IDs:', Array.from(document.querySelectorAll('textarea')).map(el => el.id || '(no id)'));
    console.log('  #basicInfo exists?', !!document.getElementById('basicInfo'));
    console.log('  #basicInfo is active?', document.getElementById('basicInfo')?.classList.contains('active'));
    console.log('  moduleTitle via ID?', document.getElementById('moduleTitle'));
    console.log('  moduleTitle via selector?', document.querySelector('#moduleTitle'));
    console.log('  moduleTitle via attr?', document.querySelector('[id="moduleTitle"]'));

    // Wait for the moduleTitle field to exist in DOM
    const waitForField = (callback, maxWait = 3000) => {
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            const field = document.getElementById('moduleTitle');
            if (field) {
                clearInterval(checkInterval);
                console.log('✓ Fields are ready in DOM');
                callback();
            } else if (Date.now() - startTime > maxWait) {
                clearInterval(checkInterval);
                console.error('✗ Timeout waiting for fields to appear in DOM');
                console.error('  Final DOM state - inputs:', document.querySelectorAll('input').length);
                console.error('  Final DOM state - input IDs:', Array.from(document.querySelectorAll('input')).map(el => el.id));
            }
        }, 50);
    };

    waitForField(() => {
        const setField = (id, value) => {
            const field = document.getElementById(id);
            if (field) {
                field.value = value || '';
                console.log(`✓ Set ${id} = "${(value || '').substring(0, 50)}..."`);
            } else {
                console.warn(`✗ Field not found: ${id}`);
            }
        };

        // Populate all fields
        setField('moduleTitle', module.title);
        setField('moduleDescription', module.description);
        setField('moduleLearningObjectives', module.learning_objectives);
        setField('moduleResources', module.resources);
        setField('systemPrompt', module.system_prompt);
        setField('modulePrompt', module.module_prompt);
        setField('systemCorpus', module.system_corpus);
        setField('moduleCorpus', module.module_corpus);
    });
}

async function loadModuleData(moduleId) {
    try {
        console.log(`Loading module ${moduleId}...`);
        const module = await HarvAPI.getModule(moduleId);
        console.log('Module data received:', module);
        currentModule = module;

        // Populate all fields
        populateFields(module);

        showSuccess(`✅ Loaded Module ${moduleId}: ${module.title}`);

    } catch (error) {
        console.error('Error loading module:', error);
        showError(`Failed to load module ${moduleId}`);
    }
}

async function saveModule() {
    if (!currentModule) {
        showError('No module selected');
        return;
    }

    try {
        // Gather data from form
        const moduleData = {
            title: document.getElementById('moduleTitle').value,
            description: document.getElementById('moduleDescription').value,
            learning_objectives: document.getElementById('moduleLearningObjectives').value,
            resources: document.getElementById('moduleResources').value,
            system_prompt: document.getElementById('systemPrompt').value,
            module_prompt: document.getElementById('modulePrompt').value,
            system_corpus: document.getElementById('systemCorpus').value,
            module_corpus: document.getElementById('moduleCorpus').value
        };

        await HarvAPI.updateModule(currentModule.id, moduleData);
        showSuccess('✅ Module saved successfully!');

    } catch (error) {
        console.error('Save error:', error);
        showError('Failed to save module');
    }
}

function showError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger';
    alert.textContent = message;
    alert.style.marginBottom = '20px';
    const firstElement = document.querySelector('.alert, .field');
    if (firstElement) {
        firstElement.before(alert);
    }
    setTimeout(() => alert.remove(), 5000);
}

function showSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.textContent = message;
    alert.style.marginBottom = '20px';
    const firstElement = document.querySelector('.alert, .field');
    if (firstElement) {
        firstElement.before(alert);
    }
    setTimeout(() => alert.remove(), 3000);
}

// Make functions globally accessible
window.loadModuleData = loadModuleData;
window.saveModule = saveModule;

console.log('✅ Module editor functions exported');

})(); // Close IIFE
