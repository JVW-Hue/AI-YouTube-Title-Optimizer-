# 🚀 Quick Deployment Guide

## Step 1: Setup Supabase Database (Backend)

1. Go to your Supabase project: https://supabase.com/dashboard/project/atteoqsnqvgkucrjfazv

2. Click on **SQL Editor** in the left sidebar

3. Copy and paste the contents of `supabase/schema.sql` and click **Run**

4. Then copy and paste the contents of `supabase/functions.sql` and click **Run**

5. Go to **Authentication** → **Providers** and enable:
   - Email (already enabled)
   - Google OAuth (optional)

✅ Backend is now ready!

## Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign in with GitHub

2. Click **"Add New Project"**

3. Import your repository: `JVW-Hue/AI-YouTube-Title-Optimizer-`

4. Configure your project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. Add Environment Variables (click "Environment Variables"):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://atteoqsnqvgkucrjfazv.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0dGVvcXNucXZna3VjcmpmYXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4Nzg1NjksImV4cCI6MjA4MDQ1NDU2OX0.R2Gvpli6nTPXr1iCPQMGNdtT1VIBNtv30rn8Aj3-12k
   OPENAI_API_KEY=demo-key
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

6. Click **"Deploy"**

7. Wait 2-3 minutes for deployment to complete

8. Your app will be live at: `https://your-app-name.vercel.app`

## Step 3: Update App URL

After deployment, update the `NEXT_PUBLIC_APP_URL` in Vercel:
1. Go to your project settings
2. Environment Variables
3. Update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL
4. Redeploy

## 🎉 Done!

Your app is now live with:
- ✅ Backend running on Supabase
- ✅ Frontend deployed on Vercel via GitHub
- ✅ Automatic deployments on every git push

## Optional: Add Custom Domain

1. In Vercel, go to your project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable
