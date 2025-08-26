import React from 'react';
import PlanCard from './PlanCard';
import { GeneratedPlan } from '../../types';

interface PlanSummaryProps {
  plan: GeneratedPlan;
  onViewDetails?: () => void;
  className?: string;
}

const PlanSummary: React.FC<PlanSummaryProps> = ({
  plan,
  onViewDetails,
  className = ''
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysUntilExpiry = (): number => {
    const expiry = new Date(plan.validade);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getObjectiveIcon = (objetivo: string): React.ReactNode => {
    if (objetivo.includes('Perda de Peso')) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    } else if (objetivo.includes('Ganho de Massa')) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else if (objetivo.includes('Força')) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    }
    
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    );
  };

  const daysUntilExpiry = getDaysUntilExpiry();
  const isExpiringSoon = daysUntilExpiry <= 7;

  return (
    <PlanCard
      title="Resumo do Plano"
      subtitle={`Gerado em ${formatDate(plan.dataGeracao)}`}
      icon={getObjectiveIcon(plan.objetivo)}
      color="mint"
      className={className}
      onClick={onViewDetails}
      isInteractive={!!onViewDetails}
    >
      {/* Objetivo e Status */}
      <div className="mb-6">
        <div className="text-center mb-4">
          <h4 className="text-xl font-semibold text-white mb-2">{plan.objetivo}</h4>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isExpiringSoon 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
              : 'bg-green-500/20 text-green-400 border border-green-500/30'
          }`}>
            <span className="mr-2">
              {isExpiringSoon ? '⚠️' : '✅'}
            </span>
            {isExpiringSoon 
              ? `Expira em ${daysUntilExpiry} dia${daysUntilExpiry !== 1 ? 's' : ''}` 
              : `Válido por mais ${daysUntilExpiry} dia${daysUntilExpiry !== 1 ? 's' : ''}`
            }
          </div>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {plan.planoDieta && (
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-mint-400 mb-1">
              {plan.planoDieta.refeicoes.length}
            </div>
            <div className="text-sm text-white/60">Refeições</div>
            <div className="text-xs text-white/40 mt-1">
              {plan.planoDieta.caloriasDiarias} kcal/dia
            </div>
          </div>
        )}

        {plan.planoTreino && (
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-lavanda-400 mb-1">
              {plan.planoTreino.treinos.length}
            </div>
            <div className="text-sm text-white/60">Treinos</div>
            <div className="text-xs text-white/40 mt-1">
              {plan.planoTreino.frequencia}x por semana
            </div>
          </div>
        )}
      </div>

      {/* Próxima Avaliação */}
      <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/80">Próxima Avaliação:</span>
          <span className="text-sm font-medium text-blue-400">
            {formatDate(plan.proximaAvaliacao)}
          </span>
        </div>
      </div>

      {/* Recomendações */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-white/80 mb-2">Recomendações:</h5>
        <div className="space-y-1">
          {plan.recomendacoes.slice(0, 3).map((recomendacao, index) => (
            <div key={index} className="flex items-start">
              <span className="text-mint-400 mr-2 mt-1">•</span>
              <span className="text-xs text-white/60 leading-relaxed">
                {recomendacao}
              </span>
            </div>
          ))}
          {plan.recomendacoes.length > 3 && (
            <div className="text-xs text-white/40 text-center pt-2">
              +{plan.recomendacoes.length - 3} mais recomendações
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      {onViewDetails && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <button
            onClick={onViewDetails}
            className="w-full px-4 py-2 bg-gradient-to-r from-mint-500 to-lavanda-500 text-white rounded-lg hover:from-mint-600 hover:to-lavanda-600 transition-all duration-300 font-medium"
          >
            Ver Detalhes Completos
          </button>
        </div>
      )}
    </PlanCard>
  );
};

export default PlanSummary;
