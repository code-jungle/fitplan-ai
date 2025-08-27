import { UserMeal, CreateMealRequest, UpdateMealRequest, MealItem } from '../types';

export class MealsService {
  private static readonly STORAGE_KEY = 'fitplan_user_meals';

  /**
   * Obtém todas as refeições do usuário
   */
  static async getUserMeals(): Promise<UserMeal[]> {
    try {
      // TODO: Integrar com Supabase/API
      // const { data, error } = await supabase
      //   .from('user_meals')
      //   .select('*')
      //   .order('data', { ascending: false });
      
      // if (error) throw error;
      // return data || [];

      // Placeholder - dados mockados para desenvolvimento
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }

      // Dados de exemplo para demonstração
      return this.getMockMeals();
    } catch (error) {
      console.error('Erro ao buscar refeições:', error);
      return [];
    }
  }

  /**
   * Obtém refeições por data específica
   */
  static async getMealsByDate(date: string): Promise<UserMeal[]> {
    try {
      const allMeals = await this.getUserMeals();
      return allMeals.filter(meal => meal.data === date);
    } catch (error) {
      console.error('Erro ao buscar refeições por data:', error);
      return [];
    }
  }

  /**
   * Cria uma nova refeição
   */
  static async createMeal(mealData: CreateMealRequest): Promise<UserMeal> {
    try {
      // TODO: Integrar com Supabase/API
      // const { data, error } = await supabase
      //   .from('user_meals')
      //   .insert([mealData])
      //   .select()
      //   .single();
      
      // if (error) throw error;
      // return data;

      // Placeholder - criação local
      const newMeal: UserMeal = {
        id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...mealData,
        itens: mealData.itens.map((item, index) => ({
          ...item,
          id: `item_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`
        })),
        caloriasTotais: mealData.itens.reduce((sum, item) => sum + item.calorias, 0),
        proteinasTotais: mealData.itens.reduce((sum, item) => sum + item.proteinas, 0),
        carboidratosTotais: mealData.itens.reduce((sum, item) => sum + item.carboidratos, 0),
        gordurasTotais: mealData.itens.reduce((sum, item) => sum + item.gorduras, 0),
        status: 'planejada'
      };

      const currentMeals = await this.getUserMeals();
      const updatedMeals = [newMeal, ...currentMeals];
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedMeals));
      
      return newMeal;
    } catch (error) {
      console.error('Erro ao criar refeição:', error);
      throw new Error('Falha ao criar refeição');
    }
  }

  /**
   * Atualiza uma refeição existente
   */
  static async updateMeal(mealId: string, updates: UpdateMealRequest): Promise<UserMeal> {
    try {
      // TODO: Integrar com Supabase/API
      // const { data, error } = await supabase
      //   .from('user_meals')
      //   .update(updates)
      //   .eq('id', mealId)
      //   .select()
      //   .single();
      
      // if (error) throw error;
      // return data;

      // Placeholder - atualização local
      const currentMeals = await this.getUserMeals();
      const mealIndex = currentMeals.findIndex(meal => meal.id === mealId);
      
      if (mealIndex === -1) {
        throw new Error('Refeição não encontrada');
      }

      const updatedMeal: UserMeal = {
        ...currentMeals[mealIndex],
        ...updates,
        itens: updates.itens 
          ? updates.itens.map((item, index) => ({
              ...item,
              id: `item_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`
            }))
          : currentMeals[mealIndex].itens,
        caloriasTotais: updates.itens 
          ? updates.itens.reduce((sum, item) => sum + item.calorias, 0)
          : currentMeals[mealIndex].caloriasTotais,
        proteinasTotais: updates.itens
          ? updates.itens.reduce((sum, item) => sum + item.proteinas, 0)
          : currentMeals[mealIndex].proteinasTotais,
        carboidratosTotais: updates.itens
          ? updates.itens.reduce((sum, item) => sum + item.carboidratos, 0)
          : currentMeals[mealIndex].carboidratosTotais,
        gordurasTotais: updates.itens
          ? updates.itens.reduce((sum, item) => sum + item.gorduras, 0)
          : currentMeals[mealIndex].gordurasTotais
      };

      currentMeals[mealIndex] = updatedMeal;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentMeals));
      
      return updatedMeal;
    } catch (error) {
      console.error('Erro ao atualizar refeição:', error);
      throw new Error('Falha ao atualizar refeição');
    }
  }

  /**
   * Remove uma refeição
   */
  static async deleteMeal(mealId: string): Promise<boolean> {
    try {
      // TODO: Integrar com Supabase/API
      // const { error } = await supabase
      //   .from('user_meals')
      //   .delete()
      //   .eq('id', mealId);
      
      // if (error) throw error;
      // return true;

      // Placeholder - remoção local
      const currentMeals = await this.getUserMeals();
      const filteredMeals = currentMeals.filter(meal => meal.id !== mealId);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredMeals));
      
      return true;
    } catch (error) {
      console.error('Erro ao deletar refeição:', error);
      throw new Error('Falha ao deletar refeição');
    }
  }

  /**
   * Atualiza o status de uma refeição
   */
  static async updateMealStatus(mealId: string, status: 'planejada' | 'consumida' | 'pulada'): Promise<UserMeal> {
    try {
      return await this.updateMeal(mealId, { status } as unknown as UpdateMealRequest);
    } catch (error) {
      console.error('Erro ao atualizar status da refeição:', error);
      throw new Error('Falha ao atualizar status da refeição');
    }
  }

  /**
   * Obtém estatísticas nutricionais por período
   */
  static async getNutritionStats(startDate: string, endDate: string): Promise<{
    calorias: number;
    proteinas: number;
    carboidratos: number;
    gorduras: number;
    refeicoes: number;
  }> {
    try {
      const allMeals = await this.getUserMeals();
      const periodMeals = allMeals.filter(meal => 
        meal.data >= startDate && meal.data <= endDate && meal.status === 'consumida'
      );

      return {
        calorias: periodMeals.reduce((sum, meal) => sum + meal.caloriasTotais, 0),
        proteinas: periodMeals.reduce((sum, meal) => sum + meal.proteinasTotais, 0),
        carboidratos: periodMeals.reduce((sum, meal) => sum + meal.carboidratosTotais, 0),
        gorduras: periodMeals.reduce((sum, meal) => sum + meal.gordurasTotais, 0),
        refeicoes: periodMeals.length
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas nutricionais:', error);
      return {
        calorias: 0,
        proteinas: 0,
        carboidratos: 0,
        gorduras: 0,
        refeicoes: 0
      };
    }
  }

  /**
   * Dados mockados para demonstração
   */
  private static getMockMeals(): UserMeal[] {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return [
      {
        id: 'meal_1',
        nome: 'Café da Manhã Energético',
        categoria: 'cafe',
        horario: '08:00',
        data: today,
        itens: [
          {
            id: 'item_1',
            nome: 'Aveia',
            quantidade: '50g',
            calorias: 180,
            proteinas: 6,
            carboidratos: 30,
            gorduras: 3,
            observacoes: 'Integral'
          },
          {
            id: 'item_2',
            nome: 'Banana',
            quantidade: '1 unidade',
            calorias: 105,
            proteinas: 1,
            carboidratos: 27,
            gorduras: 0,
            observacoes: 'Madura'
          },
          {
            id: 'item_3',
            nome: 'Iogurte Grego',
            quantidade: '150g',
            calorias: 130,
            proteinas: 15,
            carboidratos: 8,
            gorduras: 5,
            observacoes: 'Natural'
          }
        ],
        caloriasTotais: 415,
        proteinasTotais: 22,
        carboidratosTotais: 65,
        gordurasTotais: 8,
        observacoes: 'Refeição pré-treino',
        status: 'consumida'
      },
      {
        id: 'meal_2',
        nome: 'Almoço Proteico',
        categoria: 'almoco',
        horario: '12:30',
        data: today,
        itens: [
          {
            id: 'item_4',
            nome: 'Frango Grelhado',
            quantidade: '150g',
            calorias: 250,
            proteinas: 45,
            carboidratos: 0,
            gorduras: 5,
            observacoes: 'Peito sem pele'
          },
          {
            id: 'item_5',
            nome: 'Arroz Integral',
            quantidade: '100g',
            calorias: 110,
            proteinas: 2,
            carboidratos: 23,
            gorduras: 1,
            observacoes: 'Cozido'
          },
          {
            id: 'item_6',
            nome: 'Brócolis',
            quantidade: '100g',
            calorias: 35,
            proteinas: 3,
            carboidratos: 7,
            gorduras: 0,
            observacoes: 'No vapor'
          }
        ],
        caloriasTotais: 395,
        proteinasTotais: 50,
        carboidratosTotais: 30,
        gordurasTotais: 6,
        observacoes: 'Refeição principal do dia',
        status: 'planejada'
      },
      {
        id: 'meal_3',
        nome: 'Lanche da Tarde',
        categoria: 'lanche',
        horario: '16:00',
        data: today,
        itens: [
          {
            id: 'item_7',
            nome: 'Castanhas',
            quantidade: '30g',
            calorias: 180,
            proteinas: 6,
            carboidratos: 6,
            gorduras: 16,
            observacoes: 'Mix de oleaginosas'
          },
          {
            id: 'item_8',
            nome: 'Maçã',
            quantidade: '1 unidade',
            calorias: 95,
            proteinas: 0,
            carboidratos: 25,
            gorduras: 0,
            observacoes: 'Vermelha'
          }
        ],
        caloriasTotais: 275,
        proteinasTotais: 6,
        carboidratosTotais: 31,
        gordurasTotais: 16,
        observacoes: 'Snack saudável',
        status: 'planejada'
      }
    ];
  }
}
