import React, { useState } from 'react';
import LogoClean from './LogoClean';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    // Redirecionar para home após logout
    window.location.href = '/#home';
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <LogoClean size="md" />
        
                {/* Área de usuário logado - apenas em desktop/tablet */}
        {isAuthenticated && user && (
          <div className="hidden sm:flex items-center space-x-3 md:space-x-4">
            {/* Indicador visual de usuário logado */}
            
            
            {/* Informações do usuário */}
            <div className="text-right">
              <p className="text-white/90 text-sm font-medium truncate max-w-32">{user.nome}</p>
              <p className="text-white/60 text-xs truncate max-w-32">{user.email}</p>
            </div>
            
            {/* Separador visual */}
            <div className="w-px h-6 bg-white/20"></div>
            
            {/* Botão de logout apenas com ícone */}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-400 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/25 p-2 min-w-[40px]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </Button>
          </div>
        )}
        
        {/* Menu mobile para usuários logados */}
        {isAuthenticated && user && (
          <div className="sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Menu do usuário"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Menu dropdown mobile */}
            {showMobileMenu && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl">
                <div className="p-4 border-b border-white/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-mint-500/20 rounded-full flex items-center justify-center">
                      <span className="text-mint-400 font-semibold text-lg">
                        {user.nome.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.nome}</p>
                      <p className="text-white/60 text-sm">{user.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sair da conta</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Overlay para fechar menu mobile */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 z-40 sm:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;
