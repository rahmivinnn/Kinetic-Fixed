# KINETIC Authentication System

A complete authentication system for the KINETIC platform with separate portals for patients and healthcare practitioners.

## 🚀 Features

### Frontend (HTML/CSS/JavaScript)
- **Patient Sign-Up**: Complete registration form with role selection
- **Patient Sign-In**: Secure login with email/password
- **Practitioner Portal**: Professional healthcare provider login
- **Real-time Validation**: Form validation with instant feedback
- **Responsive Design**: Works on all devices
- **Social Login**: Google and Apple sign-in options (placeholder)
- **Password Toggle**: Show/hide password functionality
- **Accessibility**: WCAG compliant with proper focus states

### Backend (Node.js/Express/MongoDB)
- **Secure Authentication**: JWT-based token system
- **Password Hashing**: bcrypt with salt rounds
- **Email Validation**: Professional domain validation for practitioners
- **Rate Limiting**: Protection against brute force attacks
- **CORS Support**: Cross-origin resource sharing
- **Security Headers**: Helmet.js for enhanced security
- **Database Models**: Separate schemas for patients and practitioners

## 📁 Project Structure

```
kinetic-auth/
├── auth.html              # Main authentication page
├── auth-styles.css        # Authentication styles
├── auth-script.js         # Frontend JavaScript
├── server.js              # Backend server
├── package.json           # Dependencies
├── AUTH_README.md         # This file
├── index.html             # Main KINETIC website
├── styles.css             # Main website styles
├── script.js              # Main website JavaScript
└── README.md              # Main project documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Backend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update connection string in server.js
   ```

3. **Start the Server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Verify Installation**
   ```bash
   curl http://localhost:3000/api/health
   ```

### Frontend Setup

1. **Open the Authentication Page**
   ```bash
   # Simply open auth.html in your browser
   # Or serve with a local server:
   python -m http.server 8000
   # Then visit: http://localhost:8000/auth.html
   ```

## 🔌 API Endpoints

### Authentication Endpoints

#### Patient Registration
```http
POST /api/patient/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "patient",
  "acceptTerms": true,
  "acceptUpdates": false
}
```

**Response:**
```json
{
  "message": "Account created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

#### Patient Login
```http
POST /api/patient/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Practitioner Login
```http
POST /api/practitioner/login
Content-Type: application/json

{
  "email": "dr.smith@clinic.com",
  "password": "securepassword123"
}
```

### Protected Endpoints

#### Get User Profile
```http
GET /api/user/profile
Authorization: Bearer jwt_token_here
```

#### Update User Profile
```http
PUT /api/user/profile
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "fullName": "John Doe Updated",
  "acceptUpdates": true
}
```

#### Change Password
```http
PUT /api/user/password
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newsecurepassword123"
}
```

#### Logout
```http
POST /api/logout
Authorization: Bearer jwt_token_here
```

## 🔐 Security Features

### Password Requirements
- Minimum 8 characters
- Bcrypt hashing with 12 salt rounds
- Secure comparison to prevent timing attacks

### Email Validation
- Standard email format validation
- Practitioner emails must contain clinic domains:
  - `clinic.com`
  - `hospital.com`
  - `medical.com`
  - `healthcare.com`
  - `kinetic.com`

### Rate Limiting
- 100 requests per 15 minutes per IP
- Prevents brute force attacks

### JWT Security
- 24-hour token expiration
- Secure token generation
- Token validation middleware

### CORS Configuration
- Cross-origin resource sharing enabled
- Secure headers with Helmet.js

## 📊 Database Schema

### Patient Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique),
  password: String (hashed),
  role: String ("patient" | "physiotherapist"),
  acceptTerms: Boolean,
  acceptUpdates: Boolean,
  createdAt: Date,
  lastLogin: Date
}
```

### Practitioner Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  clinicId: String,
  licenseVerified: Boolean,
  fullName: String,
  specialization: String,
  createdAt: Date,
  lastLogin: Date
}
```

## 🎨 Frontend Features

### Form Validation
- **Real-time validation**: Instant feedback on input
- **Email format**: Validates proper email structure
- **Password strength**: Minimum 8 characters
- **Password confirmation**: Ensures passwords match
- **Terms acceptance**: Required for registration

### User Experience
- **Loading states**: Visual feedback during API calls
- **Error messages**: Clear, user-friendly error display
- **Success messages**: Confirmation of successful actions
- **Tab navigation**: Easy switching between auth screens
- **Responsive design**: Works on mobile and desktop

### Interactive Elements
- **Password toggle**: Show/hide password functionality
- **Social login buttons**: Google and Apple sign-in
- **Forgot password**: Password recovery functionality
- **Contact admin**: Practitioner registration assistance

## 🚀 Usage Examples

### Register a New Patient
```javascript
const response = await fetch('/api/patient/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    password: 'securepassword123',
    role: 'patient',
    acceptTerms: true,
    acceptUpdates: true
  })
});

const data = await response.json();
localStorage.setItem('authToken', data.token);
```

### Login as Practitioner
```javascript
const response = await fetch('/api/practitioner/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'dr.johnson@clinic.com',
    password: 'securepassword123'
  })
});

const data = await response.json();
localStorage.setItem('authToken', data.token);
```

### Access Protected Route
```javascript
const response = await fetch('/api/user/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  }
});

const data = await response.json();
console.log(data.user);
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
MONGODB_URI=mongodb://localhost:27017/kinetic_auth
NODE_ENV=development
```

### MongoDB Connection
Update the MongoDB connection string in `server.js`:

```javascript
// Local MongoDB
mongoose.connect('mongodb://localhost:27017/kinetic_auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// MongoDB Atlas (cloud)
mongoose.connect('mongodb+srv://username:password@cluster.mongodb.net/kinetic_auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Manual Testing
1. Start the server: `npm run dev`
2. Open `auth.html` in your browser
3. Test all authentication flows
4. Verify error handling and validation

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📱 Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+

## 🔒 Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Environment Variables**: Never commit secrets to version control
3. **Input Validation**: All inputs are validated server-side
4. **Rate Limiting**: Prevents abuse and brute force attacks
5. **Password Hashing**: Secure bcrypt implementation
6. **JWT Expiration**: Tokens expire after 24 hours
7. **CORS**: Properly configured for security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For questions or support:
- **Email**: support@kinetic.com
- **Documentation**: [KINETIC Docs](https://docs.kinetic.com)
- **Issues**: [GitHub Issues](https://github.com/kinetic/auth/issues)

---

**KINETIC Authentication System** - Secure, scalable authentication for healthcare platforms. 