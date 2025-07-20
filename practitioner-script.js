// Practitioner Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Practitioner Dashboard loaded');

    // Side Menu Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const dashboardSections = document.querySelectorAll('.dashboard-section');

    // Function to show section
    function showSection(sectionId) {
        // Hide all sections
        dashboardSections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.querySelector(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update active nav item
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        const activeNavItem = document.querySelector(`[href="${sectionId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
    }

    // Add click event listeners to nav items
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            showSection(targetId);
            console.log('Navigated to:', targetId);
        });
    });

    // Session Buttons Functionality
    const sessionButtons = document.querySelectorAll('.btn-primary');
    sessionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            console.log('Session button clicked:', buttonText);
            
            if (buttonText === 'Join Session') {
                showNotification('Joining virtual session...', 'success');
                setTimeout(() => {
                    showNotification('Session started! Patient is waiting.', 'success');
                }, 1000);
            } else if (buttonText === 'Prepare') {
                showNotification('Preparing for session...', 'info');
                setTimeout(() => {
                    showNotification('Session preparation complete!', 'success');
                }, 1500);
            } else if (buttonText === 'Start Exercise') {
                showNotification('Starting exercise session...', 'success');
            } else if (buttonText === 'Create Treatment Plan') {
                showNotification('Opening treatment plan creator...', 'info');
            } else if (buttonText === 'Send Message') {
                showNotification('Message sent successfully!', 'success');
            } else if (buttonText === 'Save Changes') {
                showNotification('Profile updated successfully!', 'success');
            }
        });
    });

    // Secondary Buttons
    const secondaryButtons = document.querySelectorAll('.btn-secondary');
    secondaryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            console.log('Secondary button clicked:', buttonText);
            
            if (buttonText === 'View Full Schedule') {
                showSection('#appointments');
                showNotification('Navigating to full schedule...', 'info');
            } else if (buttonText === 'Add New Patient') {
                showNotification('Opening patient registration form...', 'info');
            } else if (buttonText === 'Create New Plan') {
                showNotification('Opening treatment plan creator...', 'info');
            } else if (buttonText === 'Export Report') {
                showNotification('Generating and downloading report...', 'success');
            } else if (buttonText === 'Change Photo') {
                showNotification('Photo upload functionality would be implemented here', 'info');
            }
        });
    });

    // Outline Buttons
    const outlineButtons = document.querySelectorAll('.btn-outline');
    outlineButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            console.log('Outline button clicked:', buttonText);
            
            if (buttonText === 'View Notes') {
                showNotification('Opening patient notes...', 'info');
            } else if (buttonText === 'Reschedule') {
                showNotification('Opening reschedule dialog...', 'info');
            } else if (buttonText === 'Edit Plan') {
                showNotification('Opening treatment plan editor...', 'info');
            } else if (buttonText === 'View Details') {
                showNotification('Opening patient details...', 'info');
            } else if (buttonText === 'Cancel') {
                if (confirm('Are you sure you want to cancel this appointment?')) {
                    showNotification('Appointment cancelled successfully', 'success');
                }
            }
        });
    });

    // Chart Controls
    const chartButtons = document.querySelectorAll('.btn-chart');
    chartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all chart buttons
            chartButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const chartType = this.textContent.trim();
            console.log('Chart type changed to:', chartType);
            showNotification(`Switched to ${chartType} view`, 'info');
        });
    });

    // Patient Action Buttons
    const patientActionButtons = document.querySelectorAll('.patient-action');
    patientActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const patientName = this.closest('.patient-card').querySelector('h4').textContent;
            
            console.log('Patient action:', action, 'for:', patientName);
            
            switch(action) {
                case 'view':
                    showNotification(`Opening ${patientName}'s profile...`, 'info');
                    break;
                case 'message':
                    showNotification(`Opening chat with ${patientName}...`, 'info');
                    break;
                case 'plan':
                    showNotification(`Creating treatment plan for ${patientName}...`, 'info');
                    break;
                case 'progress':
                    showNotification(`Viewing ${patientName}'s progress...`, 'info');
                    break;
            }
        });
    });

    // Appointment Actions
    const appointmentActions = document.querySelectorAll('.appointment-action');
    appointmentActions.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const appointmentTime = this.closest('.appointment-card').querySelector('.appointment-time').textContent;
            
            console.log('Appointment action:', action, 'for:', appointmentTime);
            
            switch(action) {
                case 'confirm':
                    showNotification('Appointment confirmed!', 'success');
                    break;
                case 'reschedule':
                    showNotification('Opening reschedule dialog...', 'info');
                    break;
                case 'cancel':
                    if (confirm('Are you sure you want to cancel this appointment?')) {
                        showNotification('Appointment cancelled successfully', 'success');
                    }
                    break;
            }
        });
    });

    // Message Item Click
    const messageItems = document.querySelectorAll('.message-item');
    messageItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove unread status
            this.classList.remove('unread');
            console.log('Message opened');
            showNotification('Opening message...', 'info');
        });
    });

    // Profile Form Submit
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Profile form submitted');
            showNotification('Profile updated successfully!', 'success');
        });
    }

    // Treatment Plan Form Submit
    const treatmentForm = document.querySelector('.treatment-form');
    if (treatmentForm) {
        treatmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Treatment plan form submitted');
            showNotification('Treatment plan created successfully!', 'success');
        });
    }

    // Notification System
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });
    }

    // User Menu Functionality
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.addEventListener('click', function() {
            console.log('User menu clicked');
            showNotification('User menu functionality would be implemented here', 'info');
        });
    }

    // Notifications Bell
    const notificationsBell = document.querySelector('.notifications');
    if (notificationsBell) {
        notificationsBell.addEventListener('click', function() {
            console.log('Notifications clicked');
            showNotification('Notifications panel would open here', 'info');
        });
    }

    // Schedule Item Click
    const scheduleItems = document.querySelectorAll('.schedule-item');
    scheduleItems.forEach(item => {
        item.addEventListener('click', function() {
            const patientName = this.querySelector('h4').textContent;
            console.log('Schedule item clicked for:', patientName);
            showNotification(`Opening details for ${patientName}...`, 'info');
        });
    });

    // Progress Items Animation
    const progressItems = document.querySelectorAll('.progress-item');
    progressItems.forEach(item => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.transition = 'all 0.5s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(item);
    });

    // Initialize dashboard
    console.log('Practitioner Dashboard initialized successfully');
    showNotification('Welcome to your KINETIC Practitioner Dashboard!', 'success');
});

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }

    .notification-success {
        border-left: 4px solid #48BB78;
        color: #22543D;
    }

    .notification-error {
        border-left: 4px solid #F56565;
        color: #742A2A;
    }

    .notification-info {
        border-left: 4px solid #4299E1;
        color: #2B6CB0;
    }

    .notification-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: #A0AEC0;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notification-close:hover {
        color: #4A5568;
    }
`;
document.head.appendChild(notificationStyles); 