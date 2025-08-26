import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

import { NavigationProps } from '../types';

interface HomeProps extends NavigationProps {}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen pt-24 pb-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="futuristic-text text-4xl md:text-6xl mb-6 ">
            Bem-vindo ao Futuro
          </h2>
          <p className="text-xl md:text-2xl text-white/80 font-inter max-w-2xl mx-auto">
            Transforme sua jornada de saúde e fitness com inteligência artificial adaptativa
          </p>
        </div>

        {/* Welcome Card */}
        <Card gradient className="mb-8 text-center animate-float relative z-0">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-mint-400 to-lavanda-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-glow">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="futuristic-text text-2xl md:text-3xl mb-4">
              Seu Assistente de Saúde e Fitness com IA Adaptativa
            </h3>
            <p className="text-lg text-white/80 font-inter leading-relaxed">
              O FitPlan AI analisa seus dados pessoais, objetivos e progresso para criar planos 
              personalizados que se adaptam ao seu estilo de vida e necessidades específicas.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => {              
                onNavigate('cadastro');                
              }}
              className="relative z-10 cursor-pointer"
            >
              Começar Jornada
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={() => onNavigate('login')}
            >
              Já tenho conta
            </Button>
            
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <div className="w-12 h-12 bg-mint-400/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-mint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="font-orbitron font-semibold text-lg mb-2">IA Adaptativa</h4>
            <p className="text-white/70 text-sm">Aprende com seus hábitos e ajusta planos automaticamente</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-lavanda-400/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-lavanda-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 className="font-orbitron font-semibold text-lg mb-2">Personalizado</h4>
            <p className="text-white/70 text-sm">Planos únicos baseados no seu perfil e objetivos</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-mint-400/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-mint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="font-orbitron font-semibold text-lg mb-2">Progresso Real</h4>
            <p className="text-white/70 text-sm">Acompanhe sua evolução com métricas precisas</p>
          </Card>
        </div>

        {/* Pricing Card */}
        <Card gradient className="text-center mb-8 relative z-0">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-mint-400 to-lavanda-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="futuristic-text text-2xl md:text-3xl mb-4">
              Plano único
            </h3>
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-4xl font-orbitron font-bold text-white">R$ 14,90</span>
                <span className="text-white/70 text-lg">/mês</span>
              </div>
              <p className="text-white/80 font-inter">Após 7 dias de teste gratuito</p>
            </div>
            
            <div className="space-y-3 mb-6 text-left max-w-md mx-auto">
             
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-mint-400 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white/90">Acesso completo a todos os recursos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-mint-400 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white/90">Cancelamento a qualquer momento</span>
              </div>
              
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              size="lg" 
              onClick={() => {
                
                
                onNavigate('cadastro');
                
              }}
              className=" relative z-10 cursor-pointer"
            >
              Começar Teste Gratuito
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
