const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'kinetic-secret-key-2024';

// In-memory storage (for development/testing)
const users = {
    patients: [],
    practitioners: []
};

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

function validatePractitionerEmail(email) {
    const clinicDomains = ['clinic.com', 'hospital.com', 'medical.com', 'healthcare.com', 'kinetic.com'];
    const domain = email.split('@')[1];
    return clinicDomains.some(clinicDomain => domain && domain.includes(clinicDomain));
}

// JWT Token generation
function generateToken(userId, userType) {
    return jwt.sign(
        { userId, userType },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
}

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// API Routes

// Patient Registration
app.post('/api/patient/register', async (req, res) => {
    try {
        const { fullName, email, password, role, acceptTerms, acceptUpdates } = req.body;

        // Validation
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        if (!acceptTerms) {
            return res.status(400).json({ message: 'You must agree to the Terms of Service' });
        }

        // Check if user already exists
        const existingUser = users.patients.find(user => user.email === email);
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new patient
        const patient = {
            id: Date.now().toString(),
            fullName,
            email,
            password: hashedPassword,
            role: role || 'patient',
            acceptTerms,
            acceptUpdates,
            createdAt: new Date(),
            lastLogin: new Date()
        };

        users.patients.push(patient);

        // Generate token
        const token = generateToken(patient.id, 'patient');

        res.status(201).json({
            message: 'Account created successfully',
            token,
            user: {
                id: patient.id,
                fullName: patient.fullName,
                email: patient.email,
                role: patient.role
            }
        });

    } catch (error) {
        console.error('Patient registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Patient Login
app.post('/api/patient/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // Find user
        const patient = users.patients.find(user => user.email === email);
        if (!patient) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, patient.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Update last login
        patient.lastLogin = new Date();

        // Generate token
        const token = generateToken(patient.id, 'patient');

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: patient.id,
                fullName: patient.fullName,
                email: patient.email,
                role: patient.role
            }
        });

    } catch (error) {
        console.error('Patient login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Practitioner Registration
app.post('/api/practitioner/register', async (req, res) => {
    try {
        const { email, password, clinicId, fullName, specialization } = req.body;

        // Validation
        if (!email || !password || !clinicId || !fullName) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        if (!validatePractitionerEmail(email)) {
            return res.status(400).json({ message: 'Please use a valid clinic email address' });
        }

        // Check if user already exists
        const existingUser = users.practitioners.find(user => user.email === email);
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new practitioner
        const practitioner = {
            id: Date.now().toString(),
            email,
            password: hashedPassword,
            clinicId,
            licenseVerified: false,
            fullName,
            specialization,
            createdAt: new Date(),
            lastLogin: new Date()
        };

        users.practitioners.push(practitioner);

        // Generate token
        const token = generateToken(practitioner.id, 'practitioner');

        res.status(201).json({
            message: 'Account created successfully',
            token,
            user: {
                id: practitioner.id,
                fullName: practitioner.fullName,
                email: practitioner.email,
                clinicId: practitioner.clinicId,
                specialization: practitioner.specialization
            }
        });

    } catch (error) {
        console.error('Practitioner registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Practitioner Login
app.post('/api/practitioner/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // Find user
        const practitioner = users.practitioners.find(user => user.email === email);
        if (!practitioner) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, practitioner.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Update last login
        practitioner.lastLogin = new Date();

        // Generate token
        const token = generateToken(practitioner.id, 'practitioner');

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: practitioner.id,
                fullName: practitioner.fullName,
                email: practitioner.email,
                clinicId: practitioner.clinicId,
                specialization: practitioner.specialization
            }
        });

    } catch (error) {
        console.error('Practitioner login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Protected route example
app.get('/api/profile', authenticateToken, (req, res) => {
    res.json({ message: 'Profile accessed successfully', user: req.user });
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/auth.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'auth.html'));
});

app.get('/patient-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'patient-dashboard.html'));
});

app.get('/practitioner-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'practitioner-dashboard.html'));
});

app.get('/booking-system.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'booking-system.html'));
});

app.get('/chat-system.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'chat-system.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 KINETIC Server running on http://localhost:${PORT}`);
    console.log(`📊 Available routes:`);
    console.log(`   - Landing Page: http://localhost:${PORT}`);
    console.log(`   - Authentication: http://localhost:${PORT}/auth.html`);
    console.log(`   - Patient Dashboard: http://localhost:${PORT}/patient-dashboard.html`);
    console.log(`   - Practitioner Dashboard: http://localhost:${PORT}/practitioner-dashboard.html`);
    console.log(`   - Booking System: http://localhost:${PORT}/booking-system.html`);
    console.log(`   - Chat System: http://localhost:${PORT}/chat-system.html`);
    console.log(`\n🔧 API Endpoints:`);
    console.log(`   - POST /api/patient/register`);
    console.log(`   - POST /api/patient/login`);
    console.log(`   - POST /api/practitioner/register`);
    console.log(`   - POST /api/practitioner/login`);
    console.log(`   - GET /api/profile (protected)`);
}); 