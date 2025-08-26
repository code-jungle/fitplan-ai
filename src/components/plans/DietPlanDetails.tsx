import React from 'react';
import PlanCard from './PlanCard';
import { DietPlan } from '../../types';

interface DietPlanDetailsProps {
  plan: DietPlan;
  className?: string;
}

const DietPlanDetails: React.FC<DietPlanDetailsProps> = ({
  plan,
  className = ''
}) => {
  const getMealIcon = (categoria: string): React.ReactNode => {
    const icons = {
      cafe: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      lanche: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 12.477 5.754 12 7.5 12s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 12.477 18.246 12 16.5 12c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      almoco: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18z" />
        </svg>
      ),
      jantar: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      ceia: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )
    };
    
    return icons[categoria as keyof typeof icons] || icons.lanche;
  };

  const getDifficultyColor = (dificuldade: string): string => {
    const colors = {
      iniciante: 'text-green-400 bg-green-500/20',
      intermediario: 'text-yellow-400 bg-yellow-500/20',
      avancado: 'text-red-400 bg-red-500/20'
    };
    
    return colors[dificuldade as keyof typeof colors] || colors.iniciante;
  };

  return (
    <PlanCard
      title={plan.nome}
      subtitle={`Plano de ${plan.objetivo} - ${plan.duracao} dias`}
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 12.477 5.754 12 7.5 12s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 12.477 18.246 12 16.5 12c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      }
      color="mint"
      className={className}
    >
      {/* Informações Gerais */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <div className="text-2xl font-bold text-mint-400 mb-1">
            {plan.caloriasDiarias}
          </div>
          <div className="text-sm text-white/60">Calorias/Dia</div>
        </div>
        
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <div className="text-2xl font-bold text-lavanda-400 mb-1">
            {plan.refeicoes.length}
          </div>
          <div className="text-sm text-white/60">Refeições</div>
        </div>
      </div>

      {/* Dificuldade */}
      <div className="mb-6">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(plan.dificuldade)}`}>
          <span className="mr-2">
            {plan.dificuldade === 'iniciante' ? '🌱' : 
             plan.dificuldade === 'intermediario' ? '🔥' : '⚡'}
          </span>
          {plan.dificuldade.charAt(0).toUpperCase() + plan.dificuldade.slice(1)}
        </div>
      </div>

      {/* Refeições */}
      <div className="space-y-4 mb-6">
        <h4 className="text-lg font-semibold text-white mb-3">Refeições Diárias</h4>
        
        {plan.refeicoes.map((refeicao) => (
          <div key={refeicao.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-mint-500/20 rounded-full flex items-center justify-center mr-3">
                  {getMealIcon(refeicao.categoria)}
                </div>
                <div>
                  <h5 className="font-semibold text-white">{refeicao.nome}</h5>
                  <p className="text-sm text-white/60">{refeicao.horario}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-mint-400">{refeicao.calorias} kcal</div>
                <div className="text-xs text-white/40">{refeicao.tempoPreparo} min</div>
              </div>
            </div>

            {/* Macronutrientes */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center p-2 bg-white/5 rounded">
                <div className="text-sm font-medium text-white">Proteínas</div>
                <div className="text-lg font-bold text-blue-400">{refeicao.proteinas}g</div>
              </div>
              <div className="text-center p-2 bg-white/5 rounded">
                <div className="text-sm font-medium text-white">Carboidratos</div>
                <div className="text-lg font-bold text-yellow-400">{refeicao.carboidratos}g</div>
              </div>
              <div className="text-center p-2 bg-white/5 rounded">
                <div className="text-sm font-medium text-white">Gorduras</div>
                <div className="text-lg font-bold text-red-400">{refeicao.gorduras}g</div>
              </div>
            </div>

            {/* Alimentos */}
            <div className="mb-3">
              <h6 className="text-sm font-medium text-white/80 mb-2">Alimentos:</h6>
              <div className="flex flex-wrap gap-2">
                {refeicao.alimentos.map((alimento, index) => (
                  <span key={index} className="px-2 py-1 bg-mint-500/20 text-mint-300 text-xs rounded-full">
                    {alimento}
                  </span>
                ))}
              </div>
            </div>

            {/* Preparo */}
            {refeicao.preparo && (
              <div>
                <h6 className="text-sm font-medium text-white/80 mb-2">Preparo:</h6>
                <p className="text-sm text-white/60 leading-relaxed">{refeicao.preparo}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hidratação */}
      <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-3">Hidratação</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{plan.hidratacao.agua}L</div>
            <div className="text-sm text-white/60">Água por dia</div>
          </div>
          <div>
            <h6 className="text-sm font-medium text-white/80 mb-2">Outros líquidos:</h6>
            <div className="space-y-1">
              {plan.hidratacao.outros.map((liquido, index) => (
                <div key={index} className="text-sm text-white/60">• {liquido}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Suplementos */}
      {plan.suplementos && plan.suplementos.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3">Suplementos Recomendados</h4>
          <div className="flex flex-wrap gap-2">
            {plan.suplementos.map((suplemento, index) => (
              <span key={index} className="px-3 py-2 bg-orange-500/20 text-orange-300 text-sm rounded-lg border border-orange-500/30">
                {suplemento}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Observações */}
      {plan.observacoes && plan.observacoes.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Observações Importantes</h4>
          <div className="space-y-2">
            {plan.observacoes.map((observacao, index) => (
              <div key={index} className="flex items-start">
                <span className="text-mint-400 mr-2 mt-1">•</span>
                <span className="text-sm text-white/60 leading-relaxed">{observacao}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </PlanCard>
  );
};

export default DietPlanDetails;
