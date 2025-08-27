import { useState, useEffect, useCallback } from 'react';
import { UserMeal, CreateMealRequest, UpdateMealRequest } from '../types';
import { MealsService } from '../services/mealsService';

export const useMeals = () => {
  const [meals, setMeals] = useState<UserMeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Carregar refeições iniciais
  useEffect(() => {
    loadMeals();
  }, []);

  // Carregar refeições por data
  useEffect(() => {
    loadMealsByDate(selectedDate);
  }, [selectedDate]);

  // Carregar todas as refeições
  const loadMeals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await MealsService.getUserMeals();
      setMeals(data);
    } catch (err) {
      setError('Erro ao carregar refeições');
      console.error('Erro ao carregar refeições:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar refeições por data específica
  const loadMealsByDate = useCallback(async (date: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await MealsService.getMealsByDate(date);
      setMeals(data);
    } catch (err) {
      setError('Erro ao carregar refeições da data selecionada');
      console.error('Erro ao carregar refeições por data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Criar nova refeição
  const createMeal = useCallback(async (mealData: CreateMealRequest): Promise<UserMeal | null> => {
    setError(null);
    
    try {
      const newMeal = await MealsService.createMeal(mealData);
      setMeals(prev => [newMeal, ...prev]);
      return newMeal;
    } catch (err) {
      setError('Erro ao criar refeição');
      console.error('Erro ao criar refeição:', err);
      return null;
    }
  }, []);

  // Atualizar refeição
  const updateMeal = useCallback(async (mealId: string, updates: UpdateMealRequest): Promise<UserMeal | null> => {
    setError(null);
    
    try {
      const updatedMeal = await MealsService.updateMeal(mealId, updates);
      setMeals(prev => prev.map(meal => meal.id === mealId ? updatedMeal : meal));
      return updatedMeal;
    } catch (err) {
      setError('Erro ao atualizar refeição');
      console.error('Erro ao atualizar refeição:', err);
      return null;
    }
  }, []);

  // Deletar refeição
  const deleteMeal = useCallback(async (mealId: string): Promise<boolean> => {
    setError(null);
    
    try {
      const success = await MealsService.deleteMeal(mealId);
      if (success) {
        setMeals(prev => prev.filter(meal => meal.id !== mealId));
      }
      return success;
    } catch (err) {
      setError('Erro ao deletar refeição');
      console.error('Erro ao deletar refeição:', err);
      return false;
    }
  }, []);

  // Atualizar status da refeição
  const updateMealStatus = useCallback(async (mealId: string, status: 'planejada' | 'consumida' | 'pulada'): Promise<boolean> => {
    setError(null);
    
    try {
      const updatedMeal = await MealsService.updateMealStatus(mealId, status);
      setMeals(prev => prev.map(meal => meal.id === mealId ? updatedMeal : meal));
      return true;
    } catch (err) {
      setError('Erro ao atualizar status da refeição');
      console.error('Erro ao atualizar status da refeição:', err);
      return false;
    }
  }, []);

  // Obter estatísticas nutricionais
  const getNutritionStats = useCallback(async (startDate: string, endDate: string) => {
    try {
      return await MealsService.getNutritionStats(startDate, endDate);
    } catch (err) {
      console.error('Erro ao buscar estatísticas nutricionais:', err);
      return {
        calorias: 0,
        proteinas: 0,
        carboidratos: 0,
        gorduras: 0,
        refeicoes: 0
      };
    }
  }, []);

  // Filtrar refeições por categoria
  const getMealsByCategory = useCallback((category: string) => {
    return meals.filter(meal => meal.categoria === category);
  }, [meals]);

  // Obter refeições do dia atual
  const getTodayMeals = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return meals.filter(meal => meal.data === today);
  }, [meals]);

  // Obter próxima refeição
  const getNextMeal = useCallback(() => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return meals
      .filter(meal => meal.data === selectedDate)
      .find(meal => {
        const [hours, minutes] = meal.horario.split(':').map(Number);
        const mealTime = hours * 60 + minutes;
        return mealTime > currentTime;
      });
  }, [meals, selectedDate]);

  // Calcular total de calorias do dia
  const getDailyCalories = useCallback(() => {
    return meals
      .filter(meal => meal.data === selectedDate)
      .reduce((total, meal) => total + meal.caloriasTotais, 0);
  }, [meals, selectedDate]);

  // Calcular total de macronutrientes do dia
  const getDailyMacros = useCallback(() => {
    return meals
      .filter(meal => meal.data === selectedDate)
      .reduce((total, meal) => ({
        proteinas: total.proteinas + meal.proteinasTotais,
        carboidratos: total.carboidratos + meal.carboidratosTotais,
        gorduras: total.gorduras + meal.gordurasTotais
      }), { proteinas: 0, carboidratos: 0, gorduras: 0 });
  }, [meals, selectedDate]);

  return {
    // Estado
    meals,
    isLoading,
    error,
    selectedDate,
    
    // Ações
    loadMeals,
    loadMealsByDate,
    createMeal,
    updateMeal,
    deleteMeal,
    updateMealStatus,
    getNutritionStats,
    
    // Filtros e cálculos
    getMealsByCategory,
    getTodayMeals,
    getNextMeal,
    getDailyCalories,
    getDailyMacros,
    
    // Setters
    setSelectedDate,
    setError
  };
};
