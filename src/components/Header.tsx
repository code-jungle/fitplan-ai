import React from 'react';
import LogoClean from './LogoClean';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Redirecionar para home após logout
    window.location.href = '/#home';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <LogoClean size="md" />
        
        <div className="flex items-center space-x-4">
          {isAuthenticated && user && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white/90 text-sm font-medium">{user.nome}</p>
                <p className="text-white/60 text-xs">{user.email}</p>
              </div>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-400"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
