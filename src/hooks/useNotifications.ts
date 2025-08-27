import { useState, useEffect, useCallback } from 'react';
import { NotificationService, NotificationSettings } from '../services/notificationService';
import { useAuth } from '../contexts/AuthContext';

export const useNotifications = () => {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<NotificationSettings>(NotificationService.getSettings());

  // Verificar suporte e status inicial
  useEffect(() => {
    const checkSupport = async () => {
      const supported = NotificationService.isSupported();
      setIsSupported(supported);
      
      if (supported) {
        const enabled = await NotificationService.isEnabled();
        setIsEnabled(enabled);
      }
      
      setIsLoading(false);
    };

    checkSupport();
  }, []);

  // Atualizar configurações quando mudarem
  useEffect(() => {
    NotificationService.saveSettings(settings);
  }, [settings]);

  // Solicitar permissão
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;
    
    setIsLoading(true);
    try {
      const granted = await NotificationService.requestPermission();
      setIsEnabled(granted);
      
      if (granted) {
        // Configurar push notifications
        await NotificationService.setupPushNotifications();
        
        // Atualizar configurações
        setSettings(prev => ({ ...prev, enabled: true }));
      }
      
      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // Ativar/desativar notificações
  const toggleNotifications = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;
    
    if (!isEnabled) {
      return await requestPermission();
    } else {
      setSettings(prev => ({ ...prev, enabled: false }));
      setIsEnabled(false);
      return true;
    }
  }, [isSupported, isEnabled, requestPermission]);

  // Atualizar configurações específicas
  const updateSettings = useCallback((updates: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  // Ativar lembretes diários
  const enableDailyReminders = useCallback(() => {
    if (!user || !isEnabled) return;
    
    NotificationService.scheduleDailyReminders(user);
    console.log('Lembretes diários ativados');
  }, [user, isEnabled]);

  // Desativar lembretes
  const disableDailyReminders = useCallback(() => {
    NotificationService.clearScheduledNotifications();
    console.log('Lembretes diários desativados');
  }, []);

  // Enviar notificação de teste
  const sendTestNotification = useCallback(async () => {
    if (!isEnabled) return;
    
    await NotificationService.showNotification({
      id: 'test_notification',
      title: '🧪 Notificação de Teste',
      body: 'Sistema de notificações funcionando perfeitamente!',
      icon: '/logo-192.png',
      badge: '/logo-192.png',
      tag: 'test'
    });
  }, [isEnabled]);

  // Enviar notificação de progresso
  const sendProgressNotification = useCallback(async (progress: string) => {
    if (!user || !isEnabled) return;
    
    await NotificationService.sendProgressNotification(user, progress);
  }, [user, isEnabled]);

  // Enviar notificação de ajuste de plano
  const sendPlanAdjustmentNotification = useCallback(async (adjustment: string) => {
    if (!isEnabled) return;
    
    await NotificationService.sendPlanAdjustmentNotification(adjustment);
  }, [isEnabled]);

  return {
    // Estado
    isSupported,
    isEnabled,
    isLoading,
    settings,
    
    // Ações
    requestPermission,
    toggleNotifications,
    updateSettings,
    enableDailyReminders,
    disableDailyReminders,
    sendTestNotification,
    sendProgressNotification,
    sendPlanAdjustmentNotification
  };
};
