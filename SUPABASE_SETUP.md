# 🗄️ Supabase Database Setup - Real Authentication

Your authentication system now uses a **real database** with Supabase!

Users and passwords are now **permanently stored** and **securely encrypted**.

## What is Supabase?

Supabase is a **free Firebase alternative**:
- ✅ Real database (PostgreSQL)
- ✅ Built-in authentication
- ✅ Real-time updates
- ✅ Free tier (perfect for s/projects)
- ✅ No credit card needed

## Step 1: Create Supabase Account

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub or email
4. Confirm your email

## Step 2: Create New Project

1. Click **"New Project"**
2. Name it: `vibe-pro`
3. Create a secure password
4. Select region closest to you
5. Click **"Create new project"** (wait 2-3 min)

## Step 3: Get Your Credentials

1. Go to **Settings → API** (left sidebar)
2. Copy these:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon (public)** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role (secret)** → `SUPABASE_SERVICE_ROLE_KEY`

## Step 4: Create Database Tables

In Supabase, go to **SQL Editor** and run this:

```sql
-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON public.users(email);

-- Enable RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

## Step 5: Update .env.local

Add to your `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Replace with your actual credentials from Supabase.

## Step 6: Restart Development Server

In Replit:
1. Stop server (Ctrl+C)
2. Run `npm install` (first time only)
3. Run `npm run dev`

## How It Works

### User Signs Up
1. User enters email and password
2. Password is **hashed with bcryptjs**
3. Data stored in Supabase database
4. User is logged in

### User Logs In
1. User enters email and password
2. System checks Supabase database
3. Compares password with stored hash
4. JWT token created if valid
5. User redirected to dashboard

### Password Recovery
- Passwords are **one-way hashed** (can't be read)
- Users must reset password if forgotten
- Reset emails sent to registered email

## Testing It

1. Go to `/signup`
2. Create account (use real email)
3. Go to Supabase → **Table Editor**
4. Click `users` table
5. You should see your account! ✅

## Important Notes

🔒 **Security:**
- Passwords are never stored in plain text
- Hashed with bcryptjs (10 rounds)
- JWT tokens expire after 7 days
- All data encrypted in transit (HTTPS)

⚠️ **Never share:**
- `SUPABASE_SERVICE_ROLE_KEY` (secret!)
- Put only in `.env.local` (never in GitHub)

🚀 **Performance:**
- Supabase handles scaling
- Database queries are optimized
- Real-time updates available
- Backups automatic

## Production Upgrades

### Enable Email Verification
1. In Supabase, go to **Authentication**
2. Enable **Email Confirmations**
3. Users must verify email before login

### Set Up Password Reset
1. Enable **Password Reset** in Auth settings
2. Users can reset forgotten passwords
3. Emails sent to registered address

### Add 2FA (Two-Factor Authentication)
1. Enable **MFA** in Supabase Auth
2. Users can add authenticator app
3. Enhanced security for accounts

### Monitor Activity
- Supabase shows all signups
- See login history
- Monitor for suspicious activity

## Troubleshooting

**"Error: env variables not found"?**
- Make sure you added all 3 Supabase keys to `.env.local`
- Restart dev server after adding `.env.local`
- Check spelling of variable names

**"Database connection failed"?**
- Verify Supabase project is running
- Check Supabase URL is correct
- Ensure keys are not expired
- Check internet connection

**"User already exists"?**
- Try logging in instead
- Or use different email
- Reset password if forgotten

**Can't see data in Supabase?**
- Go to Table Editor
- Click `users` table
- Data should appear there
- Refresh page if needed

## Free Tier Limits

Supabase free tier includes:
- ✅ 500MB database
- ✅ 2GB bandwidth/month
- ✅ Unlimited API requests
- ✅ 50k realtime connections
- ✅ 100 projects

**Plenty for learning and small projects!**

## Upgrade When Needed

As your project grows:
- **Pro Plan** ($25/month) - More storage, priority support
- **Enterprise** - Custom scaling, dedicated support

No hidden charges. Pay only for what you use.

## Next Steps

1. ✅ Set up Supabase account
2. ✅ Create database and tables
3. ✅ Add credentials to `.env.local`
4. ✅ Restart server
5. ✅ Test signup/login

**Your real database is ready!** 🚀

---

Questions? Check Supabase docs: https://supabase.com/docs
