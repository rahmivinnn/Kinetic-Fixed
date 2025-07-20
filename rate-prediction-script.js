// Rate Prediction Interface JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the interface
    initializeRatePrediction();
    
    // Add event listeners
    addEventListeners();
    
    // Initialize charts if needed
    initializeCharts();
});

function initializeRatePrediction() {
    console.log('Rate Prediction Interface Initialized');
    
    // Set default values
    setDefaultValues();
    
    // Update route visualization
    updateRouteVisualization();
}

function setDefaultValues() {
    // Set current date and time for pickup
    const now = new Date();
    now.setDate(now.getDate() + 1); // Tomorrow
    now.setHours(10, 0, 0, 0); // 10:00 AM
    
    const dateTimeInput = document.getElementById('pickup-date');
    if (dateTimeInput) {
        dateTimeInput.value = now.toISOString().slice(0, 16);
    }
}

function addEventListeners() {
    // Equipment selection
    const equipmentSelect = document.getElementById('equipment');
    if (equipmentSelect) {
        equipmentSelect.addEventListener('change', function() {
            updateRatesBasedOnEquipment(this.value);
        });
    }
    
    // Location inputs
    const pickupInput = document.getElementById('pickup');
    const dropoffInput = document.getElementById('dropoff');
    
    if (pickupInput) {
        pickupInput.addEventListener('input', debounce(function() {
            updateRouteVisualization();
        }, 500));
    }
    
    if (dropoffInput) {
        dropoffInput.addEventListener('input', debounce(function() {
            updateRouteVisualization();
        }, 500));
    }
    
    // Get Rate button
    const getRateBtn = document.querySelector('.btn-primary');
    if (getRateBtn && getRateBtn.textContent.includes('Get Rate')) {
        getRateBtn.addEventListener('click', function() {
            calculateRates();
        });
    }
    
    // Send Quote button
    const sendQuoteBtn = document.querySelector('.btn-primary.btn-large');
    if (sendQuoteBtn && sendQuoteBtn.textContent.includes('Send Quote')) {
        sendQuoteBtn.addEventListener('click', function() {
            sendQuote();
        });
    }
    
    // Request Bid button
    const requestBidBtn = document.querySelector('.btn-outline.btn-large');
    if (requestBidBtn && requestBidBtn.textContent.includes('Request Bid')) {
        requestBidBtn.addEventListener('click', function() {
            requestBid();
        });
    }
    
    // Feedback buttons
    const feedbackBtns = document.querySelectorAll('.feedback-btn');
    feedbackBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            handleFeedback(this);
        });
    });
    
    // Tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            handleTabChange(this);
        });
    });
    
    // Show filtered loads link
    const showFilteredLink = document.querySelector('.show-filtered');
    if (showFilteredLink) {
        showFilteredLink.addEventListener('click', function(e) {
            e.preventDefault();
            showFilteredLoads();
        });
    }
    
    // Accuracy report link
    const accuracyReportLink = document.querySelector('.accuracy-report');
    if (accuracyReportLink) {
        accuracyReportLink.addEventListener('click', function(e) {
            e.preventDefault();
            showAccuracyReport();
        });
    }
}

function updateRatesBasedOnEquipment(equipment) {
    console.log('Updating rates for equipment:', equipment);
    
    // Simulate rate calculation based on equipment
    const rateMultipliers = {
        'reefer': 1.2,
        'dry-van': 1.0,
        'flatbed': 1.15,
        'power-only': 0.8
    };
    
    const baseRate = 3000;
    const multiplier = rateMultipliers[equipment] || 1.0;
    const newRate = Math.round(baseRate * multiplier);
    
    // Update buy rate
    const buyRateElement = document.querySelector('.buy-rate .rate-amount');
    if (buyRateElement) {
        buyRateElement.textContent = `$${newRate.toLocaleString()}`;
    }
    
    // Update sell rate (15% markup)
    const sellRate = Math.round(newRate * 1.15);
    const sellRateElement = document.querySelector('.sell-rate .rate-amount');
    if (sellRateElement) {
        sellRateElement.textContent = `$${sellRate.toLocaleString()}`;
    }
    
    // Update markup amount
    const markupAmount = sellRate - newRate;
    const markupElement = document.querySelector('.markup-amount');
    if (markupElement) {
        markupElement.textContent = `$${markupAmount.toLocaleString()}`;
    }
    
    // Show notification
    showNotification(`Rates updated for ${equipment} equipment`);
}

function updateRouteVisualization() {
    const pickup = document.getElementById('pickup')?.value || '';
    const dropoff = document.getElementById('dropoff')?.value || '';
    
    if (pickup && dropoff) {
        // Simulate distance calculation
        const distance = calculateDistance(pickup, dropoff);
        const duration = Math.ceil(distance / 800); // Assuming 800 miles per day
        
        // Update route info
        const distanceElement = document.querySelector('.route-info .distance');
        const durationElement = document.querySelector('.route-info .duration');
        
        if (distanceElement) {
            distanceElement.textContent = `${distance.toLocaleString()} miles`;
        }
        
        if (durationElement) {
            durationElement.textContent = `~${duration} days`;
        }
        
        // Update location names on map
        updateMapLocations(pickup, dropoff);
    }
}

function calculateDistance(origin, destination) {
    // Simplified distance calculation
    // In a real application, this would use a mapping API
    const baseDistance = 2819;
    const variation = Math.random() * 200 - 100; // ±100 miles variation
    return Math.round(baseDistance + variation);
}

function updateMapLocations(origin, destination) {
    // Extract state codes
    const originState = extractState(origin);
    const destState = extractState(destination);
    
    // Update origin point
    const originPoint = document.querySelector('.origin-point');
    if (originPoint && originState) {
        originPoint.textContent = originState;
    }
    
    // Update destination point
    const destPoint = document.querySelector('.destination-point');
    if (destPoint && destState) {
        destPoint.textContent = destState;
    }
}

function extractState(location) {
    // Simple state extraction
    const stateMatch = location.match(/,\s*([A-Z]{2})\s*\d{5}/);
    return stateMatch ? stateMatch[1] : 'CA';
}

function calculateRates() {
    const equipment = document.getElementById('equipment')?.value || 'reefer';
    const pickup = document.getElementById('pickup')?.value || '';
    const dropoff = document.getElementById('dropoff')?.value || '';
    const pickupDate = document.getElementById('pickup-date')?.value || '';
    
    if (!pickup || !dropoff || !pickupDate) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Simulate API call
    showLoadingState();
    
    setTimeout(() => {
        // Update rates with new calculation
        updateRatesBasedOnEquipment(equipment);
        
        // Update confidence levels
        updateConfidenceLevels();
        
        // Update history data
        updateHistoryData();
        
        hideLoadingState();
        showNotification('Rates calculated successfully!');
    }, 1500);
}

function updateConfidenceLevels() {
    // Simulate confidence level updates
    const buyConfidence = Math.floor(Math.random() * 15) + 80; // 80-95%
    const sellConfidence = Math.floor(Math.random() * 10) + 90; // 90-100%
    
    const buyConfidenceElement = document.querySelector('.buy-rate .confidence-badge');
    const sellConfidenceElement = document.querySelector('.sell-rate .confidence-badge');
    
    if (buyConfidenceElement) {
        buyConfidenceElement.textContent = `${buyConfidence}%`;
    }
    
    if (sellConfidenceElement) {
        sellConfidenceElement.textContent = `${sellConfidence}%`;
    }
}

function updateHistoryData() {
    // Simulate history data updates
    const historyCards = document.querySelectorAll('.history-card');
    
    historyCards.forEach(card => {
        const minElement = card.querySelector('.data-item .value');
        const maxElement = card.querySelectorAll('.data-item .value')[1];
        
        if (minElement && maxElement) {
            const baseMin = 3000;
            const baseMax = 3500;
            const variation = Math.random() * 200 - 100;
            
            const newMin = Math.round(baseMin + variation);
            const newMax = Math.round(baseMax + variation);
            
            minElement.textContent = `$${newMin.toLocaleString()}`;
            maxElement.textContent = `$${newMax.toLocaleString()}`;
        }
    });
}

function handleFeedback(button) {
    // Remove active class from all feedback buttons
    const feedbackBtns = document.querySelectorAll('.feedback-btn');
    feedbackBtns.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    button.classList.add('active');
    
    // Show feedback notification
    const feedback = button.textContent.trim();
    showNotification(`Feedback recorded: ${feedback}`);
}

function handleTabChange(button) {
    // Remove active class from all tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    button.classList.add('active');
    
    // Update content based on selected tab
    const tabName = button.textContent.trim();
    updateTabContent(tabName);
}

function updateTabContent(tabName) {
    console.log('Switching to tab:', tabName);
    
    // In a real application, this would load different data
    // For now, just show a notification
    showNotification(`Switched to ${tabName} view`);
}

function sendQuote() {
    const buyRate = document.querySelector('.buy-rate .rate-amount')?.textContent || '$3,375';
    const sellRate = document.querySelector('.sell-rate .rate-amount')?.textContent || '$3,881';
    
    // Simulate quote sending
    showLoadingState();
    
    setTimeout(() => {
        hideLoadingState();
        showNotification(`Quote sent! Buy Rate: ${buyRate}, Sell Rate: ${sellRate}`, 'success');
    }, 1000);
}

function requestBid() {
    const pickup = document.getElementById('pickup')?.value || '';
    const dropoff = document.getElementById('dropoff')?.value || '';
    
    if (!pickup || !dropoff) {
        showNotification('Please fill in pickup and dropoff locations', 'error');
        return;
    }
    
    // Simulate bid request
    showLoadingState();
    
    setTimeout(() => {
        hideLoadingState();
        showNotification('Bid request submitted successfully!', 'success');
    }, 1000);
}

function showFilteredLoads() {
    showNotification('Loading filtered loads...', 'info');
    
    // In a real application, this would load actual load data
    setTimeout(() => {
        showNotification('No additional loads found for this lane', 'info');
    }, 2000);
}

function showAccuracyReport() {
    // Create and show accuracy report modal
    const modal = document.createElement('div');
    modal.className = 'accuracy-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Accuracy Report</h3>
            <p>This feature will show detailed accuracy metrics for rate predictions.</p>
            <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function showLoadingState() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        if (btn.textContent.includes('Get Rate') || btn.textContent.includes('Send Quote') || btn.textContent.includes('Request Bid')) {
            btn.disabled = true;
            btn.textContent = 'Loading...';
        }
    });
}

function hideLoadingState() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        if (btn.disabled) {
            btn.disabled = false;
            if (btn.textContent.includes('Get Rate')) {
                btn.textContent = 'Get Rate';
            } else if (btn.textContent.includes('Send Quote')) {
                btn.textContent = 'Send Quote';
            } else if (btn.textContent.includes('Request Bid')) {
                btn.textContent = 'Request Bid';
            }
        }
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    const colors = {
        'success': '#48BB78',
        'error': '#F56565',
        'info': '#00B4D8',
        'warning': '#ED8936'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function initializeCharts() {
    // Initialize any charts if needed
    console.log('Charts initialized');
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .accuracy-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 400px;
        text-align: center;
    }
    
    .modal-content h3 {
        margin-bottom: 1rem;
        color: #1a202c;
    }
    
    .modal-content p {
        margin-bottom: 1.5rem;
        color: #4a5568;
    }
`;
document.head.appendChild(style); 