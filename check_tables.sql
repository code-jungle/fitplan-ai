-- Script para verificar a estrutura das tabelas
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se as tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'workout_preferences', 'dietary_preferences', 'notification_preferences', 'progress_tracking', 'meal_plans', 'workout_plans');

-- 2. Verificar estrutura da tabela profiles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 3. Verificar estrutura da tabela workout_preferences
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'workout_preferences' 
ORDER BY ordinal_position;

-- 4. Verificar estrutura da tabela dietary_preferences
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'dietary_preferences' 
ORDER BY ordinal_position;

-- 5. Verificar estrutura da tabela notification_preferences
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'notification_preferences' 
ORDER BY ordinal_position;

-- 6. Verificar se há dados nas tabelas
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM profiles
UNION ALL
SELECT 'workout_preferences' as table_name, COUNT(*) as row_count FROM workout_preferences
UNION ALL
SELECT 'dietary_preferences' as table_name, COUNT(*) as row_count FROM dietary_preferences
UNION ALL
SELECT 'notification_preferences' as table_name, COUNT(*) as row_count FROM notification_preferences;

-- 7. Verificar RLS (Row Level Security) das tabelas
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'workout_preferences', 'dietary_preferences', 'notification_preferences');

-- 8. Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename IN ('profiles', 'workout_preferences', 'dietary_preferences', 'notification_preferences');
