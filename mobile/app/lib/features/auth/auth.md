# Authentication Flow: Node.js Backend + Flutter App

## Table of Contents

1. [Complete Authentication Flow](#complete-authentication-flow)
2. [Signup Flow](#signup-flow)
3. [Login Flow](#login-flow)
4. [Token Management](#token-management)
5. [Authenticated Requests](#authenticated-requests)
6. [Logout Flow](#logout-flow)
7. [Error Handling](#error-handling)
8. [Security Considerations](#security-considerations)

---

### Key Components

| Component           | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| **Node.js Backend** | Validates credentials, generates JWT tokens, manages user data |
| **Flutter App**     | Provides UI, sends auth requests, stores tokens locally        |
| **JWT Token**       | Stateless authentication token, signed by backend              |
| **Local Storage**   | Stores token on device for session persistence                 |
| **HTTP Requests**   | Communication between app and backend                          |

---

## Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION SYSTEM FLOW                       │
└─────────────────────────────────────────────────────────────────────┘

                         ┌──────────────────┐
                         │   Flutter App    │
                         └──────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
              [Signup/Login]            [Already Logged In?]
                    │                           │
                    ▼                           ▼
         ┌─────────────────────┐    ┌──────────────────────┐
         │ Send Credentials    │    │ Retrieve Stored Token│
         │ to Backend          │    │ from Local Storage    │
         └─────────────────────┘    └──────────────────────┘
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │   Node.js Backend API    │
                    └──────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
              [Validate]                  [Verify Token]
              [Hash Check]                [Check Expiry]
                    │                           │
                    ▼                           ▼
         ┌─────────────────────┐    ┌──────────────────────┐
         │ Generate JWT Token  │    │ Token Valid?         │
         │ (Signed)            │    │                      │
         └─────────────────────┘    └──────────────────────┘
                    │                      │        │
                    │                      │        │
              [Success]            [Valid] │    [Expired/Invalid]
                    │                      │        │
                    ▼                      ▼        ▼
        ┌──────────────────────┐  ┌──────────────┐ ┌─────────────┐
        │ Return Token + User  │  │ Grant Access │ │ Redirect to │
        │ Data to Flutter      │  │              │ │ Login       │
        └──────────────────────┘  └──────────────┘ └─────────────┘
                    │
                    ▼
        ┌──────────────────────────┐
        │ Store Token in Local     │
        │ Storage (SharedPrefs)    │
        │ + Set User State         │
        └──────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────┐
        │ Navigate to Home/Dashboard
        │ App is Now Authenticated │
        └──────────────────────────┘
```

---

## Signup Flow

### Step-by-Step Process

```
USER SIGNUP FLOW
═══════════════════════════════════════════════════════════════

1. USER ACTION
   └─ User enters: email, password, name in Flutter UI
   └─ User taps "Sign Up" button

2. FLUTTER APP (auth_controller.dart)
   ├─ Validate input locally (email format, password length)
   ├─ Create request body: { email, password, name }
   └─ Make HTTP POST request to: /api/auth/signup

3. NODE.JS BACKEND
   ├─ Receive request
   ├─ Validate input:
   │  ├─ Check email format is valid
   │  ├─ Check password is strong enough
   │  └─ Check name is not empty
   ├─ Check if email already exists in database
   │  └─ If exists: return error 409 (Conflict)
   └─ If all valid, proceed to user creation

4. USER CREATION
   ├─ Hash password using bcrypt
   └─ Create new user in database:
      ├─ Email: user@example.com
      ├─ Password: hashed_value
      ├─ Name: John Doe
      ├─ Created At: timestamp
      └─ ID: auto-generated

5. TOKEN GENERATION
   ├─ Create JWT payload: { userId, email, name, role }
   ├─ Sign token with secret key
   ├─ Set expiration: 7 days
   └─ Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

6. RESPONSE TO FLUTTER
   ├─ Status: 201 (Created)
   ├─ Body:
   │  ├─ token: "JWT_TOKEN_HERE"
   │  ├─ user: { id, email, name }
   │  └─ message: "User created successfully"
   └─ Send to Flutter app

7. FLUTTER APP RECEIVES
   ├─ Extract token from response
   ├─ Store token in SharedPreferences (encrypted)
   ├─ Save user data in app state (GetX, Riverpod, Provider)
   ├─ Set isAuthenticated flag to true
   └─ Navigate to Home/Dashboard screen
```

### Signup Request/Response Example

**Flutter sends:**

```json
POST /api/auth/signup HTTP/1.1
Host: your-backend.com
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Backend responds (Success):**

```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWY3ZDU4YjkwZTQ2YzAwMWE2YzJhMTIiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE2NDMyNzg0MDAsImV4cCI6MTY0Mzg4MzIwMH0.signature",
  "user": {
    "id": "61f7d58b90e46c001a6c2a12",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Backend responds (Error - Email exists):**

```json
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "success": false,
  "message": "Email already registered",
  "error": "EMAIL_EXISTS"
}
```

---

## Login Flow

### Step-by-Step Process

```
USER LOGIN FLOW
═══════════════════════════════════════════════════════════════

1. USER ACTION
   └─ User enters: email, password in Flutter UI
   └─ User taps "Login" button

2. FLUTTER APP (auth_controller.dart)
   ├─ Validate input locally
   ├─ Create request body: { email, password }
   └─ Make HTTP POST request to: /api/auth/login

3. NODE.JS BACKEND
   ├─ Receive request
   ├─ Find user by email in database
   │  └─ If not found: return error 401 (Unauthorized)
   └─ If found, proceed to password check

4. PASSWORD VERIFICATION
   ├─ Retrieve hashed password from database
   ├─ Compare provided password with hashed version using bcrypt
   ├─ bcrypt.compare(plainPassword, hashedPassword)
   │  ├─ If match: ✓ Continue
   │  └─ If no match: ✗ Return error 401
   └─ Password is verified

5. TOKEN GENERATION (same as signup)
   ├─ Create JWT payload: { userId, email, name, role }
   ├─ Sign token with secret key
   └─ Set expiration: 7 days

6. RESPONSE TO FLUTTER
   ├─ Status: 200 (OK)
   ├─ Body:
   │  ├─ token: "JWT_TOKEN_HERE"
   │  ├─ user: { id, email, name }
   │  └─ message: "Login successful"
   └─ Send to Flutter app

7. FLUTTER APP RECEIVES
   ├─ Extract token from response
   ├─ Store token securely
   ├─ Save user data
   ├─ Update app state
   └─ Navigate to Home screen
```

### Login Request/Response Example

**Flutter sends:**

```json
POST /api/auth/login HTTP/1.1
Host: your-backend.com
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Backend responds (Success):**

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWY3ZDU4YjkwZTQ2YzAwMWE2YzJhMTIiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE2NDMyNzg0MDAsImV4cCI6MTY0Mzg4MzIwMH0.signature",
  "user": {
    "id": "61f7d58b90e46c001a6c2a12",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Backend responds (Error - Wrong password):**

```json
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "success": false,
  "message": "Invalid email or password",
  "error": "INVALID_CREDENTIALS"
}
```

---

## Token Management

### What is a JWT Token?

A JWT token has 3 parts separated by dots (`.`):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 . eyJ1c2VySWQiOiI2MWY3ZDU4YjkwZTQ2YzAwMWE2YzJhMTIiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJuYW1lIjoiSm9obiBEb2UifQ . signature

         HEADER                    .              PAYLOAD                       .    SIGNATURE
```

**Header:** Contains token type and algorithm (HS256)
**Payload:** Contains user data (userId, email, name, expiry)
**Signature:** Signed by backend secret key to prevent tampering

### Token Lifecycle

```
TOKEN LIFECYCLE
═══════════════════════════════════════════════════════════════

1. GENERATION
   └─ Backend creates token immediately after signup/login
   └─ Token is valid for 7 days (or your configured duration)

2. STORAGE
   └─ Flutter receives token
   └─ Stores in SharedPreferences or secure storage
   └─ Token persists even after app closes

3. USAGE
   └─ For every API request (except login/signup):
      ├─ Flutter retrieves token from storage
      └─ Adds to request header:
         └─ Authorization: Bearer <token>

4. VERIFICATION (on each request)
   └─ Backend receives request with token in header
   └─ Decodes token using secret key
   ├─ Checks if signature is valid (not tampered)
   ├─ Checks if token is expired
   └─ If valid: allow request, If expired: return 401

5. REFRESH (when expired)
   └─ Token is expired (7 days old)
   └─ Backend returns 401 Unauthorized
   └─ Flutter makes request to /api/auth/refresh with refresh token
   └─ Backend generates new token (advanced - optional)

6. DELETION
   └─ User logs out
   └─ Flutter deletes token from storage
   └─ Token is no longer sent in requests
   └─ Backend rejects requests without token
```

### Token Storage in Flutter

```
LOCAL STORAGE FLOW
═══════════════════════════════════════════════════════════════
Flutter Secure Storage (Encrypted, production-ready)
┌──────────────────────────────────────────┐
│ const storage = FlutterSecureStorage()   │
│   storage.write(key: 'auth_token', value: token)
│   storage.write(key: 'user_data', value: jsonEncode(user))
└──────────────────────────────────────────┘
```

---

## Authenticated Requests

### Making API Calls with Token

Once user is authenticated, every API request must include the token:

```
AUTHENTICATED REQUEST FLOW
═══════════════════════════════════════════════════════════════

1. FLUTTER APP NEEDS DATA
   └─ User opens home screen
   └─ App needs to fetch user's posts

2. RETRIEVE STORED TOKEN
   ├─ Get token from SharedPreferences/Secure Storage
   └─ Token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

3. MAKE HTTP REQUEST
   ├─ Endpoint: GET /api/posts
   ├─ Headers:
   │  ├─ Content-Type: application/json
   │  ├─ Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   │  └─ (other headers)
   └─ Body: (empty for GET)

4. NODE.JS BACKEND RECEIVES
   ├─ Extract token from Authorization header
   ├─ Remove "Bearer " prefix
   ├─ Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   └─ Verify token:

5. TOKEN VERIFICATION
   ├─ Decode token using secret key
   ├─ Check signature is valid
   ├─ Check expiration date
   │  ├─ If valid: ✓ Continue
   │  └─ If expired: ✗ Return 401
   └─ Extract userId from token

6. PROCESS REQUEST
   ├─ Get userId from decoded token
   ├─ Fetch posts for that user from database
   └─ Return posts to Flutter

7. FLUTTER RECEIVES RESPONSE
   ├─ Status: 200 OK
   ├─ Body: [ { id, title, content, date }, ... ]
   └─ Update UI with posts
```

### Authenticated Request Example

**Flutter sends:**

```
GET /api/posts HTTP/1.1
Host: your-backend.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWY3ZDU4YjkwZTQ2YzAwMWE2YzJhMTIiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE2NDMyNzg0MDAsImV4cCI6MTY0Mzg4MzIwMH0.signature
Content-Type: application/json
```

**Backend responds (Token valid):**

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": [
    {
      "id": "post_001",
      "title": "My First Post",
      "content": "This is amazing!",
      "createdAt": "2024-03-15T10:30:00Z"
    },
    {
      "id": "post_002",
      "title": "Second Post",
      "content": "Another great post!",
      "createdAt": "2024-03-16T15:45:00Z"
    }
  ]
}
```

**Backend responds (Token missing/invalid):**

```json
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "success": false,
  "message": "No token provided or token is invalid",
  "error": "UNAUTHORIZED"
}
```

### Creating HTTP Client Helper in Flutter

```
HTTP REQUEST HELPER PATTERN
═══════════════════════════════════════════════════════════════

class ApiClient {

  // Private method to add auth header to all requests
  Future<Map<String, String>> _getHeaders() async {
    final token = await _getStoredToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  // GET request with auth
  Future<dynamic> get(String endpoint) async {
    final headers = await _getHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl$endpoint'),
      headers: headers,
    );
    return _handleResponse(response);
  }

  // POST request with auth
  Future<dynamic> post(String endpoint, dynamic body) async {
    final headers = await _getHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: headers,
      body: jsonEncode(body),
    );
    return _handleResponse(response);
  }

  // Handle response and errors
  dynamic _handleResponse(http.Response response) {
    if (response.statusCode == 401) {
      // Token expired or invalid - redirect to login
      _handleUnauthorized();
    }
    return jsonDecode(response.body);
  }
}
```

---

## Logout Flow

### Step-by-Step Process

```
USER LOGOUT FLOW
═══════════════════════════════════════════════════════════════

1. USER ACTION
   └─ User taps "Logout" button in settings/menu

2. FLUTTER APP
   ├─ Call logout() from auth_controller.dart
   └─ Steps:
      ├─ Delete stored token from SharedPreferences
      ├─ Delete stored user data
      ├─ Clear app state (isAuthenticated = false)
      ├─ Optional: Notify backend of logout
      └─ Navigate to Login screen

3. OPTIONAL: NOTIFY BACKEND
   ├─ Send POST request to /api/auth/logout
   ├─ Include token in header
   ├─ Backend can log the logout event
   └─ Backend returns success confirmation

4. FLUTTER COMPLETES
   ├─ All auth data cleared from device
   └─ User sees login screen

5. USER IS NOW LOGGED OUT
   └─ Any API request without token will be rejected
   └─ User must login again to use app
```

### Logout Code Flow

```
LOGOUT CODE EXECUTION
═══════════════════════════════════════════════════════════════

User taps Logout
         │
         ▼
authController.logout()
         │
         ├─ SharedPreferences.getInstance()
         │  └─ remove('auth_token')
         │  └─ remove('user_data')
         │
         ├─ State management update
         │  └─ isAuthenticated = false
         │  └─ currentUser = null
         │
         ├─ Optional: HTTP POST /api/auth/logout
         │  └─ (for server-side logging)
         │
         ├─ Navigation
         │  └─ Navigator.pushReplacementNamed('/login')
         │
         └─ Login screen displayed
```

---

## Error Handling

### Common Authentication Errors

```
ERROR HANDLING MATRIX
═══════════════════════════════════════════════════════════════

┌─────────┬─────────────────────────┬──────────────┬────────────────────┐
│ Status  │ Error Scenario          │ Error Code   │ App Action         │
├─────────┼─────────────────────────┼──────────────┼────────────────────┤
│ 400     │ Missing email/password   │ INVALID_INPUT│ Show validation msg │
│         │ Invalid email format     │              │ Let user retry      │
├─────────┼─────────────────────────┼──────────────┼────────────────────┤
│ 401     │ Wrong password           │ INVALID_CRED │ Show error msg      │
│         │ Email not found          │              │ Let user retry      │
│         │ Token expired            │ TOKEN_EXP    │ Redirect to login   │
│         │ Token invalid/missing    │ UNAUTHORIZED │ Redirect to login   │
├─────────┼─────────────────────────┼──────────────┼────────────────────┤
│ 409     │ Email already exists     │ EMAIL_EXISTS │ Suggest login/      │
│         │ (during signup)          │              │ password reset      │
├─────────┼─────────────────────────┼──────────────┼────────────────────┤
│ 429     │ Too many login attempts  │ RATE_LIMITED │ Show wait timer     │
│         │                          │              │ Lock form temporarily
├─────────┼─────────────────────────┼──────────────┼────────────────────┤
│ 500     │ Server error             │ SERVER_ERROR │ Show generic error  │
│         │ Database error           │              │ Suggest retry later │
├─────────┼─────────────────────────┼──────────────┼────────────────────┤
│ 0       │ Network error            │ NETWORK_ERR  │ Show connection msg │
│         │ No internet              │              │ Allow offline mode  │
└─────────┴─────────────────────────┴──────────────┴────────────────────┘
```

### Error Response Examples

**Missing credentials:**

```json
{
  "success": false,
  "message": "Email and password are required",
  "error": "INVALID_INPUT",
  "field": "email" // or "password"
}
```

**Wrong password:**

```json
{
  "success": false,
  "message": "Invalid email or password",
  "error": "INVALID_CREDENTIALS"
}
```

**Token expired:**

```json
{
  "success": false,
  "message": "Token has expired. Please login again.",
  "error": "TOKEN_EXPIRED"
}
```

**Network error (handled in Flutter):**

```
Exception: Failed host lookup: 'your-backend.com'
App should catch this and show: "No internet connection"
```

---

## Security Considerations

### Best Practices Checklist

```
SECURITY CHECKLIST
═══════════════════════════════════════════════════════════════

✓ HTTPS/SSL ONLY
  ├─ Always use HTTPS (never HTTP)
  └─ Prevents token interception over network

✓ PASSWORD HASHING
  ├─ Use bcrypt with salt rounds ≥ 10
  ├─ Never store plain text passwords
  └─ Hash on backend, not frontend

✓ TOKEN SECURITY
  ├─ Use strong secret key (32+ characters)
  ├─ Set reasonable expiration (7-30 days)
  ├─ Never log tokens in console/logs
  └─ Sign with HS256 or RS256 algorithm

✓ STORAGE SECURITY (Flutter)
  ├─ Use FlutterSecureStorage, not SharedPreferences for tokens
  ├─ Encrypt tokens on device
  ├─ Don't store sensitive data in plain text
  └─ Use platform-native encryption (Keystore on Android, Keychain on iOS)

✓ REQUEST VALIDATION (Backend)
  ├─ Validate all input on backend (don't trust client)
  ├─ Check email format, password strength
  ├─ Verify token signature on every request
  ├─ Check token expiration
  └─ Rate limit login attempts (max 5 per IP per hour)

✓ RESPONSE SECURITY
  ├─ Never return plain text passwords in responses
  ├─ Don't log sensitive data
  ├─ Use generic error messages (not "email doesn't exist")
  └─ Include proper CORS headers

✓ SESSION MANAGEMENT
  ├─ Invalidate token on logout
  ├─ Implement refresh token rotation (advanced)
  ├─ Track active sessions on backend (optional)
  └─ Force logout on password change

✓ INFRASTRUCTURE
  ├─ Use environment variables for secrets (not hardcoded)
  ├─ Enable CORS only for your app domain
  ├─ Use API rate limiting (prevent brute force)
  ├─ Log authentication events for audit trail
  └─ Regular security updates and patches
```

### Token Secret Storage (Backend)

```
NODE.JS SECRET MANAGEMENT
═══════════════════════════════════════════════════════════════

❌ WRONG: Hardcoded in code
  const SECRET = "my-secret-key-12345";

✓ RIGHT: Environment variable
  const SECRET = process.env.JWT_SECRET;

.env file:
  JWT_SECRET=your-very-long-secret-key-min-32-characters-abc123...
  NODE_ENV=production
  DATABASE_URL=mongodb+srv://...
```

### Rate Limiting on Login

```
RATE LIMITING EXAMPLE
═══════════════════════════════════════════════════════════════

Login attempts tracked by:
  ├─ IP address (for unauthorized users)
  └─ Email address (once email is identified)

Limits:
  ├─ Max 5 failed attempts per IP per hour
  ├─ Max 3 login attempts per email per 15 minutes
  └─ Temporary lock: 15 minutes after threshold

Response after limit:
  {
    "success": false,
    "message": "Too many login attempts. Please try again in 15 minutes.",
    "error": "RATE_LIMITED",
    "retryAfter": 900 // seconds
  }
```

---

## Complete Request/Response Cycle Summary

```
COMPLETE AUTH CYCLE
═══════════════════════════════════════════════════════════════

TIME    | FLUTTER APP              | NODE.JS BACKEND          | STORAGE
────────┼──────────────────────────┼──────────────────────────┼──────────────
  T0    | User taps "Login"        |                          |
        | Shows login form         |                          |
────────┼──────────────────────────┼──────────────────────────┼──────────────
  T1    | User enters credentials  |                          |
  T2    | User taps "Login" button  |                          |
  T3    | Validates input locally   |                          |
  T4    | POST to /api/auth/login   | ───────────────────>     |
        | { email, password }      |                          |
────────┼──────────────────────────┼──────────────────────────┼──────────────
  T5    |                          | Receives request         |
  T6    |                          | Finds user by email      |
  T7    |                          | Compares password hash   |
  T8    |                          | Creates JWT token        |
  T9    |                          | Returns response         |
────────┼──────────────────────────┼──────────────────────────┼──────────────
  T10   | Receives response        | <──────────────────      |
        | { token, user }          |                          |
  T11   | Extracts token           |                          |
  T12   | Stores token locally     |                          | ✓ SharedPrefs
  T13   | Updates app state        |                          |
  T14   | Navigates to Home        |                          |
────────┼──────────────────────────┼──────────────────────────┼──────────────
  T15   | [User using app]         |                          |
  T16   | GET /api/posts           | ───────────────────>     |
        | Header: Authorization:   |                          |
        | Bearer eyJhb...          |                          |
────────┼──────────────────────────┼──────────────────────────┼──────────────
  T17   |                          | Receives request         |
  T18   |                          | Extracts token from header
  T19   |                          | Verifies token signature |
  T20   |                          | Checks expiration        |
  T21   |                          | Extracts userId          |
  T22   |                          | Fetches user's posts     |
  T23   |                          | Returns posts            |
────────┼──────────────────────────┼──────────────────────────┼──────────────
  T24   | Receives posts response  | <──────────────────      |
  T25   | Updates UI with posts    |                          |
────────┼──────────────────────────┼──────────────────────────┼──────────────
  T26   | User taps "Logout"       |                          |
  T27   | Calls logout()           |                          |
  T28   | Deletes stored token     |                          | ✗ Deleted
  T29   | Clears app state         |                          |
  T30   | Navigates to Login       |                          |
────────┴──────────────────────────┴──────────────────────────┴──────────────
```

---


---

## Next Steps

1. **Implement auth_controller.dart** with login, signup, logout, token management
2. **Create HTTP client helper** to automatically attach token to requests
3. **Build UI screens** for login and signup
4. **Implement error handling** for common scenarios
5. **Test complete flow** from signup → login → authenticated request → logout
6. **Add refresh token logic** (advanced)
7. **Implement biometric authentication** (optional)

---

_This document provides the complete authentication flow between Node.js backend and Flutter app. Reference it while building auth_controller.dart and HTTP helpers._
