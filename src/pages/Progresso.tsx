import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

import { NavigationProps } from '../types';

interface ProgressoProps extends NavigationProps {}

const Progresso: React.FC<ProgressoProps> = ({ onNavigate }) => {
  const mockProgressData = {
    peso: [
      { data: '01/01', valor: 80.0 },
      { data: '08/01', valor: 79.2 },
      { data: '15/01', valor: 78.5 },
      { data: '22/01', valor: 77.8 },
      { data: '29/01', valor: 77.0 },
      { data: '05/02', valor: 76.3 },
      { data: '12/02', valor: 75.5 }
    ],
    calorias: [
      { data: 'Seg', valor: 1850 },
      { data: 'Ter', valor: 1920 },
      { data: 'Qua', valor: 1780 },
      { data: 'Qui', valor: 1950 },
      { data: 'Sex', valor: 1880 },
      { data: 'Sab', valor: 2100 },
      { data: 'Dom', valor: 1750 }
    ],
    exercicios: [
      { data: 'Seg', valor: 4 },
      { data: 'Ter', valor: 5 },
      { data: 'Qua', valor: 3 },
      { data: 'Ter', valor: 6 },
      { data: 'Sex', valor: 4 },
      { data: 'Sab', valor: 2 },
      { data: 'Dom', valor: 1 }
    ]
  };

  const renderSimpleChart = (data: any[], color: string, maxValue: number) => (
    <div className="flex items-end justify-between h-32 space-x-1">
      {data.map((item, index) => {
        const height = (item.valor / maxValue) * 100;
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className={`w-full rounded-t-sm transition-all duration-500 ${color}`}
              style={{ height: `${height}%` }}
            ></div>
            <span className="text-xs text-white/60 mt-2">{item.data}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="futuristic-text text-3xl md:text-4xl mb-2">
              Seu Progresso 📊
            </h2>
            <p className="text-white/70 text-lg">
              Acompanhe sua evolução e conquistas
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => onNavigate('dashboard')}>
            Voltar ao Dashboard
          </Button>
        </div>

        {/* Resumo Geral */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <h3 className="font-orbitron font-semibold text-lg mb-4">Peso Perdido</h3>
            <div className="text-3xl font-bold text-mint-400 mb-2">4.5 kg</div>
            <p className="text-sm text-white/60">Desde o início</p>
            <div className="mt-4 w-full bg-white/10 rounded-full h-2">
              <div className="bg-gradient-to-r from-mint-400 to-lavanda-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </Card>

          <Card className="text-center">
            <h3 className="font-orbitron font-semibold text-lg mb-4">Dias Ativos</h3>
            <div className="text-3xl font-bold text-lavanda-400 mb-2">42</div>
            <p className="text-sm text-white/60">Últimos 60 dias</p>
            <div className="mt-4 w-full bg-white/10 rounded-full h-2">
              <div className="bg-gradient-to-r from-mint-400 to-lavanda-500 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </Card>

          <Card className="text-center">
            <h3 className="font-orbitron font-semibold text-lg mb-4">Meta Alcançada</h3>
            <div className="text-3xl font-bold text-mint-400 mb-2">68%</div>
            <p className="text-sm text-white/60">Do objetivo principal</p>
            <div className="mt-4 w-full bg-white/10 rounded-full h-2">
              <div className="bg-gradient-to-r from-mint-400 to-lavanda-500 h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de Peso */}
          <Card>
            <h3 className="font-orbitron font-semibold text-lg mb-4">Evolução do Peso</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/60">Meta: 70.0 kg</span>
                <span className="text-sm text-white/60">Atual: 75.5 kg</span>
              </div>
            </div>
            {renderSimpleChart(mockProgressData.peso, 'bg-gradient-to-t from-mint-400 to-mint-600', 85)}
          </Card>

          {/* Gráfico de Calorias */}
          <Card>
            <h3 className="font-orbitron font-semibold text-lg mb-4">Calorias Semanais</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/60">Meta: 2000 cal</span>
                <span className="text-sm text-white/60">Média: 1897 cal</span>
              </div>
            </div>
            {renderSimpleChart(mockProgressData.calorias, 'bg-gradient-to-t from-lavanda-400 to-lavanda-600', 2200)}
          </Card>
        </div>

        {/* Gráfico de Exercícios */}
        <Card className="mb-8">
          <h3 className="font-orbitron font-semibold text-lg mb-4">Frequência de Exercícios</h3>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">Meta: 5x por semana</span>
              <span className="text-sm text-white/60">Média: 3.6x por semana</span>
            </div>
          </div>
          {renderSimpleChart(mockProgressData.exercicios, 'bg-gradient-to-t from-mint-400 to-lavanda-500', 7)}
        </Card>

        {/* Conquistas */}
        <Card gradient className="mb-8">
          <h3 className="futuristic-text text-xl mb-6">🏆 Conquistas Desbloqueadas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="w-12 h-12 bg-mint-400/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
              <h4 className="font-semibold mb-1">Primeira Semana</h4>
              <p className="text-sm text-white/60">7 dias consecutivos</p>
            </div>

            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="w-12 h-12 bg-lavanda-400/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold mb-1">Consistente</h4>
              <p className="text-sm text-white/60">30 dias ativos</p>
            </div>

            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="w-12 h-12 bg-mint-400/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="font-semibold mb-1">Meta de Peso</h4>
              <p className="text-sm text-white/60">-2kg alcançado</p>
            </div>

            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="w-12 h-12 bg-lavanda-400/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl">💪</span>
              </div>
              <h4 className="font-semibold mb-1">Força</h4>
              <p className="text-sm text-white/60">10 treinos completos</p>
            </div>
          </div>
        </Card>

        {/* Próximas Metas */}
        <Card>
          <h3 className="font-orbitron font-semibold text-xl mb-6">🎯 Próximas Metas</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <h4 className="font-semibold">Alcançar 73 kg</h4>
                <p className="text-sm text-white/60">Faltam 2.5 kg</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60 mb-1">Progresso</div>
                <div className="w-24 bg-white/10 rounded-full h-2">
                  <div className="bg-mint-400 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <h4 className="font-semibold">50 dias ativos</h4>
                <p className="text-sm text-white/60">Faltam 8 dias</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60 mb-1">Progresso</div>
                <div className="w-24 bg-white/10 rounded-full h-2">
                  <div className="bg-lavanda-400 h-2 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <h4 className="font-semibold">Meta de calorias</h4>
                <p className="text-sm text-white/60">Manter abaixo de 2000</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60 mb-1">Progresso</div>
                <div className="w-24 bg-white/10 rounded-full h-2">
                  <div className="bg-mint-400 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Progresso;
