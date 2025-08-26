import { useState, useEffect, useCallback } from 'react';
import { ProgressData } from '../types';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export interface UpdateProgressData {
  peso: number;
  altura?: number;
  calorias: number;
  exercicios: number;
  agua: number;
  sono: number;
  estresse: number;
  observacoes?: string;
}

export const useProgress = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Carregar dados de progresso
  const loadProgressData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getProgress();
      setProgressData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar progresso');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Adicionar nova entrada de progresso
  const addProgressEntry = useCallback(async (data: UpdateProgressData) => {
    try {
      setIsUpdating(true);
      setError(null);
      
      const newEntry = await api.addProgressEntry({
        peso: data.peso,
        calorias: data.calorias,
        exercicios: data.exercicios,
        agua: data.agua
      });
      
      setProgressData(prev => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar progresso');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Atualizar entrada de progresso existente
  const updateProgressEntry = useCallback(async (date: string, updates: Partial<ProgressData>) => {
    try {
      setIsUpdating(true);
      setError(null);
      
      const updatedEntry = await api.updateProgressEntry(date, updates);
      
      setProgressData(prev => 
        prev.map(entry => 
          entry.data === date ? updatedEntry : entry
        )
      );
      
      return updatedEntry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar progresso');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Deletar entrada de progresso
  const deleteProgressEntry = useCallback(async (date: string) => {
    try {
      setIsDeleting(true);
      setError(null);
      
      await api.deleteProgressEntry(date);
      
      setProgressData(prev => prev.filter(entry => entry.data !== date));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar progresso');
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  // Calcular estatísticas do progresso
  const calculateProgressStats = useCallback(() => {
    if (progressData.length === 0) {
      return {
        totalEntries: 0,
        averageWeight: 0,
        weightChange: 0,
        averageCalories: 0,
        averageExercises: 0,
        averageWater: 0,
        totalDays: 0,
        consistency: 0
      };
    }

    const sortedProgress = [...progressData].sort((a, b) => 
      new Date(a.data).getTime() - new Date(b.data).getTime()
    );

    const firstEntry = sortedProgress[0];
    const lastEntry = sortedProgress[sortedProgress.length - 1];

    const totalWeight = progressData.reduce((sum, entry) => sum + entry.peso, 0);
    const totalCalories = progressData.reduce((sum, entry) => sum + entry.calorias, 0);
    const totalExercises = progressData.reduce((sum, entry) => sum + entry.exercicios, 0);
    const totalWater = progressData.reduce((sum, entry) => sum + entry.agua, 0);

    // Calcular consistência (dias consecutivos)
    let consistency = 0;
    let currentStreak = 0;
    let maxStreak = 0;
    
    for (let i = 0; i < sortedProgress.length - 1; i++) {
      const currentDate = new Date(sortedProgress[i].data);
      const nextDate = new Date(sortedProgress[i + 1].data);
      const diffDays = Math.floor((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return {
      totalEntries: progressData.length,
      averageWeight: totalWeight / progressData.length,
      weightChange: lastEntry.peso - firstEntry.peso,
      averageCalories: totalCalories / progressData.length,
      averageExercises: totalExercises / progressData.length,
      averageWater: totalWater / progressData.length,
      totalDays: progressData.length,
      consistency: maxStreak
    };
  }, [progressData]);

  // Gerar dados para gráficos
  const generateChartData = useCallback(() => {
    if (progressData.length === 0) return { peso: [], calorias: [], exercicios: [] };

    const sortedProgress = [...progressData].sort((a, b) => 
      new Date(a.data).getTime() - new Date(b.data).getTime()
    );

    const peso = sortedProgress.map(entry => ({
      data: new Date(entry.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      valor: entry.peso
    }));

    const calorias = sortedProgress.slice(-7).map(entry => ({
      data: new Date(entry.data).toLocaleDateString('pt-BR', { weekday: 'short' }),
      valor: entry.calorias
    }));

    const exercicios = sortedProgress.slice(-7).map(entry => ({
      data: new Date(entry.data).toLocaleDateString('pt-BR', { weekday: 'short' }),
      valor: entry.exercicios
    }));

    return { peso, calorias, exercicios };
  }, [progressData]);

  // Carregar dados iniciais
  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  const stats = calculateProgressStats();
  const chartData = generateChartData();

  return {
    // Estado
    progressData,
    isLoading,
    error,
    isUpdating,
    isDeleting,
    
    // Dados calculados
    stats,
    chartData,
    
    // Ações
    loadProgressData,
    addProgressEntry,
    updateProgressEntry,
    deleteProgressEntry,
    
    // Utilitários
    refresh: loadProgressData
  };
};
