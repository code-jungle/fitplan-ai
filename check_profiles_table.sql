-- Script para verificar especificamente a tabela profiles
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela profiles existe
SELECT table_name, table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'profiles';

-- 2. Verificar estrutura completa da tabela profiles
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verificar se há dados na tabela profiles
SELECT COUNT(*) as total_profiles FROM profiles;

-- 4. Verificar uma amostra dos dados (se existirem)
SELECT * FROM profiles LIMIT 3;

-- 5. Verificar se a tabela tem RLS ativado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- 6. Verificar políticas RLS da tabela profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'profiles';
