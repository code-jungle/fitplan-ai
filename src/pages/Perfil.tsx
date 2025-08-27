import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import AvatarUploader from '../components/profile/AvatarUploader';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileStats from '../components/profile/ProfileStats';
import { NavigationProps } from '../types';
import Button from '../components/Button';

const Perfil: React.FC<NavigationProps> = ({ onNavigate }) => {
  const { profile, stats, isLoading, error, updateProfile, updateAvatar, clearError } = useProfile();
  const [activeTab, setActiveTab] = useState<'perfil' | 'estatisticas'>('perfil');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Salvar alterações do perfil
  const handleSaveProfile = async (updates: any) => {
    try {
      await updateProfile(updates);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    }
  };

  // Atualizar avatar
  const handleAvatarUpdate = async (avatarUrl: string) => {
    try {
      await updateAvatar(avatarUrl);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Erro ao atualizar avatar:', error);
    }
  };

  // Se ainda está carregando
  if (isLoading && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-mint-500 mx-auto mb-4"></div>
          <p className="text-white/70">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  // Se há erro
  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Erro ao carregar perfil</h2>
          <p className="text-white/70 mb-4">{error}</p>
          <div className="space-y-3">
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Tentar Novamente
            </Button>
            <Button
              onClick={() => onNavigate('dashboard')}
              variant="secondary"
              className="w-full"
            >
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Se não há perfil
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-white/50 text-6xl mb-4">👤</div>
          <h2 className="text-xl font-bold text-white mb-2">Perfil não encontrado</h2>
          <p className="text-white/70 mb-4">Não foi possível carregar suas informações de perfil.</p>
          <Button
            onClick={() => onNavigate('dashboard')}
            className="w-full"
          >
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header da Página */}
      <div className="relative overflow-hidden">
        {/* Background com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-r from-mint-500/20 via-blue-500/20 to-purple-500/20"></div>
        
        {/* Conteúdo do Header */}
        <div className="relative z-10 px-4 py-8 md:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Botão Voltar */}
            <div className="mb-6">
              <Button
                onClick={() => onNavigate('dashboard')}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <span>←</span>
                <span>Voltar ao Dashboard</span>
              </Button>
            </div>

            {/* Título da Página */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Meu Perfil
              </h1>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Gerencie suas informações pessoais, acompanhe seu progresso e personalize sua experiência no FitPlan AI
              </p>
            </div>

            {/* Tabs de Navegação */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 rounded-lg p-1 border border-white/20">
                <button
                  onClick={() => setActiveTab('perfil')}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                    activeTab === 'perfil'
                      ? 'bg-mint-500 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  📝 Dados do Perfil
                </button>
                <button
                  onClick={() => setActiveTab('estatisticas')}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                    activeTab === 'estatisticas'
                      ? 'bg-mint-500 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  📊 Estatísticas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="px-4 pb-8 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Mensagem de Sucesso */}
          {showSuccessMessage && (
            <div className="mb-6 bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-green-400 text-center">
              ✅ Alterações salvas com sucesso!
            </div>
          )}

          {/* Mensagem de Erro */}
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-400 text-center">
              <div className="flex items-center justify-between">
                <span>⚠️ {error}</span>
                <button
                  onClick={clearError}
                  className="text-red-400 hover:text-red-300 text-lg"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Conteúdo das Tabs */}
          {activeTab === 'perfil' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Coluna Esquerda - Avatar e Informações */}
              <div className="lg:col-span-1">
                <AvatarUploader
                  profile={profile}
                  onAvatarUpdate={handleAvatarUpdate}
                  className="mb-8"
                />
              </div>

              {/* Coluna Direita - Formulário */}
              <div className="lg:col-span-2">
                <ProfileForm
                  profile={profile}
                  onSave={handleSaveProfile}
                  isLoading={isLoading}
                />
              </div>
            </div>
          ) : (
            /* Tab de Estatísticas */
            <div className="max-w-4xl mx-auto">
              {stats ? (
                <ProfileStats stats={stats} />
              ) : (
                <div className="text-center py-12">
                  <div className="text-white/50 text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-bold text-white mb-2">Estatísticas não disponíveis</h3>
                  <p className="text-white/70">
                    Suas estatísticas serão exibidas aqui conforme você usa o app.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
