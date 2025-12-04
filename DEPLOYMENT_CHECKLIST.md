# ✅ Deployment Checklist

## Backend Setup (Supabase) - 5 minutes

### Step 1: Setup Database
- [ ] Go to https://supabase.com/dashboard/project/atteoqsnqvgkucrjfazv
- [ ] Click **SQL Editor** in sidebar
- [ ] Open `SUPABASE_SETUP.sql` from your project
- [ ] Copy ALL the SQL code
- [ ] Paste into Supabase SQL Editor
- [ ] Click **RUN** button
- [ ] Wait for "Success" message

### Step 2: Enable Authentication (Optional)
- [ ] Go to **Authentication** → **Providers**
- [ ] Enable **Email** (should be on by default)
- [ ] Optional: Enable **Google OAuth** for social login

✅ **Backend Complete!** Your database is ready.

---

## Frontend Deployment (Vercel) - 10 minutes

### Step 1: Connect to Vercel
- [ ] Go to https://vercel.com
- [ ] Click **Sign Up** or **Log In** with GitHub
- [ ] Authorize Vercel to access your GitHub

### Step 2: Import Project
- [ ] Click **"Add New..."** → **"Project"**
- [ ] Find `JVW-Hue/AI-YouTube-Title-Optimizer-`
- [ ] Click **Import**

### Step 3: Configure Project
- [ ] Framework Preset: **Next.js** (auto-detected)
- [ ] Root Directory: `./` (leave as default)
- [ ] Build Command: `npm run build` (auto-filled)
- [ ] Output Directory: `.next` (auto-filled)

### Step 4: Add Environment Variables
Click **"Environment Variables"** and add these:

```
NEXT_PUBLIC_SUPABASE_URL
https://atteoqsnqvgkucrjfazv.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0dGVvcXNucXZna3VjcmpmYXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4Nzg1NjksImV4cCI6MjA4MDQ1NDU2OX0.R2Gvpli6nTPXr1iCPQMGNdtT1VIBNtv30rn8Aj3-12k

OPENAI_API_KEY
demo-key

NODE_ENV
production
```

### Step 5: Deploy
- [ ] Click **"Deploy"** button
- [ ] Wait 2-3 minutes for build to complete
- [ ] Click on the deployment URL when ready

### Step 6: Update App URL
- [ ] Copy your Vercel URL (e.g., `https://your-app.vercel.app`)
- [ ] Go to **Settings** → **Environment Variables**
- [ ] Add new variable:
  ```
  NEXT_PUBLIC_APP_URL
  https://your-actual-vercel-url.vercel.app
  ```
- [ ] Go to **Deployments** tab
- [ ] Click **"Redeploy"** on latest deployment

✅ **Frontend Complete!** Your app is live!

---

## 🎉 You're Done!

Your app is now running:
- **Backend**: Supabase (Database + Auth)
- **Frontend**: Vercel (Auto-deploys from GitHub)

### Your Live App URL:
`https://your-app-name.vercel.app`

### What Works Now:
✅ User authentication (email signup/login)
✅ Title generation (with demo AI)
✅ Save favorite titles
✅ Credit system (5 free titles/day)
✅ Responsive design

### Next Steps (Optional):
- Add real OpenAI API key for better titles
- Add Stripe for payments
- Add custom domain
- Enable Google OAuth

---

## 🔄 Auto-Deployment

Every time you push to GitHub, Vercel automatically:
1. Pulls latest code
2. Builds the app
3. Deploys to production

No manual deployment needed! 🚀
