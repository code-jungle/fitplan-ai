import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { AuthService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (email: string, senha: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  });

  // Verificar autenticação ao inicializar
  useEffect(() => {
    const checkAuth = () => {
      try {
        const isAuth = AuthService.isAuthenticated();
        const user = AuthService.getUser();
        const token = AuthService.getToken();

        setAuthState({
          user: isAuth ? user : null,
          token: isAuth ? token : null,
          isAuthenticated: isAuth,
          isLoading: false
        });

        // Se autenticado, verificar se precisa renovar sessão
        if (isAuth && AuthService.isTokenExpiringSoon()) {
          console.log('Token expirando em breve, renovando sessão...');
          AuthService.refreshSession();
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    checkAuth();
  }, []);

  // Função de login
  const login = async (email: string, senha: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const result = await AuthService.login({ email, senha });
      
      if (result.success && result.user && result.token) {
        setAuthState({
          user: result.user,
          token: result.token,
          isAuthenticated: true,
          isLoading: false
        });
        return { success: true };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Erro durante login:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Erro de conexão. Tente novamente.' };
    }
  };

  // Função de logout
  const logout = () => {
    AuthService.logout();
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  // Função para renovar sessão
  const refreshSession = () => {
    const success = AuthService.refreshSession();
    if (success) {
      const user = AuthService.getUser();
      const token = AuthService.getToken();
      setAuthState(prev => ({
        ...prev,
        user,
        token
      }));
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
