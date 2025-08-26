import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from './Card';
import Button from './Button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-8 px-4 flex items-center justify-center">
        <Card className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-400 mx-auto mb-4"></div>
          <p className="text-white/80">Verificando autenticação...</p>
        </Card>
      </div>
    );
  }

  // Se não estiver autenticado, mostrar fallback ou tela de acesso negado
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen pt-24 pb-8 px-4 flex items-center justify-center">
        <Card gradient className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="futuristic-text text-2xl mb-4 text-red-400">
            Acesso Negado
          </h2>
          
          <p className="text-white/80 mb-6">
            Você precisa estar logado para acessar esta página.
          </p>
          
          <div className="space-y-3">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/#login'}
              className="w-full"
            >
              Fazer Login
            </Button>
            
            <Button 
              variant="secondary" 
              size="md" 
              onClick={() => window.location.href = '/#home'}
              className="w-full"
            >
              Voltar para Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Se estiver autenticado, mostrar o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
