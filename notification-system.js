// Notification System for KINETIC Platform
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.isInitialized = false;
        this.socket = null;
        this.init();
    }

    init() {
        this.createNotificationContainer();
        this.bindEvents();
        this.startRealTimeUpdates();
        this.isInitialized = true;
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    bindEvents() {
        // Notification bell click
        const notificationBell = document.querySelector('.notifications');
        if (notificationBell) {
            notificationBell.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleNotificationPanel();
            });
        }

        // Close notifications when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.notification-panel') && 
                !e.target.closest('.notifications')) {
                this.closeNotificationPanel();
            }
        });
    }

    startRealTimeUpdates() {
        // Simulate real-time notifications
        setInterval(() => {
            this.checkForNewNotifications();
        }, 30000); // Check every 30 seconds

        // Simulate WebSocket connection
        this.simulateWebSocket();
    }

    simulateWebSocket() {
        // Simulate incoming notifications
        const notificationTypes = [
            'appointment_reminder',
            'exercise_completed',
            'progress_update',
            'message_received',
            'treatment_plan_updated'
        ];

        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance of new notification
                const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
                this.createNotification(type);
            }
        }, 60000); // Every minute
    }

    createNotification(type, data = {}) {
        const notification = {
            id: Date.now() + Math.random(),
            type: type,
            title: this.getNotificationTitle(type),
            message: this.getNotificationMessage(type, data),
            timestamp: new Date(),
            isRead: false,
            icon: this.getNotificationIcon(type),
            action: this.getNotificationAction(type)
        };

        this.notifications.unshift(notification);
        this.updateNotificationBadge();
        this.showToastNotification(notification);
        this.saveNotifications();
    }

    getNotificationTitle(type) {
        const titles = {
            'appointment_reminder': 'Appointment Reminder',
            'exercise_completed': 'Exercise Completed',
            'progress_update': 'Progress Update',
            'message_received': 'New Message',
            'treatment_plan_updated': 'Treatment Plan Updated'
        };
        return titles[type] || 'Notification';
    }

    getNotificationMessage(type, data) {
        const messages = {
            'appointment_reminder': 'Your appointment with Dr. Smith is tomorrow at 10:00 AM',
            'exercise_completed': 'Great job! You completed your walking exercise with 95% accuracy',
            'progress_update': 'Your recovery score has improved by 5 points this week',
            'message_received': 'Dr. Smith sent you a message about your treatment plan',
            'treatment_plan_updated': 'Your treatment plan has been updated based on recent progress'
        };
        return messages[type] || 'You have a new notification';
    }

    getNotificationIcon(type) {
        const icons = {
            'appointment_reminder': 'fas fa-calendar',
            'exercise_completed': 'fas fa-check-circle',
            'progress_update': 'fas fa-chart-line',
            'message_received': 'fas fa-comments',
            'treatment_plan_updated': 'fas fa-clipboard-list'
        };
        return icons[type] || 'fas fa-bell';
    }

    getNotificationAction(type) {
        const actions = {
            'appointment_reminder': () => this.openAppointments(),
            'exercise_completed': () => this.openExercises(),
            'progress_update': () => this.openProgress(),
            'message_received': () => this.openMessages(),
            'treatment_plan_updated': () => this.openTreatmentPlans()
        };
        return actions[type] || (() => {});
    }

    showToastNotification(notification) {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${notification.type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${notification.icon}"></i>
            </div>
            <div class="toast-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(toast);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);

        // Add click handler
        toast.addEventListener('click', (e) => {
            if (!e.target.closest('.toast-close')) {
                notification.action();
                this.markAsRead(notification.id);
            }
        });
    }

    toggleNotificationPanel() {
        const panel = document.querySelector('.notification-panel');
        if (panel) {
            this.closeNotificationPanel();
        } else {
            this.showNotificationPanel();
        }
    }

    showNotificationPanel() {
        const panel = document.createElement('div');
        panel.className = 'notification-panel';
        panel.innerHTML = `
            <div class="notification-header">
                <h3>Notifications</h3>
                <div class="notification-actions">
                    <button class="btn-mark-all-read">Mark all read</button>
                    <button class="btn-close-panel">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="notification-list">
                ${this.renderNotifications()}
            </div>
        `;

        document.body.appendChild(panel);

        // Bind panel events
        panel.querySelector('.btn-mark-all-read').addEventListener('click', () => {
            this.markAllAsRead();
        });

        panel.querySelector('.btn-close-panel').addEventListener('click', () => {
            this.closeNotificationPanel();
        });
    }

    renderNotifications() {
        if (this.notifications.length === 0) {
            return '<div class="no-notifications">No notifications yet</div>';
        }

        return this.notifications.map(notification => `
            <div class="notification-item ${notification.isRead ? 'read' : 'unread'}" 
                 data-id="${notification.id}">
                <div class="notification-icon">
                    <i class="${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                    <span class="notification-time">${this.getTimeAgo(notification.timestamp)}</span>
                </div>
                <button class="notification-close" onclick="notificationSystem.markAsRead(${notification.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    closeNotificationPanel() {
        const panel = document.querySelector('.notification-panel');
        if (panel) {
            panel.remove();
        }
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.isRead = true;
            this.updateNotificationBadge();
            this.saveNotifications();
        }
    }

    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.isRead = true;
        });
        this.updateNotificationBadge();
        this.saveNotifications();
        this.closeNotificationPanel();
        this.showNotificationPanel(); // Refresh panel
    }

    updateNotificationBadge() {
        const badge = document.querySelector('.notification-badge');
        const unreadCount = this.notifications.filter(n => !n.isRead).length;
        
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return timestamp.toLocaleDateString();
    }

    checkForNewNotifications() {
        // Simulate checking for new notifications from server
        const types = ['progress_update', 'exercise_completed'];
        if (Math.random() > 0.8) {
            const type = types[Math.floor(Math.random() * types.length)];
            this.createNotification(type);
        }
    }

    saveNotifications() {
        localStorage.setItem('kinetic_notifications', JSON.stringify(this.notifications));
    }

    loadNotifications() {
        const saved = localStorage.getItem('kinetic_notifications');
        if (saved) {
            this.notifications = JSON.parse(saved);
            this.updateNotificationBadge();
        }
    }

    // Action handlers
    openAppointments() {
        console.log('Opening appointments...');
        // Navigate to appointments section
        const appointmentsLink = document.querySelector('a[href="#appointments"]');
        if (appointmentsLink) {
            appointmentsLink.click();
        }
    }

    openExercises() {
        console.log('Opening exercises...');
        // Navigate to exercises section
        const exercisesLink = document.querySelector('a[href="#exercises"]');
        if (exercisesLink) {
            exercisesLink.click();
        }
    }

    openProgress() {
        console.log('Opening progress...');
        // Navigate to progress section
        const progressLink = document.querySelector('a[href="#progress"]');
        if (progressLink) {
            progressLink.click();
        }
    }

    openMessages() {
        console.log('Opening messages...');
        // Navigate to messages section
        const messagesLink = document.querySelector('a[href="#messages"]');
        if (messagesLink) {
            messagesLink.click();
        }
    }

    openTreatmentPlans() {
        console.log('Opening treatment plans...');
        // Navigate to treatment plans section
        const treatmentPlansLink = document.querySelector('a[href="#treatment-plans"]');
        if (treatmentPlansLink) {
            treatmentPlansLink.click();
        }
    }
}

// Initialize notification system
const notificationSystem = new NotificationSystem();

// Load saved notifications
notificationSystem.loadNotifications();

// Export for global access
window.notificationSystem = notificationSystem; 