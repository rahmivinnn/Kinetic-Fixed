// Booking System JavaScript
document.addEventListener('DOMContentLoaded', function() {
    let currentStep = 1;
    let selectedService = null;
    let selectedPractitioner = null;
    let selectedDate = null;
    let selectedTime = null;

    // Initialize the booking system
    initializeBooking();

    // Service selection
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function() {
            selectService(this);
        });
    });

    // Practitioner selection
    document.querySelectorAll('.practitioner-card').forEach(card => {
        card.addEventListener('click', function() {
            selectPractitioner(this);
        });
    });

    // Navigation buttons
    document.getElementById('next-btn').addEventListener('click', function() {
        if (validateCurrentStep()) {
            nextStep();
        }
    });

    document.getElementById('prev-btn').addEventListener('click', function() {
        previousStep();
    });

    document.getElementById('confirm-btn').addEventListener('click', function() {
        confirmBooking();
    });

    // Calendar navigation
    document.getElementById('prev-month').addEventListener('click', function() {
        changeMonth(-1);
    });

    document.getElementById('next-month').addEventListener('click', function() {
        changeMonth(1);
    });

    // Initialize calendar
    initializeCalendar();
});

function initializeBooking() {
    updateProgressSteps();
    updateNavigationButtons();
}

function updateProgressSteps() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber === currentStep) {
            step.classList.add('active');
        } else if (stepNumber < currentStep) {
            step.classList.add('completed');
        }
    });
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const confirmBtn = document.getElementById('confirm-btn');

    if (currentStep === 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'inline-block';
        confirmBtn.style.display = 'none';
    } else if (currentStep === 4) {
        prevBtn.style.display = 'inline-block';
        nextBtn.style.display = 'none';
        confirmBtn.style.display = 'inline-block';
    } else {
        prevBtn.style.display = 'inline-block';
        nextBtn.style.display = 'inline-block';
        confirmBtn.style.display = 'none';
    }
}

function nextStep() {
    if (currentStep < 4) {
        currentStep++;
        showStep(currentStep);
        updateProgressSteps();
        updateNavigationButtons();
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgressSteps();
        updateNavigationButtons();
    }
}

function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.booking-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show current step
    const currentStepElement = document.getElementById(`step-${stepNumber}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }

    // Initialize step-specific functionality
    if (stepNumber === 3) {
        initializeCalendar();
    } else if (stepNumber === 4) {
        updateBookingSummary();
    }
}

function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            if (!selectedService) {
                showError('Please select a service');
                return false;
            }
            break;
        case 2:
            if (!selectedPractitioner) {
                showError('Please select a practitioner');
                return false;
            }
            break;
        case 3:
            if (!selectedDate || !selectedTime) {
                showError('Please select a date and time');
                return false;
            }
            break;
        case 4:
            return validatePatientForm();
    }
    return true;
}

function selectService(card) {
    // Remove selection from all service cards
    document.querySelectorAll('.service-card').forEach(c => {
        c.classList.remove('selected');
        c.querySelector('input[type="radio"]').checked = false;
    });

    // Select the clicked card
    card.classList.add('selected');
    card.querySelector('input[type="radio"]').checked = true;
    selectedService = card.getAttribute('data-service');
}

function selectPractitioner(card) {
    // Remove selection from all practitioner cards
    document.querySelectorAll('.practitioner-card').forEach(c => {
        c.classList.remove('selected');
        c.querySelector('input[type="radio"]').checked = false;
    });

    // Select the clicked card
    card.classList.add('selected');
    card.querySelector('input[type="radio"]').checked = true;
    selectedPractitioner = card.getAttribute('data-practitioner');
}

// Calendar functionality
let currentDate = new Date();
let selectedCalendarDate = null;

function initializeCalendar() {
    renderCalendar();
    generateTimeSlots();
}

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    const currentMonth = document.getElementById('current-month');
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    currentMonth.textContent = `${getMonthName(month)} ${year}`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    let calendarHTML = '';
    
    // Add day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        calendarHTML += `<div class="calendar-day header">${day}</div>`;
    });
    
    // Generate calendar days
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const isCurrentMonth = date.getMonth() === month;
        const isToday = isSameDate(date, new Date());
        const isSelected = selectedCalendarDate && isSameDate(date, selectedCalendarDate);
        const isDisabled = date < new Date() || !isCurrentMonth;
        
        let dayClass = 'calendar-day';
        if (isToday) dayClass += ' today';
        if (isSelected) dayClass += ' selected';
        if (isDisabled) dayClass += ' disabled';
        
        calendarHTML += `
            <div class="${dayClass}" data-date="${date.toISOString().split('T')[0]}" ${!isDisabled ? 'onclick="selectDate(this)"' : ''}>
                <span class="day-number">${date.getDate()}</span>
                ${isCurrentMonth && !isDisabled ? '<div class="appointment-dot active"></div>' : ''}
            </div>
        `;
    }
    
    calendar.innerHTML = calendarHTML;
}

function selectDate(dayElement) {
    // Remove selection from all days
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected');
    });
    
    // Select clicked day
    dayElement.classList.add('selected');
    selectedCalendarDate = new Date(dayElement.getAttribute('data-date'));
    selectedDate = selectedCalendarDate;
    
    // Update time slots for selected date
    generateTimeSlots();
}

function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
}

function generateTimeSlots() {
    const timeSlots = document.getElementById('time-slots');
    const times = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];
    
    let timeSlotsHTML = '';
    times.forEach(time => {
        const isAvailable = Math.random() > 0.3; // Simulate availability
        const isSelected = selectedTime === time;
        
        let slotClass = 'time-slot';
        if (!isAvailable) slotClass += ' disabled';
        if (isSelected) slotClass += ' selected';
        
        timeSlotsHTML += `
            <div class="${slotClass}" data-time="${time}" ${isAvailable ? 'onclick="selectTime(this)"' : ''}>
                ${time}
            </div>
        `;
    });
    
    timeSlots.innerHTML = timeSlotsHTML;
}

function selectTime(timeElement) {
    // Remove selection from all time slots
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Select clicked time slot
    timeElement.classList.add('selected');
    selectedTime = timeElement.getAttribute('data-time');
}

// Utility functions
function getMonthName(month) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
}

function isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// Booking summary
function updateBookingSummary() {
    const serviceData = {
        'initial-assessment': { name: 'Initial Assessment', duration: '60 minutes', cost: '$150' },
        'follow-up': { name: 'Follow-up Session', duration: '45 minutes', cost: '$120' },
        'specialized-treatment': { name: 'Specialized Treatment', duration: '90 minutes', cost: '$200' },
        'consultation': { name: 'Consultation', duration: '30 minutes', cost: '$80' }
    };

    const practitionerData = {
        'dr-smith': 'Dr. Sarah Smith',
        'dr-johnson': 'Dr. Michael Johnson',
        'dr-davis': 'Dr. Emily Davis'
    };

    if (selectedService && serviceData[selectedService]) {
        document.getElementById('summary-service').textContent = serviceData[selectedService].name;
        document.getElementById('summary-duration').textContent = serviceData[selectedService].duration;
        document.getElementById('summary-cost').textContent = serviceData[selectedService].cost;
    }

    if (selectedPractitioner && practitionerData[selectedPractitioner]) {
        document.getElementById('summary-practitioner').textContent = practitionerData[selectedPractitioner];
    }

    if (selectedDate) {
        document.getElementById('summary-date').textContent = selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    if (selectedTime) {
        document.getElementById('summary-time').textContent = selectedTime;
    }
}

function validatePatientForm() {
    const name = document.getElementById('patient-name').value.trim();
    const email = document.getElementById('patient-email').value.trim();
    const phone = document.getElementById('patient-phone').value.trim();
    const condition = document.getElementById('patient-condition').value.trim();

    if (!name) {
        showError('Please enter your full name');
        return false;
    }

    if (!email || !isValidEmail(email)) {
        showError('Please enter a valid email address');
        return false;
    }

    if (!phone) {
        showError('Please enter your phone number');
        return false;
    }

    if (!condition) {
        showError('Please describe your condition or concern');
        return false;
    }

    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function confirmBooking() {
    if (validatePatientForm()) {
        // Generate appointment ID
        const appointmentId = 'APT-' + new Date().getFullYear() + '-' + 
                            String(Math.floor(Math.random() * 1000)).padStart(3, '0');
        
        // Update confirmation modal
        document.getElementById('appointment-id').textContent = appointmentId;
        document.getElementById('confirmation-date').textContent = selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('confirmation-time').textContent = selectedTime;
        
        // Show success modal
        document.getElementById('success-modal').style.display = 'flex';
        
        // Simulate API call
        setTimeout(() => {
            // Here you would typically send the booking data to your server
            console.log('Booking confirmed:', {
                appointmentId,
                service: selectedService,
                practitioner: selectedPractitioner,
                date: selectedDate,
                time: selectedTime,
                patient: {
                    name: document.getElementById('patient-name').value,
                    email: document.getElementById('patient-email').value,
                    phone: document.getElementById('patient-phone').value,
                    condition: document.getElementById('patient-condition').value
                }
            });
        }, 1000);
    }
}

function closeModal() {
    document.getElementById('success-modal').style.display = 'none';
}

function showError(message) {
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

// Add CSS for toasts
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
    
    .calendar-day.header {
        font-weight: 600;
        color: var(--text-secondary);
        cursor: default;
    }
    
    .calendar-day.header:hover {
        background: none;
    }
`;

// Inject toast styles
const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet);

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states for better UX
function addLoadingState(button) {
    const originalText = button.textContent;
    button.textContent = 'Loading...';
    button.disabled = true;
    
    return () => {
        button.textContent = originalText;
        button.disabled = false;
    };
}

// Add form validation feedback
document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', function() {
        validateField(this);
    });
});

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('id');
    
    // Remove existing validation classes
    field.classList.remove('valid', 'invalid');
    
    if (!value) {
        field.classList.add('invalid');
        return false;
    }
    
    // Specific validation rules
    if (fieldName === 'patient-email' && !isValidEmail(value)) {
        field.classList.add('invalid');
        return false;
    }
    
    if (fieldName === 'patient-phone' && value.length < 10) {
        field.classList.add('invalid');
        return false;
    }
    
    field.classList.add('valid');
    return true;
}

// Add CSS for form validation
const validationStyles = `
    .form-group input.valid,
    .form-group textarea.valid {
        border-color: #48BB78;
    }
    
    .form-group input.invalid,
    .form-group textarea.invalid {
        border-color: #F56565;
    }
    
    .form-group input.valid:focus,
    .form-group textarea.valid:focus {
        border-color: #48BB78;
    }
    
    .form-group input.invalid:focus,
    .form-group textarea.invalid:focus {
        border-color: #F56565;
    }
`;

// Inject validation styles
const validationStyleSheet = document.createElement('style');
validationStyleSheet.textContent = validationStyles;
document.head.appendChild(validationStyleSheet); 