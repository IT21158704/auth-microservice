# JWT Authentication System Test Suite

## Prerequisites
- Server running on `http://localhost:3000` (adjust port as needed)
- Database connected and user table created
- Environment variables configured

## Test Cases

### 1. User Registration

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User"
}
```

**Expected Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid-here",
    "username": "testuser",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User"
  }
}
```

**Test Variations:**
```json
// Missing required field
{
  "email": "test2@example.com",
  "password": "password123"
}

// Duplicate email
{
  "username": "testuser2",
  "email": "test@example.com",
  "password": "password123"
}

// Invalid email format
{
  "username": "testuser3",
  "email": "invalid-email",
  "password": "password123"
}

// Weak password
{
  "username": "testuser4",
  "email": "test4@example.com",
  "password": "123"
}
```

### 2. User Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid-here",
    "username": "testuser",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Test Variations:**
```json
// Wrong password
{
  "email": "test@example.com",
  "password": "wrongpassword"
}

// Non-existent email
{
  "email": "nonexistent@example.com",
  "password": "password123"
}

// Missing fields
{
  "email": "test@example.com"
}
```

### 3. Token Refresh

**Endpoint:** `POST /api/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Expected Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Test Variations:**
```json
// Invalid refresh token
{
  "refreshToken": "invalid.token.here"
}

// Expired refresh token
{
  "refreshToken": "expired.refresh.token"
}

// Missing refresh token
{
  "refreshToken": ""
}
```

### 4. Protected Route Access

**Endpoint:** `GET /api/protected/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Expected Response (200):**
```json
{
  "user": {
    "id": "uuid-here",
    "username": "testuser",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User"
  }
}
```

**Test Variations:**
```
// Missing Authorization header
(no header)

// Invalid token format
Authorization: Bearer invalid.token.here

// Expired access token
Authorization: Bearer expired.access.token

// Malformed Authorization header
Authorization: invalid-format
```

### 5. Update User Profile

**Endpoint:** `PUT /api/protected/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "username": "updateduser"
}
```

**Expected Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "uuid-here",
    "username": "updateduser",
    "email": "test@example.com",
    "firstName": "Updated",
    "lastName": "Name"
  }
}
```

### 6. Change Password

**Endpoint:** `POST /api/protected/change-password`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Expected Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

**Test Variations:**
```json
// Wrong current password
{
  "currentPassword": "wrongpassword",
  "newPassword": "newpassword456"
}

// Weak new password
{
  "currentPassword": "password123",
  "newPassword": "123"
}
```

### 7. Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Expected Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

## cURL Commands for Testing

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Access Protected Route
```bash
curl -X GET http://localhost:3000/api/protected/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Refresh Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

### Update Profile
```bash
curl -X PUT http://localhost:3000/api/protected/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name"
  }'
```

### Change Password
```bash
curl -X POST http://localhost:3000/api/protected/change-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456"
  }'
```

### Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

## Postman Collection JSON

```json
{
  "info": {
    "name": "JWT Authentication API",
    "description": "Complete test suite for JWT authentication system",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"testuser\",\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\",\n  \"firstName\": \"Test\",\n  \"lastName\": \"User\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/auth/register",
          "host": ["{{baseUrl}}"],
          "path": ["api", "auth", "register"]
        }
      }
    },
    {
      "name": "Login User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/auth/login",
          "host": ["{{baseUrl}}"],
          "path": ["api", "auth", "login"]
        }
      }
    },
    {
      "name": "Get Profile",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{accessToken}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/protected/profile",
          "host": ["{{baseUrl}}"],
          "path": ["api", "protected", "profile"]
        }
      }
    },
    {
      "name": "Refresh Token",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"refreshToken\": \"{{refreshToken}}\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/auth/refresh",
          "host": ["{{baseUrl}}"],
          "path": ["api", "auth", "refresh"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    },
    {
      "key": "accessToken",
      "value": ""
    },
    {
      "key": "refreshToken",
      "value": ""
    }
  ]
}
```

## Testing Workflow

1. **Start with Registration** - Create a new user account
2. **Login** - Get access and refresh tokens
3. **Test Protected Routes** - Use access token to access protected endpoints
4. **Test Token Refresh** - Use refresh token to get new access token
5. **Test Token Expiration** - Wait for token to expire and test error handling
6. **Test Logout** - Invalidate tokens
7. **Test Error Cases** - Try invalid tokens, missing headers, wrong passwords

## Expected HTTP Status Codes

- **200**: Success (login, refresh, profile access)
- **201**: Created (registration)
- **400**: Bad Request (validation errors, missing fields)
- **401**: Unauthorized (invalid credentials, expired tokens)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (user not found)
- **409**: Conflict (duplicate email/username)
- **500**: Internal Server Error (server issues)

## Environment Variables Needed

```env
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
DATABASE_URL=your-database-connection-string
PORT=3000
```