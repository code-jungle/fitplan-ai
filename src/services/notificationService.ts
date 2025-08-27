import { User } from '../types';

export interface NotificationSettings {
  enabled: boolean;
  trainingReminders: boolean;
  dietReminders: boolean;
  progressReminders: boolean;
  trainingTime: string; // HH:mm
  dietTime: string; // HH:mm
  progressTime: string; // HH:mm
}

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  icon: string;
  badge: string;
  tag: string;
  data?: any;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export class NotificationService {
  private static readonly VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa1l0NgPmHwzHnMqGzJcIBUs4CL9c3qJ0N3lC3TI5eqHHj8HfL1b1RHUtElE';
  private static readonly DEFAULT_SETTINGS: NotificationSettings = {
    enabled: false,
    trainingReminders: true,
    dietReminders: true,
    progressReminders: true,
    trainingTime: '08:00',
    dietTime: '12:00',
    progressTime: '20:00'
  };

  /**
   * Verifica se as notificações são suportadas
   */
  static isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  /**
   * Verifica se as notificações estão habilitadas
   */
  static async isEnabled(): Promise<boolean> {
    if (!this.isSupported()) return false;
    
    if (Notification.permission === 'granted') {
      return true;
    }
    
    if (Notification.permission === 'denied') {
      return false;
    }
    
    // Verificar se há permissão implícita
    return Notification.permission === 'default';
  }

  /**
   * Solicita permissão para notificações
   */
  static async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificação:', error);
      return false;
    }
  }

  /**
   * Registra o service worker para push notifications
   */
  static async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!this.isSupported()) return null;
    
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registrado:', registration);
      
      // Aguardar o service worker estar ativo
      await navigator.serviceWorker.ready;
      
      return registration;
    } catch (error) {
      console.error('Erro ao registrar service worker:', error);
      return null;
    }
  }

  /**
   * Solicita e configura push notifications
   */
  static async setupPushNotifications(): Promise<boolean> {
    if (!this.isSupported()) return false;
    
    try {
      const registration = await this.registerServiceWorker();
      if (!registration) return false;
      
      // Verificar se já existe uma subscription
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        // Criar nova subscription
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.VAPID_PUBLIC_KEY) as unknown as ArrayBuffer
        });
      }
      
      console.log('Push subscription criada:', subscription);
      return true;
    } catch (error) {
      console.error('Erro ao configurar push notifications:', error);
      return false;
    }
  }

  /**
   * Envia notificação local
   */
  static async showNotification(data: NotificationData): Promise<Notification | null> {
    if (!this.isSupported() || !(await this.isEnabled())) return null;
    
    try {
      const notification = new Notification(data.title, {
        body: data.body,
        icon: data.icon || '/logo-192.png',
        badge: data.badge || '/logo-192.png',
        tag: data.tag,
        data: data.data,
        requireInteraction: data.requireInteraction || false,
        silent: false
      });
      
      // Configurar eventos da notificação
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      
      return notification;
    } catch (error) {
      console.error('Erro ao mostrar notificação:', error);
      return null;
    }
  }

  /**
   * Agenda notificação local
   */
  static scheduleNotification(data: NotificationData, delay: number): string {
    if (!this.isSupported()) return '';
    
    const id = `scheduled_${Date.now()}_${Math.random()}`;
    
    setTimeout(async () => {
      await this.showNotification(data);
    }, delay);
    
    return id;
  }

  /**
   * Agenda notificação para horário específico
   */
  static scheduleNotificationAtTime(data: NotificationData, time: string): string {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    
    // Se o horário já passou hoje, agendar para amanhã
    if (targetTime <= now) {
      targetTime.setDate(targetTime.getDate() + 1);
    }
    
    const delay = targetTime.getTime() - now.getTime();
    return this.scheduleNotification(data, delay);
  }

  /**
   * Agenda lembretes diários
   */
  static scheduleDailyReminders(user: User): void {
    if (!this.isSupported()) return;
    
    // Lembrete de treino
    this.scheduleNotificationAtTime({
      id: 'training_reminder',
      title: '🏋️ Hora do Treino!',
      body: `Olá ${user.nome}! Está na hora de fazer seu treino de hoje. Mantenha a consistência!`,
      icon: '/logo-192.png',
      badge: '/logo-192.png',
      tag: 'training_reminder'
    }, '08:00');
    
    // Lembrete de dieta
    this.scheduleNotificationAtTime({
      id: 'diet_reminder',
      title: '🥗 Hora da Refeição!',
      body: `Lembre-se de seguir seu plano alimentar. Hidratação é fundamental!`,
      icon: '/logo-192.png',
      badge: '/logo-192.png',
      tag: 'diet_reminder'
    }, '12:00');
    
    // Lembrete de progresso
    this.scheduleNotificationAtTime({
      id: 'progress_reminder',
      title: '📊 Atualize Seu Progresso!',
      body: 'Registre suas conquistas de hoje para acompanhar sua evolução.',
      icon: '/logo-192.png',
      badge: '/logo-192.png',
      tag: 'progress_reminder'
    }, '20:00');
  }

  /**
   * Envia notificação de progresso
   */
  static async sendProgressNotification(user: User, progress: string): Promise<void> {
    await this.showNotification({
      id: 'progress_update',
      title: '🎯 Progresso Atualizado!',
      body: progress,
      icon: '/logo-192.png',
      badge: '/logo-192.png',
      tag: 'progress_update'
    });
  }

  /**
   * Envia notificação de plano ajustado
   */
  static async sendPlanAdjustmentNotification(adjustment: string): Promise<void> {
    await this.showNotification({
      id: 'plan_adjustment',
      title: '⚡ Plano Ajustado!',
      body: adjustment,
      icon: '/logo-192.png',
      badge: '/logo-192.png',
      tag: 'plan_adjustment',
      requireInteraction: true
    });
  }

  /**
   * Converte chave VAPID para Uint8Array
   */
  private static urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Obtém configurações salvas
   */
  static getSettings(): NotificationSettings {
    try {
      const saved = localStorage.getItem('fitplan_notification_settings');
      return saved ? { ...this.DEFAULT_SETTINGS, ...JSON.parse(saved) } : this.DEFAULT_SETTINGS;
    } catch {
      return this.DEFAULT_SETTINGS;
    }
  }

  /**
   * Salva configurações
   */
  static saveSettings(settings: Partial<NotificationSettings>): void {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem('fitplan_notification_settings', JSON.stringify(updated));
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  }

  /**
   * Limpa todas as notificações agendadas
   */
  static clearScheduledNotifications(): void {
    // Implementar limpeza de notificações agendadas
    console.log('Notificações agendadas limpas');
  }
}
