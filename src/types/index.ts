// Tipos globais para o FitPlan AI

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

export type Page = 'home' | 'login' | 'cadastro' | 'dashboard' | 'progresso';

export interface NavigationProps {
  onNavigate: (page: Page) => void;
}

export interface AuthProps extends NavigationProps {
  onLogin?: () => void;
  onLogout?: () => void;
}
