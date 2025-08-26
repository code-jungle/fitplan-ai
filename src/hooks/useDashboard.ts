import { useState, useEffect, useCallback } from 'react';
import { DashboardService, DashboardData, UpdateProgressRequest } from '../services/dashboardService';
import { useAuth } from '../contexts/AuthContext';

export const useDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  /**
   * Carrega os dados do dashboard
   */
  const loadDashboardData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const data = await DashboardService.getDashboardData(user.id);
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  /**
   * Atualiza o progresso do usuário
   */
  const updateProgress = useCallback(async (progressData: UpdateProgressRequest) => {
    if (!user?.id) return;

    try {
      setIsUpdatingProgress(true);
      setError(null);
      
      const newEntry = await DashboardService.updateProgress(progressData);
      
      // Atualiza os dados locais
      if (dashboardData) {
        setDashboardData(prev => prev ? {
          ...prev,
          progress: [...prev.progress, newEntry]
        } : null);
      }
      
      return newEntry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar progresso');
      throw err;
    } finally {
      setIsUpdatingProgress(false);
    }
  }, [user?.id, dashboardData]);

  /**
   * Recarrega os dados do dashboard
   */
  const refreshDashboard = useCallback(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Carrega dados iniciais
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Calcula estatísticas do progresso
  const progressStats = dashboardData ? DashboardService.calculateProgressStats(dashboardData.progress) : null;
  
  // Gera recomendações
  const recommendations = dashboardData ? DashboardService.generateRecommendations(dashboardData.user, dashboardData.progress) : [];

  return {
    // Estado
    dashboardData,
    isLoading,
    error,
    isUpdatingProgress,
    
    // Dados calculados
    progressStats,
    recommendations,
    
    // Ações
    updateProgress,
    refreshDashboard,
    loadDashboardData
  };
};
