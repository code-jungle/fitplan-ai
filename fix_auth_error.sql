-- Fix for "Database error saving new user" during signup
-- Execute this in your Supabase SQL Editor

-- 1. Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.initialize_free_trial();

-- 2. Fix RLS policies for subscribers table
DROP POLICY IF EXISTS "Edge functions can manage subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Allow trial initialization" ON public.subscribers;

-- 3. Create proper RLS policies
CREATE POLICY "Users can view their own subscription" 
ON public.subscribers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Allow system functions to manage subscriptions" 
ON public.subscribers FOR ALL 
USING (true);

-- 4. Recreate the function with proper security context
CREATE OR REPLACE FUNCTION public.initialize_free_trial()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.subscribers (
    user_id,
    email,
    subscribed,
    subscription_tier,
    trial_started_at,
    trial_ends_at
  ) VALUES (
    NEW.id,
    NEW.email,
    true,
    'free_trial',
    now(),
    now() + interval '15 days'
  );
  
  RETURN NEW;
END;
$function$;

-- 5. Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.initialize_free_trial();

-- 6. Verify the fix
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 7. Test the function (optional)
-- SELECT public.initialize_free_trial();
