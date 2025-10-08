// ===== NOTIFICATION SYSTEM =====
// Replaces alerts with elegant toast notifications

const NotificationSystem = {
    container: null,

    init() {
        // Create notification container if it doesn't exist
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            `;
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'info', duration = 4000) {
        this.init();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        notification.style.cssText = `
            background: white;
            color: #1f2937;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            min-width: 300px;
            max-width: 500px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-left: 4px solid ${colors[type]};
            pointer-events: auto;
            animation: slideIn 0.3s ease-out;
            transform-origin: right top;
        `;

        notification.innerHTML = `
            <div style="
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: ${colors[type]};
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                flex-shrink: 0;
            ">${icons[type]}</div>
            <div style="flex: 1; font-size: 14px; line-height: 1.5;">${message}</div>
            <button onclick="this.parentElement.remove()" style="
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                padding: 4px;
                font-size: 18px;
                line-height: 1;
                flex-shrink: 0;
            ">×</button>
        `;

        this.container.appendChild(notification);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }

        return notification;
    },

    success(message, duration) {
        return this.show(message, 'success', duration);
    },

    error(message, duration) {
        return this.show(message, 'error', duration);
    },

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    },

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
};

// Add animations to the page
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes slideOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== MODAL DIALOG SYSTEM =====
// Replaces prompts and confirms with elegant modals

const ModalSystem = {
    overlay: null,

    init() {
        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.id = 'modal-overlay';
            this.overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                backdrop-filter: blur(4px);
            `;
            this.overlay.onclick = (e) => {
                if (e.target === this.overlay) {
                    this.close();
                }
            };
            document.body.appendChild(this.overlay);
        }
    },

    open(content) {
        this.init();
        this.overlay.innerHTML = '';
        this.overlay.appendChild(content);
        this.overlay.style.display = 'flex';
        this.overlay.style.animation = 'fadeIn 0.2s ease-out';
        content.style.animation = 'modalSlideIn 0.3s ease-out';
    },

    close() {
        this.overlay.style.animation = 'fadeOut 0.2s ease-in';
        setTimeout(() => {
            this.overlay.style.display = 'none';
            this.overlay.innerHTML = '';
        }, 200);
    },

    confirm(title, message, onConfirm) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 450px;
            width: 90%;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        `;

        modal.innerHTML = `
            <h3 style="margin: 0 0 12px 0; color: #1f1f1f; font-size: 20px; font-weight: 700;">${title}</h3>
            <p style="margin: 0 0 24px 0; color: #565656; line-height: 1.6;">${message}</p>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="modal-cancel" style="
                    padding: 10px 20px;
                    border: 2px solid #d4d4d4;
                    background: white;
                    color: #2f2f2f;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.2s;
                "
                onmouseover="this.style.background='#f5f5f5'"
                onmouseout="this.style.background='white'">Cancel</button>
                <button id="modal-confirm" style="
                    padding: 10px 20px;
                    border: none;
                    background: #EF4444;
                    color: white;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.2s;
                "
                onmouseover="this.style.background='#DC2626'"
                onmouseout="this.style.background='#EF4444'">Delete</button>
            </div>
        `;

        modal.querySelector('#modal-cancel').onclick = () => this.close();
        modal.querySelector('#modal-confirm').onclick = () => {
            onConfirm();
            this.close();
        };

        this.open(modal);
    },

    prompt(title, message, defaultValue = '', onSubmit) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 450px;
            width: 90%;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        `;

        modal.innerHTML = `
            <h3 style="margin: 0 0 12px 0; color: #1f1f1f; font-size: 20px; font-weight: 700;">${title}</h3>
            <p style="margin: 0 0 16px 0; color: #565656; line-height: 1.6;">${message}</p>
            <input type="text" id="modal-input" value="${defaultValue}" style="
                width: 100%;
                padding: 10px 12px;
                border: 2px solid #d4d4d4;
                border-radius: 6px;
                font-size: 14px;
                margin-bottom: 20px;
                box-sizing: border-box;
            ">
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="modal-cancel" style="
                    padding: 10px 20px;
                    border: 2px solid #d4d4d4;
                    background: white;
                    color: #2f2f2f;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.2s;
                "
                onmouseover="this.style.background='#f5f5f5'"
                onmouseout="this.style.background='white'">Cancel</button>
                <button id="modal-submit" style="
                    padding: 10px 20px;
                    border: none;
                    background: #10B981;
                    color: white;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.2s;
                "
                onmouseover="this.style.background='#059669'"
                onmouseout="this.style.background='#10B981'">Submit</button>
            </div>
        `;

        const input = modal.querySelector('#modal-input');
        const submit = () => {
            const value = input.value.trim();
            if (value) {
                onSubmit(value);
                this.close();
            }
        };

        modal.querySelector('#modal-cancel').onclick = () => this.close();
        modal.querySelector('#modal-submit').onclick = submit;
        input.onkeypress = (e) => {
            if (e.key === 'Enter') submit();
        };

        this.open(modal);
        setTimeout(() => input.focus(), 100);
    },

    loading(message = 'Loading...') {
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 30px;
            max-width: 350px;
            width: 90%;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            text-align: center;
        `;

        modal.innerHTML = `
            <div class="spinner" style="
                width: 40px;
                height: 40px;
                border: 4px solid #ECFDF5;
                border-top-color: #10B981;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 16px;
            "></div>
            <p style="margin: 0; color: #1f1f1f; font-size: 15px; font-weight: 600;">${message}</p>
        `;

        this.open(modal);
    },

    custom(title, htmlContent) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 0;
            max-width: 800px;
            width: 90%;
            max-height: 80vh;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
        `;

        modal.innerHTML = `
            <div style="
                padding: 20px 24px;
                border-bottom: 2px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-shrink: 0;
            ">
                <h3 style="margin: 0; color: #1f1f1f; font-size: 20px; font-weight: 700;">${title}</h3>
                <button onclick="ModalSystem.close()" style="
                    background: none;
                    border: none;
                    color: #9ca3af;
                    cursor: pointer;
                    padding: 4px;
                    font-size: 24px;
                    line-height: 1;
                ">×</button>
            </div>
            <div style="overflow-y: auto; flex: 1;">
                ${htmlContent}
            </div>
        `;

        this.open(modal);
    }
};

// Add modal animations
if (!document.getElementById('modal-styles')) {
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }

        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Make globally available
window.NotificationSystem = NotificationSystem;
window.ModalSystem = ModalSystem;
