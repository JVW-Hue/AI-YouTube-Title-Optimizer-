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
