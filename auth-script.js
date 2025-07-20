// Global variables
let currentTab = 'signup';
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const navTabs = document.querySelectorAll('.nav-tab');
const authScreens = document.querySelectorAll('.auth-screen');
const messageContainer = document.getElementById('message-container');

// Tab switching functionality
function switchTab(tabName) {
    // Update navigation tabs
    navTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });

    // Update auth screens
    authScreens.forEach(screen => {
        screen.classList.remove('active');
        if (screen.id === `${tabName}-screen`) {
            screen.classList.add('active');
        }
    });

    currentTab = tabName;
}

// Event listeners for tab switching
navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        switchTab(tab.dataset.tab);
    });
});

// Password toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.textContent = '🙈';
            } else {
                input.type = 'password';
                this.textContent = '👁️';
            }
        });
    });
});

// Form validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

function validatePractitionerEmail(email) {
    // Check if email contains clinic domain
    const clinicDomains = ['clinic.com', 'hospital.com', 'medical.com', 'healthcare.com'];
    const domain = email.split('@')[1];
    return clinicDomains.some(clinicDomain => domain && domain.includes(clinicDomain));
}

// Message display functions
function showMessage(message, type = 'success') {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    messageContainer.appendChild(messageElement);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

function showError(message) {
    showMessage(message, 'error');
}

function showSuccess(message) {
    showMessage(message, 'success');
}

// API call functions
async function makeApiCall(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Something went wrong');
        }
        
        return result;
    } catch (error) {
        throw error;
    }
}

// Patient Sign-Up Form Handler
document.getElementById('signup-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        role: document.querySelector('input[name="role"]:checked').value,
        acceptTerms: formData.get('acceptTerms') === 'on',
        acceptUpdates: formData.get('acceptUpdates') === 'on'
    };

    // Validation
    if (!data.fullName.trim()) {
        showError('Full name is required');
        return;
    }

    if (!validateEmail(data.email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (!validatePassword(data.password)) {
        showError('Password must be at least 8 characters long');
        return;
    }

    if (data.password !== data.confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    if (!data.acceptTerms) {
        showError('You must agree to the Terms of Service and Privacy Policy');
        return;
    }

    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Creating Account...';
    submitButton.disabled = true;

    try {
        const result = await makeApiCall('/patient/register', {
            fullName: data.fullName,
            email: data.email,
            password: data.password,
            role: data.role,
            acceptTerms: data.acceptTerms,
            acceptUpdates: data.acceptUpdates
        });

        showSuccess('Account created successfully! Redirecting to dashboard...');
        
        // Store token
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('userType', 'patient');
        
        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

    } catch (error) {
        showError(error.message);
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// Patient Sign-In Form Handler
document.getElementById('signin-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    // Validation
    if (!validateEmail(data.email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (!data.password) {
        showError('Password is required');
        return;
    }

    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Signing In...';
    submitButton.disabled = true;

    try {
        const result = await makeApiCall('/patient/login', data);

        showSuccess('Signed in successfully! Redirecting to dashboard...');
        
        // Store token
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('userType', 'patient');
        
        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

    } catch (error) {
        showError(error.message);
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// Practitioner Login Form Handler
document.getElementById('practitioner-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    // Validation
    if (!validateEmail(data.email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (!validatePractitionerEmail(data.email)) {
        showError('Please use your professional clinic email address');
        return;
    }

    if (!data.password) {
        showError('Password is required');
        return;
    }

    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Accessing Portal...';
    submitButton.disabled = true;

    try {
        const result = await makeApiCall('/practitioner/login', data);

        showSuccess('Access granted! Redirecting to practitioner portal...');
        
        // Store token
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('userType', 'practitioner');
        
        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = 'practitioner-dashboard.html';
        }, 2000);

    } catch (error) {
        showError(error.message);
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// Social login functions
function signInWithGoogle() {
    showMessage('Google sign-in functionality would be implemented here', 'success');
    // In a real implementation, this would redirect to Google OAuth
    // window.location.href = 'https://accounts.google.com/oauth2/authorize?...';
}

function signInWithApple() {
    showMessage('Apple sign-in functionality would be implemented here', 'success');
    // In a real implementation, this would redirect to Apple OAuth
    // window.location.href = 'https://appleid.apple.com/auth/authorize?...';
}

// Forgot password function
function showForgotPassword() {
    showMessage('Password reset functionality would be implemented here', 'success');
    // In a real implementation, this would show a password reset modal
    // or redirect to a password reset page
}

// Contact admin function
function contactAdmin() {
    showMessage('Contact admin functionality would be implemented here', 'success');
    // In a real implementation, this would open a contact form
    // or redirect to a contact page
}

// Real-time validation
document.addEventListener('DOMContentLoaded', function() {
    // Email validation on input
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = '#F56565';
                showError('Please enter a valid email address');
            } else {
                this.style.borderColor = '#E2E8F0';
            }
        });
    });

    // Password validation on input
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && this.value.length < 8) {
                this.style.borderColor = '#F56565';
                showError('Password must be at least 8 characters long');
            } else {
                this.style.borderColor = '#E2E8F0';
            }
        });
    });

    // Confirm password validation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', function() {
            const passwordInput = document.getElementById('password');
            if (this.value && this.value !== passwordInput.value) {
                this.style.borderColor = '#F56565';
                showError('Passwords do not match');
            } else {
                this.style.borderColor = '#E2E8F0';
            }
        });
    }

    // Practitioner email validation
    const professionalEmailInput = document.getElementById('professionalEmail');
    if (professionalEmailInput) {
        professionalEmailInput.addEventListener('blur', function() {
            if (this.value && !validatePractitionerEmail(this.value)) {
                this.style.borderColor = '#F56565';
                showError('Please use your professional clinic email address');
            } else {
                this.style.borderColor = '#E2E8F0';
            }
        });
    }
});

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('authToken');
    const userType = localStorage.getItem('userType');
    
    if (token) {
        // User is already logged in, redirect to appropriate dashboard
        if (userType === 'practitioner') {
            window.location.href = 'practitioner-dashboard.html';
        } else {
            window.location.href = 'index.html';
        }
    }
});

// Logout function (for future use)
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    window.location.href = 'auth.html';
}

// Export functions for global access
window.switchTab = switchTab;
window.signInWithGoogle = signInWithGoogle;
window.signInWithApple = signInWithApple;
window.showForgotPassword = showForgotPassword;
window.contactAdmin = contactAdmin;
window.logout = logout;

// Bypass functions for development
function bypassToPatientDashboard() {
    // Set mock authentication data
    localStorage.setItem('authToken', 'bypass-token-patient');
    localStorage.setItem('userType', 'patient');
    localStorage.setItem('userName', 'Demo Patient');
    localStorage.setItem('userEmail', 'patient@demo.com');
    
    // Show success message
    showSuccess('Bypassing to Patient Dashboard...');
    
    // Redirect to patient dashboard
    setTimeout(() => {
        window.location.href = '/patient-dashboard.html';
    }, 1000);
}

function bypassToPractitionerDashboard() {
    // Set mock authentication data
    localStorage.setItem('authToken', 'bypass-token-practitioner');
    localStorage.setItem('userType', 'practitioner');
    localStorage.setItem('userName', 'Dr. Demo Practitioner');
    localStorage.setItem('userEmail', 'practitioner@demo.com');
    localStorage.setItem('clinicId', 'DEMO001');
    localStorage.setItem('specialization', 'Physical Therapy');
    
    // Show success message
    showSuccess('Bypassing to Practitioner Dashboard...');
    
    // Redirect to practitioner dashboard
    setTimeout(() => {
        window.location.href = '/practitioner-dashboard.html';
    }, 1000);
}

// Export bypass functions for global access
window.bypassToPatientDashboard = bypassToPatientDashboard;
window.bypassToPractitionerDashboard = bypassToPractitionerDashboard; 