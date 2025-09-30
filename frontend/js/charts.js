/**
 * Chart.js Initializations for HARV Admin Dashboard
 * Creates all analytics visualizations
 */

// Chart color palette matching theme
const chartColors = {
    primary: getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#1a73e8',
    success: getComputedStyle(document.documentElement).getPropertyValue('--success-color').trim() || '#34a853',
    warning: getComputedStyle(document.documentElement).getPropertyValue('--warning-color').trim() || '#ea8600',
    danger: getComputedStyle(document.documentElement).getPropertyValue('--danger-color').trim() || '#d93025',
    text: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#202124',
    textSecondary: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#5f6368',
    border: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() || '#e0e0e0'
};

// Global Chart.js defaults
Chart.defaults.color = chartColors.textSecondary;
Chart.defaults.borderColor = chartColors.border;
Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

/**
 * Dashboard - Module Performance Bar Chart
 */
function initModulePerformanceChart() {
    const canvas = document.getElementById('modulePerformanceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'Module 1: Communication Theory',
                'Module 2: History',
                'Module 3: Media Theory',
                'Module 4: Print Media',
                'Module 5: Broadcasting'
            ],
            datasets: [{
                label: 'Completion Rate',
                data: [92, 85, 88, 65, 55],
                backgroundColor: function(context) {
                    const value = context.parsed.y;
                    if (value >= 85) return chartColors.success;
                    if (value >= 65) return chartColors.warning;
                    return chartColors.danger;
                },
                borderRadius: 4,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.x + '% completion rate';
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        display: true
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * Analytics - Engagement Trends Line Chart
 */
function initEngagementTrendsChart() {
    const canvas = document.getElementById('engagementTrendsChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Generate 30 days of sample data
    const labels = [];
    const data = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        // Sample data with some variance
        data.push(Math.floor(30 + Math.random() * 25));
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Active Students',
                data: data,
                borderColor: chartColors.primary,
                backgroundColor: chartColors.primary + '20',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    padding: 12,
                    titleFont: {
                        size: 13
                    },
                    bodyFont: {
                        size: 14
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 8
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + ' students';
                        }
                    },
                    grid: {
                        color: chartColors.border
                    }
                }
            }
        }
    });
}

/**
 * Analytics - Grade Distribution Doughnut Chart
 */
function initGradeDistributionChart() {
    const canvas = document.getElementById('gradeDistributionChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['A (28%)', 'B (45%)', 'C (20%)', 'D (5%)', 'F (2%)'],
            datasets: [{
                data: [28, 45, 20, 5, 2],
                backgroundColor: [
                    chartColors.success,
                    chartColors.primary,
                    chartColors.warning,
                    '#ff9800',
                    chartColors.danger
                ],
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 15,
                        font: {
                            size: 13
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            return label + ' of students';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Initialize charts based on current page
 */
function initChartsForPage(pageId) {
    // Small delay to ensure canvas elements are in DOM
    setTimeout(() => {
        if (pageId === 'dashboard') {
            initModulePerformanceChart();
        } else if (pageId === 'analytics') {
            initEngagementTrendsChart();
            initGradeDistributionChart();
        }
    }, 100);
}

// Export for use in app.js
window.HarvCharts = {
    initChartsForPage,
    initModulePerformanceChart,
    initEngagementTrendsChart,
    initGradeDistributionChart
};
