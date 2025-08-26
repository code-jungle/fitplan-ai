import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

import { NavigationProps } from '../types';

interface CadastroProps extends NavigationProps {}

const Cadastro: React.FC<CadastroProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    objetivo: 'perder-peso'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Cadastro:', formData);
  };

  return (
    <div className="min-h-screen pt-24 pb-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card gradient className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-mint-400 to-lavanda-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="futuristic-text text-2xl mb-2">Junte-se ao Futuro</h2>
            <p className="text-white/70">Crie sua conta FitPlan AI</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="nome"
                placeholder="Seu nome completo"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Seu email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            
            <div>
              <input
                type="password"
                name="senha"
                placeholder="Sua senha"
                value={formData.senha}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="confirmarSenha"
                placeholder="Confirme sua senha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            <div>
              <select
                name="objetivo"
                value={formData.objetivo}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300"
              >
                <option value="perder-peso">Perder Peso</option>
                <option value="ganhar-massa">Ganhar Massa Muscular</option>
                <option value="manter-forma">Manter Forma</option>
                <option value="melhorar-saude">Melhorar Saúde Geral</option>
              </select>
            </div>

            <Button type="submit" className="w-full">
              Criar Conta
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-white/70 text-sm">
              Já tem uma conta?{' '}
              <button 
                className="text-mint-400 hover:text-mint-300 transition-colors"
                onClick={() => onNavigate('login')}
              >
                Faça login
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Cadastro;
