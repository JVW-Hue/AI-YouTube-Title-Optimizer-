# 🚀 Complete Setup Guide - AI YouTube Title Optimizer

This guide will walk you through setting up the entire application from scratch.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git
- A code editor (VS Code recommended)

## 🔧 Step-by-Step Setup

### 1. Project Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-youtube-title-optimizer

# Install dependencies
npm install
```

### 2. Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose organization and enter project details
   - Wait for project to be created

2. **Get Supabase Credentials**
   - Go to Settings > API
   - Copy the Project URL and anon public key
   - Copy the service_role secret key

3. **Set up Database**
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste the entire content from `supabase/schema.sql`
   - Click "Run" to execute the SQL

4. **Configure Authentication**
   - Go to Authentication > Settings
   - Enable Google provider
   - Add your domain to allowed origins
   - Configure redirect URLs:
     - `http://localhost:3000/auth/callback` (development)
     - `https://yourdomain.com/auth/callback` (production)

### 3. OpenAI Setup

1. **Get API Key**
   - Go to [platform.openai.com](https://platform.openai.com)
   - Sign up or log in
   - Go to API Keys section
   - Create a new secret key
   - Copy the key (you won't see it again!)

2. **Set up Billing**
   - Add payment method to your OpenAI account
   - Set usage limits if desired
   - Ensure you have access to GPT-4 (may require payment)

### 4. Stripe Setup

1. **Create Stripe Account**
   - Go to [stripe.com](https://stripe.com)
   - Sign up for an account
   - Complete account verification

2. **Get API Keys**
   - Go to Developers > API Keys
   - Copy Publishable key and Secret key
   - Use test keys for development

3. **Create Products**
   
   **Pro Plan:**
   ```
   Name: Pro Plan
   Price: $9.00 USD
   Billing: Monthly
   Product ID: pro
   ```
   
   **Creator Plan:**
   ```
   Name: Creator Plan
   Price: $19.00 USD
   Billing: Monthly
   Product ID: creator
   ```

4. **Set up Webhooks**
   - Go to Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

### 5. Environment Variables

Create `.env.local` file in the root directory:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=sk-your_openai_key

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Google OAuth Setup

1. **Create Google Cloud Project**
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Go to APIs & Services > Library
   - Search for "Google+ API"
   - Enable it

3. **Create OAuth Credentials**
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `https://your-project.supabase.co/auth/v1/callback`

4. **Configure in Supabase**
   - Go to Authentication > Settings > Auth Providers
   - Enable Google
   - Add your Client ID and Client Secret

### 7. Test the Setup

```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
```

**Test checklist:**
- [ ] Landing page loads correctly
- [ ] Google sign-in works
- [ ] Dashboard loads after login
- [ ] Title generation works
- [ ] Saving titles works
- [ ] Billing page loads

### 8. Production Deployment

#### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

3. **Update Environment Variables**
   - Update `NEXT_PUBLIC_APP_URL` to your production domain
   - Update Stripe webhook URL
   - Update Google OAuth redirect URLs
   - Update Supabase auth settings

#### Alternative: Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `.next` folder
   - Or connect your GitHub repository
   - Add environment variables
   - Configure redirects for SPA

### 9. Post-Deployment Setup

1. **Update Stripe Webhooks**
   - Change webhook URL to production domain
   - Test webhook delivery

2. **Update Supabase Settings**
   - Add production domain to allowed origins
   - Update redirect URLs

3. **Test Production**
   - Test user registration
   - Test payment flow
   - Test all features

## 🔍 Troubleshooting

### Common Issues

**1. Supabase Connection Error**
```
Error: Invalid API key
```
- Check your Supabase URL and keys
- Ensure RLS policies are set up correctly

**2. OpenAI API Error**
```
Error: Insufficient quota
```
- Check your OpenAI billing
- Ensure you have credits available

**3. Stripe Webhook Error**
```
Error: No signatures found matching the expected signature
```
- Check your webhook secret
- Ensure webhook URL is correct

**4. Authentication Error**
```
Error: OAuth provider not configured
```
- Check Google OAuth setup
- Verify redirect URLs

### Debug Mode

Enable debug logging by adding to `.env.local`:
```bash
DEBUG=true
NODE_ENV=development
```

### Database Issues

If you need to reset the database:
```sql
-- Run in Supabase SQL editor
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Then run schema.sql again
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs in your deployment platform
3. Check Supabase logs
4. Verify all environment variables
5. Test API endpoints individually

## 🎉 You're Ready!

Once everything is set up, you should have:
- ✅ A fully functional AI title generator
- ✅ User authentication with Google
- ✅ Subscription management with Stripe
- ✅ Database with proper security
- ✅ Production-ready deployment

Time to start generating those viral YouTube titles! 🚀