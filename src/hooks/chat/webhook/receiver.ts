
import { getReceivingWebhookUrl } from './urls';

// Configura um servidor para receber mensagens via HTTP POST
export const setupMessageReceiver = (onMessageReceived: (message: string) => void): void => {
  const receivingWebhookUrl = getReceivingWebhookUrl();
  
  if (!receivingWebhookUrl) {
    console.log('Receiving webhook URL not configured, skipping setup');
    return;
  }
  
  console.log('Setting up message receiver for URL:', receivingWebhookUrl);
  
  // Define startPolling function before using it
  const startPolling = () => {
    // Add a message handler for incoming webhook messages
    window.addEventListener('message', (event) => {
      // Handle messages sent to the window
      if (event.data && event.data.type === 'webhook_message') {
        console.log('Received webhook message:', event.data.message);
        onMessageReceived(event.data.message);
      }
    });
    
    const pollInterval = setInterval(() => {
      // Use the fetch API to poll the webhook endpoint
      fetch(receivingWebhookUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(data => {
          try {
            // Try to parse as JSON first
            const jsonData = JSON.parse(data);
            if (jsonData && jsonData.message) {
              console.log('Received webhook message via polling:', jsonData.message);
              onMessageReceived(jsonData.message);
            }
          } catch (e) {
            // If it's not valid JSON, check if it's a raw message
            if (data && typeof data === 'string' && data.trim()) {
              console.log('Received raw webhook message:', data);
              onMessageReceived(data);
            }
          }
        })
        .catch(error => {
          // Log the error but don't spam the console
          console.debug('Polling error (this is normal if the endpoint is not yet available):', error);
        });
    }, 5000); // Poll every 5 seconds
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      clearInterval(pollInterval);
    });
    
    return pollInterval;
  };
  
  // Create a simple server-sent events listener
  try {
    // Register an endpoint handler in the service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        console.log('Service worker ready, setting up message handler');
        
        // We'll use a simple polling mechanism instead since service workers
        // might not be fully supported in all environments
        startPolling();
      });
    } else {
      // Fallback to polling if service worker is not available
      startPolling();
    }
  } catch (err) {
    console.error('Error setting up message receiver:', err);
    // Fallback to polling
    startPolling();
  }
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
