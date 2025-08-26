import React from 'react';
import Card from '../Card';
import { ProgressData } from '../../types';

interface ProgressHistoryProps {
  progressData: ProgressData[];
  onEditEntry?: (entry: ProgressData) => void;
  onDeleteEntry?: (entryId: string) => void;
  className?: string;
}

const ProgressHistory: React.FC<ProgressHistoryProps> = ({
  progressData,
  onEditEntry,
  onDeleteEntry,
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

  const getWeightChange = (current: number, previous: number): { value: number; isPositive: boolean } => {
    const change = current - previous;
    return {
      value: Math.abs(change),
      isPositive: change < 0 // Perda de peso é positiva
    };
  };

  const getWeightChangeIcon = (change: number): string => {
    if (change === 0) return '→';
    return change > 0 ? '↗' : '↘';
  };

  const getWeightChangeColor = (change: number): string => {
    if (change === 0) return 'text-white';
    return change > 0 ? 'text-red-400' : 'text-green-400';
  };

  if (progressData.length === 0) {
    return (
      <Card className={`${className}`}>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum Progresso Registrado</h3>
          <p className="text-white/60">Comece registrando seu progresso para ver o histórico aqui</p>
        </div>
      </Card>
    );
  }

  // Ordenar por data (mais recente primeiro)
  const sortedData = [...progressData].sort((a, b) => 
    new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  return (
    <Card className={`${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="futuristic-text text-2xl">Histórico de Progresso</h3>
        <div className="text-sm text-white/60">
          {progressData.length} registro{progressData.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-4">
        {sortedData.map((entry, index) => {
          const previousEntry = index < sortedData.length - 1 ? sortedData[index + 1] : null;
          const weightChange = previousEntry 
            ? getWeightChange(entry.peso, previousEntry.peso)
            : null;

          return (
            <div
              key={entry.data}
              className="p-6 border border-white/20 rounded-xl hover:border-mint-400/50 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">
                    {formatDate(entry.data)}
                  </h4>
                  {weightChange && (
                    <div className={`flex items-center text-sm ${getWeightChangeColor(weightChange.value)}`}>
                      <span className="mr-1">{getWeightChangeIcon(weightChange.value)}</span>
                      <span>
                        {weightChange.isPositive ? 'Perdeu' : 'Ganhou'} {weightChange.value.toFixed(1)} kg
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {onEditEntry && (
                    <button
                      onClick={() => onEditEntry(entry)}
                      className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )}
                  {onDeleteEntry && (
                    <button
                      onClick={() => onDeleteEntry(entry.data)}
                      className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-sm text-white/60 mb-1">Peso</div>
                  <div className="text-lg font-semibold text-white">{entry.peso} kg</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-white/60 mb-1">Calorias</div>
                  <div className="text-lg font-semibold text-white">{entry.calorias} kcal</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-white/60 mb-1">Exercícios</div>
                  <div className="text-lg font-semibold text-white">{entry.exercicios}x</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-white/60 mb-1">Água</div>
                  <div className="text-lg font-semibold text-white">{entry.agua} L</div>
                </div>
              </div>

              {/* Indicadores visuais */}
              <div className="mt-4 flex gap-2">
                {/* Indicador de calorias */}
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Calorias</span>
                    <span>{entry.calorias}/2000</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        entry.calorias <= 2000 ? 'bg-green-400' : 'bg-orange-400'
                      }`}
                      style={{ width: `${Math.min((entry.calorias / 2000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Indicador de exercícios */}
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Exercícios</span>
                    <span>{entry.exercicios}/5</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        entry.exercicios >= 5 ? 'bg-green-400' : 'bg-blue-400'
                      }`}
                      style={{ width: `${Math.min((entry.exercicios / 5) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Indicador de água */}
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Água</span>
                    <span>{entry.agua}/2.5L</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        entry.agua >= 2.5 ? 'bg-green-400' : 'bg-blue-400'
                      }`}
                      style={{ width: `${Math.min((entry.agua / 2.5) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ProgressHistory;
