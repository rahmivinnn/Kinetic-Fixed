// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .step, .metric-card, .testimonial-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Button hover effects
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Mobile menu toggle (for future mobile menu implementation)
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('mobile-active');
}

// Button functionality for navigation and actions
document.addEventListener('DOMContentLoaded', function() {
    // Login button functionality
    const loginButtons = document.querySelectorAll('.btn-outline');
    loginButtons.forEach(button => {
        if (button.textContent.trim() === 'Log In') {
            button.addEventListener('click', function() {
                window.location.href = '/auth.html';
            });
        }
    });

    // Book Consultation button functionality
    const bookConsultationButtons = document.querySelectorAll('.btn-primary');
    bookConsultationButtons.forEach(button => {
        if (button.textContent.trim() === 'Book Consultation') {
            button.addEventListener('click', function() {
                window.location.href = '/booking-system.html';
            });
        }
    });

    // Start Your Recovery Journey button
    const startJourneyButtons = document.querySelectorAll('.btn-primary');
    startJourneyButtons.forEach(button => {
        if (button.textContent.trim() === 'Start Your Recovery Journey') {
            button.addEventListener('click', function() {
                window.location.href = '/auth.html';
            });
        }
    });

    // Start Free Trial button
    const startTrialButtons = document.querySelectorAll('.btn-outline');
    startTrialButtons.forEach(button => {
        if (button.textContent.trim() === 'Start Free Trial') {
            button.addEventListener('click', function() {
                window.location.href = '/auth.html';
            });
        }
    });

    // Schedule Demo button
    const scheduleDemoButtons = document.querySelectorAll('.btn-primary');
    scheduleDemoButtons.forEach(button => {
        if (button.textContent.trim() === 'Schedule Demo') {
            button.addEventListener('click', function() {
                window.location.href = '/booking-system.html';
            });
        }
    });

    // Resources link functionality
    const resourcesLinks = document.querySelectorAll('a[href="#resources"]');
    resourcesLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Scroll to resources section or show resources modal
            const resourcesSection = document.querySelector('#resources');
            if (resourcesSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = resourcesSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            } else {
                // If no resources section, redirect to a resources page
                window.location.href = '/resources.html';
            }
        });
    });

    // Watch Demo button functionality
    const watchDemoButtons = document.querySelectorAll('.btn-outline');
    watchDemoButtons.forEach(button => {
        if (button.innerHTML.includes('Watch Demo')) {
            button.addEventListener('click', function() {
                // You can add a video modal or redirect to a demo page
                alert('Demo video will be available soon! For now, please explore our platform features.');
            });
        }
    });

    // Resource card button functionality
    const resourceButtons = document.querySelectorAll('.resource-card .btn');
    resourceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = button.textContent.trim();
            switch(buttonText) {
                case 'View Library':
                    alert('Exercise Library will be available soon! Please check back later.');
                    break;
                case 'Read Guides':
                    alert('Recovery Guides will be available soon! Please check back later.');
                    break;
                case 'Watch Videos':
                    alert('Video Tutorials will be available soon! Please check back later.');
                    break;
                case 'Track Progress':
                    window.location.href = '/patient-dashboard.html';
                    break;
                default:
                    alert('This feature will be available soon!');
            }
        });
    });
});

// Form validation for contact forms (if added later)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#E53E3E';
            isValid = false;
        } else {
            input.style.borderColor = '#E2E8F0';
        }
    });
    
    return isValid;
}

// Loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Add loading class to body
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loading');
});

// Performance optimization - lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.addEventListener('DOMContentLoaded', function() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    });
}

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add skip link for accessibility
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const mainContent = document.querySelector('.hero');
    if (mainContent) {
        mainContent.id = 'main-content';
    }
});

// Add CSS for skip link
const skipLinkStyle = document.createElement('style');
skipLinkStyle.textContent = `
    .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #1A202C;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
    }
    
    .skip-link:focus {
        top: 6px;
    }
    
    .loading {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .loaded {
        opacity: 1;
    }
`;
document.head.appendChild(skipLinkStyle); 