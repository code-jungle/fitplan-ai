import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { FormField } from '../components/forms/FormField';
import { MultiSelectField } from '../components/forms/MultiSelectField';
import { useCadastroForm } from '../hooks/useCadastroForm';
import { UserService } from '../services/userService';
import { NavigationProps } from '../types';
import { FORM_OPTIONS } from '../constants/formOptions';

interface CadastroProps extends NavigationProps {}

const Cadastro: React.FC<CadastroProps> = ({ onNavigate }) => {
  const {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    updateField,
    updateArrayField,
    validateForm,
    resetForm
  } = useCadastroForm();

  const [successMessage, setSuccessMessage] = useState<string>('');
  const [generalError, setGeneralError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulário submetido:', formData);
    setGeneralError('');
    setSuccessMessage('');

    if (!validateForm()) {
      console.log('Validação falhou');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Chamando UserService.cadastrarUsuario...');
      const result = await UserService.cadastrarUsuario(formData);
      console.log('Resultado do cadastro:', result);

      if (result.success) {
        setSuccessMessage('Usuário cadastrado com sucesso! Redirecionando...');
        
        // Simula delay para mostrar mensagem de sucesso
        setTimeout(() => {
          console.log('Redirecionando para dashboard...');
          onNavigate('dashboard');
        }, 2000);
      } else {
        setGeneralError(result.error || 'Erro ao cadastrar usuário');
      }
    } catch (error) {
      console.error('Erro durante cadastro:', error);
      setGeneralError('Erro inesperado ao cadastrar usuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    console.log('Resetando formulário...');
    resetForm();
    setGeneralError('');
    setSuccessMessage('');
    console.log('Formulário resetado com sucesso');
  };

  return (
    <div className="min-h-screen pt-24 pb-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="futuristic-text text-4xl md:text-5xl mb-4">
            Comece Sua Jornada
          </h1>
          <p className="text-xl text-white/80 font-inter max-w-2xl mx-auto">
            Preencha seus dados para criarmos um plano personalizado de saúde e fitness
          </p>
        </div>

        <Card gradient className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mensagens de feedback */}
            {successMessage && (
              <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-4 text-green-400 text-center">
                {successMessage}
              </div>
            )}

            {generalError && (
              <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4 text-red-400 text-center">
                {generalError}
              </div>
            )}

            {/* Informações Pessoais */}
            <div className="border-b border-white/20 pb-6">
              <h3 className="text-xl font-orbitron font-semibold text-white mb-4">
                Informações Pessoais
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nome Completo" error={errors.nome} required>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => updateField('nome', e.target.value)}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300"
                    placeholder="Digite seu nome completo"
                  />
                </FormField>

                <FormField label="Email" error={errors.email} required>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300"
                    placeholder="seu@email.com"
                  />
                </FormField>

                <FormField label="Idade" error={errors.idade} required>
                  <input
                    type="number"
                    value={formData.idade || ''}
                    onChange={(e) => updateField('idade', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300"
                    placeholder="25"
                    min="13"
                    max="120"
                  />
                </FormField>

                <FormField label="Sexo" error={errors.sexo} required>
                  <select
                    value={formData.sexo}
                    onChange={(e) => updateField('sexo', e.target.value)}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300"
                  >
                    <option value="" className="bg-slate-800 text-white">Selecione o sexo</option>
                    {FORM_OPTIONS.sexo.map(option => (
                      <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
            </div>

            {/* Medidas Corporais */}
            <div className="border-b border-white/20 pb-6">
              <h3 className="text-xl font-orbitron font-semibold text-white mb-4">
                Medidas Corporais
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Peso (kg)" error={errors.peso} required>
                  <input
                    type="number"
                    value={formData.peso || ''}
                    onChange={(e) => updateField('peso', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300"
                    placeholder="70.5"
                    step="0.1"
                    min="30"
                    max="300"
                  />
                </FormField>

                <FormField label="Altura (cm)" error={errors.altura} required>
                  <input
                    type="number"
                    value={formData.altura || ''}
                    onChange={(e) => updateField('altura', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300"
                    placeholder="175"
                    min="100"
                    max="250"
                  />
                </FormField>
              </div>
            </div>

            {/* Nível de Atividade e Objetivo */}
            <div className="border-b border-white/20 pb-6">
              <h3 className="text-xl font-orbitron font-semibold text-white mb-4">
                Atividade e Objetivos
              </h3>
              
              <FormField label="Nível de Atividade Atual" error={errors.nivelAtividade} required>
                <select
                  value={formData.nivelAtividade}
                  onChange={(e) => updateField('nivelAtividade', e.target.value)}
                  className="w-full px-4 py-3 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300"
                >
                  <option value="" className="bg-slate-800 text-white">Selecione o nível de atividade</option>
                  {FORM_OPTIONS.nivelAtividade.map(option => (
                    <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Objetivo Principal" error={errors.objetivo} required>
                <select
                  value={formData.objetivo}
                  onChange={(e) => updateField('objetivo', e.target.value)}
                  className="w-full px-4 py-3 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300"
                >
                  <option value="" className="bg-slate-800 text-white">Selecione o objetivo</option>
                  {FORM_OPTIONS.objetivo.map(option => (
                    <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            {/* Restrições e Preferências */}
            <div className="border-b border-white/20 pb-6">
              <h3 className="text-xl font-orbitron font-semibold text-white mb-4">
                Restrições e Preferências
              </h3>
              
              <MultiSelectField
                label="Restrições Alimentares"
                options={FORM_OPTIONS.restricoesAlimentares}
                selectedValues={formData.restricoesAlimentares}
                onChange={(values) => updateField('restricoesAlimentares', values)}
                className="mb-6"
              />

              <MultiSelectField
                label="Preferências de Exercício e Dieta"
                options={FORM_OPTIONS.preferencias}
                selectedValues={formData.preferencias}
                onChange={(values) => updateField('preferencias', values)}
              />
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleReset}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                Limpar
              </Button>
              
            
            </div>

            {/* Link para Login */}
            <div className="text-center pt-4 border-t border-white/20">
              <p className="text-white/70 text-sm">
                Já tem uma conta?{' '}
                <button
                  type="button"
                  className="text-mint-400 hover:text-mint-300 transition-colors font-medium"
                  onClick={() => onNavigate('login')}
                >
                  Faça login
                </button>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Cadastro;
