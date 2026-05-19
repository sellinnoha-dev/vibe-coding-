# 📧 EmailJS Configuration Guide

Your contact form now sends **real emails** using EmailJS! Follow these steps to set it up:

## Step 1: Create EmailJS Account

1. Go to **https://emailjs.com/**
2. Click **"Sign Up For Free"**
3. Create your account (Gmail, GitHub, or email)

## Step 2: Get Your Credentials

1. In EmailJS Dashboard, go to **Account** (left sidebar)
2. Copy your **Public Key** (you'll need this)
3. Go to **Email Services** 
4. Click **"Add New Service"**
5. Choose **Gmail** (or your email provider)
6. Connect your email account
7. Copy the **Service ID**

## Step 3: Create Email Template

1. In EmailJS, go to **Email Templates**
2. Click **"Create New Template"**
3. Use this template name: `contact_form` 
4. Copy the **Template ID**

Template content example:
```
From: {{from_name}} ({{from_email}})
Subject: {{subject}}

Message:
{{message}}
```

## Step 4: Update .env.local

Edit `.env.local` in your project root:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=public_key_xxx
```

Replace `xxx` with your actual credentials from EmailJS.

## Step 5: Test It!

1. Restart your Next.js server (`npm run dev`)
2. Go to the **Contact** section
3. Fill in the form and click **"Send Message"**
4. You should receive an email within seconds!

## Important Notes

⚠️ **Credentials in .env.local:**
- `.env.local` is gitignored (not pushed to GitHub)
- Safe to use on Replit/any deployment

⚠️ **Rate Limiting:**
- EmailJS free plan has limits (check your usage)
- Upgrade to paid plan if needed

⚠️ **Public Keys:**
- `NEXT_PUBLIC_` prefix means it's visible in browser (that's OK!)
- Never expose your *Service ID* or email address

## Troubleshooting

**"EmailJS is not defined"?**
- Make sure variables are prefixed with `NEXT_PUBLIC_`
- Restart your dev server after updating `.env.local`

**Emails not sending?**
- Check EmailJS dashboard for error logs
- Verify Service ID and Template ID are correct
- Make sure email service is connected

**Getting rate limited?**
- Upgrade to EmailJS Pro
- Or implement server-side email service

## Free Alternative: Use a Backend Service

If you don't want to use EmailJS:
1. Integrate **Resend**, **SendGrid**, or **Mailgun**
2. Modify `/lib/email.ts` to use their API
3. Keep credentials in backend only (more secure)

---

**Questions?** Check EmailJS docs: https://www.emailjs.com/docs/
