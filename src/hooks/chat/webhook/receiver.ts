
import { getReceivingWebhookUrl } from './urls';

// Configura um servidor para receber mensagens via HTTP POST
export const setupMessageReceiver = (onMessageReceived: (message: string) => void): void => {
  const receivingWebhookUrl = getReceivingWebhookUrl();
  
  if (!receivingWebhookUrl) {
    console.log('Receiving webhook URL not configured, skipping setup');
    return;
  }
  
  console.log('Setting up message receiver for URL:', receivingWebhookUrl);
  
  // Usando polling ao invés de EventSource para maior compatibilidade
  const startPolling = () => {
    const pollInterval = setInterval(() => {
      fetch(receivingWebhookUrl)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Polling request failed');
        })
        .then(data => {
          if (data && data.message) {
            onMessageReceived(data.message);
          }
        })
        .catch(err => {
          // Silently ignore polling errors to avoid console spam
          // console.error('Polling error:', err);
        });
    }, 5000); // Poll every 5 seconds
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      clearInterval(pollInterval);
    });
    
    return pollInterval;
  };
  
  // Start polling
  startPolling();
};

// Função para manter o webhook ativo
export const keepWebhookAlive = (webhookUrl: string): void => {
  // Implementa um heartbeat para manter a conexão viva
  const heartbeatInterval = setInterval(() => {
    fetch(webhookUrl, {
      method: 'HEAD',
      headers: {
        'Keep-Alive': 'timeout=60, max=100'
      },
    }).catch(err => {
      console.log('Heartbeat falhou, reconectando webhook...');
      // Tentar reconectar se o heartbeat falhar
    });
  }, 45000); // Envia heartbeat a cada 45 segundos
  
  // Limpar o intervalo quando a janela for fechada
  window.addEventListener('beforeunload', () => {
    clearInterval(heartbeatInterval);
  });
};
