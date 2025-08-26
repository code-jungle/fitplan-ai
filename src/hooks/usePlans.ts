import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PlanGenerator } from '../services/planGenerator';
import { PlanAdjuster, PlanAdjustmentResult } from '../services/planAdjuster';
import { GeneratedPlan, DietPlan, TrainingPlan, ProgressData } from '../types';

export interface PlanState {
  currentPlan: GeneratedPlan | null;
  isLoading: boolean;
  error: string | null;
  hasGeneratedPlan: boolean;
  lastAdjustment: PlanAdjustmentResult | null;
  showAdjustmentNotification: boolean;
}

export const usePlans = () => {
  const { user } = useAuth();
  const [planState, setPlanState] = useState<PlanState>({
    currentPlan: null,
    isLoading: false,
    error: null,
    hasGeneratedPlan: false,
    lastAdjustment: null,
    showAdjustmentNotification: false
  });

  /**
   * Gera um novo plano completo baseado no perfil do usuário
   */
  const generateNewPlan = useCallback(async () => {
    if (!user) {
      setPlanState(prev => ({
        ...prev,
        error: 'Usuário não autenticado'
      }));
      return null;
    }

    try {
      setPlanState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));

      // Simular delay de geração (futuramente será substituído por IA)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newPlan = PlanGenerator.generateCompletePlan(user);

      setPlanState(prev => ({
        ...prev,
        currentPlan: newPlan,
        isLoading: false,
        hasGeneratedPlan: true
      }));

      // Salvar no localStorage para persistência
      localStorage.setItem('fitplan_current_plan', JSON.stringify(newPlan));
      localStorage.setItem('fitplan_plan_generated', 'true');

      return newPlan;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar plano';
      setPlanState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
      return null;
    }
  }, [user]);

  /**
   * Carrega plano existente do localStorage
   */
  const loadExistingPlan = useCallback(() => {
    try {
      const savedPlan = localStorage.getItem('fitplan_current_plan');
      const hasGenerated = localStorage.getItem('fitplan_plan_generated') === 'true';

      if (savedPlan && hasGenerated) {
        const parsedPlan = JSON.parse(savedPlan) as GeneratedPlan;
        
        // Verificar se o plano ainda é válido
        const planExpiry = new Date(parsedPlan.validade);
        const now = new Date();
        
        if (now < planExpiry) {
          setPlanState(prev => ({
            ...prev,
            currentPlan: parsedPlan,
            hasGeneratedPlan: true
          }));
          return parsedPlan;
        } else {
          // Plano expirado, limpar localStorage
          localStorage.removeItem('fitplan_current_plan');
          localStorage.removeItem('fitplan_plan_generated');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar plano salvo:', error);
      // Limpar dados corrompidos
      localStorage.removeItem('fitplan_current_plan');
      localStorage.removeItem('fitplan_plan_generated');
    }

    return null;
  }, []);

  /**
   * Atualiza plano existente
   */
  const updatePlan = useCallback(async (updates: Partial<GeneratedPlan>) => {
    if (!planState.currentPlan) {
      setPlanState(prev => ({
        ...prev,
        error: 'Nenhum plano para atualizar'
      }));
      return null;
    }

    try {
      setPlanState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));

      // Simular delay de atualização
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedPlan: GeneratedPlan = {
        ...planState.currentPlan,
        ...updates,
        dataGeracao: new Date().toISOString()
      };

      setPlanState(prev => ({
        ...prev,
        currentPlan: updatedPlan,
        isLoading: false
      }));

      // Atualizar localStorage
      localStorage.setItem('fitplan_current_plan', JSON.stringify(updatedPlan));

      return updatedPlan;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar plano';
      setPlanState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
      return null;
    }
  }, [planState.currentPlan]);

  /**
   * Regenera plano com base em novos dados do usuário
   */
  const regeneratePlan = useCallback(async () => {
    if (!user) {
      setPlanState(prev => ({
        ...prev,
        error: 'Usuário não autenticado'
      }));
      return null;
    }

    try {
      setPlanState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));

      // Simular delay de regeneração
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newPlan = PlanGenerator.generateCompletePlan(user);

      setPlanState(prev => ({
        ...prev,
        currentPlan: newPlan,
        isLoading: false
      }));

      // Atualizar localStorage
      localStorage.setItem('fitplan_current_plan', JSON.stringify(newPlan));

      return newPlan;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao regenerar plano';
      setPlanState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
      return null;
    }
  }, [user]);

  /**
   * Ajusta automaticamente o plano baseado no progresso do usuário
   */
  const adjustPlanAutomatically = useCallback(async (
    progressData: ProgressData[]
  ) => {
    if (!user || !planState.currentPlan || progressData.length === 0) {
      return null;
    }

    try {
      setPlanState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));

      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1500));

      const lastProgress = progressData[progressData.length - 1];
      const adjustmentResult = PlanAdjuster.adjustPlanBasedOnProgress(
        planState.currentPlan,
        user,
        progressData,
        lastProgress
      );

      // Atualizar o plano atual
      setPlanState(prev => ({
        ...prev,
        currentPlan: adjustmentResult.plan,
        isLoading: false,
        lastAdjustment: adjustmentResult,
        showAdjustmentNotification: true
      }));

      // Salvar plano ajustado no localStorage
      localStorage.setItem('fitplan_current_plan', JSON.stringify(adjustmentResult.plan));

      // Ocultar notificação após 5 segundos
      setTimeout(() => {
        setPlanState(prev => ({
          ...prev,
          showAdjustmentNotification: false
        }));
      }, 5000);

      return adjustmentResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao ajustar plano';
      setPlanState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
      return null;
    }
  }, [user, planState.currentPlan]);

  /**
   * Ocultar notificação de ajuste
   */
  const hideAdjustmentNotification = useCallback(() => {
    setPlanState(prev => ({
      ...prev,
      showAdjustmentNotification: false
    }));
  }, []);

  /**
   * Remove plano atual
   */
  const removePlan = useCallback(() => {
    setPlanState(prev => ({
      ...prev,
      currentPlan: null,
      hasGeneratedPlan: false
    }));

    // Limpar localStorage
    localStorage.removeItem('fitplan_current_plan');
    localStorage.removeItem('fitplan_plan_generated');
  }, []);

  /**
   * Limpa erros
   */
  const clearError = useCallback(() => {
    setPlanState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  /**
   * Verifica se o plano atual está próximo de expirar
   */
  const isPlanExpiringSoon = useCallback(() => {
    if (!planState.currentPlan) return false;

    const planExpiry = new Date(planState.currentPlan.validade);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((planExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return daysUntilExpiry <= 7; // Expira em 7 dias ou menos
  }, [planState.currentPlan]);

  /**
   * Obtém estatísticas do plano atual
   */
  const getPlanStats = useCallback(() => {
    if (!planState.currentPlan) return null;

    const { planoDieta, planoTreino } = planState.currentPlan;
    
    return {
      dieta: {
        totalRefeicoes: planoDieta?.refeicoes.length || 0,
        caloriasDiarias: planoDieta?.caloriasDiarias || 0,
        duracao: planoDieta?.duracao || 0
      },
      treino: {
        totalTreinos: planoTreino?.treinos.length || 0,
        frequenciaSemanal: planoTreino?.frequencia || 0,
        duracao: planoTreino?.duracao || 0
      },
      proximaAvaliacao: planState.currentPlan.proximaAvaliacao,
      validade: planState.currentPlan.validade
    };
  }, [planState.currentPlan]);

  /**
   * Obtém próximas ações recomendadas
   */
  const getNextActions = useCallback(() => {
    if (!planState.currentPlan) return [];

    const actions = [];
    const now = new Date();
    const planDate = new Date(planState.currentPlan.dataGeracao);
    const daysSinceGeneration = Math.floor((now.getTime() - planDate.getTime()) / (1000 * 60 * 60 * 24));

    // Ações baseadas no tempo desde a geração do plano
    if (daysSinceGeneration === 0) {
      actions.push('Começar a seguir o plano hoje mesmo');
      actions.push('Preparar lista de compras para a semana');
    } else if (daysSinceGeneration === 1) {
      actions.push('Avaliar como foi o primeiro dia');
      actions.push('Ajustar horários se necessário');
    } else if (daysSinceGeneration === 3) {
      actions.push('Primeira avaliação de progresso');
      actions.push('Ajustar intensidade se necessário');
    } else if (daysSinceGeneration === 7) {
      actions.push('Avaliação semanal completa');
      actions.push('Regenerar plano se necessário');
    }

    // Ações baseadas no objetivo
    if (planState.currentPlan.objetivo.includes('Perda de Peso')) {
      actions.push('Pesar-se e registrar no app');
      actions.push('Medir circunferências');
    } else if (planState.currentPlan.objetivo.includes('Ganho de Massa')) {
      actions.push('Registrar progresso nos pesos');
      actions.push('Tirar fotos de progresso');
    }

    return actions;
  }, [planState.currentPlan]);

  return {
    // Estado
    ...planState,
    
    // Ações
    generateNewPlan,
    loadExistingPlan,
    updatePlan,
    regeneratePlan,
    adjustPlanAutomatically,
    removePlan,
    clearError,
    hideAdjustmentNotification,
    
    // Utilitários
    isPlanExpiringSoon,
    getPlanStats,
    getNextActions
  };
};
