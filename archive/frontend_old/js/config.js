/**
 * Frontend Configuration
 * Environment-based API configuration
 */

// Determine API base URL from environment
const getAPIBaseURL = () => {
    // Check if running in production
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        // Production: use same origin
        return window.location.origin;
    }

    // Development: use environment variable or default
    return window.HarvConfig?.API_URL || 'http://localhost:8000';
};

// Export configuration
window.HarvConfig = {
    API_URL: getAPIBaseURL(),
    ENV: window.location.hostname === 'localhost' ? 'development' : 'production'
};

console.log('🔧 HARV Config:', window.HarvConfig);
