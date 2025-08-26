import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

import { AuthProps } from '../types';

interface DashboardProps extends AuthProps {}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onLogout }) => {
  const mockData = {
    nome: 'João Silva',
    objetivo: 'Perder Peso',
    pesoAtual: 75.5,
    pesoMeta: 70.0,
    caloriasConsumidas: 1850,
    caloriasMeta: 2000,
    exerciciosHoje: 3,
    metaExercicios: 5
  };

  return (
    <div className="min-h-screen pt-24 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header do Dashboard */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="futuristic-text text-3xl md:text-4xl mb-2">
              Olá, {mockData.nome}! 👋
            </h2>
            <p className="text-white/70 text-lg">
              Aqui está seu progresso de hoje
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" onClick={() => onNavigate('progresso')}>
              Ver Progresso
            </Button>
            <Button variant="secondary" size="sm" onClick={onLogout}>
              Sair
            </Button>
          </div>
        </div>

        {/* Cards de Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="w-12 h-12 bg-mint-400/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-mint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-orbitron font-semibold text-lg mb-2">Peso Atual</h3>
            <p className="text-2xl font-bold text-mint-400">{mockData.pesoAtual} kg</p>
            <p className="text-sm text-white/60">Meta: {mockData.pesoMeta} kg</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-lavanda-400/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-lavanda-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-orbitron font-semibold text-lg mb-2">Calorias</h3>
            <p className="text-2xl font-bold text-lavanda-400">{mockData.caloriasConsumidas}</p>
            <p className="text-sm text-white/60">Meta: {mockData.caloriasMeta}</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-mint-400/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-mint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-orbitron font-semibold text-lg mb-2">Exercícios</h3>
            <p className="text-2xl font-bold text-mint-400">{mockData.exerciciosHoje}</p>
            <p className="text-sm text-white/60">Meta: {mockData.metaExercicios}</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-lavanda-400/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-lavanda-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-orbitron font-semibold text-lg mb-2">Progresso</h3>
            <p className="text-2xl font-bold text-lavanda-400">68%</p>
            <p className="text-sm text-white/60">Semana atual</p>
          </Card>
        </div>

        {/* Seção de Ações Rápidas */}
        <Card gradient className="mb-8">
          <h3 className="futuristic-text text-xl mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="secondary" size="sm">
              Registrar Peso
            </Button>
            <Button variant="secondary" size="sm">
              Adicionar Exercício
            </Button>
            <Button variant="secondary" size="sm">
              Registrar Refeição
            </Button>
            <Button variant="secondary" size="sm">
              Ver Relatórios
            </Button>
          </div>
        </Card>

        {/* Seção de IA Insights */}
        <Card className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-mint-400 to-lavanda-500 rounded-full mr-3 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="futuristic-text text-xl">Insights da IA</h3>
          </div>
          <p className="text-white/80 leading-relaxed">
            Baseado no seu progresso, recomendo aumentar a intensidade dos exercícios cardiovasculares 
            em 15% esta semana. Sua consistência está excelente! 🎯
          </p>
        </Card>

        {/* Próximos Treinos */}
        <Card>
          <h3 className="futuristic-text text-xl mb-4">Próximos Treinos</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-semibold">Treino de Força - Superior</p>
                <p className="text-sm text-white/60">Amanhã às 8:00</p>
              </div>
              <Button size="sm">Ver Detalhes</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-semibold">Cardio - HIIT</p>
                <p className="text-sm text-white/60">Quinta às 18:00</p>
              </div>
              <Button size="sm">Ver Detalhes</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
