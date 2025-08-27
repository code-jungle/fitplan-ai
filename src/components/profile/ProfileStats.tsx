import React from 'react';
import { ProfileStats as ProfileStatsType } from '../../types';

interface ProfileStatsProps {
  stats: ProfileStatsType;
  className?: string;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  stats,
  className = ''
}) => {
  // Calcular variação percentual do peso
  const weightChangePercent = stats.pesoInicial > 0 
    ? ((stats.variacaoPeso / stats.pesoInicial) * 100).toFixed(1)
    : 0;

  // Calcular IMC
  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  // Obter cor baseada na variação do peso
  const getWeightChangeColor = (change: number) => {
    if (change < 0) return 'text-green-400'; // Perda de peso
    if (change > 0) return 'text-yellow-400'; // Ganho de peso
    return 'text-white'; // Sem mudança
  };

  // Obter ícone baseado na variação do peso
  const getWeightChangeIcon = (change: number) => {
    if (change < 0) return '📉'; // Perda de peso
    if (change > 0) return '📈'; // Ganho de peso
    return '⚖️'; // Sem mudança
  };

  return (
    <div className={`bg-white/5 rounded-lg p-6 border border-white/10 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
        <span className="w-2 h-2 bg-mint-500 rounded-full mr-3"></span>
        Estatísticas do Perfil
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Dias Ativo */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📅</span>
            <span className="text-mint-400 text-sm font-medium">Ativo</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.diasAtivo}</div>
          <div className="text-white/70 text-xs">dias</div>
        </div>

        {/* Treinos Completos */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💪</span>
            <span className="text-mint-400 text-sm font-medium">Treinos</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.treinosCompletos}</div>
          <div className="text-white/70 text-xs">completos</div>
        </div>

        {/* Refeições Registradas */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🍽️</span>
            <span className="text-mint-400 text-sm font-medium">Refeições</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.refeicoesRegistradas}</div>
          <div className="text-white/70 text-xs">registradas</div>
        </div>

        {/* Taxa de Sucesso */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🎯</span>
            <span className="text-mint-400 text-sm font-medium">Sucesso</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {stats.diasAtivo > 0 ? Math.round((stats.treinosCompletos / stats.diasAtivo) * 100) : 0}%
          </div>
          <div className="text-white/70 text-xs">taxa</div>
        </div>
      </div>

      {/* Progresso do Peso */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-6">
        <h4 className="text-md font-semibold text-white mb-4 flex items-center">
          <span className="w-2 h-2 bg-mint-500 rounded-full mr-2"></span>
          Progresso do Peso
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Peso Inicial */}
          <div className="text-center">
            <div className="text-white/70 text-sm mb-1">Peso Inicial</div>
            <div className="text-2xl font-bold text-white">{stats.pesoInicial} kg</div>
          </div>

          {/* Peso Atual */}
          <div className="text-center">
            <div className="text-white/70 text-sm mb-1">Peso Atual</div>
            <div className="text-2xl font-bold text-white">{stats.pesoAtual} kg</div>
          </div>

          {/* Variação */}
          <div className="text-center">
            <div className="text-white/70 text-sm mb-1">Variação</div>
            <div className={`text-2xl font-bold flex items-center justify-center ${getWeightChangeColor(stats.variacaoPeso)}`}>
              <span className="mr-2">{getWeightChangeIcon(stats.variacaoPeso)}</span>
              {stats.variacaoPeso > 0 ? '+' : ''}{stats.variacaoPeso} kg
            </div>
            <div className={`text-sm ${getWeightChangeColor(stats.variacaoPeso)}`}>
              ({weightChangePercent}%)
            </div>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="mt-6">
          <div className="flex justify-between text-white/70 text-sm mb-2">
            <span>Peso Inicial: {stats.pesoInicial} kg</span>
            <span>Peso Atual: {stats.pesoAtual} kg</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-mint-500 to-mint-600 h-3 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(100, Math.max(0, ((stats.pesoAtual - 30) / (300 - 30)) * 100))}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Meta Próxima */}
      <div className="bg-gradient-to-r from-mint-500/20 to-blue-500/20 rounded-lg p-6 border border-mint-500/30">
        <h4 className="text-md font-semibold text-white mb-3 flex items-center">
          <span className="w-2 h-2 bg-mint-500 rounded-full mr-2"></span>
          🎯 Meta Próxima
        </h4>
        <p className="text-white/90 text-lg leading-relaxed">
          {stats.metaProxima}
        </p>
        <div className="mt-4 flex items-center text-mint-400 text-sm">
          <span className="mr-2">🚀</span>
          Continue focado em seus objetivos!
        </div>
      </div>

      {/* Dicas de Melhoria */}
      <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
        <h5 className="text-sm font-medium text-white mb-3 flex items-center">
          <span className="w-2 h-2 bg-mint-500 rounded-full mr-2"></span>
          💡 Dicas para Melhorar
        </h5>
        <ul className="text-white/70 text-sm space-y-2">
          <li className="flex items-start">
            <span className="text-mint-400 mr-2">•</span>
            Mantenha consistência nos treinos para melhores resultados
          </li>
          <li className="flex items-start">
            <span className="text-mint-400 mr-2">•</span>
            Registre suas refeições para acompanhar a nutrição
          </li>
          <li className="flex items-start">
            <span className="text-mint-400 mr-2">•</span>
            Defina metas realistas e mensuráveis
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileStats;
