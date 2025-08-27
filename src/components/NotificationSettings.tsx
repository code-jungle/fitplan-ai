import React from 'react';
import Card from './Card';
import Button from './Button';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationSettingsProps {
  className?: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ className = '' }) => {
  const {
    isSupported,
    isEnabled,
    isLoading,
    settings,
    toggleNotifications,
    updateSettings,
    enableDailyReminders,
    disableDailyReminders,
    sendTestNotification
  } = useNotifications();

  if (!isSupported) {
    return (
      <Card className={`${className}`}>
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Notificações Não Suportadas</h3>
          <p className="text-white/70">
            Seu navegador não suporta notificações push. Tente usar um navegador mais recente.
          </p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className={`${className}`}>
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint-400 mx-auto mb-4"></div>
          <p className="text-white/70">Verificando notificações...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card gradient className={`${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">🔔 Configurações de Notificações</h3>
            <p className="text-white/70 text-sm">
              Gerencie seus lembretes e notificações personalizadas
            </p>
          </div>
          
          <Button
            onClick={toggleNotifications}
            variant={isEnabled ? "secondary" : "primary"}
            size="sm"
            disabled={isLoading}
          >
            {isEnabled ? 'Desativar' : 'Ativar'} Notificações
          </Button>
        </div>

        {isEnabled && (
          <>
            {/* Status das Notificações */}
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">Notificações Ativas</span>
              </div>
              <p className="text-white/70 text-sm mt-1">
                Você receberá lembretes e atualizações importantes
              </p>
            </div>

            {/* Configurações de Lembretes */}
            <div className="space-y-4 mb-6">
              <h4 className="text-lg font-medium text-white">⏰ Lembretes Diários</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Lembretes de Treino */}
                <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.trainingReminders}
                        onChange={(e) => updateSettings({ trainingReminders: e.target.checked })}
                        className="w-4 h-4 text-mint-500 bg-white/10 border-white/20 rounded focus:ring-mint-500 focus:ring-2"
                      />
                      <span className="text-white font-medium">🏋️ Treino</span>
                    </label>
                  </div>
                  
                  <input
                    type="time"
                    value={settings.trainingTime}
                    onChange={(e) => updateSettings({ trainingTime: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
                  />
                </div>

                {/* Lembretes de Dieta */}
                <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.dietReminders}
                        onChange={(e) => updateSettings({ dietReminders: e.target.checked })}
                        className="w-4 h-4 text-mint-500 bg-white/10 border-white/20 rounded focus:ring-mint-500 focus:ring-2"
                      />
                      <span className="text-white font-medium">🥗 Dieta</span>
                    </label>
                  </div>
                  
                  <input
                    type="time"
                    value={settings.dietTime}
                    onChange={(e) => updateSettings({ dietTime: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
                  />
                </div>

                {/* Lembretes de Progresso */}
                <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.progressReminders}
                        onChange={(e) => updateSettings({ progressReminders: e.target.checked })}
                        className="w-4 h-4 text-mint-500 bg-white/10 border-white/20 rounded focus:ring-mint-500 focus:ring-2"
                      />
                      <span className="text-white font-medium">📊 Progresso</span>
                    </label>
                  </div>
                  
                  <input
                    type="time"
                    value={settings.progressTime}
                    onChange={(e) => updateSettings({ progressTime: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
                  />
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={enableDailyReminders}
                variant="primary"
                size="sm"
                className="flex-1"
              >
                🚀 Ativar Lembretes Diários
              </Button>
              
              <Button
                onClick={disableDailyReminders}
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                ⏹️ Desativar Lembretes
              </Button>
              
              <Button
                onClick={sendTestNotification}
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                🧪 Testar Notificação
              </Button>
            </div>

            {/* Informações Adicionais */}
            <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h5 className="text-blue-400 font-medium mb-1">💡 Dica</h5>
                  <p className="text-white/70 text-sm">
                    As notificações são sincronizadas com seu dispositivo e funcionam mesmo quando o app está fechado.
                    Você pode personalizar os horários dos lembretes conforme sua rotina.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {!isEnabled && (
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-mint-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-mint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h6v-2H4v2zM4 11h6V9H4v2zM4 7h6V5H4v2z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-white mb-2">Ative as Notificações</h4>
            <p className="text-white/70 mb-6">
              Receba lembretes personalizados para treinos, dieta e acompanhamento de progresso.
              Mantenha-se motivado e consistente em sua jornada fitness!
            </p>
            <Button
              onClick={toggleNotifications}
              variant="primary"
              size="lg"
              disabled={isLoading}
            >
              🔔 Ativar Notificações
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default NotificationSettings;
