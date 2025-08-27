import React from 'react';
import Card from '../Card';
import Button from '../Button';
import { Page } from '../../types';

interface QuickActionsCardProps {
  onNavigate: (page: Page) => void;
  className?: string;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onNavigate,
  className = ''
}) => {
  const actions: Array<{ id: Page; title: string; description: string; icon: React.ReactNode; color: string }> = [
    {
      id: 'progresso',
      title: 'Ver Progresso',
      description: 'Acompanhe sua evolução detalhada',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'mint'
    },
    {
      id: 'planos',
      title: 'Meus Planos',
      description: 'Visualize seus planos de dieta e treino',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'lavanda'
    },
    {
      id: 'refeicoes',
      title: 'Minhas Refeições',
      description: 'Controle sua alimentação',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 12.477 5.754 12 7.5 12s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 12.477 18.246 12 16.5 12c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'blue'
    },
    {
      id: 'perfil',
      title: 'Meu Perfil',
      description: 'Gerencie suas informações',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'green'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      mint: 'hover:bg-mint-500/20 border-mint-500/30',
      lavanda: 'hover:bg-lavanda-500/20 border-lavanda-500/30',
      blue: 'hover:bg-blue-500/20 border-blue-500/30',
      green: 'hover:bg-green-500/20 border-green-500/30'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.mint;
  };

  return (
    <Card gradient className={`${className}`}>
      <h2 className="futuristic-text text-2xl mb-6 text-center">Ações Rápidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
                         onClick={() => onNavigate(action.id)}
            className={`flex flex-col items-center justify-center h-24 p-4 rounded-xl border border-white/20 transition-all duration-300 ${getColorClasses(action.color)}`}
          >
            <div className="mb-2">{action.icon}</div>
            <span className="text-white font-semibold text-sm text-center">{action.title}</span>
            <span className="text-white/60 text-xs text-center mt-1">{action.description}</span>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActionsCard;
