import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error('Usuário não autenticado');
    }

    const user = userData.user;
    const { targetDate } = await req.json();

    // Buscar perfil do usuário
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Verificar se o usuário tem acesso (trial ou assinatura ativa)
    const { data: subscription } = await supabaseClient
      .from('subscribers')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const hasAccess = subscription && (
      subscription.subscribed || 
      (subscription.trial_ends_at && new Date(subscription.trial_ends_at) > new Date())
    );

    if (!hasAccess) {
      return new Response(JSON.stringify({ 
        error: 'Acesso negado. Assinatura necessária.' 
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Gerar prompt para a IA Gemini baseado no perfil
    const prompt = `
Crie um plano alimentar personalizado para hoje baseado nas seguintes informações:

Perfil do usuário:
- Idade: ${profile?.age || 'não informado'} anos
- Peso: ${profile?.weight || 'não informado'} kg
- Altura: ${profile?.height || 'não informado'} m
- Gênero: ${profile?.gender || 'não informado'}
- Nível de atividade: ${profile?.activity_level || 'moderado'}
- Objetivos: ${profile?.goals?.join(', ') || 'manter peso'}
- Restrições alimentares: ${profile?.dietary_restrictions?.join(', ') || 'nenhuma'}

Preciso que você retorne APENAS um JSON válido no seguinte formato:
{
  "meals": [
    {
      "type": "cafe_da_manha",
      "name": "Nome da refeição",
      "time": "07:00",
      "foods": [
        {
          "name": "Alimento",
          "quantity": "quantidade",
          "calories": 120,
          "protein": 10,
          "carbs": 15,
          "fat": 5
        }
      ]
    }
  ],
  "total_calories": 1800,
  "total_protein": 120,
  "total_carbs": 200,
  "total_fat": 60
}

Inclua pelo menos café da manhã, almoço, lanche e jantar. Use alimentos brasileiros típicos.
`;

    // Chamar API do Gemini
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    const geminiData = await geminiResponse.json();
    const generatedText = geminiData.candidates[0]?.content?.parts[0]?.text || '';
    
    // Extrair JSON do texto gerado
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Falha ao gerar plano alimentar válido');
    }

    const mealPlan = JSON.parse(jsonMatch[0]);

    // Salvar no banco de dados
    await supabaseClient
      .from('meal_plans')
      .upsert({
        user_id: user.id,
        plan_date: targetDate || new Date().toISOString().split('T')[0],
        meals: mealPlan.meals,
        total_calories: mealPlan.total_calories,
        total_protein: mealPlan.total_protein,
        total_carbs: mealPlan.total_carbs,
        total_fat: mealPlan.total_fat,
        generated_by_ai: true
      });

    return new Response(JSON.stringify(mealPlan), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao gerar plano alimentar:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});