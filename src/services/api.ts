// Serviço de API para o FitPlan AI
// Por enquanto com dados mock, mas preparado para integração futura

import { User, ProgressData, Exercise, Meal, CreateUserRequest, LoginRequest, AuthResponse } from '../types';

// Mock data para desenvolvimento
const mockUser: User = {
  id: '1',
  nome: 'João Silva',
  email: 'joao@example.com',
  idade: 28,
  peso: 75.5,
  altura: 175,
  sexo: 'masculino',
  restricoesAlimentares: ['lactose'],
  preferencias: ['exercicios-cardio', 'dieta-vegetariana'],
  nivelAtividade: 'moderado',
  objetivo: 'perder-peso',
  dataCadastro: '2024-01-01'
};

const mockProgressData: ProgressData[] = [
  { data: '2024-01-01', peso: 80.0, calorias: 1850, exercicios: 4, agua: 2.5 },
  { data: '2024-01-08', peso: 79.2, calorias: 1920, exercicios: 5, agua: 2.8 },
  { data: '2024-01-15', peso: 78.5, calorias: 1780, exercicios: 3, agua: 2.2 },
  { data: '2024-01-22', peso: 77.8, calorias: 1950, exercicios: 6, agua: 3.0 },
  { data: '2024-01-29', peso: 77.0, calorias: 1880, exercicios: 4, agua: 2.5 },
  { data: '2024-02-05', peso: 76.3, calorias: 2100, exercicios: 2, agua: 2.0 },
  { data: '2024-02-12', peso: 75.5, calorias: 1750, exercicios: 1, agua: 1.8 }
];

// Funções da API
export const api = {
  // Usuário
  getUser: async (): Promise<User> => {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUser;
  },

  getUserById: async (userId: string): Promise<User> => {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simula busca por ID (por enquanto retorna o mockUser)
    if (userId === '1' || userId === '2') {
      return mockUser;
    }
    
    throw new Error('Usuário não encontrado');
  },

  updateUser: async (userData: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...mockUser, ...userData };
  },

  // Cadastro de usuário
  createUser: async (userData: CreateUserRequest): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simula validação no backend
    if (!userData.nome || !userData.email || !userData.idade || !userData.peso || !userData.altura) {
      throw new Error('Todos os campos obrigatórios devem ser preenchidos');
    }

    if (userData.idade < 13 || userData.idade > 120) {
      throw new Error('Idade deve estar entre 13 e 120 anos');
    }

    if (userData.peso < 30 || userData.peso > 300) {
      throw new Error('Peso deve estar entre 30kg e 300kg');
    }

    if (userData.altura < 100 || userData.altura > 250) {
      throw new Error('Altura deve estar entre 100cm e 250cm');
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      dataCadastro: new Date().toISOString().split('T')[0]
    };
    
    return { user: newUser, token: 'mock-jwt-token-' + Date.now() };
  },

  // Progresso
  getProgress: async (): Promise<ProgressData[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProgressData;
  },

  addProgressEntry: async (entry: Omit<ProgressData, 'data'>): Promise<ProgressData> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newEntry: ProgressData = {
      ...entry,
      data: new Date().toISOString().split('T')[0]
    };
    return newEntry;
  },

  // Exercícios
  getExercises: async (): Promise<Exercise[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: '1', nome: 'Corrida', categoria: 'cardio', intensidade: 'moderada', duracao: 30, calorias: 300 },
      { id: '2', nome: 'Flexões', categoria: 'força', intensidade: 'alta', duracao: 15, calorias: 150 },
      { id: '3', nome: 'Agachamentos', categoria: 'força', intensidade: 'moderada', duracao: 20, calorias: 200 },
      { id: '4', nome: 'Natação', categoria: 'cardio', intensidade: 'baixa', duracao: 45, calorias: 400 }
    ];
  },

  // Refeições
  getMeals: async (): Promise<Meal[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: '1', nome: 'Café da manhã', categoria: 'cafe', calorias: 450, proteinas: 25, carboidratos: 60, gorduras: 15, horario: '08:00' },
      { id: '2', nome: 'Almoço', categoria: 'almoco', calorias: 650, proteinas: 35, carboidratos: 80, gorduras: 20, horario: '12:30' },
      { id: '3', nome: 'Lanche', categoria: 'lanche', calorias: 200, proteinas: 10, carboidratos: 25, gorduras: 8, horario: '16:00' },
      { id: '4', nome: 'Jantar', categoria: 'jantar', calorias: 550, proteinas: 30, carboidratos: 70, gorduras: 18, horario: '19:30' }
    ];
  },

  // IA Insights
  getAIInsights: async (): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const insights = [
      "Baseado no seu progresso, recomendo aumentar a intensidade dos exercícios cardiovasculares em 15% esta semana.",
      "Sua consistência está excelente! Continue mantendo o ritmo de 5 exercícios por semana.",
      "Para acelerar a perda de peso, considere adicionar 2 sessões de HIIT por semana.",
      "Seu consumo de água está abaixo do recomendado. Tente beber 3L por dia para otimizar o metabolismo."
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  },

  // Autenticação
  login: async (credentials: LoginRequest): Promise<{ success: boolean; user?: User; token?: string; expiresAt?: string; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simula validação de credenciais
    if (credentials.email === 'joao@example.com' && credentials.senha === '123456') {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // Token válido por 24 horas
      
      return { 
        success: true, 
        user: mockUser, 
        token: 'mock-jwt-token-' + Date.now(),
        expiresAt: expiresAt.toISOString()
      };
    } else if (credentials.email === 'maria@example.com' && credentials.senha === '123456') {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      const mariaUser: User = {
        id: '2',
        nome: 'Maria Santos',
        email: 'maria@example.com',
        idade: 32,
        peso: 62,
        altura: 165,
        sexo: 'feminino',
        restricoesAlimentares: ['gluten'],
        preferencias: ['vegano'],
        nivelAtividade: 'ativo',
        objetivo: 'ganhar-massa',
        dataCadastro: '2024-01-10'
      };
      
      return { 
        success: true, 
        user: mariaUser, 
        token: 'mock-jwt-token-' + Date.now(),
        expiresAt: expiresAt.toISOString()
      };
    }
    
    return { 
      success: false, 
      error: 'Email ou senha incorretos. Tente novamente.' 
    };
  },

  register: async (userData: Omit<User, 'id' | 'dataCadastro'>): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser: User = { ...userData, id: Date.now().toString(), dataCadastro: new Date().toISOString().split('T')[0] };
    return { user: newUser, token: 'mock-jwt-token' };
  }
};

export default api;
