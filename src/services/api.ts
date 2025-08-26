// Serviço de API para o FitPlan AI
// Por enquanto com dados mock, mas preparado para integração futura

export interface User {
  id: string;
  nome: string;
  email: string;
  objetivo: string;
  pesoInicial: number;
  pesoAtual: number;
  pesoMeta: number;
  altura: number;
  idade: number;
  genero: string;
}

export interface ProgressData {
  data: string;
  peso: number;
  calorias: number;
  exercicios: number;
  agua: number;
}

export interface Exercise {
  id: string;
  nome: string;
  categoria: string;
  intensidade: string;
  duracao: number;
  calorias: number;
}

export interface Meal {
  id: string;
  nome: string;
  categoria: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  horario: string;
}

// Mock data para desenvolvimento
const mockUser: User = {
  id: '1',
  nome: 'João Silva',
  email: 'joao@example.com',
  objetivo: 'perder-peso',
  pesoInicial: 80.0,
  pesoAtual: 75.5,
  pesoMeta: 70.0,
  altura: 175,
  idade: 28,
  genero: 'masculino'
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

  updateUser: async (userData: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...mockUser, ...userData };
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
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'joao@example.com' && password === '123456') {
      return { user: mockUser, token: 'mock-jwt-token' };
    }
    throw new Error('Credenciais inválidas');
  },

  register: async (userData: Omit<User, 'id'>): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser: User = { ...userData, id: Date.now().toString() };
    return { user: newUser, token: 'mock-jwt-token' };
  }
};

export default api;
