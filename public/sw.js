// Service Worker para FitPlanAI PWA
const CACHE_NAME = 'fitplan-ai-v1';
const STATIC_CACHE = 'fitplan-static-v1';
const DYNAMIC_CACHE = 'fitplan-dynamic-v1';

// Arquivos para cache estático
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/logo-192.png',
  '/logo-512.png'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalando...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Cache estático aberto');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Arquivos estáticos cacheados');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Erro ao instalar cache estático:', error);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativando...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker ativado');
        return self.clients.claim();
      })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Estratégia de cache para diferentes tipos de arquivos
  if (request.method === 'GET') {
    // Arquivos estáticos
    if (STATIC_FILES.includes(url.pathname)) {
      event.respondWith(
        caches.match(request)
          .then((response) => {
            return response || fetch(request);
          })
      );
    }
    // API calls - sempre buscar do servidor
    else if (url.pathname.startsWith('/api/')) {
      event.respondWith(fetch(request));
    }
    // Outros recursos - cache dinâmico
    else {
      event.respondWith(
        fetch(request)
          .then((response) => {
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return response;
          })
          .catch(() => {
            return caches.match(request);
          })
      );
    }
  }
});

// Push Notifications
self.addEventListener('push', (event) => {
  console.log('Push notification recebida:', event);
  
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body || 'Nova notificação do FitPlanAI',
        icon: data.icon || '/logo-192.png',
        badge: data.badge || '/logo-192.png',
        tag: data.tag || 'default',
        data: data.data || {},
        actions: data.actions || [],
        requireInteraction: data.requireInteraction || false,
        silent: false,
        vibrate: [200, 100, 200],
        timestamp: Date.now()
      };
      
      event.waitUntil(
        self.registration.showNotification(data.title || 'FitPlanAI', options)
      );
    } catch (error) {
      console.error('Erro ao processar push notification:', error);
      
      // Fallback para notificação simples
      const options = {
        body: 'Nova notificação do FitPlanAI',
        icon: '/logo-192.png',
        badge: '/logo-192.png',
        tag: 'fallback'
      };
      
      event.waitUntil(
        self.registration.showNotification('FitPlanAI', options)
      );
    }
  }
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  console.log('Notificação clicada:', event);
  
  event.notification.close();
  
  // Focar na janela existente ou abrir nova
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Procurar por janela aberta
        for (const client of clientList) {
          if (client.url.includes('/') && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Abrir nova janela se não houver
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Fechamento de notificação
self.addEventListener('notificationclose', (event) => {
  console.log('Notificação fechada:', event);
  
  // Aqui você pode implementar analytics ou outras ações
  // quando o usuário fecha a notificação
});

// Background Sync (para funcionalidades offline)
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Implementar sincronização em background
      console.log('Sincronizando dados em background...')
    );
  }
});

// Mensagens do app principal
self.addEventListener('message', (event) => {
  console.log('Mensagem recebida no SW:', event);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATED') {
    // Limpar caches antigos quando houver atualização
    event.waitUntil(
      caches.keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                return caches.delete(cacheName);
              }
            })
          );
        })
    );
  }
});

// Tratamento de erros
self.addEventListener('error', (event) => {
  console.error('Erro no Service Worker:', event);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejeitada não tratada:', event);
});
