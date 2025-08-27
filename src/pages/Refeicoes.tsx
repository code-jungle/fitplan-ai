import React, { useState } from 'react';
import { NavigationProps } from '../types';
import { useMeals } from '../hooks/useMeals';
import Card from '../components/Card';
import Button from '../components/Button';
import MealCard from '../components/meals/MealCard';
import MealFormModal from '../components/meals/MealFormModal';
import { UserMeal, CreateMealRequest } from '../types';

interface RefeicoesProps extends NavigationProps {}

const Refeicoes: React.FC<RefeicoesProps> = ({ onNavigate }) => {
  const {
    meals,
    isLoading,
    error,
    selectedDate,
    setSelectedDate,
    createMeal,
    updateMeal,
    deleteMeal,
    updateMealStatus,
    getDailyCalories,
    getDailyMacros
  } = useMeals();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<UserMeal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler para abrir modal de nova refeição
  const handleOpenModal = () => {
    setEditingMeal(null);
    setIsModalOpen(true);
  };

  // Handler para fechar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMeal(null);
  };

  // Handler para editar refeição
  const handleEditMeal = (meal: UserMeal) => {
    setEditingMeal(meal);
    setIsModalOpen(true);
  };

  // Handler para submeter formulário
  const handleSubmitMeal = async (mealData: CreateMealRequest) => {
    setIsSubmitting(true);
    
    try {
      if (editingMeal) {
        await updateMeal(editingMeal.id, { ...mealData, id: editingMeal.id });
      } else {
        await createMeal(mealData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar refeição:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler para deletar refeição
  const handleDeleteMeal = async (mealId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta refeição?')) {
      await deleteMeal(mealId);
    }
  };

  // Handler para mudar status da refeição
  const handleStatusChange = async (mealId: string, status: 'planejada' | 'consumida' | 'pulada') => {
    await updateMealStatus(mealId, status);
  };

  // Agrupar refeições por categoria
  const mealsByCategory = meals.reduce((acc, meal) => {
    if (!acc[meal.categoria]) {
      acc[meal.categoria] = [];
    }
    acc[meal.categoria].push(meal);
    return acc;
  }, {} as Record<string, UserMeal[]>);

  // Ordem das categorias
  const categoryOrder = ['cafe', 'lanche', 'almoco', 'jantar', 'ceia'];

  // Obter estatísticas do dia
  const dailyCalories = getDailyCalories();
  const dailyMacros = getDailyMacros();

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-mint-400 mx-auto mb-4"></div>
            <p className="text-white/70 text-lg">Carregando suas refeições...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <Card className="text-center p-8">
            <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Erro ao Carregar Refeições</h3>
            <p className="text-white/70 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="primary">
              🔄 Tentar Novamente
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header da Página */}
        <div className="text-center mb-12">
          <h1 className="futuristic-text text-4xl md:text-5xl mb-4">
            🍽️ Minhas Refeições
          </h1>
          <p className="text-xl text-white/80 font-inter max-w-2xl mx-auto">
            Gerencie suas refeições diárias e acompanhe sua nutrição
          </p>
        </div>

        {/* Botão Voltar */}
        <div className="mb-6">
          <Button
            onClick={() => onNavigate('dashboard')}
            variant="secondary"
            size="md"
            className="px-6"
          >
            ← Voltar ao Dashboard
          </Button>
        </div>

        {/* Seletor de Data */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">📅 Selecione a Data</h3>
                <p className="text-white/70 text-sm">
                  Visualize e gerencie suas refeições para uma data específica
                </p>
              </div>
              
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
              />
            </div>
          </div>
        </Card>

        {/* Estatísticas do Dia */}
        <Card gradient className="mb-8">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">📊 Resumo Nutricional do Dia</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-mint-400">{dailyCalories}</div>
                <div className="text-white/60 text-sm">Calorias Totais</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{dailyMacros.proteinas}g</div>
                <div className="text-white/60 text-sm">Proteínas</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{dailyMacros.carboidratos}g</div>
                <div className="text-white/60 text-sm">Carboidratos</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{dailyMacros.gorduras}g</div>
                <div className="text-white/60 text-sm">Gorduras</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Botão Adicionar Refeição */}
        <div className="text-center mb-8">
          <Button
            onClick={handleOpenModal}
            variant="primary"
            size="lg"
            className="px-8 py-4 text-lg"
          >
            ➕ Adicionar Nova Refeição
          </Button>
        </div>

        {/* Lista de Refeições */}
        {meals.length === 0 ? (
          <div className="flex justify-center">
            <Card className="text-center p-12 max-w-2xl">
              <div className="w-20 h-20 bg-mint-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">🍽️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Nenhuma Refeição Encontrada</h3>
              <p className="text-white/70 mb-6">
                Para a data selecionada, você ainda não tem refeições planejadas.
                Comece adicionando sua primeira refeição!
              </p>
              <Button onClick={handleOpenModal} variant="primary">
                ➕ Adicionar Primeira Refeição
              </Button>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {categoryOrder.map(category => {
              const categoryMeals = mealsByCategory[category];
              if (!categoryMeals || categoryMeals.length === 0) return null;

              return (
                <div key={category}>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    {category === 'cafe' }
                    {category === 'lanche' }
                    {category === 'almoco' }
                    {category === 'jantar' }
                    {category === 'ceia' }
                  </h2>
                  
                  <div className={`grid gap-6 ${
                    categoryMeals.length === 1 
                      ? 'grid-cols-1 max-w-2xl mx-auto' 
                      : 'grid-cols-1 lg:grid-cols-2'
                  }`}>
                    {categoryMeals.map(meal => (
                      <MealCard
                        key={meal.id}
                        meal={meal}
                        onStatusChange={handleStatusChange}
                        onEdit={handleEditMeal}
                        onDelete={handleDeleteMeal}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Formulário */}
      <MealFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitMeal}
        meal={editingMeal}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Refeicoes;
