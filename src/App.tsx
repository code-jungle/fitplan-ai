import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import Progresso from './pages/Progresso';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigation} />;
      case 'login':
        return <Login onNavigate={handleNavigation} onLogin={handleLogin} />;
      case 'cadastro':
        return <Cadastro onNavigate={handleNavigation} />;
      case 'dashboard':
        return isAuthenticated ? <Dashboard onNavigate={handleNavigation} onLogout={handleLogout} /> : <Home onNavigate={handleNavigation} />;
      case 'progresso':
        return isAuthenticated ? <Progresso onNavigate={handleNavigation} /> : <Home onNavigate={handleNavigation} />;
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

export default App;
