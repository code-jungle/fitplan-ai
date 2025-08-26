import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { NavigationProps } from '../types';

interface DashboardProps extends NavigationProps {}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-24 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header do Dashboard */}
        <div className="text-center mb-12">
          <h1 className="futuristic-text text-4xl md:text-5xl mb-4 text-shadow-lg">
            Bem-vindo, {user?.nome}! 👋
          </h1>
          <p className="text-xl text-white/80 font-inter max-w-2xl mx-auto">
            Seu dashboard personalizado de saúde e fitness
          </p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <div className="w-16 h-16 bg-mint-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-mint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-orbitron font-semibold text-xl mb-2">Peso Atual</h3>
            <p className="text-3xl font-bold text-white">{user?.peso} kg</p>
            <p className="text-white/60 text-sm">Meta: {user?.objetivo === 'perder-peso' ? 'Reduzir' : user?.objetivo === 'ganhar-massa' ? 'Aumentar' : 'Manter'}</p>
          </Card>

          <Card className="text-center">
            <div className="w-16 h-16 bg-lavanda-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-lavanda-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-orbitron font-semibold text-xl mb-2">Nível de Atividade</h3>
            <p className="text-2xl font-bold text-white capitalize">{user?.nivelAtividade}</p>
            <p className="text-white/60 text-sm">Recomendado para seu objetivo</p>
          </Card>

          <Card className="text-center">
            <div className="w-16 h-16 bg-mint-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-mint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-orbitron font-semibold text-xl mb-2">Objetivo</h3>
            <p className="text-2xl font-bold text-white capitalize">{user?.objetivo?.replace('-', ' ')}</p>
            <p className="text-white/60 text-sm">Foco principal do seu plano</p>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card gradient className="mb-8">
          <h2 className="futuristic-text text-2xl mb-6 text-center">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              size="lg"
              onClick={() => onNavigate('progresso')}
              className="flex flex-col items-center justify-center h-24"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Ver Progresso
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="flex flex-col items-center justify-center h-24"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              IA Insights
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="flex flex-col items-center justify-center h-24"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 12.477 5.754 12 7.5 12s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 12.477 18.246 12 16.5 12c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Meu Plano
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="flex flex-col items-center justify-center h-24"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Perfil
            </Button>
          </div>
        </Card>

        {/* Informações do Usuário */}
        <Card className="mb-8">
          <h2 className="futuristic-text text-2xl mb-6">Informações do Perfil</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-orbitron font-semibold text-lg mb-4 text-mint-400">Dados Pessoais</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Nome:</span>
                  <span className="text-white font-medium">{user?.nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Email:</span>
                  <span className="text-white font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Idade:</span>
                  <span className="text-white font-medium">{user?.idade} anos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Sexo:</span>
                  <span className="text-white font-medium capitalize">{user?.sexo}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-orbitron font-semibold text-lg mb-4 text-lavanda-400">Medidas e Objetivos</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Peso:</span>
                  <span className="text-white font-medium">{user?.peso} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Altura:</span>
                  <span className="text-white font-medium">{user?.altura} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Nível de Atividade:</span>
                  <span className="text-white font-medium capitalize">{user?.nivelAtividade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Objetivo:</span>
                  <span className="text-white font-medium capitalize">{user?.objetivo?.replace('-', ' ')}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
