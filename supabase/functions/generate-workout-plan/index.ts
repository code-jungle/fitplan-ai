import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Security: Restrict CORS to specific origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  'https://fitplan-ai.vercel.app'
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

    if (profileError || !profileData) {
      console.error('Erro ao carregar perfil:', profileError);
      return new Response(JSON.stringify({ 
        error: 'Erro ao carregar perfil do usuário' 
      }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // Carregar preferências de treino
    const { data: workoutData, error: workoutError } = await supabaseClient
      .from('workout_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (workoutError && workoutError.code !== 'PGRST116') {
      console.error('Erro ao carregar preferências de treino:', workoutError);
    }

    // Carregar preferências dietéticas para considerar lesões
    const { data: dietData, error: dietError } = await supabaseClient
      .from('dietary_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (dietError && dietError.code !== 'PGRST116') {
      console.error('Erro ao carregar preferências dietéticas:', dietError);
    }

    // Gerar plano de treino personalizado
    const workoutPlan = generatePersonalizedWorkoutPlan(profileData, workoutData, dietData);

    return new Response(JSON.stringify({ 
      success: true,
      workoutPlan,
      message: 'Plano de treino gerado com sucesso'
    }), {
      status: 200,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro interno:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }
});

function generatePersonalizedWorkoutPlan(profile: any, workoutPreferences: any, dietPreferences: any) {
  // Validar se profile existe e tem dados necessários
  if (!profile || !profile.weight || !profile.height || !profile.age || !profile.gender) {
    throw new Error('Dados do perfil incompletos ou inválidos');
  }

  // Dados do usuário para personalização
  const { full_name, age, weight, height, gender, activity_level, goals } = profile;
  const { workout_type, workout_duration, workout_days, preferred_time } = workoutPreferences || {};
  const { injuries } = dietPreferences || {};
  
  // Determinar intensidade baseada no nível de atividade e objetivos
  const intensity = determineWorkoutIntensity(activity_level, goals?.[0]);
  
  // Gerar treinos baseados no tipo e intensidade
  const workouts = generateWorkouts(workout_type, intensity, injuries || []);
  
  // Calcular duração baseada nas preferências
  const duration = workout_duration || '60min';
  const days = workout_days || 3;
  
  return {
    userInfo: {
      name: full_name || 'Usuário',
      age,
      weight,
      height,
      gender,
      activityLevel: activity_level,
      goals: goals || []
    },
    workoutPreferences: {
      type: workout_type || 'mixed',
      duration,
      days,
      preferredTime: preferred_time || 'flexible'
    },
    intensity,
    workouts,
    schedule: generateWorkoutSchedule(days, preferred_time),
    recommendations: generateWorkoutRecommendations(workout_type, goals?.[0], injuries || []),
    safetyNotes: generateSafetyNotes(injuries || [], age, activity_level)
  };
}

function determineWorkoutIntensity(activityLevel: string, goal: string): string {
  const intensityMap = {
    'sedentario': 'beginner',
    'leve': 'beginner',
    'moderado': 'intermediate',
    'intenso': 'advanced',
    'muito_intenso': 'advanced'
  };
  
  let baseIntensity = intensityMap[activityLevel] || 'beginner';
  
  // Ajustar baseado no objetivo
  if ((goal === 'muscle_gain' || goal === 'ganho_massa') && baseIntensity === 'beginner') {
    baseIntensity = 'intermediate';
  } else if ((goal === 'weight_loss' || goal === 'perda_peso') && baseIntensity === 'advanced') {
    baseIntensity = 'intermediate';
  }
  
  return baseIntensity;
}

function generateWorkouts(workoutType: string, intensity: string, injuries: string[]) {
  const workoutDatabase = {
    mixed: {
      beginner: [
        {
          name: "Treino Full Body",
          focus: "Corpo completo",
          duration: "45 min",
          exercises: [
            { name: "Agachamento com peso corporal", sets: 3, reps: "12-15", rest: "60s" },
            { name: "Flexão de braço (joelhos)", sets: 3, reps: "8-12", rest: "60s" },
            { name: "Prancha", sets: 3, reps: "30s", rest: "60s" },
            { name: "Agachamento sumo", sets: 3, reps: "12-15", rest: "60s" },
            { name: "Remada com elástico", sets: 3, reps: "12-15", rest: "60s" }
          ]
        }
      ],
      intermediate: [
        {
          name: "Treino Upper/Lower",
          focus: "Superior/Inferior",
          duration: "60 min",
          exercises: [
            { name: "Agachamento livre", sets: 4, reps: "8-12", rest: "90s" },
            { name: "Supino reto", sets: 4, reps: "8-12", rest: "90s" },
            { name: "Puxada na frente", sets: 4, reps: "8-12", rest: "90s" },
            { name: "Leg press", sets: 4, reps: "10-15", rest: "90s" },
            { name: "Desenvolvimento militar", sets: 3, reps: "8-12", rest: "90s" }
          ]
        }
      ],
      advanced: [
        {
          name: "Treino Push/Pull/Legs",
          focus: "Empurrar/Puxar/Pernas",
          duration: "75 min",
          exercises: [
            { name: "Agachamento livre", sets: 5, reps: "5-8", rest: "120s" },
            { name: "Supino inclinado", sets: 4, reps: "6-10", rest: "120s" },
            { name: "Puxada na frente", sets: 4, reps: "6-10", rest: "120s" },
            { name: "Stiff", sets: 4, reps: "8-12", rest: "90s" },
            { name: "Desenvolvimento com halteres", sets: 4, reps: "8-12", rest: "90s" }
          ]
        }
      ]
    },
    strength: {
      beginner: [
        {
          name: "Treino de Força Básico",
          focus: "Força fundamental",
          duration: "50 min",
          exercises: [
            { name: "Agachamento com barra", sets: 3, reps: "5-8", rest: "120s" },
            { name: "Supino reto", sets: 3, reps: "5-8", rest: "120s" },
            { name: "Puxada na frente", sets: 3, reps: "5-8", rest: "120s" },
            { name: "Stiff", sets: 3, reps: "5-8", rest: "120s" },
            { name: "Desenvolvimento militar", sets: 3, reps: "5-8", rest: "120s" }
          ]
        }
      ],
      intermediate: [
        {
          name: "Treino de Força Intermediário",
          focus: "Força avançada",
          duration: "70 min",
          exercises: [
            { name: "Agachamento livre", sets: 5, reps: "3-5", rest: "180s" },
            { name: "Supino inclinado", sets: 4, reps: "3-5", rest: "180s" },
            { name: "Puxada na frente", sets: 4, reps: "3-5", rest: "180s" },
            { name: "Stiff", sets: 4, reps: "3-5", rest: "180s" },
            { name: "Desenvolvimento com halteres", sets: 4, reps: "3-5", rest: "180s" }
          ]
        }
      ],
      advanced: [
        {
          name: "Treino de Força Avançado",
          focus: "Força máxima",
          duration: "90 min",
          exercises: [
            { name: "Agachamento livre", sets: 6, reps: "1-3", rest: "240s" },
            { name: "Supino inclinado", sets: 5, reps: "1-3", rest: "240s" },
            { name: "Puxada na frente", sets: 5, reps: "1-3", rest: "240s" },
            { name: "Stiff", sets: 5, reps: "1-3", rest: "240s" },
            { name: "Desenvolvimento com halteres", sets: 5, reps: "1-3", rest: "240s" }
          ]
        }
      ]
    },
    cardio: {
      beginner: [
        {
          name: "Treino Cardio Básico",
          focus: "Resistência cardiovascular",
          duration: "30 min",
          exercises: [
            { name: "Caminhada rápida", sets: 1, reps: "20 min", rest: "0s" },
            { name: "Corrida leve", sets: 1, reps: "10 min", rest: "0s" },
            { name: "Alongamento", sets: 1, reps: "5 min", rest: "0s" }
          ]
        }
      ],
      intermediate: [
        {
          name: "Treino HIIT",
          focus: "Alta intensidade",
          duration: "45 min",
          exercises: [
            { name: "Corrida intensa", sets: 8, reps: "30s", rest: "90s" },
            { name: "Burpee", sets: 8, reps: "30s", rest: "90s" },
            { name: "Mountain climber", sets: 8, reps: "30s", rest: "90s" },
            { name: "Jumping jack", sets: 8, reps: "30s", rest: "90s" }
          ]
        }
      ],
      advanced: [
        {
          name: "Treino Cardio Avançado",
          focus: "Endurance máxima",
          duration: "60 min",
          exercises: [
            { name: "Corrida contínua", sets: 1, reps: "45 min", rest: "0s" },
            { name: "Sprint", sets: 10, reps: "100m", rest: "120s" },
            { name: "Alongamento dinâmico", sets: 1, reps: "10 min", rest: "0s" }
          ]
        }
      ]
    }
  };

  // Filtrar exercícios baseado em lesões
  const safeWorkouts = workoutDatabase[workoutType]?.[intensity] || workoutDatabase.mixed[intensity];
  
  if (injuries && injuries.length > 0) {
    return safeWorkouts.map(workout => ({
      ...workout,
      exercises: workout.exercises.filter(exercise => 
        !injuries.some(injury => 
          exercise.name.toLowerCase().includes(injury.toLowerCase())
        )
      ),
      safetyNote: `Ajustado para evitar exercícios que possam agravar: ${injuries.join(', ')}`
    }));
  }
  
  return safeWorkouts;
}

function generateWorkoutSchedule(days: number, preferredTime: string) {
  const schedule = [];
  const timeSlots = {
    'morning': '06:00 - 08:00',
    'afternoon': '12:00 - 14:00',
    'evening': '18:00 - 20:00',
    'flexible': 'Flexível'
  };
  
  for (let i = 1; i <= days; i++) {
    schedule.push({
      day: `Dia ${i}`,
      time: timeSlots[preferredTime] || timeSlots.flexible,
      focus: i % 2 === 0 ? 'Superior' : 'Inferior'
    });
  }
  
  return schedule;
}

function generateWorkoutRecommendations(workoutType: string, goal: string, injuries: string[]) {
  // Validar parâmetros de entrada
  if (!workoutType || !goal) {
    return [
      "Sempre faça aquecimento antes do treino",
      "Mantenha a técnica correta em todos os exercícios",
      "Hidrate-se adequadamente durante o treino",
      "Descanse adequadamente entre as sessões"
    ];
  }

  // Garantir que injuries é um array
  const safeInjuries = Array.isArray(injuries) ? injuries : [];

  const recommendations = {
    general: [
      "Sempre faça aquecimento antes do treino",
      "Mantenha a técnica correta em todos os exercícios",
      "Hidrate-se adequadamente durante o treino",
      "Descanse adequadamente entre as sessões"
    ],
    strength: [
      "Foque na progressão de carga",
      "Mantenha boa forma técnica",
      "Use cargas que permitam 6-12 repetições",
      "Descanse 2-3 minutos entre séries pesadas"
    ],
    cardio: [
      "Mantenha frequência cardíaca controlada",
      "Aumente gradualmente a intensidade",
      "Combine diferentes tipos de cardio",
      "Monitore sua respiração"
    ],
    flexibility: [
      "Alongue após o aquecimento",
      "Mantenha cada alongamento por 20-30 segundos",
      "Não force além do confortável",
      "Respire profundamente durante o alongamento"
    ],
    mixed: [
      "Combine diferentes tipos de exercícios",
      "Varie a intensidade ao longo da semana",
      "Inclua dias de recuperação ativa",
      "Balance cardio e força"
    ],
    yoga: [
      "Foque na respiração",
      "Respeite seus limites",
      "Mantenha as posturas com estabilidade",
      "Pratique regularmente para melhores resultados"
    ],
    pilates: [
      "Controle o movimento com o core",
      "Mantenha a precisão em cada exercício",
      "Foque na respiração controlada",
      "Progrida gradualmente"
    ],
    crossfit: [
      "Priorize a técnica sobre a velocidade",
      "Escale os exercícios conforme necessário",
      "Mantenha alta intensidade",
      "Inclua dias de recuperação"
    ],
    weight_loss: [
      "Mantenha alta intensidade",
      "Reduza o descanso entre exercícios",
      "Inclua exercícios compostos",
      "Foque em queima calórica"
    ],
    muscle_gain: [
      "Progressive overload é fundamental",
      "Foque em exercícios compostos",
      "Mantenha volume de treino alto",
      "Descanse adequadamente para recuperação"
    ]
  };

  let selectedRecommendations = [...recommendations.general];
  
  if (workoutType && recommendations[workoutType as keyof typeof recommendations]) {
    selectedRecommendations.push(...recommendations[workoutType as keyof typeof recommendations]);
  }
  
  if (goal && recommendations[goal as keyof typeof recommendations]) {
    selectedRecommendations.push(...recommendations[goal as keyof typeof recommendations]);
  }
  
  return selectedRecommendations;
}

function generateSafetyNotes(injuries: string[], age: number, activityLevel: string) {
  // Garantir que injuries é um array
  const safeInjuries = Array.isArray(injuries) ? injuries : [];
  
  const notes: string[] = [];
  
  if (safeInjuries.length > 0) {
    notes.push(`⚠️ ATENÇÃO: Evite exercícios que possam agravar: ${safeInjuries.join(', ')}`);
  }
  
  if (age > 50) {
    notes.push("👴 Para usuários acima de 50 anos, priorize exercícios de baixo impacto");
  }
  
  if (activityLevel === 'sedentario') {
    notes.push("🚶 Comece gradualmente e aumente a intensidade ao longo do tempo");
  }
  
  if (notes.length === 0) {
    notes.push("✅ Nenhuma restrição especial identificada");
  }
  
  return notes;
}