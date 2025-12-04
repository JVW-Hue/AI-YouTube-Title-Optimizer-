# 🚀 ONE-CLICK DEPLOY

## Click this button to deploy your app NOW:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/JVW-Hue/AI-YouTube-Title-Optimizer-&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,OPENAI_API_KEY,NODE_ENV&envDescription=Required%20environment%20variables&envLink=https://github.com/JVW-Hue/AI-YouTube-Title-Optimizer-/blob/master/DEPLOYMENT_CHECKLIST.md)

## OR Manual Deploy (5 minutes):

### 1. Go to Vercel
👉 https://vercel.com/new

### 2. Sign in with GitHub
- Click "Continue with GitHub"
- Authorize Vercel

### 3. Import Your Repository
- Search for: `AI-YouTube-Title-Optimizer-`
- Click "Import"

### 4. Add Environment Variables
Copy and paste these exactly:

**Variable 1:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://atteoqsnqvgkucrjfazv.supabase.co
```

**Variable 2:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0dGVvcXNucXZna3VjcmpmYXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4Nzg1NjksImV4cCI6MjA4MDQ1NDU2OX0.R2Gvpli6nTPXr1iCPQMGNdtT1VIBNtv30rn8Aj3-12k
```

**Variable 3:**
```
Name: OPENAI_API_KEY
Value: demo-key
```

**Variable 4:**
```
Name: NODE_ENV
Value: production
```

### 5. Click "Deploy"
Wait 2-3 minutes. Your app will be LIVE!

---

## ⚠️ IMPORTANT: Setup Database First

Before your app works, you MUST setup the database:

1. Go to: https://supabase.com/dashboard/project/atteoqsnqvgkucrjfazv/sql/new
2. Copy ALL code from `SUPABASE_SETUP.sql` file
3. Paste into SQL Editor
4. Click "RUN"
5. Wait for "Success" ✅

---

## 🎉 Done!

Your app will be live at: `https://your-app-name.vercel.app`

GitHub = Code Storage 📦
Vercel = Live Website 🌐
Supabase = Database 🗄️
