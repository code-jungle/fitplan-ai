import { User, GeneratedPlan, DietPlan, TrainingPlan, ProgressData } from '../types';
import { PlanGenerator } from './planGenerator';

export interface PlanAdjustmentResult {
  plan: GeneratedPlan;
  adjustments: PlanAdjustment[];
  message: string;
  needsRegeneration: boolean;
}

export interface PlanAdjustment {
  type: 'dieta' | 'treino' | 'geral';
  field: string;
  oldValue: any;
  newValue: any;
  reason: string;
  priority: 'baixa' | 'media' | 'alta';
}

export interface ProgressAnalysis {
  weightTrend: 'losing' | 'gaining' | 'stable';
  weightChange: number;
  consistency: number; // 0-100
  adherence: number; // 0-100
  recommendations: string[];
}

export class PlanAdjuster {
  /**
   * Analisa o progresso do usuário e ajusta o plano automaticamente
   */
  static adjustPlanBasedOnProgress(
    currentPlan: GeneratedPlan,
    user: User,
    progressData: ProgressData[],
    lastProgress: ProgressData
  ): PlanAdjustmentResult {
    const analysis = this.analyzeProgress(progressData, lastProgress, user);
    const adjustments: PlanAdjustment[] = [];
    
    // Determinar se precisa regenerar o plano completamente
    const needsRegeneration = this.shouldRegeneratePlan(analysis, currentPlan);
    
    if (needsRegeneration) {
      const newPlan = PlanGenerator.generateCompletePlan(user);
      return {
        plan: newPlan,
        adjustments: [{
          type: 'geral',
          field: 'plano_completo',
          oldValue: 'plano_anterior',
          newValue: 'plano_regenerado',
          reason: 'Progresso significativo detectado - plano regenerado completamente',
          priority: 'alta'
        }],
        message: 'Seu plano foi regenerado completamente com base no seu progresso!',
        needsRegeneration: true
      };
    }
    
    // Ajustes incrementais
    const adjustedPlan = { ...currentPlan };
    
    // Ajustar plano de dieta se existir
    if (currentPlan.planoDieta) {
      const dietAdjustments = this.adjustDietPlan(
        currentPlan.planoDieta,
        analysis,
        user
      );
      adjustments.push(...dietAdjustments);
      
      // Aplicar ajustes ao plano de dieta
      adjustedPlan.planoDieta = this.applyDietAdjustments(
        currentPlan.planoDieta,
        dietAdjustments
      );
    }
    
    // Ajustar plano de treino se existir
    if (currentPlan.planoTreino) {
      const trainingAdjustments = this.adjustTrainingPlan(
        currentPlan.planoTreino,
        analysis,
        user
      );
      adjustments.push(...trainingAdjustments);
      
      // Aplicar ajustes ao plano de treino
      adjustedPlan.planoTreino = this.applyTrainingAdjustments(
        currentPlan.planoTreino,
        trainingAdjustments
      );
    }
    
    // Atualizar recomendações
    adjustedPlan.recomendacoes = this.generateUpdatedRecommendations(
      currentPlan.recomendacoes,
      analysis,
      adjustments
    );
    
    // Atualizar data de geração e validade
    adjustedPlan.dataGeracao = new Date().toISOString();
    adjustedPlan.validade = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
    return {
      plan: adjustedPlan,
      adjustments,
      message: this.generateAdjustmentMessage(adjustments),
      needsRegeneration: false
    };
  }
  
  /**
   * Analisa o progresso do usuário
   */
  private static analyzeProgress(
    progressData: ProgressData[],
    lastProgress: ProgressData,
    user: User
  ): ProgressAnalysis {
    if (progressData.length < 2) {
      return {
        weightTrend: 'stable',
        weightChange: 0,
        consistency: 100,
        adherence: 100,
        recommendations: ['Continue seguindo o plano atual']
      };
    }
    
    // Calcular tendência de peso
    const weightData = progressData.map(p => p.peso);
    const weightChange = weightData[weightData.length - 1] - weightData[0];
    const weightTrend = this.calculateWeightTrend(weightChange, user.objetivo);
    
    // Calcular consistência (frequência de atualizações)
    const consistency = this.calculateConsistency(progressData);
    
    // Calcular aderência (quão próximo está do objetivo)
    const adherence = this.calculateAdherence(weightChange, user.objetivo);
    
    // Gerar recomendações baseadas na análise
    const recommendations = this.generateProgressRecommendations(
      weightTrend,
      weightChange,
      consistency,
      adherence,
      user.objetivo
    );
    
    return {
      weightTrend,
      weightChange: Math.abs(weightChange),
      consistency,
      adherence,
      recommendations
    };
  }
  
  /**
   * Determina se o plano deve ser regenerado completamente
   */
  private static shouldRegeneratePlan(
    analysis: ProgressAnalysis,
    currentPlan: GeneratedPlan
  ): boolean {
    // Regenerar se:
    // 1. Mudança de peso muito significativa (>5kg)
    if (analysis.weightChange > 5) return true;
    
    // 2. Consistência muito baixa (<30%)
    if (analysis.consistency < 30) return true;
    
    // 3. Aderência muito baixa (<20%)
    if (analysis.adherence < 20) return true;
    
    // 4. Plano muito antigo (>60 dias)
    const planAge = Date.now() - new Date(currentPlan.dataGeracao).getTime();
    const daysOld = planAge / (1000 * 60 * 60 * 24);
    if (daysOld > 60) return true;
    
    return false;
  }
  
  /**
   * Ajusta o plano de dieta baseado no progresso
   */
  private static adjustDietPlan(
    dietPlan: DietPlan,
    analysis: ProgressAnalysis,
    user: User
  ): PlanAdjustment[] {
    const adjustments: PlanAdjustment[] = [];
    
    // Ajustar calorias baseado na tendência de peso
    const currentCalories = dietPlan.caloriasDiarias;
    let newCalories = currentCalories;
    
    if (analysis.weightTrend === 'losing' && user.objetivo === 'perder-peso') {
      // Reduzir calorias se está perdendo peso muito rapidamente
      if (analysis.weightChange > 2) {
        newCalories = Math.round(currentCalories * 0.95);
        adjustments.push({
          type: 'dieta',
          field: 'caloriasDiarias',
          oldValue: currentCalories,
          newValue: newCalories,
          reason: 'Perda de peso muito rápida - reduzindo calorias para progresso sustentável',
          priority: 'media'
        });
      }
    } else if (analysis.weightTrend === 'gaining' && user.objetivo === 'ganhar-massa') {
      // Aumentar calorias se não está ganhando peso
      if (analysis.weightChange < 1) {
        newCalories = Math.round(currentCalories * 1.05);
        adjustments.push({
          type: 'dieta',
          field: 'caloriasDiarias',
          oldValue: currentCalories,
          newValue: newCalories,
          reason: 'Ganho de peso insuficiente - aumentando calorias para estimular crescimento',
          priority: 'media'
        });
      }
    }
    
    // Ajustar hidratação baseado na consistência
    if (analysis.consistency < 70) {
      const currentWater = dietPlan.hidratacao.agua;
      const newWater = Math.round(currentWater * 1.1);
      
      adjustments.push({
        type: 'dieta',
        field: 'hidratacao.agua',
        oldValue: currentWater,
        newValue: newWater,
        reason: 'Baixa consistência detectada - aumentando recomendação de água',
        priority: 'baixa'
      });
    }
    
    return adjustments;
  }
  
  /**
   * Ajusta o plano de treino baseado no progresso
   */
  private static adjustTrainingPlan(
    trainingPlan: TrainingPlan,
    analysis: ProgressAnalysis,
    user: User
  ): PlanAdjustment[] {
    const adjustments: PlanAdjustment[] = [];
    
    // Ajustar frequência baseado na consistência
    const currentFrequency = trainingPlan.frequencia;
    let newFrequency = currentFrequency;
    
    if (analysis.consistency < 60) {
      // Reduzir frequência se não está sendo consistente
      newFrequency = Math.max(2, currentFrequency - 1);
      adjustments.push({
        type: 'treino',
        field: 'frequencia',
        oldValue: currentFrequency,
        newValue: newFrequency,
        reason: 'Baixa consistência detectada - reduzindo frequência para facilitar aderência',
        priority: 'media'
      });
    } else if (analysis.consistency > 90 && analysis.adherence > 80) {
      // Aumentar frequência se está sendo muito consistente
      newFrequency = Math.min(6, currentFrequency + 1);
      adjustments.push({
        type: 'treino',
        field: 'frequencia',
        oldValue: currentFrequency,
        newValue: newFrequency,
        reason: 'Alta consistência e aderência - aumentando frequência para otimizar resultados',
        priority: 'baixa'
      });
    }
    
    // Ajustar dificuldade baseado no progresso
    const currentDifficulty = trainingPlan.dificuldade;
    let newDifficulty = currentDifficulty;
    
    if (analysis.weightTrend === 'losing' && user.objetivo === 'perder-peso') {
      // Aumentar dificuldade se está perdendo peso consistentemente
      if (analysis.consistency > 80 && analysis.weightChange > 2) {
        newDifficulty = this.increaseDifficulty(currentDifficulty);
        if (newDifficulty !== currentDifficulty) {
          adjustments.push({
            type: 'treino',
            field: 'dificuldade',
            oldValue: currentDifficulty,
            newValue: newDifficulty,
            reason: 'Progresso consistente detectado - aumentando dificuldade do treino',
            priority: 'media'
          });
        }
      }
    }
    
    return adjustments;
  }
  
  /**
   * Aplica ajustes ao plano de dieta
   */
  private static applyDietAdjustments(
    dietPlan: DietPlan,
    adjustments: PlanAdjustment[]
  ): DietPlan {
    const adjustedPlan = { ...dietPlan };
    
    adjustments.forEach(adjustment => {
      if (adjustment.type === 'dieta') {
        switch (adjustment.field) {
          case 'caloriasDiarias':
            adjustedPlan.caloriasDiarias = adjustment.newValue;
            // Recalcular refeições com novas calorias
            adjustedPlan.refeicoes = this.recalculateMeals(
              adjustedPlan.refeicoes,
              adjustment.newValue
            );
            break;
          case 'hidratacao.agua':
            adjustedPlan.hidratacao = {
              ...adjustedPlan.hidratacao,
              agua: adjustment.newValue
            };
            break;
        }
      }
    });
    
    return adjustedPlan;
  }
  
  /**
   * Aplica ajustes ao plano de treino
   */
  private static applyTrainingAdjustments(
    trainingPlan: TrainingPlan,
    adjustments: PlanAdjustment[]
  ): TrainingPlan {
    const adjustedPlan = { ...trainingPlan };
    
    adjustments.forEach(adjustment => {
      if (adjustment.type === 'treino') {
        switch (adjustment.field) {
          case 'frequencia':
            adjustedPlan.frequencia = adjustment.newValue;
            // Ajustar treinos para nova frequência
            adjustedPlan.treinos = this.adjustWorkoutsForFrequency(
              adjustedPlan.treinos,
              adjustment.newValue
            );
            break;
          case 'dificuldade':
            adjustedPlan.dificuldade = adjustment.newValue;
            // Ajustar exercícios para nova dificuldade
            adjustedPlan.treinos = this.adjustWorkoutsForDifficulty(
              adjustedPlan.treinos,
              adjustment.newValue
            );
            break;
        }
      }
    });
    
    return adjustedPlan;
  }
  
  /**
   * Gera mensagem de ajuste para o usuário
   */
  private static generateAdjustmentMessage(adjustments: PlanAdjustment[]): string {
    if (adjustments.length === 0) {
      return 'Seu plano está otimizado para seu progresso atual!';
    }
    
    const highPriorityCount = adjustments.filter(a => a.priority === 'alta').length;
    const mediumPriorityCount = adjustments.filter(a => a.priority === 'media').length;
    
    if (highPriorityCount > 0) {
      return 'Seu plano foi ajustado com base no seu progresso. Algumas mudanças importantes foram feitas para otimizar seus resultados.';
    } else if (mediumPriorityCount > 0) {
      return 'Seu plano foi ajustado com base no seu progresso. Pequenas otimizações foram aplicadas para melhorar sua experiência.';
    } else {
      return 'Seu plano foi ajustado com base no seu progresso. Ajustes menores foram feitos para manter tudo alinhado.';
    }
  }
  
  /**
   * Gera recomendações atualizadas baseadas no progresso
   */
  private static generateUpdatedRecommendations(
    currentRecommendations: string[],
    analysis: ProgressAnalysis,
    adjustments: PlanAdjustment[]
  ): string[] {
    const newRecommendations = [...currentRecommendations];
    
    // Adicionar recomendações baseadas no progresso
    if (analysis.weightTrend === 'losing' && analysis.weightChange > 2) {
      newRecommendations.push('Excelente progresso na perda de peso! Continue mantendo a consistência.');
    } else if (analysis.weightTrend === 'gaining' && analysis.weightChange > 1) {
      newRecommendations.push('Ótimo ganho de massa! Mantenha o foco na alimentação e descanso.');
    }
    
    if (analysis.consistency < 70) {
      newRecommendations.push('Tente ser mais consistente com suas atualizações para melhores resultados.');
    }
    
    if (analysis.adherence < 60) {
      newRecommendations.push('Considere ajustar seus horários para melhor aderência ao plano.');
    }
    
    // Limitar a 8 recomendações
    return newRecommendations.slice(0, 8);
  }
  
  // Métodos auxiliares
  private static calculateWeightTrend(weightChange: number, objetivo: string): 'losing' | 'gaining' | 'stable' {
    if (Math.abs(weightChange) < 0.5) return 'stable';
    return weightChange > 0 ? 'gaining' : 'losing';
  }
  
  private static calculateConsistency(progressData: ProgressData[]): number {
    if (progressData.length < 2) return 100;
    
    const expectedUpdates = Math.ceil((Date.now() - new Date(progressData[0].data).getTime()) / (7 * 24 * 60 * 60 * 1000));
    const actualUpdates = progressData.length;
    
    return Math.min(100, Math.round((actualUpdates / expectedUpdates) * 100));
  }
  
  private static calculateAdherence(weightChange: number, objetivo: string): number {
    if (objetivo === 'perder-peso') {
      return weightChange < 0 ? 100 : Math.max(0, 100 - Math.abs(weightChange) * 10);
    } else if (objetivo === 'ganhar-massa') {
      return weightChange > 0 ? 100 : Math.max(0, 100 - Math.abs(weightChange) * 10);
    }
    return 100;
  }
  
  private static generateProgressRecommendations(
    weightTrend: 'losing' | 'gaining' | 'stable',
    weightChange: number,
    consistency: number,
    adherence: number,
    objetivo: string
  ): string[] {
    const recommendations: string[] = [];
    
    if (consistency < 70) {
      recommendations.push('Tente atualizar seu progresso pelo menos uma vez por semana');
    }
    
    if (adherence < 60) {
      recommendations.push('Considere ajustar seus horários para melhor aderência');
    }
    
    if (weightTrend === 'losing' && objetivo === 'perder-peso') {
      if (weightChange > 2) {
        recommendations.push('Perda de peso muito rápida - considere reduzir o déficit calórico');
      } else if (weightChange < 0.5) {
        recommendations.push('Perda de peso lenta - verifique se está seguindo o plano corretamente');
      }
    }
    
    if (weightTrend === 'gaining' && objetivo === 'ganhar-massa') {
      if (weightChange < 0.5) {
        recommendations.push('Ganho de massa lento - considere aumentar as calorias');
      }
    }
    
    return recommendations;
  }
  
  private static increaseDifficulty(difficulty: 'iniciante' | 'intermediario' | 'avancado'): 'iniciante' | 'intermediario' | 'avancado' {
    const levels: Array<'iniciante' | 'intermediario' | 'avancado'> = ['iniciante', 'intermediario', 'avancado'];
    const currentIndex = levels.indexOf(difficulty);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : difficulty;
  }
  
  private static recalculateMeals(meals: any[], newCalories: number): any[] {
    // Recalcular calorias das refeições proporcionalmente
    const totalCurrentCalories = meals.reduce((sum, meal) => sum + meal.calorias, 0);
    const ratio = newCalories / totalCurrentCalories;
    
    return meals.map(meal => ({
      ...meal,
      calorias: Math.round(meal.calorias * ratio),
      proteinas: Math.round((meal.calorias * ratio * 0.25) / 4),
      carboidratos: Math.round((meal.calorias * ratio * 0.55) / 4),
      gorduras: Math.round((meal.calorias * ratio * 0.20) / 9)
    }));
  }
  
  private static adjustWorkoutsForFrequency(workouts: any[], newFrequency: number): any[] {
    if (newFrequency >= workouts.length) {
      return workouts;
    }
    
    // Reduzir número de treinos se frequência diminuiu
    return workouts.slice(0, newFrequency);
  }
  
  private static adjustWorkoutsForDifficulty(workouts: any[], newDifficulty: string): any[] {
    // Ajustar intensidade dos exercícios baseado na nova dificuldade
    return workouts.map(workout => ({
      ...workout,
      exercicios: workout.exercicios.map((exercise: any) => ({
        ...exercise,
        series: newDifficulty === 'avancado' ? exercise.series + 1 : exercise.series,
        repeticoes: newDifficulty === 'iniciante' ? exercise.repeticoes + 2 : exercise.repeticoes
      }))
    }));
  }
}
