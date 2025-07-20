// Progress Tracking System for KINETIC Platform
class ProgressTrackingSystem {
    constructor() {
        this.progressData = {
            recoveryScore: 0,
            painLevel: 0,
            mobility: 0,
            strength: 0,
            endurance: 0,
            balance: 0,
            goals: [],
            exercises: [],
            measurements: [],
            milestones: []
        };
        this.goals = [];
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadProgressData();
        this.initializeCharts();
        this.setupEventListeners();
        this.startProgressMonitoring();
    }

    loadProgressData() {
        const saved = localStorage.getItem('kinetic_progress_data');
        if (saved) {
            this.progressData = { ...this.progressData, ...JSON.parse(saved) };
        }
        
        // Initialize with sample data if empty
        if (this.progressData.recoveryScore === 0) {
            this.initializeSampleData();
        }
    }

    initializeSampleData() {
        this.progressData = {
            recoveryScore: 75,
            painLevel: 3,
            mobility: 70,
            strength: 65,
            endurance: 60,
            balance: 80,
            goals: [
                {
                    id: 1,
                    title: 'Improve Walking Distance',
                    description: 'Walk 500 meters without assistance',
                    target: 500,
                    current: 300,
                    unit: 'meters',
                    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    completed: false
                },
                {
                    id: 2,
                    title: 'Reduce Pain Level',
                    description: 'Reduce pain from 5 to 2 on scale',
                    target: 2,
                    current: 3,
                    unit: 'pain scale',
                    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                    completed: false
                }
            ],
            exercises: [
                {
                    id: 1,
                    name: 'Walking Exercise',
                    type: 'mobility',
                    duration: 20,
                    frequency: 'daily',
                    lastCompleted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    accuracy: 95,
                    difficulty: 'medium'
                },
                {
                    id: 2,
                    name: 'Strength Training',
                    type: 'strength',
                    duration: 30,
                    frequency: '3x/week',
                    lastCompleted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                    accuracy: 88,
                    difficulty: 'hard'
                }
            ],
            measurements: [
                {
                    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    recoveryScore: 70,
                    painLevel: 4,
                    mobility: 65,
                    strength: 60,
                    endurance: 55,
                    balance: 75
                },
                {
                    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                    recoveryScore: 65,
                    painLevel: 5,
                    mobility: 60,
                    strength: 55,
                    endurance: 50,
                    balance: 70
                }
            ],
            milestones: [
                {
                    id: 1,
                    title: 'First Week Complete',
                    description: 'Completed first week of rehabilitation program',
                    achieved: true,
                    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                },
                {
                    id: 2,
                    title: 'Pain Reduction',
                    description: 'Reduced pain level by 2 points',
                    achieved: true,
                    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
                }
            ]
        };
        
        this.saveProgressData();
    }

    setupEventListeners() {
        // Goal completion tracking
        document.addEventListener('goalCompleted', (e) => {
            this.handleGoalCompletion(e.detail);
        });

        // Exercise completion tracking
        document.addEventListener('exerciseCompleted', (e) => {
            this.handleExerciseCompletion(e.detail);
        });

        // Progress update
        document.addEventListener('progressUpdate', (e) => {
            this.updateProgress(e.detail);
        });
    }

    initializeCharts() {
        this.createRecoveryChart();
        this.createProgressChart();
        this.createGoalProgressChart();
    }

    createRecoveryChart() {
        const ctx = document.getElementById('recoveryChart');
        if (!ctx) return;

        const data = this.progressData.measurements.map(m => ({
            date: m.date,
            score: m.recoveryScore
        }));

        // Create recovery score chart
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.date.toLocaleDateString()),
                datasets: [{
                    label: 'Recovery Score',
                    data: data.map(d => d.score),
                    borderColor: '#00B4D8',
                    backgroundColor: 'rgba(0, 180, 216, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    createProgressChart() {
        const ctx = document.getElementById('progressChart');
        if (!ctx) return;

        const currentData = {
            painLevel: this.progressData.painLevel,
            mobility: this.progressData.mobility,
            strength: this.progressData.strength,
            endurance: this.progressData.endurance,
            balance: this.progressData.balance
        };

        const chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Pain Level', 'Mobility', 'Strength', 'Endurance', 'Balance'],
                datasets: [{
                    label: 'Current Progress',
                    data: [
                        10 - currentData.painLevel, // Invert pain level
                        currentData.mobility,
                        currentData.strength,
                        currentData.endurance,
                        currentData.balance
                    ],
                    borderColor: '#00B4D8',
                    backgroundColor: 'rgba(0, 180, 216, 0.2)',
                    pointBackgroundColor: '#00B4D8',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#00B4D8'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                }
            }
        });
    }

    createGoalProgressChart() {
        const ctx = document.getElementById('goalProgressChart');
        if (!ctx) return;

        const goalData = this.progressData.goals.map(goal => ({
            name: goal.title,
            progress: (goal.current / goal.target) * 100
        }));

        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: goalData.map(g => g.name),
                datasets: [{
                    data: goalData.map(g => g.progress),
                    backgroundColor: [
                        '#00B4D8',
                        '#FF8C00',
                        '#48BB78',
                        '#9F7AEA',
                        '#F56565'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    updateProgress(updateData) {
        // Update progress metrics
        Object.keys(updateData).forEach(key => {
            if (this.progressData.hasOwnProperty(key)) {
                this.progressData[key] = updateData[key];
            }
        });

        // Add measurement record
        this.progressData.measurements.unshift({
            date: new Date(),
            recoveryScore: this.progressData.recoveryScore,
            painLevel: this.progressData.painLevel,
            mobility: this.progressData.mobility,
            strength: this.progressData.strength,
            endurance: this.progressData.endurance,
            balance: this.progressData.balance
        });

        // Keep only last 30 measurements
        if (this.progressData.measurements.length > 30) {
            this.progressData.measurements = this.progressData.measurements.slice(0, 30);
        }

        this.saveProgressData();
        this.updateUI();
        this.checkMilestones();
    }

    handleGoalCompletion(goalData) {
        const goal = this.progressData.goals.find(g => g.id === goalData.id);
        if (goal) {
            goal.completed = true;
            goal.completedDate = new Date();
            
            // Add milestone
            this.progressData.milestones.push({
                id: Date.now(),
                title: `Goal Completed: ${goal.title}`,
                description: `Successfully achieved ${goal.title}`,
                achieved: true,
                date: new Date()
            });

            this.saveProgressData();
            this.updateUI();
            this.showGoalCompletionNotification(goal);
        }
    }

    handleExerciseCompletion(exerciseData) {
        const exercise = this.progressData.exercises.find(e => e.id === exerciseData.id);
        if (exercise) {
            exercise.lastCompleted = new Date();
            exercise.accuracy = exerciseData.accuracy || exercise.accuracy;
            
            // Update progress based on exercise type
            this.updateProgressFromExercise(exercise);
        }
    }

    updateProgressFromExercise(exercise) {
        const progressUpdate = {};
        
        switch (exercise.type) {
            case 'mobility':
                progressUpdate.mobility = Math.min(100, this.progressData.mobility + 2);
                break;
            case 'strength':
                progressUpdate.strength = Math.min(100, this.progressData.strength + 3);
                break;
            case 'endurance':
                progressUpdate.endurance = Math.min(100, this.progressData.endurance + 2);
                break;
            case 'balance':
                progressUpdate.balance = Math.min(100, this.progressData.balance + 2);
                break;
        }

        // Update recovery score
        const avgProgress = (
            this.progressData.mobility + 
            this.progressData.strength + 
            this.progressData.endurance + 
            this.progressData.balance
        ) / 4;
        
        progressUpdate.recoveryScore = Math.round(avgProgress);

        this.updateProgress(progressUpdate);
    }

    checkMilestones() {
        const newMilestones = [];

        // Check for pain reduction milestone
        if (this.progressData.painLevel <= 2 && !this.hasMilestone('Pain Under Control')) {
            newMilestones.push({
                id: Date.now(),
                title: 'Pain Under Control',
                description: 'Pain level reduced to 2 or below',
                achieved: true,
                date: new Date()
            });
        }

        // Check for recovery score milestone
        if (this.progressData.recoveryScore >= 80 && !this.hasMilestone('Strong Recovery')) {
            newMilestones.push({
                id: Date.now(),
                title: 'Strong Recovery',
                description: 'Recovery score reached 80% or higher',
                achieved: true,
                date: new Date()
            });
        }

        // Check for exercise streak milestone
        const recentExercises = this.progressData.exercises.filter(e => 
            e.lastCompleted && 
            (new Date() - e.lastCompleted) < 7 * 24 * 60 * 60 * 1000
        );
        
        if (recentExercises.length >= 5 && !this.hasMilestone('Exercise Dedication')) {
            newMilestones.push({
                id: Date.now(),
                title: 'Exercise Dedication',
                description: 'Completed 5+ exercises this week',
                achieved: true,
                date: new Date()
            });
        }

        // Add new milestones
        newMilestones.forEach(milestone => {
            this.progressData.milestones.push(milestone);
            this.showMilestoneNotification(milestone);
        });

        if (newMilestones.length > 0) {
            this.saveProgressData();
            this.updateUI();
        }
    }

    hasMilestone(title) {
        return this.progressData.milestones.some(m => m.title === title);
    }

    updateUI() {
        // Update progress circles
        this.updateProgressCircles();
        
        // Update goal progress
        this.updateGoalProgress();
        
        // Update milestone display
        this.updateMilestoneDisplay();
        
        // Update exercise status
        this.updateExerciseStatus();
    }

    updateProgressCircles() {
        const metrics = ['recoveryScore', 'painLevel', 'mobility', 'strength', 'endurance', 'balance'];
        
        metrics.forEach(metric => {
            const circle = document.querySelector(`[data-metric="${metric}"]`);
            if (circle) {
                const value = this.progressData[metric];
                const percentage = metric === 'painLevel' ? (10 - value) * 10 : value;
                
                circle.style.background = `conic-gradient(#00B4D8 0deg ${percentage * 3.6}deg, #E2E8F0 ${percentage * 3.6}deg 360deg)`;
                circle.querySelector('.progress-value').textContent = `${value}${metric === 'painLevel' ? '/10' : '%'}`;
            }
        });
    }

    updateGoalProgress() {
        const goalContainer = document.querySelector('.goal-progress');
        if (!goalContainer) return;

        goalContainer.innerHTML = this.progressData.goals.map(goal => `
            <div class="goal-item ${goal.completed ? 'completed' : ''}">
                <div class="goal-header">
                    <h4>${goal.title}</h4>
                    <span class="goal-status">${goal.completed ? 'Completed' : 'In Progress'}</span>
                </div>
                <p>${goal.description}</p>
                <div class="goal-progress-bar">
                    <div class="progress-fill" style="width: ${(goal.current / goal.target) * 100}%"></div>
                </div>
                <div class="goal-stats">
                    <span>${goal.current} / ${goal.target} ${goal.unit}</span>
                    <span>${Math.round((goal.current / goal.target) * 100)}%</span>
                </div>
            </div>
        `).join('');
    }

    updateMilestoneDisplay() {
        const milestoneContainer = document.querySelector('.milestone-list');
        if (!milestoneContainer) return;

        const recentMilestones = this.progressData.milestones
            .filter(m => m.achieved)
            .sort((a, b) => b.date - a.date)
            .slice(0, 5);

        milestoneContainer.innerHTML = recentMilestones.map(milestone => `
            <div class="milestone-item">
                <div class="milestone-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <div class="milestone-content">
                    <h4>${milestone.title}</h4>
                    <p>${milestone.description}</p>
                    <span class="milestone-date">${milestone.date.toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    }

    updateExerciseStatus() {
        const exerciseContainer = document.querySelector('.exercise-status');
        if (!exerciseContainer) return;

        const recentExercises = this.progressData.exercises
            .filter(e => e.lastCompleted)
            .sort((a, b) => b.lastCompleted - a.lastCompleted)
            .slice(0, 3);

        exerciseContainer.innerHTML = recentExercises.map(exercise => `
            <div class="exercise-status-item">
                <div class="exercise-info">
                    <h4>${exercise.name}</h4>
                    <p>${exercise.type} • ${exercise.duration} min</p>
                </div>
                <div class="exercise-stats">
                    <span class="accuracy">${exercise.accuracy}% accuracy</span>
                    <span class="last-completed">${this.getTimeAgo(exercise.lastCompleted)}</span>
                </div>
            </div>
        `).join('');
    }

    getTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    }

    showGoalCompletionNotification(goal) {
        const notification = {
            type: 'goal_completed',
            title: 'Goal Achieved!',
            message: `Congratulations! You've successfully completed: ${goal.title}`,
            icon: 'fas fa-trophy'
        };

        if (window.notificationSystem) {
            window.notificationSystem.createNotification('goal_completed', {
                goalTitle: goal.title
            });
        }
    }

    showMilestoneNotification(milestone) {
        const notification = {
            type: 'milestone_achieved',
            title: 'New Milestone!',
            message: `You've achieved: ${milestone.title}`,
            icon: 'fas fa-star'
        };

        if (window.notificationSystem) {
            window.notificationSystem.createNotification('milestone_achieved', {
                milestoneTitle: milestone.title
            });
        }
    }

    startProgressMonitoring() {
        // Monitor progress changes
        setInterval(() => {
            this.checkProgressTrends();
        }, 60000); // Check every minute
    }

    checkProgressTrends() {
        if (this.progressData.measurements.length < 2) return;

        const recent = this.progressData.measurements[0];
        const previous = this.progressData.measurements[1];

        // Check for significant improvements
        const improvements = [];
        if (recent.recoveryScore > previous.recoveryScore + 5) {
            improvements.push('Recovery Score');
        }
        if (recent.painLevel < previous.painLevel - 1) {
            improvements.push('Pain Level');
        }

        if (improvements.length > 0) {
            this.showProgressImprovementNotification(improvements);
        }
    }

    showProgressImprovementNotification(improvements) {
        if (window.notificationSystem) {
            window.notificationSystem.createNotification('progress_improvement', {
                improvements: improvements.join(', ')
            });
        }
    }

    saveProgressData() {
        localStorage.setItem('kinetic_progress_data', JSON.stringify(this.progressData));
    }

    // Public methods for external use
    addGoal(goal) {
        goal.id = Date.now();
        goal.completed = false;
        this.progressData.goals.push(goal);
        this.saveProgressData();
        this.updateUI();
    }

    completeExercise(exerciseId, accuracy) {
        const exercise = this.progressData.exercises.find(e => e.id === exerciseId);
        if (exercise) {
            exercise.lastCompleted = new Date();
            exercise.accuracy = accuracy;
            this.updateProgressFromExercise(exercise);
        }
    }

    updateMeasurement(measurement) {
        this.updateProgress(measurement);
    }

    getProgressSummary() {
        return {
            recoveryScore: this.progressData.recoveryScore,
            painLevel: this.progressData.painLevel,
            goalsCompleted: this.progressData.goals.filter(g => g.completed).length,
            totalGoals: this.progressData.goals.length,
            milestonesAchieved: this.progressData.milestones.filter(m => m.achieved).length,
            exercisesThisWeek: this.progressData.exercises.filter(e => 
                e.lastCompleted && 
                (new Date() - e.lastCompleted) < 7 * 24 * 60 * 60 * 1000
            ).length
        };
    }
}

// Initialize progress tracking system
const progressTracker = new ProgressTrackingSystem();

// Export for global access
window.progressTracker = progressTracker; 