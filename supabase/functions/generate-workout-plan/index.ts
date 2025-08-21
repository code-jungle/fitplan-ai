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
        headers: { ...headers, 'ContentType': 'application/json' }
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
    
    const { targetDate, workoutType } = requestBody;
    
    // Security: Validate input parameters
    if (targetDate && typeof targetDate !== 'string') {
      return new Response(JSON.stringify({ 
        error: 'Data de destino deve ser uma string válida' 
      }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
    
    if (workoutType && typeof workoutType !== 'string') {
      return new Response(JSON.stringify({ 
        error: 'Tipo de treino deve ser uma string válida' 
      }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

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
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
    }

    // Determinar nível de dificuldade baseado no activity_level
    const difficultyMap = {
      'sedentario': 'iniciante',
      'leve': 'iniciante',
      'moderado': 'intermediario',
      'intenso': 'intermediario',
      'muito_intenso': 'avancado'
    };
    
    const difficulty = difficultyMap[profile?.activity_level || 'moderado'] || 'intermediario';

    // Gerar prompt para a IA Gemini baseado no perfil
    const prompt = `
Crie um treino personalizado para hoje baseado nas seguintes informações:

Perfil do usuário:
- Idade: ${profile?.age || 'não informado'} anos
- Peso: ${profile?.weight || 'não informado'} kg
- Altura: ${profile?.height || 'não informado'} m
- Gênero: ${profile?.gender || 'não informado'}
- Nível de atividade: ${profile?.activity_level || 'moderado'}
- Objetivos: ${profile?.goals?.join(', ') || 'manter forma'}
- Tipo de treino solicitado: ${workoutType || 'geral'}
- Nível de dificuldade: ${difficulty}

Preciso que você retorne APENAS um JSON válido no seguinte formato:
{
  "workout_type": "Nome do tipo de treino",
  "duration_minutes": 45,
  "difficulty_level": "intermediario",
  "exercises": [
    {
      "name": "Nome do exercício",
      "sets": 3,
      "reps": "12-15",
      "rest_seconds": 60,
      "instructions": "Como executar o exercício",
      "muscle_groups": ["pernas", "glúteos"]
    }
  ],
  "warm_up": {
    "duration_minutes": 5,
    "exercises": ["Exercícios de aquecimento"]
  },
  "cool_down": {
    "duration_minutes": 5,
    "exercises": ["Exercícios de relaxamento"]
  }
}

Crie um treino adequado para academia ou casa, com exercícios seguros e progressivos.
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
      throw new Error('Falha ao gerar treino válido');
    }

    const workoutPlan = JSON.parse(jsonMatch[0]);

    // Salvar no banco de dados
    await supabaseClient
      .from('workout_plans')
      .upsert({
        user_id: user.id,
        plan_date: targetDate || new Date().toISOString().split('T')[0],
        workout_type: workoutPlan.workout_type,
        exercises: workoutPlan.exercises,
        duration_minutes: workoutPlan.duration_minutes,
        difficulty_level: workoutPlan.difficulty_level,
        generated_by_ai: true
      });

    return new Response(JSON.stringify(workoutPlan), {
      headers: { ...headers, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao gerar treino:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor' // Don't expose internal error details
    }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' }
      });
  }
});