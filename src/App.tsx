import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import Progresso from './pages/Progresso';
import Planos from './pages/Planos';
import { Page } from './types';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
  };

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
            <Planos />
          </ProtectedRoute>
        );
      default:
        return <Home onNavigate={handleNavigation} />;
    }
  };

  return (
    <AuthProvider>
      <div className="App min-h-screen bg-gradient-to-br from-slate-900 via-graphite-900 to-slate-800">
        <Header />
        <div className="pb-20 pt-24">
          {renderPage()}
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;
