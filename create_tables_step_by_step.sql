-- Script PASSO A PASSO para criar tabelas
-- Execute um bloco por vez no SQL Editor do Supabase

-- PASSO 1: Criar tabela progress_tracking
CREATE TABLE IF NOT EXISTS public.progress_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    weight DECIMAL(5,2) NOT NULL,
    body_fat DECIMAL(4,1),
    muscle_mass DECIMAL(5,2),
    measurements JSONB,
    record_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PASSO 2: Verificar se a tabela foi criada
SELECT * FROM information_schema.tables WHERE table_name = 'progress_tracking';

-- PASSO 3: Criar tabela meal_plans
CREATE TABLE IF NOT EXISTS public.meal_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_date DATE NOT NULL,
    plan_data JSONB NOT NULL,
    calories_target INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PASSO 4: Verificar se a tabela foi criada
SELECT * FROM information_schema.tables WHERE table_name = 'meal_plans';

-- PASSO 5: Criar tabela workout_plans
CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_date DATE NOT NULL,
    plan_data JSONB NOT NULL,
    duration_minutes INTEGER,
    difficulty_level TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PASSO 6: Verificar se a tabela foi criada
SELECT * FROM information_schema.tables WHERE table_name = 'workout_plans';

-- PASSO 7: Criar índices
CREATE INDEX IF NOT EXISTS progress_tracking_user_id_idx ON public.progress_tracking(user_id);
CREATE INDEX IF NOT EXISTS progress_tracking_date_idx ON public.progress_tracking(record_date DESC);
CREATE INDEX IF NOT EXISTS meal_plans_user_date_idx ON public.meal_plans(user_id, plan_date);
CREATE INDEX IF NOT EXISTS workout_plans_user_date_idx ON public.workout_plans(user_id, plan_date);

-- PASSO 8: Habilitar RLS
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

-- PASSO 9: Criar políticas básicas de segurança
CREATE POLICY "Users can manage own progress" ON public.progress_tracking
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own meal plans" ON public.meal_plans
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own workout plans" ON public.workout_plans
    USING (auth.uid() = user_id);

-- PASSO 10: Verificação final
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('progress_tracking', 'meal_plans', 'workout_plans')
ORDER BY table_name, ordinal_position;
