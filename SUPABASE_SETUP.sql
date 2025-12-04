-- ============================================
-- JVW AI YouTube Title Optimizer
-- Supabase Database Setup Script
-- ============================================
-- Run this entire script in your Supabase SQL Editor
-- Project: https://supabase.com/dashboard/project/atteoqsnqvgkucrjfazv
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'creator', 'agency')),
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  subscription_id TEXT,
  credits_used INTEGER DEFAULT 0 NOT NULL,
  credits_limit INTEGER DEFAULT 5 NOT NULL,
  credits_reset_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT credits_non_negative CHECK (credits_used >= 0),
  CONSTRAINT credits_limit_positive CHECK (credits_limit > 0)
);

-- Title generations table
CREATE TABLE public.title_generations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  input_topic TEXT NOT NULL,
  generated_titles JSONB NOT NULL,
  thumbnail_texts JSONB,
  style_preferences JSONB,
  ctr_scores JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved titles table
CREATE TABLE public.saved_titles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  thumbnail_text TEXT,
  topic TEXT,
  style TEXT,
  ctr_score INTEGER,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage analytics table
CREATE TABLE public.usage_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.title_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own generations" ON public.title_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations" ON public.title_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own saved titles" ON public.saved_titles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own analytics" ON public.usage_analytics
  FOR ALL USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, credits_used, credits_limit)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    0,
    5
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset monthly credits
CREATE OR REPLACE FUNCTION public.reset_monthly_credits()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET 
    credits_used = 0,
    credits_reset_date = NOW() + INTERVAL '1 month',
    updated_at = NOW()
  WHERE 
    plan IN ('pro', 'creator', 'agency')
    AND (credits_reset_date IS NULL OR credits_reset_date <= NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic credit increment function to prevent race conditions
CREATE OR REPLACE FUNCTION public.increment_user_credits(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET credits_used = credits_used + 1
  WHERE id = user_id AND credits_used < credits_limit;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Credit limit reached or user not found';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user credit info
CREATE OR REPLACE FUNCTION public.get_user_credits(user_id UUID)
RETURNS TABLE(credits_used INTEGER, credits_limit INTEGER, credits_remaining INTEGER, plan TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.credits_used,
    p.credits_limit,
    (p.credits_limit - p.credits_used) AS credits_remaining,
    p.plan
  FROM public.profiles p
  WHERE p.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update plan and credits
CREATE OR REPLACE FUNCTION public.update_user_plan(
  user_id UUID,
  new_plan TEXT,
  new_limit INTEGER
)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET 
    plan = new_plan,
    credits_limit = new_limit,
    credits_used = 0,
    credits_reset_date = NOW() + INTERVAL '1 month'
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Index for faster credit queries
CREATE INDEX idx_profiles_credits ON public.profiles(id, credits_used, credits_limit);
CREATE INDEX idx_profiles_plan ON public.profiles(plan, subscription_status);

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- Setup Complete! 
-- Next: Deploy frontend to Vercel
-- See DEPLOY_NOW.md for instructions
-- ============================================
