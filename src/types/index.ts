// Tipos globais para o FitPlan AI

export interface User {
  id: string;
  nome: string;
  email: string;
  idade: number;
  peso: number;
  altura: number;
  sexo: 'masculino' | 'feminino' | 'outro';
  restricoesAlimentares: string[];
  preferencias: string[];
  nivelAtividade: 'sedentario' | 'leve' | 'moderado' | 'ativo' | 'muito-ativo';
  objetivo: 'perder-peso' | 'ganhar-massa' | 'manter-peso' | 'melhorar-saude' | 'ganhar-forca';
  dataCadastro: string;
}

export interface CreateUserRequest {
  nome: string;
  email: string;
  idade: number;
  peso: number;
  altura: number;
  sexo: 'masculino' | 'feminino' | 'outro';
  restricoesAlimentares: string[];
  preferencias: string[];
  nivelAtividade: 'sedentario' | 'leve' | 'moderado' | 'ativo' | 'muito-ativo';
  objetivo: 'perder-peso' | 'ganhar-massa' | 'manter-peso' | 'melhorar-saude' | 'ganhar-forca';
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

export interface AIInsight {
  id: string;
  mensagem: string;
  tipo: 'recomendacao' | 'motivacao' | 'alerta' | 'conquista';
  data: string;
  prioridade: 'baixa' | 'media' | 'alta';
}

export interface Goal {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'peso' | 'exercicio' | 'nutricao' | 'geral';
  valorAtual: number;
  valorMeta: number;
  unidade: string;
  dataInicio: string;
  dataMeta: string;
  status: 'em-andamento' | 'concluido' | 'atrasado';
}

export interface Workout {
  id: string;
  nome: string;
  categoria: string;
  exercicios: Exercise[];
  duracaoTotal: number;
  caloriasEstimadas: number;
  dificuldade: 'iniciante' | 'intermediario' | 'avancado';
  dataAgendada?: string;
  status: 'agendado' | 'em-andamento' | 'concluido' | 'cancelado';
}

// Tipos para Planos de Dieta e Treino
export interface DietPlan {
  id: string;
  nome: string;
  objetivo: string;
  caloriasDiarias: number;
  refeicoes: DietMeal[];
  hidratacao: {
    agua: number;
    outros: string[];
  };
  suplementos?: string[];
  observacoes: string[];
  duracao: number; // em dias
  dificuldade: 'iniciante' | 'intermediario' | 'avancado';
}

export interface DietMeal {
  id: string;
  nome: string;
  horario: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  alimentos: string[];
  preparo: string;
  tempoPreparo: number; // em minutos
  categoria: 'cafe' | 'lanche' | 'almoco' | 'jantar' | 'ceia';
}

// Tipos para a tela de refeições
export interface MealItem {
  id: string;
  nome: string;
  quantidade: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  observacoes?: string;
}

export interface UserMeal {
  id: string;
  nome: string;
  categoria: 'cafe' | 'lanche' | 'almoco' | 'jantar' | 'ceia';
  horario: string;
  data: string;
  itens: MealItem[];
  caloriasTotais: number;
  proteinasTotais: number;
  carboidratosTotais: number;
  gordurasTotais: number;
  observacoes?: string;
  status: 'planejada' | 'consumida' | 'pulada';
}

export interface CreateMealRequest {
  nome: string;
  categoria: 'cafe' | 'lanche' | 'almoco' | 'jantar' | 'ceia';
  horario: string;
  data: string;
  itens: Omit<MealItem, 'id'>[];
  observacoes?: string;
}

export interface UpdateMealRequest extends Partial<CreateMealRequest> {
  id: string;
}

// Tipos para o perfil do usuário
export interface UserProfile extends User {
  avatar?: string;
  bio?: string;
  telefone?: string;
  endereco?: {
    cidade: string;
    estado: string;
    pais: string;
  };
  redesSociais?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  configuracoes?: {
    notificacoes: boolean;
    privacidade: 'publico' | 'privado' | 'amigos';
    tema: 'claro' | 'escuro' | 'auto';
  };
}

export interface UpdateProfileRequest {
  nome?: string;
  idade?: number;
  peso?: number;
  altura?: number;
  sexo?: 'masculino' | 'feminino' | 'outro';
  objetivo?: 'perder-peso' | 'ganhar-massa' | 'manter-peso' | 'melhorar-saude' | 'ganhar-forca';
  bio?: string;
  telefone?: string;
  avatar?: string;
  endereco?: {
    cidade: string;
    estado: string;
    pais: string;
  };
  redesSociais?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface ProfileStats {
  diasAtivo: number;
  treinosCompletos: number;
  refeicoesRegistradas: number;
  pesoInicial: number;
  pesoAtual: number;
  variacaoPeso: number;
  metaProxima: string;
}

export interface TrainingPlan {
  id: string;
  nome: string;
  objetivo: string;
  duracao: number; // em semanas
  frequencia: number; // treinos por semana
  treinos: TrainingWorkout[];
  descanso: {
    dias: number[];
    recomendacoes: string[];
  };
  progressao: {
    tipo: 'linear' | 'ondulante' | 'piramidal';
    incremento: number;
    frequencia: number; // a cada quantas semanas
  };
  dificuldade: 'iniciante' | 'intermediario' | 'avancado';
}

export interface TrainingWorkout {
  id: string;
  nome: string;
  dia: string;
  categoria: 'forca' | 'cardio' | 'flexibilidade' | 'hiit' | 'resistencia';
  exercicios: TrainingExercise[];
  duracaoTotal: number;
  caloriasEstimadas: number;
  equipamentos: string[];
  aquecimento: string[];
  alongamento: string[];
}

export interface TrainingExercise {
  id: string;
  nome: string;
  series: number;
  repeticoes: number;
  peso?: number; // em kg
  duracao?: number; // em segundos
  descanso: number; // em segundos
  tecnica: string;
  variacoes?: string[];
  observacoes: string[];
}

export interface GeneratedPlan {
  id: string;
  tipo: 'dieta' | 'treino' | 'completo';
  objetivo: string;
  dataGeracao: string;
  validade: string;
  planoDieta?: DietPlan;
  planoTreino?: TrainingPlan;
  recomendacoes: string[];
  proximaAvaliacao: string;
}

export type Page = 'home' | 'login' | 'cadastro' | 'dashboard' | 'progresso' | 'planos' | 'refeicoes' | 'perfil';

export interface NavigationProps {
  onNavigate: (page: Page) => void;
}

export interface AuthProps extends NavigationProps {
  onLogin?: () => void;
  onLogout?: () => void;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
