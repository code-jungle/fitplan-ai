-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  age INTEGER,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  gender TEXT CHECK (gender IN ('masculino', 'feminino', 'outro')),
  activity_level TEXT CHECK (activity_level IN ('sedentario', 'leve', 'moderado', 'intenso', 'muito_intenso')),
  goals TEXT[] DEFAULT '{}',
  dietary_restrictions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscribers table for subscription management
CREATE TABLE public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT DEFAULT 'free_trial',
  subscription_end TIMESTAMPTZ,
  trial_started_at TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create meal_plans table
CREATE TABLE public.meal_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  meals JSONB NOT NULL DEFAULT '[]',
  total_calories INTEGER,
  total_protein DECIMAL(6,2),
  total_carbs DECIMAL(6,2),
  total_fat DECIMAL(6,2),
  generated_by_ai BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, plan_date)
);

-- Create workout_plans table
CREATE TABLE public.workout_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  workout_type TEXT NOT NULL,
  exercises JSONB NOT NULL DEFAULT '[]',
  duration_minutes INTEGER,
  difficulty_level TEXT CHECK (difficulty_level IN ('iniciante', 'intermediario', 'avancado')),
  generated_by_ai BOOLEAN DEFAULT true,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, plan_date)
);

-- Create progress_tracking table
CREATE TABLE public.progress_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  weight DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  muscle_mass DECIMAL(5,2),
  measurements JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, record_date)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for subscribers
CREATE POLICY "Users can view their own subscription" 
ON public.subscribers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Edge functions can manage subscriptions" 
ON public.subscribers FOR ALL 
USING (true);

-- Allow the initialize_free_trial function to insert into subscribers
CREATE POLICY "Allow trial initialization" 
ON public.subscribers FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for meal_plans
CREATE POLICY "Users can view their own meal plans" 
ON public.meal_plans FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own meal plans" 
ON public.meal_plans FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for workout_plans
CREATE POLICY "Users can view their own workout plans" 
ON public.workout_plans FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workout plans" 
ON public.workout_plans FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for progress_tracking
CREATE POLICY "Users can view their own progress" 
ON public.progress_tracking FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own progress" 
ON public.progress_tracking FOR ALL 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscribers_updated_at
  BEFORE UPDATE ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at
  BEFORE UPDATE ON public.meal_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workout_plans_updated_at
  BEFORE UPDATE ON public.workout_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_progress_tracking_updated_at
  BEFORE UPDATE ON public.progress_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to check if trial is active
CREATE OR REPLACE FUNCTION public.is_trial_active(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  trial_end TIMESTAMPTZ;
BEGIN
  SELECT trial_ends_at INTO trial_end
  FROM public.subscribers
  WHERE user_id = user_uuid;
  
  RETURN (trial_end IS NOT NULL AND trial_end > now());
END;
$function$;

-- Create function to initialize free trial when user signs up
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
    true, -- Durante o trial, consideramos como "subscrito"
    'free_trial',
    now(),
    now() + interval '15 days'
  );
  RETURN NEW;
END;
$function$;

-- Create trigger to initialize trial on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.initialize_free_trial();