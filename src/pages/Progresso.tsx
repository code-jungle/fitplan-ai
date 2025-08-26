import React, { useState } from 'react';
import { useProgress, UpdateProgressData } from '../hooks/useProgress';
import { useAuth } from '../contexts/AuthContext';
import { NavigationProps } from '../types';
import { ProgressData } from '../types';

// Componentes de Progresso
import {
  ProgressCard,
  ProgressChart,
  UpdateProgressForm,
  ProgressHistory
} from '../components/progress';

interface ProgressoProps extends NavigationProps {}

const Progresso: React.FC<ProgressoProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const {
    progressData,
    isLoading,
    error,
    isUpdating,
    isDeleting,
    stats,
    chartData,
    addProgressEntry,
    updateProgressEntry,
    deleteProgressEntry,
    refresh
  } = useProgress();

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ProgressData | null>(null);

  // Handler para adicionar novo progresso
  const handleAddProgress = async (data: UpdateProgressData) => {
    try {
      await addProgressEntry(data);
      setShowUpdateForm(false);
      // Mostrar mensagem de sucesso
    } catch (error) {
      console.error('Erro ao adicionar progresso:', error);
      // Mostrar mensagem de erro
    }
  };

  // Handler para editar progresso existente
  const handleEditProgress = async (data: UpdateProgressData) => {
    if (!editingEntry) return;
    
    try {
      await updateProgressEntry(editingEntry.data, {
        peso: data.peso,
        calorias: data.calorias,
        exercicios: data.exercicios,
        agua: data.agua
      });
      setEditingEntry(null);
      // Mostrar mensagem de sucesso
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      // Mostrar mensagem de erro
    }
  };

  // Handler para deletar progresso
  const handleDeleteProgress = async (date: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de progresso?')) {
      try {
        await deleteProgressEntry(date);
        // Mostrar mensagem de sucesso
      } catch (error) {
        console.error('Erro ao deletar progresso:', error);
        // Mostrar mensagem de erro
      }
    }
  };

  // Handler para cancelar edição
  const handleCancelEdit = () => {
    setEditingEntry(null);
    setShowUpdateForm(false);
  };

  // Calcular progresso para metas
  const calculateGoalProgress = () => {
    if (!user || stats.totalEntries === 0) return { weight: 0, consistency: 0, nutrition: 0 };
    
    // Progresso do peso (assumindo objetivo de perder peso)
    const targetWeight = user.objetivo === 'perder-peso' ? user.peso - 10 : user.peso;
    const weightProgress = Math.max(0, Math.min(100, ((user.peso - targetWeight) / 10) * 100));
    
    // Progresso da consistência (meta: 30 dias consecutivos)
    const consistencyProgress = Math.min(100, (stats.consistency / 30) * 100);
    
    // Progresso da nutrição (meta: manter calorias abaixo de 2000)
    const nutritionProgress = stats.averageCalories <= 2000 ? 100 : Math.max(0, 100 - ((stats.averageCalories - 2000) / 500) * 100);
    
    return { weight: weightProgress, consistency: consistencyProgress, nutrition: nutritionProgress };
  };

  const goalProgress = calculateGoalProgress();

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="h-8 bg-white/10 rounded-lg w-64 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center">
            <h1 className="futuristic-text text-3xl mb-4 text-red-400">Erro ao Carregar Progresso</h1>
            <p className="text-white/80 text-lg mb-6">{error}</p>
            <button
              onClick={refresh}
              className="px-6 py-3 bg-mint-500 text-white rounded-lg hover:bg-mint-600 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="futuristic-text text-3xl md:text-4xl mb-2">
              Seu Progresso 📊
            </h1>
            <p className="text-white/70 text-lg">
              Acompanhe sua evolução e conquistas
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowUpdateForm(true)}
              className="px-6 py-3 bg-mint-500 text-white rounded-lg hover:bg-mint-600 transition-colors"
            >
              Atualizar Progresso
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>

        {/* Resumo Geral */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <ProgressCard
            title="Peso Atual"
            value={`${user?.peso || 0} kg`}
            subtitle="Meta: perder peso"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            }
            color="mint"
            progress={goalProgress.weight}
            progressLabel="Progresso da meta de peso"
          />

          <ProgressCard
            title="Dias Ativos"
            value={stats.totalDays}
            subtitle="Total de registros"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="lavanda"
            progress={goalProgress.consistency}
            progressLabel="Meta: 30 dias consecutivos"
          />

          <ProgressCard
            title="Calorias Médias"
            value={`${Math.round(stats.averageCalories)} kcal`}
            subtitle="Meta: 2000 kcal"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            color="blue"
            progress={goalProgress.nutrition}
            progressLabel="Controle calórico"
          />

          <ProgressCard
            title="Variação de Peso"
            value={`${stats.weightChange >= 0 ? '+' : ''}${stats.weightChange.toFixed(1)} kg`}
            subtitle="Desde o início"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            color={stats.weightChange <= 0 ? 'green' : 'red'}
          />
        </div>

        {/* Gráficos */}
        {chartData.peso.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ProgressChart
              title="Evolução do Peso"
              data={chartData.peso}
              color="mint"
              maxValue={100}
            />
            
            <ProgressChart
              title="Calorias Semanais"
              data={chartData.calorias}
              color="lavanda"
              maxValue={2500}
            />
          </div>
        )}

        {/* Gráfico de Exercícios */}
        {chartData.exercicios.length > 0 && (
          <ProgressChart
            title="Frequência de Exercícios"
            data={chartData.exercicios}
            color="blue"
            maxValue={7}
            className="mb-8"
          />
        )}

        {/* Conquistas */}
        <div className="mb-8">
          <ProgressCard
            title="🏆 Conquistas Desbloqueadas"
            value={`${stats.consistency >= 7 ? 1 : 0} de 4`}
            subtitle="Continue progredindo para desbloquear mais conquistas"
            color="orange"
            className="gradient"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className={`text-center p-4 rounded-lg transition-all duration-300 ${
                stats.consistency >= 7 ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5 border border-white/20'
              }`}>
                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                  stats.consistency >= 7 ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'
                }`}>
                  <span className="text-2xl">🔥</span>
                </div>
                <h4 className="font-semibold mb-1">Primeira Semana</h4>
                <p className="text-sm text-white/60">7 dias consecutivos</p>
              </div>

              <div className={`text-center p-4 rounded-lg transition-all duration-300 ${
                stats.consistency >= 30 ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5 border border-white/20'
              }`}>
                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                  stats.consistency >= 30 ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'
                }`}>
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-semibold mb-1">Consistente</h4>
                <p className="text-sm text-white/60">30 dias ativos</p>
              </div>

              <div className={`text-center p-4 rounded-lg transition-all duration-300 ${
                stats.weightChange <= -2 ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5 border border-white/20'
              }`}>
                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                  stats.weightChange <= -2 ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'
                }`}>
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold mb-1">Meta de Peso</h4>
                <p className="text-sm text-white/60">-2kg alcançado</p>
              </div>

              <div className={`text-center p-4 rounded-lg transition-all duration-300 ${
                stats.totalEntries >= 10 ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5 border border-white/20'
              }`}>
                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                  stats.totalEntries >= 10 ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'
                }`}>
                  <span className="text-2xl">💪</span>
                </div>
                <h4 className="font-semibold mb-1">Dedicado</h4>
                <p className="text-sm text-white/60">10 registros completos</p>
              </div>
            </div>
          </ProgressCard>
        </div>

        {/* Histórico de Progresso */}
        <ProgressHistory
          progressData={progressData}
          onEditEntry={setEditingEntry}
          onDeleteEntry={handleDeleteProgress}
          className="mb-8"
        />

        {/* Formulário de Atualização */}
        {(showUpdateForm || editingEntry) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <UpdateProgressForm
                currentWeight={editingEntry?.peso || user?.peso || 0}
                                 currentHeight={user?.altura || 0}
                onSubmit={editingEntry ? handleEditProgress : handleAddProgress}
                onCancel={handleCancelEdit}
                isSubmitting={isUpdating}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progresso;
