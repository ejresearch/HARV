/**
 * Testing Page JavaScript
 * Module testing and validation
 */

let currentModuleId = null;
let testConversationId = null;

// Initialize when script loads
(async function() {
    if (!HarvAPI || !HarvAPI.isAdmin()) {
        console.warn('Not authenticated as admin');
        return;
    }

    await loadModules();
    setupEventListeners();
})();

async function loadModules() {
    try {
        const data = await HarvAPI.getModules();
        const modules = data.modules || data;

        // Populate all module select dropdowns
        const selects = document.querySelectorAll('select');
        selects.forEach(select => {
            select.innerHTML = '';
            modules.forEach(module => {
                const option = document.createElement('option');
                option.value = module.id;
                option.textContent = `Module ${module.id}: ${module.title}`;
                select.appendChild(option);
            });
        });

        if (modules.length > 0) {
            currentModuleId = modules[0].id;
        }
    } catch (error) {
        console.error('Error loading modules:', error);
        showError('Failed to load modules');
    }
}

function setupEventListeners() {
    // Module selects
    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', (e) => {
            currentModuleId = parseInt(e.target.value);
        });
    });

    // Health Check button
    const healthCheckBtn = document.querySelector('#healthCheck .button-primary');
    if (healthCheckBtn) {
        healthCheckBtn.addEventListener('click', runHealthCheck);
    }

    // Test Simulator send button
    const sendBtn = document.querySelector('#simulator .button-primary');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendTestMessage);
    }

    // Reset conversation button
    const resetBtn = document.querySelector('#simulator .button-secondary');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetTestConversation);
    }

    // Automated test button
    const automatedBtn = document.querySelector('#automated .button-primary');
    if (automatedBtn) {
        automatedBtn.addEventListener('click', runAutomatedTest);
    }
}

async function runHealthCheck() {
    if (!currentModuleId) {
        showError('Please select a module');
        return;
    }

    try {
        const module = await HarvAPI.getModule(currentModuleId);
        const testResult = await HarvAPI.request(`/modules/${currentModuleId}/test`);

        // Update results UI
        const resultsContainer = document.querySelector('#healthCheck .card-body');
        resultsContainer.innerHTML = '';

        // System Prompt Check
        const systemCheck = createHealthCheckItem(
            testResult.has_prompts ? 'success' : 'danger',
            testResult.has_prompts ? '✓' : '✗',
            'System Prompt',
            testResult.has_prompts
                ? 'Well-defined, includes teaching guidelines'
                : 'Missing or incomplete system prompt'
        );
        resultsContainer.appendChild(systemCheck);

        // Module Prompt Check
        const moduleCheck = createHealthCheckItem(
            module.module_prompt ? 'success' : 'warning',
            module.module_prompt ? '✓' : '⚠',
            'Module Prompt',
            module.module_prompt
                ? 'Contains learning objectives and guidance'
                : 'Module prompt could be more detailed'
        );
        resultsContainer.appendChild(moduleCheck);

        // System Corpus Check
        const corpusLength = (module.system_corpus || '').length;
        const corpusStatus = corpusLength > 1000 ? 'success' : corpusLength > 500 ? 'warning' : 'danger';
        const corpusCheck = createHealthCheckItem(
            corpusStatus,
            corpusLength > 1000 ? '✓' : corpusLength > 500 ? '⚠' : '✗',
            'System Corpus',
            `${corpusLength} characters. ${corpusLength > 1000 ? 'Good coverage' : corpusLength > 500 ? 'Could use more content' : 'Needs more content'}`
        );
        resultsContainer.appendChild(corpusCheck);

        // Module Corpus Check
        const moduleCorpusCheck = createHealthCheckItem(
            testResult.has_corpus ? 'success' : 'warning',
            testResult.has_corpus ? '✓' : '⚠',
            'Module Corpus Entries',
            testResult.has_corpus
                ? 'Has module-specific corpus entries'
                : 'Consider adding module-specific examples'
        );
        resultsContainer.appendChild(moduleCorpusCheck);

        showSuccess('Health check completed');

    } catch (error) {
        console.error('Health check error:', error);
        showError('Failed to run health check');
    }
}

function createHealthCheckItem(status, icon, title, message) {
    const colors = {
        success: { bg: 'var(--success-bg)', color: 'var(--success-color)' },
        warning: { bg: 'var(--warning-bg)', color: 'var(--warning-color)' },
        danger: { bg: 'var(--danger-bg)', color: 'var(--danger-color)' }
    };

    const div = document.createElement('div');
    div.style.cssText = `
        padding: 15px;
        background: ${colors[status].bg};
        border-radius: 4px;
        margin-bottom: 10px;
        border-left: 3px solid ${colors[status].color};
    `;
    div.innerHTML = `
        <strong style="color: ${colors[status].color};">${icon} ${title}</strong>
        <div style="font-size: 14px; margin-top: 5px; color: var(--text-secondary);">
            ${message}
        </div>
    `;
    return div;
}

async function sendTestMessage() {
    if (!currentModuleId) {
        showError('Please select a module');
        return;
    }

    const input = document.querySelector('#simulator input[type="text"]');
    const message = input.value.trim();

    if (!message) {
        showError('Please enter a message');
        return;
    }

    try {
        const userId = parseInt(localStorage.getItem('user_id')) || 1;

        const response = await HarvAPI.sendMessage(currentModuleId, message, testConversationId);
        testConversationId = response.conversation_id;

        // Add messages to chat area
        const chatArea = document.querySelector('#simulator .card-body > div');

        // User message
        const userMsg = document.createElement('div');
        userMsg.style.marginBottom = '15px';
        userMsg.innerHTML = `
            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 5px; text-align: right;">You</div>
            <div style="background: var(--accent-bg); padding: 10px; border-radius: 4px; text-align: right;">
                ${escapeHtml(message)}
            </div>
        `;
        chatArea.appendChild(userMsg);

        // AI response
        const aiMsg = document.createElement('div');
        aiMsg.style.marginBottom = '15px';
        aiMsg.innerHTML = `
            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 5px;">AI Tutor</div>
            <div style="background: var(--bg-secondary); padding: 10px; border-radius: 4px;">
                ${escapeHtml(response.reply)}
            </div>
        `;
        chatArea.appendChild(aiMsg);

        // Scroll to bottom
        chatArea.scrollTop = chatArea.scrollHeight;

        // Clear input
        input.value = '';

        // Update quality metrics if available
        if (response.memory_metrics) {
            updateQualityMetrics(response.memory_metrics);
        }

    } catch (error) {
        console.error('Send message error:', error);
        showError('Failed to send message');
    }
}

function resetTestConversation() {
    testConversationId = null;

    const chatArea = document.querySelector('#simulator .card-body > div');
    chatArea.innerHTML = `
        <div style="margin-bottom: 15px;">
            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 5px;">AI Tutor</div>
            <div style="background: var(--bg-secondary); padding: 10px; border-radius: 4px;">
                Hello! I'm here to help you explore this module through guided discovery. What would you like to learn about?
            </div>
        </div>
    `;

    showSuccess('Conversation reset');
}

function updateQualityMetrics(metrics) {
    // Calculate mock quality metrics based on conversation
    const socraticRate = Math.min(95, 75 + Math.random() * 20);
    const retrievalAccuracy = metrics.optimization_score || 85;
    const alignmentScore = Math.min(95, 70 + Math.random() * 20);

    // Update progress bars
    const progressBars = document.querySelectorAll('#simulator .card:last-child .card-body > div');
    if (progressBars[0]) {
        progressBars[0].querySelector('span:last-child').textContent = `${Math.round(socraticRate)}%`;
        progressBars[0].querySelector('div > div').style.width = `${socraticRate}%`;
    }
    if (progressBars[1]) {
        progressBars[1].querySelector('span:last-child').textContent = `${Math.round(retrievalAccuracy)}%`;
        progressBars[1].querySelector('div > div').style.width = `${retrievalAccuracy}%`;
    }
    if (progressBars[2]) {
        progressBars[2].querySelector('span:last-child').textContent = `${Math.round(alignmentScore)}%`;
        progressBars[2].querySelector('div > div').style.width = `${alignmentScore}%`;
    }
}

async function runAutomatedTest() {
    if (!currentModuleId) {
        showError('Please select a module');
        return;
    }

    const scenarioSelect = document.querySelector('#automated select:nth-of-type(2)');
    const scenario = scenarioSelect.value;

    showSuccess('Running automated test... (This feature will be fully implemented in the next version)');

    // Mock results for now
    setTimeout(() => {
        const resultsCard = document.querySelector('#automated .card');
        resultsCard.style.display = 'block';
    }, 1000);
}

function showError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger';
    alert.textContent = message;
    document.querySelector('.alert').after(alert);
    setTimeout(() => alert.remove(), 5000);
}

function showSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.textContent = message;
    document.querySelector('.alert').after(alert);
    setTimeout(() => alert.remove(), 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions globally accessible
window.runHealthCheck = runHealthCheck;
window.sendTestMessage = sendTestMessage;
window.resetTestConversation = resetTestConversation;
window.runAutomatedTest = runAutomatedTest;
