// Dark mode toggle functionality

class DarkMode {
    constructor() {
        this.darkModeKey = 'darkMode';
        this.isDark = this.getSavedPreference();
        this.init();
    }

    init() {
        // Apply saved preference
        if (this.isDark) {
            this.enable();
        }

        // Create toggle button
        this.createToggleButton();

        // Listen for system preference changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem(this.darkModeKey)) {
                    this.isDark = e.matches;
                    this.apply();
                }
            });
        }
    }

    createToggleButton() {
        const button = document.createElement('button');
        button.id = 'darkModeToggle';
        button.className = 'dark-mode-toggle';
        button.innerHTML = this.isDark ? '☀️' : '🌙';
        button.title = this.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        
        button.addEventListener('click', () => this.toggle());
        
        // Add to sidebar if exists, otherwise to body
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.appendChild(button);
        } else {
            document.body.appendChild(button);
        }

        // Add styles
        this.addStyles();
    }

    addStyles() {
        if (document.getElementById('dark-mode-styles')) return;

        const style = document.createElement('style');
        style.id = 'dark-mode-styles';
        style.textContent = `
            .dark-mode-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: none;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .dark-mode-toggle:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
            }

            .dark-mode-toggle:active {
                transform: translateY(0);
            }

            /* Dark mode styles */
            body.dark-mode {
                background: #1a1a2e;
                color: #eee;
            }

            .dark-mode .auth-card,
            .dark-mode .chat-header,
            .dark-mode .chat-input-container,
            .dark-mode .stats-header,
            .dark-mode .stat-card,
            .dark-mode .chart-card {
                background: #16213e;
                color: #eee;
                border-color: #2a3f5f;
            }

            .dark-mode .message.assistant .message-bubble {
                background: #0f3460;
                border-color: #2a3f5f;
                color: #eee;
            }

            .dark-mode .form-group input,
            .dark-mode #messageInput,
            .dark-mode .model-selector select {
                background: #0f3460;
                border-color: #2a3f5f;
                color: #eee;
            }

            .dark-mode .form-group input::placeholder,
            .dark-mode #messageInput::placeholder {
                color: #888;
            }

            .dark-mode .form-group label,
            .dark-mode .stat-label,
            .dark-mode .user-email,
            .dark-mode .subtitle {
                color: #aaa;
            }

            .dark-mode .title,
            .dark-mode .chat-header h1,
            .dark-mode .stats-header h1,
            .dark-mode .chart-card h3 {
                color: #eee;
            }

            .dark-mode .suggestion-chip {
                background: #0f3460;
                border-color: #2a3f5f;
                color: #eee;
            }

            .dark-mode .thinking-bubble {
                background: #0f3460;
                border-color: #2a3f5f;
            }

            .dark-mode .message-bubble code {
                background: #0f3460;
                color: #f92672;
            }

            .dark-mode .nav-btn:hover,
            .dark-mode .logout-btn:hover {
                background: rgba(255, 255, 255, 0.15);
            }

            .dark-mode .chat-messages::-webkit-scrollbar-track {
                background: #16213e;
            }

            .dark-mode .chat-messages::-webkit-scrollbar-thumb {
                background: #2a3f5f;
            }

            .dark-mode .welcome-message h2 {
                color: #eee;
            }

            .dark-mode .welcome-message p {
                color: #aaa;
            }
        `;
        document.head.appendChild(style);
    }

    getSavedPreference() {
        const saved = localStorage.getItem(this.darkModeKey);
        if (saved !== null) {
            return saved === 'true';
        }
        // Check system preference
        if (window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    }

    enable() {
        this.isDark = true;
        this.apply();
        this.save();
    }

    disable() {
        this.isDark = false;
        this.apply();
        this.save();
    }

    toggle() {
        if (this.isDark) {
            this.disable();
        } else {
            this.enable();
        }
        
        // Update button
        const button = document.getElementById('darkModeToggle');
        if (button) {
            button.innerHTML = this.isDark ? '☀️' : '🌙';
            button.title = this.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        }
    }

    apply() {
        if (this.isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    save() {
        localStorage.setItem(this.darkModeKey, this.isDark);
    }
}

// Initialize dark mode
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new DarkMode();
    });
} else {
    new DarkMode();
}

export default DarkMode;
