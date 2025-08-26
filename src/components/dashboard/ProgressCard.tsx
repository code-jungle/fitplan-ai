import React from 'react';
import Card from '../Card';
import Button from '../Button';

interface ProgressCardProps {
  progressStats: {
    totalEntries: number;
    averageWeight: number;
    weightChange: number;
    averageCalories: number;
    averageExercises: number;
    averageWater: number;
  } | null;
  onUpdateProgress: () => void;
  className?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  progressStats,
  onUpdateProgress,
  className = ''
}) => {
  if (!progressStats) {
    return (
      <Card className={`${className}`}>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-mint-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-mint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="font-orbitron font-semibold text-xl mb-2">Nenhum Progresso Registrado</h3>
          <p className="text-white/60 text-sm mb-4">
            Comece registrando seu progresso diário para acompanhar sua evolução
          </p>
          <Button onClick={onUpdateProgress} size="lg">
            Registrar Primeiro Progresso
          </Button>
        </div>
      </Card>
    );
  }

  const getWeightChangeColor = (change: number) => {
    if (change === 0) return 'text-white';
    return change > 0 ? 'text-red-400' : 'text-green-400';
  };

  const getWeightChangeIcon = (change: number) => {
    if (change === 0) return '→';
    return change > 0 ? '↗' : '↘';
  };

  return (
    <Card className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="futuristic-text text-2xl">Seu Progresso</h2>
        <Button onClick={onUpdateProgress} size="sm">
          Atualizar Progresso
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estatísticas de Peso */}
        <div>
          <h3 className="font-orbitron font-semibold text-lg mb-4 text-mint-400">Peso e Medidas</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Total de Registros:</span>
              <span className="text-white font-medium">{progressStats.totalEntries}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Peso Médio:</span>
              <span className="text-white font-medium">{progressStats.averageWeight.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Variação de Peso:</span>
              <span className={`font-medium flex items-center ${getWeightChangeColor(progressStats.weightChange)}`}>
                {getWeightChangeIcon(progressStats.weightChange)} {Math.abs(progressStats.weightChange).toFixed(1)} kg
              </span>
            </div>
          </div>
        </div>

        {/* Estatísticas de Atividade */}
        <div>
          <h3 className="font-orbitron font-semibold text-lg mb-4 text-lavanda-400">Atividade e Nutrição</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Calorias Médias:</span>
              <span className="text-white font-medium">{progressStats.averageCalories.toFixed(0)} kcal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Exercícios Médias:</span>
              <span className="text-white font-medium">{progressStats.averageExercises.toFixed(1)}/semana</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Água Média:</span>
              <span className="text-white font-medium">{progressStats.averageWater.toFixed(1)} L/dia</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProgressCard;
