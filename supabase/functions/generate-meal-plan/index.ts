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

    if (profileError) {
      console.error('Erro ao carregar perfil:', profileError);
      return new Response(JSON.stringify({ 
        error: 'Erro ao carregar perfil do usuário' 
      }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // Carregar preferências dietéticas
    const { data: dietData, error: dietError } = await supabaseClient
      .from('dietary_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (dietError && dietError.code !== 'PGRST116') {
      console.error('Erro ao carregar preferências dietéticas:', dietError);
    }

    // Gerar plano alimentar personalizado
    const mealPlan = generatePersonalizedMealPlan(profileData, dietData);

    return new Response(JSON.stringify({ 
      success: true,
      mealPlan,
      message: 'Plano alimentar gerado com sucesso'
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

function generatePersonalizedMealPlan(profile: any, dietPreferences: any) {
  // Dados do usuário para personalização
  const { full_name, age, weight, height, gender, activity_level, goals } = profile;
  const { diet_type, allergies, intolerances, medications } = dietPreferences || {};
  
  // Calcular necessidades calóricas
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activity_level);
  const targetCalories = adjustCaloriesForGoal(tdee, goals?.[0]);
  
  // Gerar refeições baseadas no tipo de dieta e restrições
  const meals = generateMeals(diet_type, targetCalories, allergies, intolerances);
  
  return {
    userInfo: {
      name: full_name,
      age,
      weight,
      height,
      gender,
      activityLevel: activity_level,
      goals
    },
    nutritionTargets: {
      dailyCalories: targetCalories,
      protein: Math.round(targetCalories * 0.3 / 4), // 30% das calorias
      carbs: Math.round(targetCalories * 0.4 / 4),  // 40% das calorias
      fats: Math.round(targetCalories * 0.3 / 9)    // 30% das calorias
    },
    meals,
    recommendations: generateDietRecommendations(diet_type, goals?.[0]),
    restrictions: {
      allergies: allergies || [],
      intolerances: intolerances || [],
      medications: medications || []
    }
  };
}

function calculateBMR(weight: number, height: number, age: number, gender: string): number {
  if (gender === 'masculino') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
}

function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers = {
    'sedentario': 1.2,
    'leve': 1.375,
    'moderado': 1.55,
    'intenso': 1.725,
    'muito_intenso': 1.9
  };
  
  return bmr * (multipliers[activityLevel] || 1.2);
}

function adjustCaloriesForGoal(tdee: number, goal: string): number {
  switch (goal) {
    case 'weight_loss':
      return Math.round(tdee * 0.85); // Déficit de 15%
    case 'muscle_gain':
      return Math.round(tdee * 1.1);  // Superávit de 10%
    default:
      return Math.round(tdee);         // Manutenção
  }
}

function generateMeals(dietType: string, dailyCalories: number, allergies: string[], intolerances: string[]) {
  const mealDistribution = {
    breakfast: 0.25,  // 25% das calorias
    lunch: 0.35,      // 35% das calorias
    dinner: 0.30,     // 30% das calorias
    snack: 0.10       // 10% das calorias
  };

  const meals = {
    breakfast: {
      name: "Café da Manhã",
      time: "07:00",
      calories: Math.round(dailyCalories * mealDistribution.breakfast),
      foods: generateFoodList(dietType, 'breakfast', allergies, intolerances)
    },
    lunch: {
      name: "Almoço",
      time: "12:00",
      calories: Math.round(dailyCalories * mealDistribution.lunch),
      foods: generateFoodList(dietType, 'lunch', allergies, intolerances)
    },
    dinner: {
      name: "Jantar",
      time: "19:00",
      calories: Math.round(dailyCalories * mealDistribution.dinner),
      foods: generateFoodList(dietType, 'dinner', allergies, intolerances)
    },
    snack: {
      name: "Lanche",
      time: "15:00",
      calories: Math.round(dailyCalories * mealDistribution.snack),
      foods: generateFoodList(dietType, 'snack', allergies, intolerances)
    }
  };

  return meals;
}

function generateFoodList(dietType: string, mealType: string, allergies: string[], intolerances: string[]) {
  // Lista de alimentos baseada no tipo de dieta e refeição
  const foodDatabase = {
    balanced: {
      breakfast: ["Aveia com frutas", "Pão integral", "Ovos", "Iogurte natural", "Banana"],
      lunch: ["Arroz integral", "Feijão", "Frango grelhado", "Salada verde", "Abacate"],
      dinner: ["Salmão", "Batata doce", "Brócolis", "Quinoa", "Azeite de oliva"],
      snack: ["Maçã", "Castanhas", "Chocolate amargo", "Iogurte", "Granola"]
    },
    low_carb: {
      breakfast: ["Ovos mexidos", "Abacate", "Queijo cottage", "Chia", "Amêndoas"],
      lunch: ["Salada de atum", "Azeite de oliva", "Folhas verdes", "Proteína magra", "Legumes"],
      dinner: ["Carne vermelha", "Legumes grelhados", "Manteiga ghee", "Couve-flor", "Proteína"],
      snack: ["Queijo", "Oleaginosas", "Azeitonas", "Proteína em pó", "Chocolate 90%"]
    },
    vegetarian: {
      breakfast: ["Aveia com leite vegetal", "Frutas", "Sementes", "Iogurte vegetal", "Granola"],
      lunch: ["Lentilhas", "Arroz integral", "Legumes", "Tofu", "Quinoa"],
      dinner: ["Grão-de-bico", "Vegetais", "Sementes", "Tahine", "Legumes"],
      snack: ["Frutas", "Oleaginosas", "Hummus", "Vegetais", "Smoothie"]
    }
  };

  const foods = foodDatabase[dietType]?.[mealType] || foodDatabase.balanced[mealType];
  
  // Filtrar alimentos baseado em alergias e intolerâncias
  const safeFoods = foods.filter(food => 
    !allergies.some(allergy => 
      food.toLowerCase().includes(allergy.toLowerCase())
    ) &&
    !intolerances.some(intolerance => 
      food.toLowerCase().includes(intolerance.toLowerCase())
    )
  );

  // Retornar 3-4 alimentos seguros
  return safeFoods.slice(0, Math.min(4, safeFoods.length));
}

function generateDietRecommendations(dietType: string, goal: string) {
  const recommendations = {
    general: [
      "Beba pelo menos 2L de água por dia",
      "Faça 5-6 refeições pequenas ao longo do dia",
      "Mastigue bem os alimentos",
      "Evite comer muito próximo ao horário de dormir"
    ],
    weight_loss: [
      "Mantenha um déficit calórico consistente",
      "Priorize proteínas magras",
      "Inclua fibras para saciedade",
      "Evite açúcares refinados"
    ],
    muscle_gain: [
      "Consuma proteínas em todas as refeições",
      "Inclua carboidratos complexos",
      "Mantenha um superávit calórico moderado",
      "Distribua as refeições ao longo do dia"
    ]
  };

  return [
    ...recommendations.general,
    ...(recommendations[goal] || recommendations.general)
  ];
}