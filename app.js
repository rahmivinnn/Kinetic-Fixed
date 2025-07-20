// KINETIC Platform - Main Application
class KineticApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'landing';
        this.systems = {
            auth: null,
            notifications: null,
            progress: null,
            chat: null
        };
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.initializeSystems();
        this.setupNavigation();
        this.setupEventListeners();
        this.loadUserPreferences();
    }

    checkAuthentication() {
        const token = localStorage.getItem('kinetic_token');
        const userData = localStorage.getItem('kinetic_user');
        
        if (token && userData) {
            this.currentUser = JSON.parse(userData);
            this.showAuthenticatedUI();
        } else {
            this.showLandingPage();
        }
    }

    initializeSystems() {
        // Initialize notification system
        if (typeof NotificationSystem !== 'undefined') {
            this.systems.notifications = new NotificationSystem();
        }

        // Initialize progress tracking
        if (typeof ProgressTrackingSystem !== 'undefined') {
            this.systems.progress = new ProgressTrackingSystem();
        }

        // Initialize chat system
        if (typeof ChatSystem !== 'undefined') {
            this.systems.chat = new ChatSystem();
        }
    }

    setupNavigation() {
        // Handle navigation between pages
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.navigateTo(href);
            }
        });

        // Handle back/forward browser buttons
        window.addEventListener('popstate', (e) => {
            this.handleRouteChange();
        });
    }

    setupEventListeners() {
        // Global event listeners
        document.addEventListener('kinetic:userLogin', (e) => {
            this.handleUserLogin(e.detail);
        });

        document.addEventListener('kinetic:userLogout', () => {
            this.handleUserLogout();
        });

        document.addEventListener('kinetic:pageChange', (e) => {
            this.handlePageChange(e.detail);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    navigateTo(route) {
        const routes = {
            '/': 'landing',
            '/auth': 'auth',
            '/dashboard': 'dashboard',
            '/practitioner': 'practitioner',
            '/booking': 'booking',
            '/chat': 'chat'
        };

        const page = routes[route] || 'landing';
        this.loadPage(page);
        
        // Update browser history
        history.pushState({ page }, '', route);
    }

    loadPage(page) {
        this.currentPage = page;
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.style.display = 'none';
        });

        // Show current page
        const currentPageElement = document.getElementById(`${page}-page`);
        if (currentPageElement) {
            currentPageElement.style.display = 'block';
        }

        // Initialize page-specific functionality
        this.initializePage(page);
    }

    initializePage(page) {
        switch (page) {
            case 'landing':
                this.initializeLandingPage();
                break;
            case 'auth':
                this.initializeAuthPage();
                break;
            case 'dashboard':
                this.initializeDashboard();
                break;
            case 'practitioner':
                this.initializePractitionerDashboard();
                break;
            case 'booking':
                this.initializeBookingPage();
                break;
            case 'chat':
                this.initializeChatPage();
                break;
        }
    }

    initializeLandingPage() {
        // Add scroll animations
        this.addScrollAnimations();
        
        // Initialize hero section
        this.initializeHeroSection();
        
        // Setup contact forms
        this.setupContactForms();
    }

    initializeAuthPage() {
        // Initialize authentication forms
        this.setupAuthForms();
        
        // Add form validation
        this.addFormValidation();
    }

    initializeDashboard() {
        // Load user data
        this.loadUserDashboard();
        
        // Initialize charts
        this.initializeDashboardCharts();
        
        // Setup real-time updates
        this.setupDashboardUpdates();
    }

    initializePractitionerDashboard() {
        // Load practitioner data
        this.loadPractitionerData();
        
        // Initialize patient management
        this.initializePatientManagement();
        
        // Setup appointment system
        this.setupAppointmentSystem();
    }

    initializeBookingPage() {
        // Initialize booking flow
        this.setupBookingFlow();
        
        // Load available practitioners
        this.loadPractitioners();
        
        // Setup calendar
        this.setupCalendar();
    }

    initializeChatPage() {
        // Initialize chat system
        if (this.systems.chat) {
            this.systems.chat.init();
        }
        
        // Load chat history
        this.loadChatHistory();
        
        // Setup real-time messaging
        this.setupRealTimeMessaging();
    }

    addScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    initializeHeroSection() {
        const heroButtons = document.querySelectorAll('.hero-buttons .btn');
        
        heroButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = button.dataset.action;
                this.handleHeroAction(action);
            });
        });
    }

    handleHeroAction(action) {
        switch (action) {
            case 'start-recovery':
                this.navigateTo('/auth');
                break;
            case 'watch-demo':
                this.showDemoVideo();
                break;
            case 'book-consultation':
                this.navigateTo('/booking');
                break;
        }
    }

    setupContactForms() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmission(e.target);
            });
        }
    }

    setupAuthForms() {
        // Setup authentication form handlers
        const authForms = document.querySelectorAll('.auth-form');
        
        authForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAuthSubmission(e.target);
            });
        });
    }

    addFormValidation() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Check required fields
        if (required && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        // Validate email
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Validate password
        if (type === 'password' && value) {
            if (value.length < 8) {
                this.showFieldError(field, 'Password must be at least 8 characters');
                return false;
            }
        }
        
        return true;
    }

    showFieldError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
        field.classList.add('error');
    }

    clearFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.classList.remove('error');
    }

    handleAuthSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        const fields = form.querySelectorAll('input, textarea, select');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) return;
        
        // Submit form
        this.submitAuthForm(data, form.dataset.type);
    }

    submitAuthForm(data, type) {
        // Show loading state
        const submitBtn = document.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            if (type === 'login') {
                this.handleLoginSuccess(data);
            } else if (type === 'register') {
                this.handleRegistrationSuccess(data);
            }
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    handleLoginSuccess(userData) {
        // Store user data
        localStorage.setItem('kinetic_token', 'sample-token');
        localStorage.setItem('kinetic_user', JSON.stringify(userData));
        
        this.currentUser = userData;
        
        // Navigate to dashboard
        this.navigateTo('/dashboard');
        
        // Show success message
        this.showSuccessMessage('Login successful! Welcome back.');
    }

    handleRegistrationSuccess(userData) {
        // Store user data
        localStorage.setItem('kinetic_token', 'sample-token');
        localStorage.setItem('kinetic_user', JSON.stringify(userData));
        
        this.currentUser = userData;
        
        // Navigate to dashboard
        this.navigateTo('/dashboard');
        
        // Show success message
        this.showSuccessMessage('Registration successful! Welcome to KINETIC.');
    }

    handleUserLogout() {
        // Clear user data
        localStorage.removeItem('kinetic_token');
        localStorage.removeItem('kinetic_user');
        
        this.currentUser = null;
        
        // Navigate to landing page
        this.navigateTo('/');
        
        // Show logout message
        this.showSuccessMessage('You have been logged out successfully.');
    }

    loadUserDashboard() {
        // Load user-specific data
        if (this.systems.progress) {
            this.systems.progress.loadProgressData();
        }
        
        // Update dashboard with user info
        this.updateDashboardUserInfo();
        
        // Load recent activities
        this.loadRecentActivities();
    }

    initializeDashboardCharts() {
        // Initialize progress charts
        if (typeof Chart !== 'undefined') {
            this.createDashboardCharts();
        }
    }

    setupDashboardUpdates() {
        // Setup real-time updates for dashboard
        setInterval(() => {
            this.updateDashboardData();
        }, 30000); // Update every 30 seconds
    }

    updateDashboardData() {
        // Update progress metrics
        if (this.systems.progress) {
            this.systems.progress.updateUI();
        }
        
        // Update notifications
        if (this.systems.notifications) {
            this.systems.notifications.updateNotificationBadge();
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K: Quick search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.showQuickSearch();
        }
        
        // Ctrl/Cmd + M: Toggle messages
        if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
            e.preventDefault();
            this.toggleMessages();
        }
        
        // Escape: Close modals
        if (e.key === 'Escape') {
            this.closeAllModals();
        }
    }

    showQuickSearch() {
        // Create quick search modal
        const searchModal = document.createElement('div');
        searchModal.className = 'quick-search-modal';
        searchModal.innerHTML = `
            <div class="search-container">
                <input type="text" placeholder="Search..." class="search-input">
                <div class="search-results"></div>
            </div>
        `;
        
        document.body.appendChild(searchModal);
        
        const searchInput = searchModal.querySelector('.search-input');
        searchInput.focus();
        
        searchInput.addEventListener('input', (e) => {
            this.performQuickSearch(e.target.value);
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchModal.remove();
            }
        });
    }

    performQuickSearch(query) {
        // Implement search functionality
        const results = this.searchContent(query);
        this.displaySearchResults(results);
    }

    searchContent(query) {
        // Search through different content types
        const results = [];
        
        // Search exercises
        if (this.systems.progress) {
            const exercises = this.systems.progress.progressData.exercises;
            exercises.forEach(exercise => {
                if (exercise.name.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        type: 'exercise',
                        title: exercise.name,
                        description: exercise.type,
                        action: () => this.navigateToExercise(exercise.id)
                    });
                }
            });
        }
        
        // Search messages
        if (this.systems.chat) {
            const messages = this.systems.chat.messages;
            messages.forEach(message => {
                if (message.text.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        type: 'message',
                        title: 'Message',
                        description: message.text.substring(0, 50) + '...',
                        action: () => this.navigateToMessage(message.id)
                    });
                }
            });
        }
        
        return results;
    }

    displaySearchResults(results) {
        const resultsContainer = document.querySelector('.search-results');
        resultsContainer.innerHTML = results.map(result => `
            <div class="search-result" onclick="kineticApp.executeSearchResult('${result.type}', ${JSON.stringify(result)})">
                <div class="result-icon">
                    <i class="fas fa-${result.type === 'exercise' ? 'dumbbell' : 'comment'}"></i>
                </div>
                <div class="result-content">
                    <div class="result-title">${result.title}</div>
                    <div class="result-description">${result.description}</div>
                </div>
            </div>
        `).join('');
    }

    executeSearchResult(type, result) {
        result.action();
        document.querySelector('.quick-search-modal').remove();
    }

    showSuccessMessage(message) {
        if (this.systems.notifications) {
            this.systems.notifications.createNotification('success', { message });
        }
    }

    showErrorMessage(message) {
        if (this.systems.notifications) {
            this.systems.notifications.createNotification('error', { message });
        }
    }

    loadUserPreferences() {
        const preferences = localStorage.getItem('kinetic_preferences');
        if (preferences) {
            this.preferences = JSON.parse(preferences);
            this.applyUserPreferences();
        }
    }

    applyUserPreferences() {
        if (this.preferences.theme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        
        if (this.preferences.fontSize) {
            document.documentElement.style.fontSize = this.preferences.fontSize;
        }
    }

    saveUserPreferences() {
        localStorage.setItem('kinetic_preferences', JSON.stringify(this.preferences));
    }

    // Public API methods
    getUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    getCurrentPage() {
        return this.currentPage;
    }

    logout() {
        this.handleUserLogout();
    }

    refreshData() {
        this.updateDashboardData();
    }
}

// Initialize the main application
const kineticApp = new KineticApp();

// Export for global access
window.kineticApp = kineticApp;

// Add CSS for quick search
const quickSearchStyles = `
    .quick-search-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 100px;
        z-index: 10000;
    }
    
    .search-container {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 600px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }
    
    .search-input {
        width: 100%;
        padding: 1rem;
        border: none;
        border-bottom: 1px solid var(--border-color);
        font-size: 1.1rem;
        outline: none;
    }
    
    .search-results {
        max-height: 400px;
        overflow-y: auto;
    }
    
    .search-result {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .search-result:hover {
        background: var(--background-light);
    }
    
    .result-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--secondary-color);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .result-title {
        font-weight: 600;
        color: var(--primary-color);
        margin-bottom: 0.25rem;
    }
    
    .result-description {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .field-error {
        color: var(--error-color);
        font-size: 0.8rem;
        margin-top: 0.25rem;
    }
    
    .error {
        border-color: var(--error-color) !important;
    }
`;

// Inject styles
const appStyles = document.createElement('style');
appStyles.textContent = quickSearchStyles;
document.head.appendChild(appStyles); 