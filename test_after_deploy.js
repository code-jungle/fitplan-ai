// Teste para verificar se as Edge Functions estão funcionando após o deploy
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://mwwegzxljanphfwryrql.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13d2VnenhsamFucGhmd3J5cnFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMTI1NzYsImV4cCI6MjA3MDg4ODU3Nn0.ewtlVGoV-eRtCF0p5JTKvHaEhHW12soHb4M3Y6NwOps";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testAfterDeploy() {
  console.log('🧪 VERIFICANDO SE O DEPLOY FUNCIONOU');
  console.log('=' .repeat(50));
  
  try {
    // ===== TESTE 1: VERIFICAR ESTRUTURA DO BANCO =====
    console.log('\n1️⃣ VERIFICANDO ESTRUTURA DO BANCO...');
    
    const tables = ['profiles', 'progress_tracking', 'meal_plans', 'workout_plans'];
    const tableStatus = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('count').limit(1);
        if (error) {
          tableStatus[table] = { exists: false, error: error.message };
        } else {
          tableStatus[table] = { exists: true, count: data?.length || 0 };
        }
      } catch (err) {
        tableStatus[table] = { exists: false, error: err.message };
      }
    }
    
    console.log('📊 Status das tabelas:');
    Object.entries(tableStatus).forEach(([table, status]) => {
      if (status.exists) {
        console.log(`   ✅ ${table}: Existe e funcionando`);
      } else {
        console.log(`   ❌ ${table}: ${status.error}`);
      }
    });
    
    // ===== TESTE 2: TESTAR EDGE FUNCTIONS =====
    console.log('\n2️⃣ TESTANDO EDGE FUNCTIONS APÓS DEPLOY...');
    
    // Teste de plano alimentar
    console.log('   🍽️ Testando generate-meal-plan...');
    try {
      const mealPlanResponse = await fetch(`${SUPABASE_URL}/functions/v1/generate-meal-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          targetDate: new Date().toISOString().split('T')[0]
        })
      });
      
      console.log(`   Status: ${mealPlanResponse.status} ${mealPlanResponse.statusText}`);
      
      if (mealPlanResponse.ok) {
        const mealPlanData = await mealPlanResponse.json();
        console.log(`   ✅ SUCESSO! Plano alimentar gerado!`);
        console.log(`      Sucesso: ${mealPlanData.success}`);
        console.log(`      Mensagem: ${mealPlanData.message}`);
        
        if (mealPlanData.mealPlan) {
          console.log(`      Plano gerado com: ${Object.keys(mealPlanData.mealPlan).length} seções`);
        }
      } else {
        const errorText = await mealPlanResponse.text();
        console.log(`   ❌ Erro: ${errorText}`);
        
        // Verificar se é erro de autenticação (esperado) ou outro erro
        if (mealPlanResponse.status === 401) {
          console.log(`   ⚠️ Erro 401: Usuário não autenticado (ESPERADO sem login)`);
        } else if (mealPlanResponse.status === 500) {
          console.log(`   ❌ Erro 500: Problema na Edge Function (NÃO esperado após deploy)`);
        }
      }
    } catch (err) {
      console.log(`   ❌ Erro na requisição: ${err.message}`);
    }
    
    // Teste de plano de treino
    console.log('   💪 Testando generate-workout-plan...');
    try {
      const workoutPlanResponse = await fetch(`${SUPABASE_URL}/functions/v1/generate-workout-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          targetDate: new Date().toISOString().split('T')[0]
        })
      });
      
      console.log(`   Status: ${workoutPlanResponse.status} ${workoutPlanResponse.statusText}`);
      
      if (workoutPlanResponse.ok) {
        const workoutPlanData = await workoutPlanResponse.json();
        console.log(`   ✅ SUCESSO! Plano de treino gerado!`);
        console.log(`      Sucesso: ${workoutPlanData.success}`);
        console.log(`      Mensagem: ${workoutPlanData.message}`);
        
        if (workoutPlanData.workoutPlan) {
          console.log(`      Plano gerado com: ${Object.keys(workoutPlanData.workoutPlan).length} seções`);
        }
      } else {
        const errorText = await workoutPlanResponse.text();
        console.log(`   ❌ Erro: ${errorText}`);
        
        // Verificar se é erro de autenticação (esperado) ou outro erro
        if (workoutPlanResponse.status === 401) {
          console.log(`   ⚠️ Erro 401: Usuário não autenticado (ESPERADO sem login)`);
        } else if (workoutPlanResponse.status === 500) {
          console.log(`   ❌ Erro 500: Problema na Edge Function (NÃO esperado após deploy)`);
        }
      }
    } catch (err) {
      console.log(`   ❌ Erro na requisição: ${err.message}`);
    }
    
    // ===== TESTE 3: VERIFICAR SE CONSEGUIMOS INSERIR DADOS =====
    console.log('\n3️⃣ VERIFICANDO SE CONSEGUIMOS INSERIR DADOS...');
    
    try {
      // Tentar inserir um perfil de teste
      const testProfile = {
        user_id: 'test-deploy-' + Date.now(),
        age: 30,
        gender: 'masculino',
        weight: 75.5,
        height: 175,
        activity_level: 'moderado'
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert([testProfile])
        .select();
      
      if (insertError) {
        if (insertError.code === '42501') {
          console.log('   ⚠️ Inserção bloqueada por RLS (ESPERADO sem autenticação)');
          console.log('   ✅ RLS está funcionando corretamente!');
        } else {
          console.log(`   ❌ Erro inesperado na inserção: ${insertError.message}`);
        }
      } else {
        console.log('   ✅ Inserção funcionando! (Isso pode indicar problema de segurança)');
        
        // Limpar dados de teste
        await supabase.from('profiles').delete().eq('user_id', testProfile.user_id);
        console.log('   Dados de teste removidos');
      }
    } catch (err) {
      console.log(`   ❌ Erro geral na inserção: ${err.message}`);
    }
    
    // ===== RESUMO FINAL =====
    console.log('\n🎯 RESUMO APÓS DEPLOY');
    console.log('=' .repeat(30));
    
    const allTablesExist = Object.values(tableStatus).every(status => status.exists);
    console.log(`📊 Banco de dados: ${allTablesExist ? '✅ FUNCIONANDO' : '❌ PROBLEMAS'}`);
    
    if (allTablesExist) {
      console.log('✅ Todas as tabelas estão funcionando');
      console.log('✅ Sistema pronto para cadastro e geração de planos');
      
      // Verificar se as Edge Functions estão funcionando
      console.log('\n🔍 STATUS DAS EDGE FUNCTIONS:');
      console.log('   ⚠️  Para verificar se estão funcionando completamente:');
      console.log('   1. Faça login na aplicação');
      console.log('   2. Tente gerar um plano alimentar');
      console.log('   3. Tente gerar um plano de treino');
      console.log('   4. Verifique se não há erros 500');
      
    } else {
      console.log('❌ Algumas tabelas não estão funcionando');
      console.log('❌ Sistema não está pronto para uso');
    }
    
  } catch (error) {
    console.error('❌ Erro geral no teste:', error);
  }
}

// Executar teste
testAfterDeploy();
