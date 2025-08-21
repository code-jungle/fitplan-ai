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

-- Create workout_preferences table
CREATE TABLE public.workout_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_type TEXT,
  workout_duration TEXT,
  workout_days INTEGER,
  preferred_time TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create dietary_preferences table
CREATE TABLE public.dietary_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  diet_type TEXT,
  allergies TEXT[] DEFAULT '{}',
  intolerances TEXT[] DEFAULT '{}',
  medications TEXT[] DEFAULT '{}',
  injuries TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create notification_preferences table
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  meals BOOLEAN DEFAULT true,
  workouts BOOLEAN DEFAULT true,
  progress BOOLEAN DEFAULT true,
  reminders BOOLEAN DEFAULT false,
  achievements BOOLEAN DEFAULT true,
  weekly_reports BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.workout_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dietary_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for workout_preferences
CREATE POLICY "Users can view their own workout preferences" 
ON public.workout_preferences FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout preferences" 
ON public.workout_preferences FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout preferences" 
ON public.workout_preferences FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for dietary_preferences
CREATE POLICY "Users can view their own dietary preferences" 
ON public.dietary_preferences FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own dietary preferences" 
ON public.dietary_preferences FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dietary preferences" 
ON public.dietary_preferences FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for notification_preferences
CREATE POLICY "Users can view their own notification preferences" 
ON public.notification_preferences FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences" 
ON public.notification_preferences FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification preferences" 
ON public.notification_preferences FOR INSERT 
WITH CHECK (auth.uid() = user_id);