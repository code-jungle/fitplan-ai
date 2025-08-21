-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing function if exists
DROP FUNCTION IF EXISTS public.initialize_free_trial();

-- Recreate the function with proper security context
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

-- Recreate the trigger to initialize trial on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.initialize_free_trial();