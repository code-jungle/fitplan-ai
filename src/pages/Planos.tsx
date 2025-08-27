import React, { useState } from 'react';
import { usePlans } from '../hooks/usePlans';
import { useAuth } from '../contexts/AuthContext';
import { PlanSummary, DietPlanDetails, TrainingPlanDetails, PlanAdjustmentNotification } from '../components/plans';
import Card from '../components/Card';
import Button from '../components/Button';
import { GeneratedPlan, NavigationProps } from '../types';

type ViewMode = 'summary' | 'diet' | 'training';

interface PlanosProps extends NavigationProps {}

const Planos: React.FC<PlanosProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const {
    currentPlan,
    isLoading,
    error,
    hasGeneratedPlan,
    generateNewPlan,
    loadExistingPlan,
    regeneratePlan,
    removePlan,
    clearError,
    isPlanExpiringSoon,
    getPlanStats,
    getNextActions,
    lastAdjustment,
    showAdjustmentNotification,
    hideAdjustmentNotification
  } = usePlans();

  const [viewMode, setViewMode] = useState<ViewMode>('summary');
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // Carregar plano existente ao montar o componente
  React.useEffect(() => {
    if (!hasGeneratedPlan) {
      loadExistingPlan();
    }
  }, [hasGeneratedPlan, loadExistingPlan]);

  const handleGeneratePlan = async () => {
    setShowGenerateModal(false);
    await generateNewPlan();
  };

  const handleViewDetails = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleBackToSummary = () => {
    setViewMode('summary');
  };

  const renderGeneratePlanModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4 text-center">
          Gerar Novo Plano
        </h3>
        
        <div className="space-y-4 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-mint-500 to-lavanda-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-white/80">
              Com base no seu perfil e objetivo, criaremos um plano personalizado de dieta e treino.
            </p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Seu Objetivo:</h4>
            <p className="text-mint-400 font-semibold">{user?.objetivo}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setShowGenerateModal(false)}
            variant="secondary"
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleGeneratePlan}
            variant="primary"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Gerando...' : 'Gerar Plano'}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderNoPlan = () => (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-gradient-to-r from-mint-500/20 to-lavanda-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-mint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-3">Nenhum Plano Ativo</h2>
      <p className="text-white/60 mb-6 max-w-md mx-auto">
        Comece sua jornada de transformação! Gere um plano personalizado baseado no seu perfil e objetivo.
      </p>
      
      <Button
        onClick={() => setShowGenerateModal(true)}
        variant="primary"
        size="lg"
        className="px-8"
      >
        Gerar Meu Primeiro Plano
      </Button>
    </div>
  );

  const renderPlanView = () => {
    if (!currentPlan) return null;

    switch (viewMode) {
      case 'summary':
        return (
          <PlanSummary
            plan={currentPlan}
            onViewDetails={() => setViewMode('summary')}
            className="mb-6"
          />
        );
      
      case 'diet':
        return currentPlan.planoDieta ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Plano de Dieta</h2>
              <Button
                onClick={handleBackToSummary}
                variant="secondary"
                size="sm"
              >
                ← Voltar ao Resumo
              </Button>
            </div>
            <DietPlanDetails plan={currentPlan.planoDieta} />
          </div>
        ) : (
          <Card className="text-center py-8">
            <p className="text-white/60">Este plano não inclui dieta.</p>
          </Card>
        );
      
      case 'training':
        return currentPlan.planoTreino ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Plano de Treino</h2>
              <Button
                onClick={handleBackToSummary}
                variant="secondary"
                size="sm"
              >
                ← Voltar ao Resumo
              </Button>
            </div>
            <TrainingPlanDetails plan={currentPlan.planoTreino} />
          </div>
        ) : (
          <Card className="text-center py-8">
            <p className="text-white/60">Este plano não inclui treino.</p>
          </Card>
        );
      
      default:
        return null;
    }
  };

  const renderPlanActions = () => {
    if (!currentPlan) return null;

    const stats = getPlanStats();
    const nextActions = getNextActions();

    if (!stats) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Estatísticas */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Estatísticas do Plano</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/60">Refeições/Dia:</span>
              <span className="text-white font-medium">{stats.dieta.totalRefeicoes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Treinos/Semana:</span>
              <span className="text-white font-medium">{stats.treino.frequenciaSemanal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Próxima Avaliação:</span>
              <span className="text-white font-medium">{stats.proximaAvaliacao}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Status:</span>
              <span className={`font-medium ${
                isPlanExpiringSoon() ? 'text-red-400' : 'text-green-400'
              }`}>
                {isPlanExpiringSoon() ? 'Expirando em breve' : 'Ativo'}
              </span>
            </div>
          </div>
        </Card>

        {/* Próximas Ações */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Próximas Ações</h3>
          <div className="space-y-2">
            {nextActions.map((action, index) => (
              <div key={index} className="flex items-center text-sm">
                <span className="text-mint-400 mr-2">•</span>
                <span className="text-white/80">{action}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const renderPlanNavigation = () => {
    if (!currentPlan) return null;

    return (
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          onClick={() => setViewMode('summary')}
          variant={viewMode === 'summary' ? 'primary' : 'secondary'}
          size="sm"
        >
          Resumo Geral
        </Button>
        
        {currentPlan.planoDieta && (
          <Button
            onClick={() => setViewMode('diet')}
            variant={viewMode === 'diet' ? 'primary' : 'secondary'}
            size="sm"
          >
            Plano de Dieta
          </Button>
        )}
        
        {currentPlan.planoTreino && (
          <Button
            onClick={() => setViewMode('training')}
            variant={viewMode === 'training' ? 'primary' : 'secondary'}
            size="sm"
          >
            Plano de Treino
          </Button>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-mint-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Carregando planos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Erro ao Carregar</h3>
          <p className="text-white/60 mb-4">{error}</p>
          <Button onClick={clearError} variant="primary">
            Tentar Novamente
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3 font-orbitron">
            Meus Planos
          </h1>
          <p className="text-white/60 text-lg">
            Planos personalizados de dieta e treino para alcançar seus objetivos
          </p>
          <div className="mt-6">
            <Button
              onClick={() => onNavigate('dashboard')}
              variant="secondary"
              size="md"
              className="px-6"
            >
              ← Voltar ao Dashboard
            </Button>
          </div>
        </div>

        {/* Ações Principais */}
        {!hasGeneratedPlan ? (
          <div className="text-center mb-8">
            <Button
              onClick={() => setShowGenerateModal(true)}
              variant="primary"
              size="lg"
              className="px-8"
            >
              Gerar Novo Plano
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Button
              onClick={() => setShowGenerateModal(true)}
              variant="secondary"
              size="sm"
            >
              Regenerar Plano
            </Button>
            <Button
              onClick={removePlan}
              variant="secondary"
              size="sm"
              className="text-red-400 hover:text-red-300"
            >
              Remover Plano
            </Button>
          </div>
        )}

        {/* Conteúdo Principal */}
        {!hasGeneratedPlan ? (
          renderNoPlan()
        ) : (
          <div>
            {renderPlanNavigation()}
            {renderPlanActions()}
            {renderPlanView()}
          </div>
        )}

        {/* Modal de Geração */}
        {showGenerateModal && renderGeneratePlanModal()}

        {/* Notificação de Ajuste Automático */}
        {showAdjustmentNotification && lastAdjustment && (
          <PlanAdjustmentNotification
            adjustment={lastAdjustment}
            onClose={hideAdjustmentNotification}
          />
        )}
      </div>
    </div>
  );
};

export default Planos;
