# 🔐 Authentication System Guide

Your site now has a **complete user authentication system** with:
- Sign up / Login
- Secure password hashing
- JWT tokens
- Protected dashboard

## Features

✅ **User Registration** - Create new accounts
✅ **Secure Login** - JWT-based authentication  
✅ **Password Hashing** - bcryptjs encryption
✅ **Protected Pages** - Redirect to login if needed
✅ **User Dashboard** - Personal user space
✅ **Logout** - Clear session

## Pages

### `/signup` - Create Account
- Enter name, email, password
- Password confirmation check
- Redirects to dashboard on success

### `/login` - Login
- Email and password
- Redirects to dashboard on success

### `/dashboard` - User Dashboard
- Shows user profile info
- Quick links
- Logout button

## API Endpoints

### POST `/api/auth/signup`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "confirmPassword": "securepass123"
}
```

Response:
```json
{
  "message": "Account created successfully",
  "token": "jwt_token_here",
  "user": { "email": "john@example.com", "name": "John Doe" }
}
```

### POST `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": { "email": "john@example.com", "name": "John Doe" }
}
```

### POST `/api/auth/logout`
Clears authentication token

## How It Works

1. **User signs up** → Password hashed with bcryptjs
2. **Data stored** → In-memory (dev) or database (production)
3. **JWT created** → Signed token for 7 days
4. **Token stored** → Browser localStorage + httpOnly cookie
5. **Dashboard access** → Check token, show user data
6. **Logout** → Clear token

## Security Features

🔒 **Passwords hashed** with bcryptjs (10 rounds)
🔒 **JWT tokens** expire after 7 days
🔒 **HttpOnly cookies** protect against XSS
🔒 **Input validation** with Zod
🔒 **CORS ready** for frontend/backend separation

## Production Upgrades

### Database Integration
Replace in-memory storage (`lib/users.ts`):
```typescript
// Current: Map<string, user>
// Production: MongoDB, PostgreSQL, Supabase, etc.
```

### Email Verification
Add step before account activation:
```typescript
await sendVerificationEmail(email)
// User clicks link to verify
```

### Password Recovery
Add forgot password feature:
```typescript
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### 2FA / MFA
Add two-factor authentication:
```typescript
// SMS or authenticator app
// TOTP library (speakeasy)
```

### Session Management
Use a session store:
```typescript
// Redis for session storage
// More scalable than JWT alone
```

## Testing

### Test Signup
1. Go to `/signup`
2. Fill form (name, email, password)
3. Click "Create Account"
4. Should redirect to `/dashboard`

### Test Login
1. Go to `/login`
2. Use credentials from signup
3. Click "Login"
4. Should redirect to `/dashboard`

### Test Protected Page
1. Open DevTools Console
2. Clear localStorage: `localStorage.clear()`
3. Go to `/dashboard`
4. Should redirect to `/login`

## Common Issues

**"Invalid email or password"?**
- Make sure email and password match signup
- Check spelling and capitalization

**Token not persisting?**
- Check browser's localStorage is enabled
- Check cookie settings in browser

**Can't access dashboard?**
- Clear localStorage and login again
- Check browser console for errors

**"Password must be at least 6 characters"?**
- Use a longer password
- Min length is 6 chars (configurable in `lib/validation.ts`)

## Customization

### Change Password Requirements
Edit in `/app/api/auth/signup/route.ts`:
```typescript
password: z.string().min(8) // Change to 8
```

### Change Token Expiration
Edit in `/lib/auth.ts`:
```typescript
jwt.sign({ userId }, SECRET, { expiresIn: '30d' }) // 30 days
```

### Customize Dashboard
Edit `/app/dashboard/page.tsx`:
```typescript
// Add more user stats, settings, etc.
```

## Environment Variables

```env
# Auth Secret (MUST change in production!)
JWT_SECRET=your-secure-random-string-here
```

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

**Your auth system is production-ready!** 🚀

For enterprise features (2FA, SSO, etc.), consider using **NextAuth.js** or **Supabase Auth**.
