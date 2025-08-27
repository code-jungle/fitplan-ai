import React, { useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { NavigationProps } from '../types';
import { UpdateProgressRequest } from '../services/dashboardService';
import NotificationSettings from '../components/NotificationSettings';

// Componentes do Dashboard
import DashboardLoading from '../components/dashboard/DashboardLoading';
import DashboardError from '../components/dashboard/DashboardError';
import StatsCard from '../components/dashboard/StatsCard';
import ProgressCard from '../components/dashboard/ProgressCard';
import QuickActionsCard from '../components/dashboard/QuickActionsCard';
import UserProfileCard from '../components/dashboard/UserProfileCard';
import RecommendationsCard from '../components/dashboard/RecommendationsCard';
import UpdateProgressModal from '../components/dashboard/UpdateProgressModal';

interface DashboardProps extends NavigationProps {}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const {
    dashboardData,
    isLoading,
    error,
    isUpdatingProgress,
    progressStats,
    recommendations,
    updateProgress,
    refreshDashboard
  } = useDashboard();

  const [isUpdateProgressModalOpen, setIsUpdateProgressModalOpen] = useState(false);

  // Estados de loading e erro
  if (isLoading) {
    return <DashboardLoading />;
  }

  if (error || !dashboardData) {
    return <DashboardError error={error || 'Dados não disponíveis'} onRetry={refreshDashboard} />;
  }

  const { user } = dashboardData;

  // Handler para atualizar progresso
  const handleUpdateProgress = async (data: UpdateProgressRequest) => {
    try {
      await updateProgress(data);
      // O modal será fechado automaticamente após o sucesso
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      // Aqui você pode adicionar uma notificação de erro se desejar
    }
  };

  // Handler para abrir modal de progresso
  const handleOpenUpdateProgress = () => {
    setIsUpdateProgressModalOpen(true);
  };

  // Handler para fechar modal de progresso
  const handleCloseUpdateProgress = () => {
    setIsUpdateProgressModalOpen(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header do Dashboard */}
        <div className="text-center mb-12">
          <h1 className="futuristic-text text-4xl md:text-5xl mb-4 ">
            Olá, {user.nome}!
          </h1>
          <p className="text-xl text-white/80 font-inter max-w-2xl mx-auto">
            Seu dashboard personalizado de saúde e fitness
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            title="Peso Atual"
            value={`${user.peso} kg`}
            subtitle={`Meta: ${user.objetivo === 'perder-peso' ? 'Reduzir' : user.objetivo === 'ganhar-massa' ? 'Aumentar' : 'Manter'}`}
            color="mint"
          />

          <StatsCard
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            title="Nível de Atividade"
            value={user.nivelAtividade.charAt(0).toUpperCase() + user.nivelAtividade.slice(1)}
            subtitle="Recomendado para seu objetivo"
            color="lavanda"
          />

          <StatsCard
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            title="Objetivo"
            value={user.objetivo.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            subtitle="Foco principal do seu plano"
            color="blue"
          />
        </div>

        {/* Card de Progresso */}
        <ProgressCard
          progressStats={progressStats}
          onUpdateProgress={handleOpenUpdateProgress}
          className="mb-8"
        />

        {/* Ações Rápidas */}
        <QuickActionsCard
          onNavigate={onNavigate}
          className="mb-8"
        />

        {/* Recomendações da IA */}
        <RecommendationsCard
          recommendations={recommendations}
          className="mb-8"
        />

        {/* Perfil do Usuário */}
        <UserProfileCard
          user={user}
          className="mb-8"
        />

        {/* Configurações de Notificações */}
        <NotificationSettings className="mb-8" />
      </div>

      {/* Modal de Atualização de Progresso */}
      <UpdateProgressModal
        isOpen={isUpdateProgressModalOpen}
        onClose={handleCloseUpdateProgress}
        onSubmit={handleUpdateProgress}
        isSubmitting={isUpdatingProgress}
        currentWeight={user.peso}
      />
    </div>
  );
};

export default Dashboard;
