import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import Progresso from './pages/Progresso';
import Planos from './pages/Planos';
import Refeicoes from './pages/Refeicoes';
import Perfil from './pages/Perfil';
import { Page } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Componente interno que usa o contexto de autenticação
const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { isAuthenticated, isLoading } = useAuth();

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
  };

  // Verificar autenticação e redirecionar automaticamente
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && currentPage === 'home') {
        // Se estiver logado e estiver na home, redirecionar para dashboard
        setCurrentPage('dashboard');
      } else if (!isAuthenticated && (currentPage === 'dashboard' || currentPage === 'progresso' || currentPage === 'planos')) {
        // Se não estiver logado e tentar acessar páginas protegidas, redirecionar para home
        setCurrentPage('home');
      }
    }
  }, [isAuthenticated, isLoading, currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigation} />;
      case 'login':
        return <Login onNavigate={handleNavigation} />;
      case 'cadastro':
        return <Cadastro onNavigate={handleNavigation} />;
      case 'dashboard':
        return (
          <ProtectedRoute>
            <Dashboard onNavigate={handleNavigation} />
          </ProtectedRoute>
        );
      case 'progresso':
        return (
          <ProtectedRoute>
            <Progresso onNavigate={handleNavigation} />
          </ProtectedRoute>
        );
      case 'planos':
        return (
          <ProtectedRoute>
            <Planos onNavigate={handleNavigation} />
          </ProtectedRoute>
        );
      case 'refeicoes':
        return (
          <ProtectedRoute>
            <Refeicoes onNavigate={handleNavigation} />
          </ProtectedRoute>
        );
      case 'perfil':
        return (
          <ProtectedRoute>
            <Perfil onNavigate={handleNavigation} />
          </ProtectedRoute>
        );
      default:
        return <Home onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-900 via-graphite-900 to-slate-800">
      <Header />
      <div className="pb-20 pt-24">
        {renderPage()}
      </div>
      <Footer />
    </div>
  );
};

// Componente principal que envolve tudo com o AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
