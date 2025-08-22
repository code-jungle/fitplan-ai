-- Script CORRIGIDO para criar tabelas faltantes no Supabase
-- Execute este script no SQL Editor do Supabase

-- Primeiro, vamos remover tabelas existentes se houver problemas
DROP TABLE IF EXISTS public.progress_tracking CASCADE;
DROP TABLE IF EXISTS public.meal_plans CASCADE;
DROP TABLE IF EXISTS public.workout_plans CASCADE;

-- Agora vamos criar as tabelas corretamente

-- Tabela para acompanhamento de progresso
CREATE TABLE public.progress_tracking (
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

-- Tabela para planos alimentares
CREATE TABLE public.meal_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_date DATE NOT NULL,
    plan_data JSONB NOT NULL,
    calories_target INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela para planos de treino
CREATE TABLE public.workout_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_date DATE NOT NULL,
    plan_data JSONB NOT NULL,
    duration_minutes INTEGER,
    difficulty_level TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para melhorar performance
CREATE INDEX progress_tracking_user_id_idx ON public.progress_tracking(user_id);
CREATE INDEX progress_tracking_date_idx ON public.progress_tracking(record_date DESC);
CREATE INDEX meal_plans_user_date_idx ON public.meal_plans(user_id, plan_date);
CREATE INDEX workout_plans_user_date_idx ON public.workout_plans(user_id, plan_date);

-- RLS (Row Level Security) Policies
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

-- Políticas para progress_tracking
CREATE POLICY "Users can view own progress" ON public.progress_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.progress_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.progress_tracking
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress" ON public.progress_tracking
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para meal_plans
CREATE POLICY "Users can view own meal plans" ON public.meal_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal plans" ON public.meal_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal plans" ON public.meal_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal plans" ON public.meal_plans
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para workout_plans
CREATE POLICY "Users can view own workout plans" ON public.workout_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout plans" ON public.workout_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout plans" ON public.workout_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout plans" ON public.workout_plans
    FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger nas tabelas
CREATE TRIGGER handle_meal_plans_updated_at
    BEFORE UPDATE ON public.meal_plans
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_workout_plans_updated_at
    BEFORE UPDATE ON public.workout_plans
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Comentários para documentação
COMMENT ON TABLE public.progress_tracking IS 'Tabela para armazenar o progresso físico dos usuários';
COMMENT ON TABLE public.meal_plans IS 'Tabela para armazenar planos alimentares gerados pela IA';
COMMENT ON TABLE public.workout_plans IS 'Tabela para armazenar planos de treino gerados pela IA';

-- Verificação final - mostrar tabelas criadas
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('progress_tracking', 'meal_plans', 'workout_plans');
