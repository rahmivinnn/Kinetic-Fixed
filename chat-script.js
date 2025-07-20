// Chat System JavaScript
class ChatSystem {
    constructor() {
        this.messages = [];
        this.currentUser = null;
        this.typingTimeout = null;
        this.isTyping = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMessages();
        this.autoResizeTextarea();
        this.simulateTyping();
    }

    setupEventListeners() {
        // Message input
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');

        messageInput.addEventListener('input', (e) => {
            this.handleInputChange(e);
        });

        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        // Attachment button
        const attachmentBtn = document.querySelector('.btn-attachment');
        attachmentBtn.addEventListener('click', () => {
            this.showAttachmentModal();
        });

        // Emoji button
        const emojiBtn = document.querySelector('.btn-emoji');
        emojiBtn.addEventListener('click', () => {
            this.toggleEmojiPicker();
        });

        // Quick replies
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply')) {
                this.handleQuickReply(e.target.textContent);
            }
        });

        // Emoji picker
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('emoji-btn')) {
                this.insertEmoji(e.target.textContent);
            }
        });

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.modal') && !e.target.closest('.btn-attachment')) {
                this.closeAttachmentModal();
            }
            if (!e.target.closest('.emoji-picker') && !e.target.closest('.btn-emoji')) {
                this.closeEmojiPicker();
            }
        });

        // File input handlers
        this.setupFileInputs();
    }

    handleInputChange(e) {
        const messageInput = e.target;
        const sendBtn = document.getElementById('send-btn');
        
        // Enable/disable send button
        sendBtn.disabled = messageInput.value.trim().length === 0;
        
        // Auto-resize textarea
        this.autoResizeTextarea();
        
        // Show typing indicator
        this.showTypingIndicator();
    }

    autoResizeTextarea() {
        const textarea = document.getElementById('message-input');
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    sendMessage() {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        
        if (message.length === 0) return;

        // Create message object
        const messageObj = {
            id: Date.now(),
            text: message,
            sender: 'patient',
            timestamp: new Date(),
            status: 'sending'
        };

        // Add message to UI
        this.addMessageToUI(messageObj);
        
        // Clear input
        messageInput.value = '';
        messageInput.style.height = 'auto';
        
        // Disable send button
        document.getElementById('send-btn').disabled = true;
        
        // Hide typing indicator
        this.hideTypingIndicator();
        
        // Simulate message sending
        setTimeout(() => {
            this.updateMessageStatus(messageObj.id, 'sent');
        }, 1000);
        
        // Simulate reply after 2-5 seconds
        setTimeout(() => {
            this.simulateReply();
        }, Math.random() * 3000 + 2000);
    }

    addMessageToUI(messageObj) {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = this.createMessageElement(messageObj);
        
        // Remove typing indicator if present
        const typingIndicator = chatMessages.querySelector('.message.typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        
        chatMessages.appendChild(messageElement);
        this.scrollToBottom();
        
        // Add to messages array
        this.messages.push(messageObj);
    }

    createMessageElement(messageObj) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${messageObj.sender === 'patient' ? 'sent' : 'received'}`;
        messageDiv.dataset.messageId = messageObj.id;
        
        const timeString = messageObj.timestamp.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        
        if (messageObj.sender === 'practitioner') {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="https://via.placeholder.com/32x32" alt="Dr. Sarah Smith">
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="sender-name">Dr. Sarah Smith</span>
                        <span class="message-time">${timeString}</span>
                    </div>
                    <div class="message-bubble">
                        <p>${this.escapeHtml(messageObj.text)}</p>
                    </div>
                    <div class="message-status">
                        <i class="fas fa-check-double"></i>
                    </div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-time">${timeString}</span>
                    </div>
                    <div class="message-bubble">
                        <p>${this.escapeHtml(messageObj.text)}</p>
                    </div>
                    <div class="message-status">
                        <i class="fas fa-check"></i>
                    </div>
                </div>
            `;
        }
        
        return messageDiv;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateMessageStatus(messageId, status) {
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if (messageElement) {
            const statusIcon = messageElement.querySelector('.message-status i');
            if (status === 'sent') {
                statusIcon.className = 'fas fa-check-double';
            } else if (status === 'delivered') {
                statusIcon.className = 'fas fa-check-double';
                statusIcon.style.color = '#4299E1';
            } else if (status === 'read') {
                statusIcon.className = 'fas fa-check-double';
                statusIcon.style.color = '#48BB78';
            }
        }
    }

    scrollToBottom() {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }
        
        this.typingTimeout = setTimeout(() => {
            this.hideTypingIndicator();
        }, 3000);
        
        if (!this.isTyping) {
            this.isTyping = true;
            this.addTypingIndicator();
        }
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.querySelector('.message.typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    addTypingIndicator() {
        const chatMessages = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message received typing';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <img src="https://via.placeholder.com/32x32" alt="Dr. Sarah Smith">
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    simulateReply() {
        const replies = [
            "That's great progress! Keep up the good work.",
            "How are you feeling today?",
            "Don't forget to do your exercises.",
            "Your recovery is going very well!",
            "Let me know if you have any questions.",
            "I'm here to help with anything you need.",
            "Remember to take it easy and not overdo it.",
            "Your dedication to recovery is impressive!"
        ];
        
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        const messageObj = {
            id: Date.now(),
            text: randomReply,
            sender: 'practitioner',
            timestamp: new Date(),
            status: 'sent'
        };
        
        this.addMessageToUI(messageObj);
    }

    handleQuickReply(reply) {
        const messageInput = document.getElementById('message-input');
        messageInput.value = reply;
        messageInput.focus();
        this.autoResizeTextarea();
        document.getElementById('send-btn').disabled = false;
    }

    showAttachmentModal() {
        const modal = document.getElementById('attachment-modal');
        modal.style.display = 'flex';
    }

    closeAttachmentModal() {
        const modal = document.getElementById('attachment-modal');
        modal.style.display = 'none';
    }

    toggleEmojiPicker() {
        const picker = document.getElementById('emoji-picker');
        if (picker.style.display === 'none') {
            this.showEmojiPicker();
        } else {
            this.closeEmojiPicker();
        }
    }

    showEmojiPicker() {
        const picker = document.getElementById('emoji-picker');
        const emojiBtn = document.querySelector('.btn-emoji');
        const rect = emojiBtn.getBoundingClientRect();
        
        picker.style.display = 'block';
        picker.style.position = 'absolute';
        picker.style.bottom = '100%';
        picker.style.right = '0';
        picker.style.marginBottom = '0.5rem';
    }

    closeEmojiPicker() {
        const picker = document.getElementById('emoji-picker');
        picker.style.display = 'none';
    }

    insertEmoji(emoji) {
        const messageInput = document.getElementById('message-input');
        const cursorPos = messageInput.selectionStart;
        const textBefore = messageInput.value.substring(0, cursorPos);
        const textAfter = messageInput.value.substring(cursorPos);
        
        messageInput.value = textBefore + emoji + textAfter;
        messageInput.selectionStart = messageInput.selectionEnd = cursorPos + emoji.length;
        
        messageInput.focus();
        this.autoResizeTextarea();
        document.getElementById('send-btn').disabled = false;
        
        this.closeEmojiPicker();
    }

    setupFileInputs() {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleFileUpload(file);
                }
            });
        });
    }

    handleFileUpload(file) {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showError('File size must be less than 10MB');
            return;
        }
        
        // Validate file type
        const allowedTypes = ['image/', 'video/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const isValidType = allowedTypes.some(type => file.type.startsWith(type));
        
        if (!isValidType) {
            this.showError('File type not supported. Please upload images, videos, or documents.');
            return;
        }
        
        // Create message with attachment
        const messageObj = {
            id: Date.now(),
            text: `Sent: ${file.name}`,
            sender: 'patient',
            timestamp: new Date(),
            status: 'sending',
            attachment: {
                name: file.name,
                type: file.type,
                size: file.size
            }
        };
        
        this.addMessageToUI(messageObj);
        this.closeAttachmentModal();
        
        // Simulate file upload
        setTimeout(() => {
            this.updateMessageStatus(messageObj.id, 'sent');
        }, 2000);
    }

    showError(message) {
        // Create error toast
        const toast = document.createElement('div');
        toast.className = 'toast error';
        toast.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    loadMessages() {
        // Load sample messages from localStorage or create default ones
        const savedMessages = localStorage.getItem('kinetic_chat_messages');
        if (savedMessages) {
            this.messages = JSON.parse(savedMessages);
            this.messages.forEach(message => {
                this.addMessageToUI(message);
            });
        }
    }

    saveMessages() {
        localStorage.setItem('kinetic_chat_messages', JSON.stringify(this.messages));
    }

    // Voice and video call handlers
    setupCallHandlers() {
        const voiceCallBtn = document.querySelector('.btn-icon[title="Voice Call"]');
        const videoCallBtn = document.querySelector('.btn-icon[title="Video Call"]');
        
        voiceCallBtn.addEventListener('click', () => {
            this.initiateCall('voice');
        });
        
        videoCallBtn.addEventListener('click', () => {
            this.initiateCall('video');
        });
    }

    initiateCall(type) {
        // Simulate call initiation
        const callType = type === 'voice' ? 'Voice' : 'Video';
        this.showNotification(`${callType} call initiated...`);
        
        // In a real app, this would integrate with WebRTC or a calling service
        setTimeout(() => {
            this.showNotification(`${callType} call ended`);
        }, 3000);
    }

    showNotification(message) {
        // Create notification toast
        const toast = document.createElement('div');
        toast.className = 'toast info';
        toast.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Message search functionality
    searchMessages(query) {
        const messages = document.querySelectorAll('.message');
        messages.forEach(message => {
            const text = message.textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                message.style.opacity = '1';
                message.style.backgroundColor = 'rgba(0, 180, 216, 0.1)';
            } else {
                message.style.opacity = '0.5';
                message.style.backgroundColor = 'transparent';
            }
        });
    }

    // Message reactions
    addReaction(messageId, reaction) {
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if (messageElement) {
            let reactionsContainer = messageElement.querySelector('.message-reactions');
            if (!reactionsContainer) {
                reactionsContainer = document.createElement('div');
                reactionsContainer.className = 'message-reactions';
                messageElement.querySelector('.message-content').appendChild(reactionsContainer);
            }
            
            const reactionElement = document.createElement('span');
            reactionElement.className = 'reaction';
            reactionElement.textContent = reaction;
            reactionsContainer.appendChild(reactionElement);
        }
    }

    // Message editing
    editMessage(messageId, newText) {
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if (messageElement) {
            const textElement = messageElement.querySelector('.message-bubble p');
            textElement.textContent = newText;
            textElement.style.fontStyle = 'italic';
            textElement.style.opacity = '0.7';
        }
    }

    // Message deletion
    deleteMessage(messageId) {
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if (messageElement) {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                messageElement.remove();
            }, 300);
        }
    }
}

// Initialize chat system
const chatSystem = new ChatSystem();

// Add toast styles
const toastStyles = `
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 3000;
        max-width: 300px;
    }
    
    .toast.show {
        transform: translateX(0);
    }
    
    .toast.error {
        border-left: 4px solid #F56565;
    }
    
    .toast.error i {
        color: #F56565;
    }
    
    .toast.info {
        border-left: 4px solid #4299E1;
    }
    
    .toast.info i {
        color: #4299E1;
    }
    
    .message-reactions {
        display: flex;
        gap: 0.25rem;
        margin-top: 0.5rem;
    }
    
    .reaction {
        background: var(--background-light);
        border-radius: 12px;
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .reaction:hover {
        background: var(--secondary-color);
        color: white;
    }
`;

// Inject toast styles
const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet);

// Export for global access
window.chatSystem = chatSystem; 