/**
 * Dashboard Page JavaScript
 * Loads and displays admin analytics data
 */

// Initialize dashboard immediately when script loads
(async function() {
    // Check admin access
    if (!HarvAPI || !HarvAPI.isAdmin()) {
        console.warn('Not authenticated as admin');
        return;
    }

    await loadDashboardData();
    setupEventListeners();
})();

async function loadDashboardData() {
    try {
        // Load all dashboard data in parallel
        const [statsData, performanceData, alertsData] = await Promise.all([
            HarvAPI.getDashboardStats(),
            HarvAPI.getModulesPerformance(),
            HarvAPI.getAnalyticsAlerts()
        ]);

        updateStatsCards(statsData);
        updateModulePerformanceChart(performanceData.modules);
        updateAlertsSection(alertsData.alerts);

    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data. Please refresh the page.');
    }
}

function updateStatsCards(stats) {
    // Update stat card values
    const cards = document.querySelectorAll('.stat-card');

    if (cards[0]) {
        cards[0].querySelector('.stat-value').textContent = stats.students_enrolled;
        cards[0].querySelector('.stat-change').textContent = `↑ ${stats.students_trend} this week`;
    }

    if (cards[1]) {
        cards[1].querySelector('.stat-value').textContent = stats.active_conversations;
        const trendEl = cards[1].querySelector('.stat-change');
        trendEl.textContent = `${stats.conversations_trend} today`;
        trendEl.style.color = stats.conversations_trend.startsWith('-') ? 'var(--danger-color)' : 'var(--success-color)';
    }

    if (cards[2]) {
        cards[2].querySelector('.stat-value').textContent = stats.modules_completed;
        cards[2].querySelector('.stat-change').textContent = `↑ ${stats.modules_trend} today`;
    }

    if (cards[3]) {
        cards[3].querySelector('.stat-value').textContent = stats.avg_grade;
    }

    if (cards[4]) {
        cards[4].querySelector('.stat-value').textContent = `${stats.avg_time_minutes}min`;
    }

    if (cards[5]) {
        cards[5].querySelector('.stat-value').textContent = `${Math.round(stats.completion_rate * 100)}%`;
    }
}

function updateModulePerformanceChart(modules) {
    const canvas = document.getElementById('modulePerformanceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Sort modules by completion rate
    const sortedModules = modules.sort((a, b) => b.completion_rate - a.completion_rate);

    // Use Chart.js if available, otherwise draw simple bars
    if (typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedModules.map(m => `Module ${m.id}`),
                datasets: [{
                    label: 'Completion Rate',
                    data: sortedModules.map(m => m.completion_rate * 100),
                    backgroundColor: sortedModules.map(m => {
                        if (m.completion_rate >= 0.8) return '#10b981';
                        if (m.completion_rate >= 0.6) return '#f59e0b';
                        return '#ef4444';
                    })
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const module = sortedModules[context.dataIndex];
                                return [
                                    `Completion: ${Math.round(module.completion_rate * 100)}%`,
                                    `Avg Grade: ${module.avg_grade}`,
                                    `Students: ${module.student_count}`
                                ];
                            }
                        }
                    }
                }
            }
        });
    } else {
        // Simple canvas drawing if Chart.js not available
        drawSimpleBarChart(ctx, sortedModules, canvas.width, canvas.height);
    }
}

function drawSimpleBarChart(ctx, modules, width, height) {
    const padding = 40;
    const barWidth = (width - padding * 2) / modules.length;
    const maxHeight = height - padding * 2;

    ctx.clearRect(0, 0, width, height);

    // Draw bars
    modules.forEach((module, index) => {
        const barHeight = module.completion_rate * maxHeight;
        const x = padding + index * barWidth;
        const y = height - padding - barHeight;

        // Bar color based on performance
        if (module.completion_rate >= 0.8) ctx.fillStyle = '#10b981';
        else if (module.completion_rate >= 0.6) ctx.fillStyle = '#f59e0b';
        else ctx.fillStyle = '#ef4444';

        ctx.fillRect(x + 5, y, barWidth - 10, barHeight);

        // Label
        ctx.fillStyle = '#666';
        ctx.font = '12px sans-serif';
        ctx.save();
        ctx.translate(x + barWidth / 2, height - 10);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText(`M${module.id}`, 0, 0);
        ctx.restore();

        // Percentage
        ctx.fillStyle = '#333';
        ctx.fillText(`${Math.round(module.completion_rate * 100)}%`, x + barWidth / 2 - 15, y - 5);
    });
}

function updateAlertsSection(alerts) {
    const alertsContainer = document.querySelector('.card-body');
    if (!alertsContainer) return;

    // Find the alerts card
    const alertsCard = Array.from(document.querySelectorAll('.card'))
        .find(card => card.querySelector('.card-title')?.textContent.includes('Needing Attention'));

    if (!alertsCard) return;

    const alertsBody = alertsCard.querySelector('.card-body');
    alertsBody.innerHTML = '';

    if (alerts.length === 0) {
        alertsBody.innerHTML = '<div class="alert alert-success">All modules are performing well!</div>';
        return;
    }

    alerts.forEach(alert => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${alert.severity === 'high' ? 'danger' : 'warning'}`;

        alertDiv.innerHTML = `
            <strong>Module ${alert.module_id}: ${alert.module_title}</strong>
            <ul style="margin: 10px 0 10px 20px;">
                ${alert.issues.map(issue => `<li>${issue}</li>`).join('')}
            </ul>
            <div style="margin-top: 10px;">
                <button class="button button-secondary button-small" onclick="viewModuleDetails(${alert.module_id})">View Details</button>
                <button class="button button-secondary button-small" onclick="editModule(${alert.module_id})">Edit Module</button>
            </div>
        `;

        alertsBody.appendChild(alertDiv);
    });
}

function setupEventListeners() {
    // Refresh button
    const refreshBtn = document.querySelector('.button-secondary.button-small');
    if (refreshBtn && refreshBtn.textContent === 'Refresh') {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.textContent = 'Refreshing...';
            refreshBtn.disabled = true;
            await loadDashboardData();
            refreshBtn.textContent = 'Refresh';
            refreshBtn.disabled = false;
        });
    }
}

// Helper functions
function viewModuleDetails(moduleId) {
    window.location.href = `analytics.html?module=${moduleId}`;
}

function editModule(moduleId) {
    window.location.href = `module-editor.html?id=${moduleId}`;
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.textContent = message;
    document.querySelector('.stat-cards').before(errorDiv);

    setTimeout(() => errorDiv.remove(), 5000);
}

// Update timestamp
setInterval(() => {
    const timestamp = document.querySelector('[style*="color: var(--text-secondary)"]');
    if (timestamp) {
        const now = new Date();
        timestamp.textContent = `Last updated: ${now.toLocaleTimeString()}`;
    }
}, 60000); // Update every minute
