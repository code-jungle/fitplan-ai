import { useState, useEffect } from 'react';

interface PWAState {
  isInstalled: boolean;
  canInstall: boolean;
  isOnline: boolean;
  notificationsSupported: boolean;
  notificationsEnabled: boolean;
}

export function usePWA() {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    canInstall: false,
    isOnline: navigator.onLine,
    notificationsSupported: 'Notification' in window,
    notificationsEnabled: false,
  });

  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    // Check if app is installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setPwaState(prev => ({ ...prev, isInstalled: true }));
      }
    };

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPwaState(prev => ({ ...prev, canInstall: true }));
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      setPwaState(prev => ({ ...prev, isInstalled: true, canInstall: false }));
      setDeferredPrompt(null);
    };

    // Handle online/offline status
    const handleOnline = () => setPwaState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setPwaState(prev => ({ ...prev, isOnline: false }));

    // Check notification permission
    const checkNotificationPermission = () => {
      if ('Notification' in window) {
        setPwaState(prev => ({ 
          ...prev, 
          notificationsEnabled: Notification.permission === 'granted' 
        }));
      }
    };

    // Register service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered:', registration);
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial checks
    checkIfInstalled();
    checkNotificationPermission();
    registerServiceWorker();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Install PWA
  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setPwaState(prev => ({ ...prev, isInstalled: true, canInstall: false }));
      }
      setDeferredPrompt(null);
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setPwaState(prev => ({ 
        ...prev, 
        notificationsEnabled: permission === 'granted' 
      }));
      return permission;
    }
    return Notification.permission;
  };

  // Send notification
  const sendNotification = (title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      return new Notification(title, options);
    }
    return null;
  };

  // Send push notification via service worker
  const sendPushNotification = async (title: string, options?: NotificationOptions) => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, options);
      } catch (error) {
        console.error('Failed to send push notification:', error);
      }
    }
  };

  return {
    ...pwaState,
    installPWA,
    requestNotificationPermission,
    sendNotification,
    sendPushNotification,
  };
}
