const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'kinetic-secret-key-2024';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/kinetic_auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Database Schemas
const patientSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['patient', 'physiotherapist'],
        default: 'patient'
    },
    acceptTerms: {
        type: Boolean,
        required: true
    },
    acceptUpdates: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
});

const practitionerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    clinicId: {
        type: String,
        required: true
    },
    licenseVerified: {
        type: Boolean,
        default: false
    },
    fullName: {
        type: String,
        required: true
    },
    specialization: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
});

const Patient = mongoose.model('Patient', patientSchema);
const Practitioner = mongoose.model('Practitioner', practitionerSchema);

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
        const existingUser = await Patient.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new patient
        const patient = new Patient({
            fullName,
            email,
            password: hashedPassword,
            role,
            acceptTerms,
            acceptUpdates
        });

        await patient.save();

        // Generate token
        const token = generateToken(patient._id, 'patient');

        res.status(201).json({
            message: 'Account created successfully',
            token,
            user: {
                id: patient._id,
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
        const patient = await Patient.findOne({ email });
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
        await patient.save();

        // Generate token
        const token = generateToken(patient._id, 'patient');

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: patient._id,
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

        if (!validatePractitionerEmail(email)) {
            return res.status(400).json({ message: 'Please use your professional clinic email address' });
        }

        // Find practitioner
        const practitioner = await Practitioner.findOne({ email });
        if (!practitioner) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, practitioner.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if license is verified
        if (!practitioner.licenseVerified) {
            return res.status(403).json({ message: 'Your license is pending verification. Please contact admin.' });
        }

        // Update last login
        practitioner.lastLogin = new Date();
        await practitioner.save();

        // Generate token
        const token = generateToken(practitioner._id, 'practitioner');

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: practitioner._id,
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

// Get user profile (protected route)
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const { userId, userType } = req.user;

        if (userType === 'patient') {
            const patient = await Patient.findById(userId).select('-password');
            if (!patient) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ user: patient });
        } else if (userType === 'practitioner') {
            const practitioner = await Practitioner.findById(userId).select('-password');
            if (!practitioner) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ user: practitioner });
        } else {
            res.status(400).json({ message: 'Invalid user type' });
        }

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update user profile (protected route)
app.put('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const { userId, userType } = req.user;
        const { fullName, acceptUpdates } = req.body;

        if (userType === 'patient') {
            const patient = await Patient.findById(userId);
            if (!patient) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (fullName) patient.fullName = fullName;
            if (acceptUpdates !== undefined) patient.acceptUpdates = acceptUpdates;

            await patient.save();
            res.json({ message: 'Profile updated successfully', user: patient });
        } else {
            res.status(400).json({ message: 'Profile updates not available for practitioners' });
        }

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Change password (protected route)
app.put('/api/user/password', authenticateToken, async (req, res) => {
    try {
        const { userId, userType } = req.user;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required' });
        }

        if (!validatePassword(newPassword)) {
            return res.status(400).json({ message: 'New password must be at least 8 characters long' });
        }

        let user;
        if (userType === 'patient') {
            user = await Patient.findById(userId);
        } else if (userType === 'practitioner') {
            user = await Practitioner.findById(userId);
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const saltRounds = 12;
        user.password = await bcrypt.hash(newPassword, saltRounds);
        await user.save();

        res.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Logout (client-side token removal)
app.post('/api/logout', authenticateToken, (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`KINETIC Auth Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
    });
}); 