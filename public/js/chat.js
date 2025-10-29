const API_URL = 'http://localhost:3000/api';

// Check authentication
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token) {
    window.location.href = '/index.html';
}

// DOM elements
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const modelSelect = document.getElementById('modelSelect');
const logoutBtn = document.getElementById('logoutBtn');
const navBtns = document.querySelectorAll('.nav-btn');
const chatView = document.getElementById('chatView');
const statsView = document.getElementById('statsView');
const refreshStatsBtn = document.getElementById('refreshStats');
const exportChatBtn = document.getElementById('exportChatBtn');
const newChatBtn = document.getElementById('newChatBtn');
const imageUploadBtn = document.getElementById('imageUploadBtn');
const imageInput = document.getElementById('imageInput');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');

// Image handling
let selectedImage = null;
let uploadedImageUrl = null;

// Set user info
document.getElementById('userName').textContent = user.username || 'User';
document.getElementById('userEmail').textContent = user.email || '';
document.getElementById('userInitial').textContent = (user.username || 'U')[0].toUpperCase();

// Navigation
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (view === 'chat') {
            chatView.classList.remove('hidden');
            statsView.classList.add('hidden');
        } else if (view === 'stats') {
            chatView.classList.add('hidden');
            statsView.classList.remove('hidden');
            loadStatistics();
        }
    });
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
});

// New Chat - Clear current conversation
newChatBtn.addEventListener('click', () => {
    if (confirm('Start a new chat? Current conversation will be saved in history.')) {
        // Clear chat messages
        chatMessages.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">👋</div>
                <h2>Welcome to Groq AI Chat!</h2>
                <p>I'm your friendly AI assistant, powered by Groq's lightning-fast LLM inference. Ask me anything!</p>
                <div class="suggestions">
                    <button class="suggestion-chip">Explain quantum computing</button>
                    <button class="suggestion-chip">Write a Python function</button>
                    <button class="suggestion-chip">Help me learn JavaScript</button>
                    <button class="suggestion-chip">Creative writing ideas</button>
                </div>
            </div>
        `;
        
        // Re-attach suggestion chip listeners
        attachSuggestionListeners();
        
        // Clear any selected image
        if (selectedImage) {
            removeImage();
        }
        
        showToast('New chat started! 🎉', 'success');
    }
});

// Image upload handlers
imageUploadBtn.addEventListener('click', () => {
    imageInput.click();
});

imageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
        showToast('Invalid file type. Please upload JPG, PNG, GIF, or WebP', 'error');
        return;
    }

    if (file.size > maxSize) {
        showToast('File too large. Maximum size is 5MB', 'error');
        return;
    }

    // Upload to server
    try {
        showToast('Uploading image...', 'info');
        
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_URL}/upload-image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const data = await response.json();
        uploadedImageUrl = data.imageUrl;

        // Create local preview URL
        const previewUrl = URL.createObjectURL(file);
        
        selectedImage = {
            url: uploadedImageUrl,
            previewUrl: previewUrl,
            name: file.name,
            type: file.type
        };

        // Show preview
        showImagePreview(previewUrl, file.name);
        imageUploadBtn.classList.add('has-image');
        showToast('Image uploaded successfully! 📷', 'success');
    } catch (error) {
        console.error('Upload error:', error);
        showToast('Failed to upload image', 'error');
    }
});

function showImagePreview(imageUrl, fileName) {
    imagePreviewContainer.innerHTML = `
        <div class="image-preview">
            <div class="preview-container">
                <img src="${imageUrl}" alt="${fileName}">
                <button class="remove-image" onclick="removeImage()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div class="image-name">${fileName}</div>
            </div>
        </div>
    `;
}

window.removeImage = function() {
    // Revoke preview URL if exists
    if (selectedImage && selectedImage.previewUrl) {
        URL.revokeObjectURL(selectedImage.previewUrl);
    }
    
    selectedImage = null;
    uploadedImageUrl = null;
    imagePreviewContainer.innerHTML = '';
    imageInput.value = '';
    imageUploadBtn.classList.remove('has-image');
    showToast('Image removed', 'info');
};

// Auto-resize textarea
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 150) + 'px';
});

// Handle Enter key
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
    }
});

// Suggestion chips
function attachSuggestionListeners() {
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            messageInput.value = chip.textContent;
            messageInput.focus();
        });
    });
}

// Attach initially
attachSuggestionListeners();

// Format message with basic markdown support
function formatMessage(text) {
    // Escape HTML to prevent XSS
    let formatted = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    // Code blocks (```code```)
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang || 'plaintext'}">${code.trim()}</code></pre>`;
    });
    
    // Inline code (`code`)
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Bold (**text**)
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Italic (*text*)
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Links [text](url)
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    
    // Line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
}

// Add message to chat
function addMessage(role, content, isStreaming = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? user.username[0].toUpperCase() : '🤖';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    
    // Format content with basic markdown support
    if (role === 'assistant') {
        bubble.innerHTML = formatMessage(content);
    } else {
        bubble.textContent = content;
    }

    messageContent.appendChild(bubble);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);

    // Remove welcome message if exists
    const welcomeMsg = chatMessages.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return bubble;
}

// Show thinking indicator
function showThinkingIndicator() {
    const thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'thinking-indicator';
    thinkingDiv.id = 'thinkingIndicator';

    thinkingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="thinking-bubble">
            <div class="thinking-dot"></div>
            <div class="thinking-dot"></div>
            <div class="thinking-dot"></div>
        </div>
    `;

    chatMessages.appendChild(thinkingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove thinking indicator
function removeThinkingIndicator() {
    const indicator = document.getElementById('thinkingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// Send message
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const message = messageInput.value.trim();
    if (!message) return;

    const model = modelSelect.value;

    // Disable input
    messageInput.disabled = true;
    sendBtn.disabled = true;
    imageUploadBtn.disabled = true;

    // Check if image is attached
    if (selectedImage) {
        // Use vision API for image understanding
        await sendImageMessage(message, selectedImage);
        return;
    }

    // Add user message
    addMessage('user', message);

    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // Show thinking indicator
    showThinkingIndicator();

    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ message, model })
        });

        if (!response.ok) {
            throw new Error('Failed to get response');
        }

        // Remove thinking indicator
        removeThinkingIndicator();

        // Create assistant message bubble
        const assistantBubble = addMessage('assistant', '');

        // Read streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        
                        if (data.content) {
                            fullResponse += data.content;
                            assistantBubble.innerHTML = formatMessage(fullResponse);
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                        }

                        if (data.error) {
                            assistantBubble.textContent = '❌ ' + data.error;
                            assistantBubble.style.color = '#c33';
                        }

                        if (data.done) {
                            console.log('Stream completed');
                            // Final format after stream completes
                            assistantBubble.innerHTML = formatMessage(fullResponse);
                        }
                    } catch (e) {
                        // Ignore parse errors for incomplete chunks
                    }
                }
            }
        }

    } catch (error) {
        console.error('Chat error:', error);
        removeThinkingIndicator();
        addMessage('assistant', '❌ Sorry, I encountered an error. Please try again.');
    } finally {
        // Re-enable input
        messageInput.disabled = false;
        sendBtn.disabled = false;
        imageUploadBtn.disabled = false;
        messageInput.focus();
    }
});

// Send message with image (Vision API)
async function sendImageMessage(message, image) {
    try {
        // Add user message with image indicator
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message user';
        userMessageDiv.innerHTML = `
            <div class="message-avatar">${user.username[0].toUpperCase()}</div>
            <div class="message-content">
                <div class="message-bubble">
                    <div class="message-image">
                        <img src="${image.previewUrl || image.url}" alt="${image.name}">
                    </div>
                    <div>${message}</div>
                </div>
            </div>
        `;
        
        // Remove welcome message
        const welcomeMsg = chatMessages.querySelector('.welcome-message');
        if (welcomeMsg) welcomeMsg.remove();
        
        chatMessages.appendChild(userMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Clear input and image
        messageInput.value = '';
        messageInput.style.height = 'auto';
        const imageUrlToSend = image.url;
        removeImage();

        // Show thinking indicator
        showThinkingIndicator();

        // Call vision API with server image URL
        const response = await fetch(`${API_URL}/chat/vision`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                message,
                imageUrl: imageUrlToSend
            })
        });

        removeThinkingIndicator();

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Vision API failed');
        }

        const data = await response.json();
        
        // Add AI response
        addMessage('assistant', data.response);
        showToast(`✅ Vision analysis complete! (${data.tokensUsed} tokens)`, 'success');

    } catch (error) {
        console.error('Vision error:', error);
        removeThinkingIndicator();
        addMessage('assistant', '❌ Sorry, I couldn\'t analyze the image. ' + error.message);
        showToast('Image analysis failed: ' + error.message, 'error');
    } finally {
        messageInput.disabled = false;
        sendBtn.disabled = false;
        imageUploadBtn.disabled = false;
        messageInput.focus();
    }
}

// Load chat history
async function loadChatHistory() {
    try {
        const response = await fetch(`${API_URL}/chat/history?limit=20`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            
            if (data.messages && data.messages.length > 0) {
                // Remove welcome message
                const welcomeMsg = chatMessages.querySelector('.welcome-message');
                if (welcomeMsg) {
                    welcomeMsg.remove();
                }

                // Add messages
                data.messages.forEach(msg => {
                    addMessage(msg.role, msg.content);
                });
            }
        }
    } catch (error) {
        console.error('Failed to load chat history:', error);
    }
}

// Statistics
let messagesChart, roleChart, modelChart;

async function loadStatistics() {
    try {
        const response = await fetch(`${API_URL}/chat/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load statistics');
        }

        const stats = await response.json();

        // Update stat cards
        document.getElementById('totalMessages').textContent = stats.totalMessages || 0;
        document.getElementById('totalTokens').textContent = stats.totalTokens || 0;

        // Calculate role-based stats
        const roleStats = stats.messagesByRole || [];
        const userMsgs = roleStats.find(r => r.role === 'user')?.count || 0;
        const aiMsgs = roleStats.find(r => r.role === 'assistant')?.count || 0;

        document.getElementById('userMessages').textContent = userMsgs;
        document.getElementById('aiResponses').textContent = aiMsgs;

        // Create charts
        createMessagesChart(stats.messagesByDate || []);
        createRoleChart(stats.messagesByRole || []);
        createModelChart(stats.modelUsage || []);

    } catch (error) {
        console.error('Failed to load statistics:', error);
    }
}

function createMessagesChart(data) {
    const ctx = document.getElementById('messagesChart');
    
    if (messagesChart) {
        messagesChart.destroy();
    }

    const labels = data.map(d => d.date).reverse();
    const counts = data.map(d => d.count).reverse();

    messagesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Messages',
                data: counts,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function createRoleChart(data) {
    const ctx = document.getElementById('roleChart');
    
    if (roleChart) {
        roleChart.destroy();
    }

    const labels = data.map(d => d.role === 'user' ? 'You' : 'AI');
    const counts = data.map(d => d.count);

    roleChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: [
                    '#667eea',
                    '#764ba2'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createModelChart(data) {
    const ctx = document.getElementById('modelChart');
    
    if (modelChart) {
        modelChart.destroy();
    }

    const labels = data.map(d => d.model || 'Unknown');
    const counts = data.map(d => d.count);

    modelChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Usage Count',
                data: counts,
                backgroundColor: '#667eea',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Refresh statistics
refreshStatsBtn.addEventListener('click', loadStatistics);

// Export chat functionality
exportChatBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(`${API_URL}/chat/history?limit=1000`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            
            if (data.messages && data.messages.length > 0) {
                // Create export content
                let content = '╔════════════════════════════════════════════════╗\n';
                content += '║          GROQ AI CHAT - EXPORT FILE           ║\n';
                content += '╚════════════════════════════════════════════════╝\n\n';
                content += `User: ${user.username}\n`;
                content += `Email: ${user.email}\n`;
                content += `Export Date: ${new Date().toLocaleString()}\n`;
                content += `Total Messages: ${data.messages.length}\n`;
                content += '═'.repeat(50) + '\n\n';
                
                data.messages.forEach((msg, index) => {
                    const timestamp = new Date(msg.created_at).toLocaleString();
                    const role = msg.role === 'user' ? '👤 YOU' : '🤖 AI';
                    const model = msg.model ? ` (${msg.model})` : '';
                    
                    content += `[${index + 1}] ${role}${model}\n`;
                    content += `Time: ${timestamp}\n`;
                    content += `${'─'.repeat(50)}\n`;
                    content += `${msg.content}\n\n`;
                    content += `${'═'.repeat(50)}\n\n`;
                });
                
                // Download file
                const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `groq-chat-${user.username}-${Date.now()}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                // Show success message
                showToast('Chat exported successfully! 📥', 'success');
            } else {
                showToast('No messages to export', 'info');
            }
        } else {
            showToast('Failed to export chat', 'error');
        }
    } catch (error) {
        console.error('Export error:', error);
        showToast('Export failed. Please try again.', 'error');
    }
});

// Toast notification function
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    const styles = {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        animation: 'slideIn 0.3s ease-out',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
    };
    
    Object.assign(toast.style, styles);
    
    const colors = {
        success: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        error: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
        info: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        warning: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    };
    
    toast.style.background = colors[type] || colors.info;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast animations
if (!document.getElementById('toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Load chat history on page load
loadChatHistory();
