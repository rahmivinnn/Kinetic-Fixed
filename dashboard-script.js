// Patient Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Patient Dashboard loaded');

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

    // Exercise Buttons Functionality
    const exerciseButtons = document.querySelectorAll('.btn-primary');
    exerciseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            console.log('Exercise button clicked:', buttonText);
            
            if (buttonText === 'Continue' || buttonText === 'Start' || buttonText === 'Start Exercise') {
                // Show exercise modal or redirect to exercise page
                showNotification('Starting exercise...', 'success');
                
                // Simulate exercise start
                setTimeout(() => {
                    showNotification('Exercise started! Follow the instructions carefully.', 'success');
                }, 1000);
            }
        });
    });

    // View All Button
    const viewAllButtons = document.querySelectorAll('.btn-secondary');
    viewAllButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            console.log('Secondary button clicked:', buttonText);
            
            if (buttonText === 'View All') {
                showSection('#exercises');
                showNotification('Navigating to exercise library...', 'info');
            } else if (buttonText === 'Book New Appointment') {
                window.location.href = 'booking-system.html';
            } else if (buttonText === 'Reschedule') {
                showNotification('Opening reschedule dialog...', 'info');
            } else if (buttonText === 'Cancel') {
                if (confirm('Are you sure you want to cancel this appointment?')) {
                    showNotification('Appointment cancelled successfully', 'success');
                }
            } else if (buttonText === 'Change Photo') {
                showNotification('Photo upload functionality would be implemented here', 'info');
            } else if (buttonText === 'Save Changes') {
                showNotification('Profile updated successfully!', 'success');
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

    // Filter Buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterType = this.textContent.trim();
            console.log('Filter changed to:', filterType);
            showNotification(`Filtered exercises by: ${filterType}`, 'info');
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

    // Progress Circle Animation
    const progressCircles = document.querySelectorAll('.circle-progress');
    progressCircles.forEach(circle => {
        const progress = circle.getAttribute('data-progress');
        const progressText = circle.querySelector('.progress-text');
        
        // Animate progress
        let currentProgress = 0;
        const targetProgress = parseInt(progress);
        const increment = targetProgress / 50;
        
        const animateProgress = () => {
            if (currentProgress < targetProgress) {
                currentProgress += increment;
                progressText.textContent = Math.round(currentProgress) + '%';
                setTimeout(animateProgress, 20);
            } else {
                progressText.textContent = targetProgress + '%';
            }
        };
        
        // Start animation when section is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgress();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(circle);
    });

    // Exercise Progress Bars Animation
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(bar);
    });

    // Initialize dashboard
    console.log('Dashboard initialized successfully');
    showNotification('Welcome to your KINETIC dashboard!', 'success');
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