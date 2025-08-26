import React from 'react';
import Card from '../Card';
import Button from '../Button';

interface DashboardErrorProps {
  error: string;
  onRetry: () => void;
}

const DashboardError: React.FC<DashboardErrorProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen pt-24 pb-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="futuristic-text text-3xl mb-4 text-red-400">Erro ao Carregar Dashboard</h1>
          
          <p className="text-white/80 text-lg mb-6">
            Ocorreu um erro ao carregar os dados do seu dashboard. Tente novamente.
          </p>
          
          <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button onClick={onRetry} size="lg">
              Tentar Novamente
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.location.reload()}
            >
              Recarregar Página
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardError;
