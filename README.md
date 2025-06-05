# 🔐 Authentication Microservice

A complete, production-ready authentication microservice built with Node.js, TypeScript, JWT tokens, and MongoDB. Perfect for integrating secure authentication into your applications as a standalone service.

## ✨ Features

### 🛡️ Security First
- **JWT Authentication** - Access tokens (15min) + Refresh tokens (7 days)
- **HTTP-only Secure Cookies** - XSS protection with secure cookie storage
- **Password Hashing** - bcrypt with 12 salt rounds
- **Rate Limiting** - Prevent brute force attacks
- **Security Headers** - Helmet.js for additional protection
- **Input Validation** - Comprehensive request validation
- **CORS Protection** - Configurable cross-origin resource sharing

### 📧 Email Features
- **Email Verification** - Secure account activation
- **Password Reset** - Secure password recovery via email
- **HTML Email Templates** - Beautiful, responsive email designs
- **SMTP Support** - Works with Gmail, SendGrid, and other providers

### 🎯 Complete API
- User registration and login
- Email verification workflow
- Password reset functionality
- Profile management
- Token refresh mechanism
- Secure logout with token invalidation
- Role-based access control (User/Admin)

### 🔧 Developer Experience
- **TypeScript** - Full type safety and better DX
- **Hot Reload** - Development with tsx watch mode
- **Environment Configuration** - Flexible config management
- **Error Handling** - Comprehensive error responses
- **Health Check** - Service monitoring endpoint
- **MongoDB Integration** - Mongoose ODM with validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 4.4+
- SMTP credentials (Gmail, SendGrid, etc.)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/auth-microservice.git
cd auth-microservice
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/auth_microservice
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

4. **Start the service**
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

The service will be available at `http://localhost:3001`

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api/auth
```

### Public Endpoints

#### Register User
```http
POST /register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email for verification.",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isVerified": false
    }
  }
}
```

#### Login User
```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isVerified": true
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

#### Verify Email
```http
GET /verify-email?token=verification_token
```

#### Forgot Password
```http
POST /forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Reset Password
```http
POST /reset-password
Content-Type: application/json

{
  "token": "reset_token",
  "password": "newpassword123"
}
```

#### Refresh Token
```http
POST /refresh-token
Content-Type: application/json

{
  "refreshToken": "jwt_refresh_token"
}
```

### Protected Endpoints

#### Get Profile
```http
GET /profile
Authorization: Bearer jwt_access_token
```

#### Update Profile
```http
PUT /profile
Authorization: Bearer jwt_access_token
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

#### Logout
```http
POST /logout
Authorization: Bearer jwt_access_token
```

### Health Check
```http
GET /health
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3001` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/auth_microservice` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_REFRESH_SECRET` | Refresh token secret | Required |
| `JWT_EXPIRE` | Access token expiration | `15m` |
| `JWT_REFRESH_EXPIRE` | Refresh token expiration | `7d` |
| `COOKIE_SECRET` | Cookie signing secret | Required |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | SMTP username | Required |
| `EMAIL_PASS` | SMTP password | Required |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

## 🏗️ Architecture

```
├── src/
│   ├── config/
│   │   └── database.ts          # Database connection
│   ├── controllers/
│   │   └── authController.ts    # Authentication logic
│   ├── middleware/
│   │   └── auth.ts              # JWT middleware
│   ├── models/
│   │   └── User.ts              # User data model
│   ├── routes/
│   │   └── authRoutes.ts        # API routes
│   ├── types/
│   │   └── index.ts             # TypeScript definitions
│   ├── utils/
│   │   ├── jwt.ts               # JWT utilities
│   │   └── email.ts             # Email utilities
│   └── server.ts                # Express server setup
├── dist/                        # Compiled JavaScript
├── .env.example                 # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Security Features

- **Password Security**: bcrypt hashing with 12 salt rounds
- **JWT Tokens**: Short-lived access tokens with refresh mechanism
- **HTTP-only Cookies**: Secure token storage
- **Rate Limiting**: Prevent brute force attacks
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin policies
- **Security Headers**: Helmet.js for additional protection
- **Token Rotation**: Refresh tokens are rotated on use

## 🚀 Deployment

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/server.js"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  auth-service:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/auth_microservice
    depends_on:
      - mongo
  
  mongo:
    image: mongo:5
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

### Cloud Deployment
This service is ready for deployment on:
- **Vercel/Netlify** - Serverless functions
- **Railway/Render** - Container deployment  
- **AWS/GCP/Azure** - Cloud platforms
- **DigitalOcean** - Droplets or App Platform

## 🧪 Testing

### Manual Testing
Use the included health check endpoint:
```bash
curl http://localhost:3001/health
```

### Integration Testing
Test the authentication flow:
```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🤝 Integration Examples

### Frontend Integration (React/Vue/Angular)
```javascript
// Login function
const login = async (email, password) => {
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Include cookies
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

// Authenticated request
const getProfile = async () => {
  const response = await fetch('http://localhost:3001/api/auth/profile', {
    credentials: 'include' // Include cookies
  });
  return response.json();
};
```

### Backend Integration (Express)
```javascript
// Middleware to verify tokens from this service
const verifyAuth = async (req, res, next) => {
  const response = await fetch('http://auth-service:3001/api/auth/profile', {
    headers: { 
      'Authorization': req.headers.authorization,
      'Cookie': req.headers.cookie 
    }
  });
  
  if (response.ok) {
    req.user = await response.json();
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
```

## 📈 Monitoring

### Health Check
```bash
curl http://localhost:3001/health
```

### Logs
The service provides structured logging for:
- Authentication attempts
- Token generation/validation
- Email sending status
- Database operations
- Error tracking

## 🛠️ Development

### Available Scripts
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Start production server
npm test         # Run tests (when implemented)
```

### Code Style
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Conventional commits for version management

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Failed**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network connectivity

**2. Email Not Sending**
- Check SMTP credentials
- Verify email provider settings
- Check firewall/network restrictions

**3. JWT Token Issues**
- Ensure JWT_SECRET is set
- Check token expiration times
- Verify cookie settings for HTTPS

**4. CORS Errors**
- Check FRONTEND_URL in `.env`
- Verify credentials: true in requests
- Check browser network tab for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- Authentication powered by [JWT](https://jwt.io/)
- Database integration with [MongoDB](https://mongodb.com/) and [Mongoose](https://mongoosejs.com/)
- Email functionality via [Nodemailer](https://nodemailer.com/)
- Security enhanced with [Helmet.js](https://helmetjs.github.io/)

## 📞 Support

- Create an [Issue](https://github.com/yourusername/auth-microservice/issues) for bug reports
- Start a [Discussion](https://github.com/yourusername/auth-microservice/discussions) for questions
- Check the [Wiki](https://github.com/yourusername/auth-microservice/wiki) for additional documentation

---

**⭐ Star this repository if you find it helpful!**

Made with ❤️ for the developer community
