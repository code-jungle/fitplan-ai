import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

import { AuthProps } from '../types';

interface LoginProps extends AuthProps {}

const Login: React.FC<LoginProps> = ({ onNavigate, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email, password });
    if (onLogin) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card gradient className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-mint-400 to-lavanda-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="futuristic-text text-2xl mb-2">Bem-vindo de Volta</h2>
            <p className="text-white/70">Entre na sua conta FitPlan AI</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-white/70 text-sm">
              Não tem uma conta?{' '}
              <button 
                className="text-mint-400 hover:text-mint-300 transition-colors"
                onClick={() => onNavigate('cadastro')}
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
