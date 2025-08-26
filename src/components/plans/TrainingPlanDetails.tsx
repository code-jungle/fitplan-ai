import React from 'react';
import PlanCard from './PlanCard';
import { TrainingPlan } from '../../types';

interface TrainingPlanDetailsProps {
  plan: TrainingPlan;
  className?: string;
}

const TrainingPlanDetails: React.FC<TrainingPlanDetailsProps> = ({
  plan,
  className = ''
}) => {
  const getWorkoutIcon = (categoria: string): React.ReactNode => {
    const icons = {
      forca: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      cardio: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      flexibilidade: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
      hiit: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      resistencia: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    };
    
    return icons[categoria as keyof typeof icons] || icons.forca;
  };

  const getDifficultyColor = (dificuldade: string): string => {
    const colors = {
      iniciante: 'text-green-400 bg-green-500/20',
      intermediario: 'text-yellow-400 bg-yellow-500/20',
      avancado: 'text-red-400 bg-red-500/20'
    };
    
    return colors[dificuldade as keyof typeof colors] || colors.iniciante;
  };

  const getProgressionIcon = (tipo: string): React.ReactNode => {
    const icons = {
      linear: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>
      ),
      ondulante: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 3-3M7 12l3 3 3-3 3 3M7 12l3-3 3 3 3-3" />
        </svg>
      ),
      piramidal: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      )
    };
    
    return icons[tipo as keyof typeof icons] || icons.linear;
  };

  const getDayName = (dayNumber: number): string => {
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    return days[dayNumber - 1] || `Dia ${dayNumber}`;
  };

  return (
    <PlanCard
      title={plan.nome}
      subtitle={`Plano de ${plan.objetivo} - ${plan.duracao} semanas`}
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      }
      color="lavanda"
      className={className}
    >
      {/* Informações Gerais */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <div className="text-2xl font-bold text-lavanda-400 mb-1">
            {plan.duracao}
          </div>
          <div className="text-sm text-white/60">Semanas</div>
        </div>
        
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <div className="text-2xl font-bold text-mint-400 mb-1">
            {plan.frequencia}
          </div>
          <div className="text-sm text-white/60">Treinos/Semana</div>
        </div>

        <div className="text-center p-3 bg-white/5 rounded-lg">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {plan.treinos.length}
          </div>
          <div className="text-sm text-white/60">Tipos de Treino</div>
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

      {/* Progressão */}
      <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <h4 className="text-lg font-semibold text-white mb-3">Sistema de Progressão</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              {getProgressionIcon(plan.progressao.tipo)}
            </div>
            <div className="text-sm font-medium text-white">{plan.progressao.tipo}</div>
            <div className="text-xs text-white/60 capitalize">Tipo</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-mint-400 mb-1">
              {plan.progressao.incremento}
            </div>
            <div className="text-sm text-white/60">Incremento</div>
            <div className="text-xs text-white/40">kg/rep</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-lavanda-400 mb-1">
              {plan.progressao.frequencia}
            </div>
            <div className="text-sm text-white/60">Frequência</div>
            <div className="text-xs text-white/40">semanas</div>
          </div>
        </div>
      </div>

      {/* Treinos */}
      <div className="space-y-4 mb-6">
        <h4 className="text-lg font-semibold text-white mb-3">Treinos da Semana</h4>
        
        {plan.treinos.map((treino) => (
          <div key={treino.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-lavanda-500/20 rounded-full flex items-center justify-center mr-3">
                  {getWorkoutIcon(treino.categoria)}
                </div>
                <div>
                  <h5 className="font-semibold text-white">{treino.nome}</h5>
                  <p className="text-sm text-white/60">{getDayName(parseInt(treino.dia))}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-lavanda-400">{treino.duracaoTotal} min</div>
                <div className="text-xs text-white/40">{treino.caloriasEstimadas} kcal</div>
              </div>
            </div>

            {/* Categoria */}
            <div className="mb-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                treino.categoria === 'forca' ? 'bg-red-500/20 text-red-400' :
                treino.categoria === 'cardio' ? 'bg-blue-500/20 text-blue-400' :
                treino.categoria === 'flexibilidade' ? 'bg-green-500/20 text-green-400' :
                treino.categoria === 'hiit' ? 'bg-orange-500/20 text-orange-400' :
                'bg-purple-500/20 text-purple-400'
              }`}>
                {treino.categoria.charAt(0).toUpperCase() + treino.categoria.slice(1)}
              </span>
            </div>

            {/* Exercícios */}
            <div className="mb-3">
              <h6 className="text-sm font-medium text-white/80 mb-2">Exercícios ({treino.exercicios.length}):</h6>
              <div className="space-y-2">
                {treino.exercicios.map((exercicio) => (
                  <div key={exercicio.id} className="bg-white/5 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="font-medium text-white text-sm">{exercicio.nome}</h6>
                      <div className="text-xs text-white/60">
                        {exercicio.series}x{exercicio.repeticoes}
                        {exercicio.peso && ` @ ${exercicio.peso}kg`}
                        {exercicio.duracao && ` ${exercicio.duracao}s`}
                      </div>
                    </div>
                    
                    {exercicio.tecnica && (
                      <p className="text-xs text-white/60 mb-1">Técnica: {exercicio.tecnica}</p>
                    )}
                    
                    {exercicio.variacoes && exercicio.variacoes.length > 0 && (
                      <div className="text-xs text-white/40">
                        Variações: {exercicio.variacoes.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Equipamentos */}
            {treino.equipamentos && treino.equipamentos.length > 0 && (
              <div className="mb-3">
                <h6 className="text-sm font-medium text-white/80 mb-2">Equipamentos:</h6>
                <div className="flex flex-wrap gap-2">
                  {treino.equipamentos.map((equipamento, index) => (
                    <span key={index} className="px-2 py-1 bg-lavanda-500/20 text-lavanda-300 text-xs rounded-full">
                      {equipamento}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Aquecimento e Alongamento */}
            <div className="grid grid-cols-2 gap-3">
              {treino.aquecimento && treino.aquecimento.length > 0 && (
                <div>
                  <h6 className="text-sm font-medium text-white/80 mb-2">Aquecimento:</h6>
                  <div className="space-y-1">
                    {treino.aquecimento.map((item, index) => (
                      <div key={index} className="text-xs text-white/60">• {item}</div>
                    ))}
                  </div>
                </div>
              )}
              
              {treino.alongamento && treino.alongamento.length > 0 && (
                <div>
                  <h6 className="text-sm font-medium text-white/80 mb-2">Alongamento:</h6>
                  <div className="space-y-1">
                    {treino.alongamento.map((item, index) => (
                      <div key={index} className="text-xs text-white/60">• {item}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Descanso */}
      <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-3">Dias de Descanso</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h6 className="text-sm font-medium text-white/80 mb-2">Dias da semana:</h6>
            <div className="flex flex-wrap gap-2">
              {plan.descanso.dias.map((dia) => (
                <span key={dia} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                  {getDayName(dia)}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h6 className="text-sm font-medium text-white/80 mb-2">Recomendações:</h6>
            <div className="space-y-1">
              {plan.descanso.recomendacoes.map((recomendacao, index) => (
                <div key={index} className="text-sm text-white/60">• {recomendacao}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PlanCard>
  );
};

export default TrainingPlanDetails;
