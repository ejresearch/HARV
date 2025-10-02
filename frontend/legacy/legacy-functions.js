// ===== LEGACY MEMORY FUNCTIONS (kept for backwards compatibility) =====

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
                ...getAuthHeaders()
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
                ...getAuthHeaders()
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

async function loadMemoryFilters() {
    try {
        // Load users for filter
        const usersResponse = await fetch(`${API_BASE}/users`, {
            headers: getAuthHeaders()
        });
        if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            const users = usersData.users || usersData; // Handle both array and {users: []} response
            const userFilter = document.getElementById('memory-user-filter');
            if (userFilter && Array.isArray(users)) {
                users.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.textContent = user.name || user.email;
                    userFilter.appendChild(option);
                });
            }
        }

        // Load modules for filter
        const modulesResponse = await fetch(`${API_BASE}/modules`, {
            headers: getAuthHeaders()
        });
        if (modulesResponse.ok) {
            const modulesData = await modulesResponse.json();
            const modules = modulesData.modules || modulesData; // Handle both array and {modules: []} response
            const moduleFilter = document.getElementById('memory-module-filter');
            if (moduleFilter && Array.isArray(modules)) {
                modules.forEach(module => {
                    const option = document.createElement('option');
                    option.value = module.id;
                    option.textContent = module.title;
                    moduleFilter.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Error loading memory filters:', error);
    }
}

// ===== PROGRESS FUNCTIONS =====

async function loadProgressFilters() {
    try {
        // Load users for filter
        const usersResponse = await fetch(`${API_BASE}/users`, {
            headers: getAuthHeaders()
        });
        if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            const users = usersData.users || usersData; // Handle both array and {users: []} response
            const userFilter = document.getElementById('progress-user-filter');
            if (userFilter && Array.isArray(users)) {
                users.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.textContent = user.name || user.email;
                    userFilter.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Error loading progress filters:', error);
    }
}

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
                ...getAuthHeaders()
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
        const statusIcon = module.completed ? 'Yes' : '[ ]';
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
        { key: 'is_admin', label: 'Admin', format: (val) => val ? 'Yes' : 'No' }
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
        { key: 'finalized', label: 'Finalized', format: (val) => val ? 'Yes' : 'No' },
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
        { key: 'completed', label: 'Completed', format: (val) => val ? 'Yes' : 'No' },
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


// ===== ARCHIVE SECTION HANDLER =====
function showArchiveSection(section) {
    // Update active tab
    document.querySelectorAll(".corpus-tab").forEach(btn => btn.classList.remove("active"));
    event?.target?.classList.add("active");

    const content = document.getElementById("archive-content");

    switch(section) {
        case "modules":
            content.innerHTML = archivedModulesHTML;
            break;
        case "corpus":
            content.innerHTML = archivedCorpusHTML;
            break;
        case "documents":
            content.innerHTML = archivedDocumentsHTML;
            break;
        default:
            content.innerHTML = `<p style="text-align: center; padding: 40px;">Select a section to view</p>`;
    }
}

