import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Security: Restrict CORS to specific origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080', // Keep for backward compatibility
  'https://yourdomain.com' // Replace with your actual domain
];

const corsHeaders = (origin: string) => ({
  'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
});

serve(async (req) => {
  // Security: Get origin and validate CORS
  const origin = req.headers.get('Origin') || '';
  const headers = corsHeaders(origin);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Security: Validate Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ 
        error: 'Token de autorização inválido ou ausente' 
      }), {
        status: 401,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return new Response(JSON.stringify({ 
        error: 'Token de autorização vazio' 
      }), {
        status: 401,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ 
        error: 'Usuário não autenticado' 
      }), {
        status: 401,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    const user = userData.user;
    // Security: Validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Corpo da requisição inválido' 
      }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
    
    const { targetDate } = requestBody;
    
    // Security: Validate targetDate if provided
    if (targetDate && typeof targetDate !== 'string') {
      return new Response(JSON.stringify({ 
        error: 'Data de destino deve ser uma string válida' 
      }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // Carregar perfil completo do usuário do banco
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Erro ao carregar perfil:', profileError);
      return new Response(JSON.stringify({ 
        error: 'Erro ao carregar perfil do usuário' 
      }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // Carregar preferências de dieta
    const { data: dietData, error: dietError } = await supabaseClient
      .from('dietary_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (dietError && dietError.code !== 'PGRST116') {
      console.error('Erro ao carregar preferências de dieta:', dietError);
    }

    // Gerar prompt para a IA Gemini baseado no perfil real
    const prompt = `
Crie um plano alimentar personalizado para hoje baseado nas seguintes informações:

Perfil do usuário:
- Nome: ${profileData?.full_name || 'não informado'}
- Idade: ${profileData?.age || 'não informado'} anos
- Peso: ${profileData?.weight || 'não informado'} kg
- Altura: ${profileData?.height || 'não informado'} cm
- Gênero: ${profileData?.gender || 'não informado'}
- Nível de atividade: ${profileData?.activity_level || 'moderado'}
- Objetivos: ${profileData?.goals?.join(', ') || 'manter peso'}
- Tipo de dieta: ${dietData?.diet_type || 'equilibrada'}
- Restrições alimentares: ${dietData?.allergies?.join(', ') || 'nenhuma'}
- Intolerâncias: ${dietData?.intolerances?.join(', ') || 'nenhuma'}
- Medicamentos: ${dietData?.medications?.join(', ') || 'nenhum'}
- Lesões/Problemas: ${dietData?.injuries?.join(', ') || 'nenhum'}

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
Considere as restrições e preferências do usuário para criar um plano seguro e personalizado.
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
      headers: { ...headers, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao gerar plano alimentar:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor' // Don't expose internal error details
    }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }
});