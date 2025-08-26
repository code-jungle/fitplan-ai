import { api } from './api';
import { User, ProgressData } from '../types';

export interface DashboardData {
  user: User;
  progress: ProgressData[];
  insights: string;
}

export interface UpdateProgressRequest {
  peso: number;
  calorias: number;
  exercicios: number;
  agua: number;
}

export class DashboardService {
  /**
   * Busca todos os dados necessários para o dashboard
   */
  static async getDashboardData(userId: string): Promise<DashboardData> {
    try {
      // Buscar dados do usuário por ID
      const user = await api.getUserById(userId);
      
      // Buscar progresso
      const progress = await api.getProgress();
      
      // Buscar insights da IA
      const insights = await api.getAIInsights();
      
      return {
        user,
        progress,
        insights
      };
    } catch (error) {
      throw new Error('Erro ao carregar dados do dashboard');
    }
  }

  /**
   * Atualiza o progresso do usuário
   */
  static async updateProgress(data: UpdateProgressRequest): Promise<ProgressData> {
    try {
      const newEntry = await api.addProgressEntry(data);
      return newEntry;
    } catch (error) {
      throw new Error('Erro ao atualizar progresso');
    }
  }

  /**
   * Calcula estatísticas do progresso
   */
  static calculateProgressStats(progress: ProgressData[]) {
    if (progress.length === 0) {
      return {
        totalEntries: 0,
        averageWeight: 0,
        weightChange: 0,
        averageCalories: 0,
        averageExercises: 0,
        averageWater: 0
      };
    }

    const sortedProgress = [...progress].sort((a, b) => 
      new Date(a.data).getTime() - new Date(b.data).getTime()
    );

    const firstEntry = sortedProgress[0];
    const lastEntry = sortedProgress[sortedProgress.length - 1];

    const totalWeight = progress.reduce((sum, entry) => sum + entry.peso, 0);
    const totalCalories = progress.reduce((sum, entry) => sum + entry.calorias, 0);
    const totalExercises = progress.reduce((sum, entry) => sum + entry.exercicios, 0);
    const totalWater = progress.reduce((sum, entry) => sum + entry.agua, 0);

    return {
      totalEntries: progress.length,
      averageWeight: totalWeight / progress.length,
      weightChange: lastEntry.peso - firstEntry.peso,
      averageCalories: totalCalories / progress.length,
      averageExercises: totalExercises / progress.length,
      averageWater: totalWater / progress.length
    };
  }

  /**
   * Gera recomendações baseadas no progresso
   */
  static generateRecommendations(user: User, progress: ProgressData[]): string[] {
    const recommendations: string[] = [];
    
    if (progress.length === 0) {
      recommendations.push("Comece registrando seu progresso diário para receber recomendações personalizadas.");
      return recommendations;
    }

    const stats = this.calculateProgressStats(progress);
    const lastEntry = progress[progress.length - 1];

    // Recomendações baseadas no peso
    if (user.objetivo === 'perder-peso' && stats.weightChange > 0) {
      recommendations.push("Considere ajustar sua dieta ou aumentar a intensidade dos exercícios para atingir seu objetivo de perda de peso.");
    }

    if (user.objetivo === 'ganhar-massa' && stats.weightChange < 0) {
      recommendations.push("Aumente sua ingestão calórica e foque em exercícios de força para ganhar massa muscular.");
    }

    // Recomendações baseadas na atividade
    if (stats.averageExercises < 3) {
      recommendations.push("Tente fazer pelo menos 3 exercícios por semana para manter uma boa forma física.");
    }

    // Recomendações baseadas na hidratação
    if (stats.averageWater < 2.5) {
      recommendations.push("Aumente sua ingestão de água para pelo menos 2.5L por dia para otimizar seu metabolismo.");
    }

    // Recomendações baseadas nas calorias
    if (stats.averageCalories < 1500) {
      recommendations.push("Considere aumentar sua ingestão calórica para manter energia suficiente para seus exercícios.");
    }

    if (recommendations.length === 0) {
      recommendations.push("Parabéns! Você está mantendo uma rotina saudável. Continue assim!");
    }

    return recommendations;
  }
}
