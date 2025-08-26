import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { NavigationProps } from '../types';

interface LoginProps extends NavigationProps {}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loginError, setLoginError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Limpar erro geral de login
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido';
    }

    if (!formData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setLoginError('');

    try {
      const result = await login(formData.email, formData.senha);
      
      if (result.success) {
        console.log('Login realizado com sucesso!');
        onNavigate('dashboard');
      } else {
        setLoginError(result.error || 'Falha na autenticação');
      }
    } catch (error) {
      console.error('Erro durante login:', error);
      setLoginError('Erro de conexão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setFormData({
      email: 'joao@example.com',
      senha: '123456'
    });
    
    // Aguardar um pouco para o usuário ver os dados preenchidos
    setTimeout(() => {
      handleSubmit(new Event('submit') as any);
    }, 500);
  };

  return (
    <div className="min-h-screen pt-24 pb-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card gradient className="text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-mint-400 to-lavanda-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="futuristic-text text-3xl mb-2">Bem-vindo de volta!</h2>
            <p className="text-white/80 font-inter">Entre na sua conta FitPlan AI</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
            <div className="text-left">
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint-400 transition-all ${
                  errors.email ? 'border-red-400' : 'border-white/20'
                }`}
                placeholder="seu@email.com"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Campo Senha */}
            <div className="text-left">
              <label htmlFor="senha" className="block text-sm font-medium text-white/90 mb-2">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={formData.senha}
                onChange={(e) => handleInputChange('senha', e.target.value)}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint-400 transition-all ${
                  errors.senha ? 'border-red-400' : 'border-white/20'
                }`}
                placeholder="••••••••"
                disabled={isSubmitting}
              />
              {errors.senha && (
                <p className="text-red-400 text-sm mt-1">{errors.senha}</p>
              )}
            </div>

            {/* Erro geral de login */}
            {loginError && (
              <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-3">
                <p className="text-red-400 text-sm">{loginError}</p>
              </div>
            )}

            {/* Botão de Login */}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>

            {/* Botão de Demo */}
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              className="w-full"
            >
              Entrar com Conta Demo
            </Button>
          </form>

          {/* Links de navegação */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-white/70 mb-4">
              Não tem uma conta?{' '}
              <button
                onClick={() => onNavigate('cadastro')}
                className="text-mint-400 hover:text-mint-300 font-medium transition-colors"
                disabled={isSubmitting}
              >
                Cadastre-se aqui
              </button>
            </p>
            
            <button
              onClick={() => onNavigate('home')}
              className="text-white/60 hover:text-white/80 text-sm transition-colors"
              disabled={isSubmitting}
            >
              ← Voltar para Home
            </button>
          </div>

          {/* Informações de Demo */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl">
            <p className="text-white/60 text-xs mb-2">💡 Conta Demo:</p>
            <p className="text-white/70 text-xs">
              Email: <span className="text-mint-400">joao@example.com</span>
            </p>
            <p className="text-white/70 text-xs">
              Senha: <span className="text-mint-400">123456</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
