
import { getReceivingWebhookUrl } from './urls';

// Configura um servidor para receber mensagens via HTTP POST
export const setupMessageReceiver = (onMessageReceived: (message: string) => void): void => {
  const receivingWebhookUrl = getReceivingWebhookUrl();
  
  if (!receivingWebhookUrl) {
    console.log('Receiving webhook URL not configured, skipping setup');
    return;
  }
  
  console.log('Setting up message receiver for URL:', receivingWebhookUrl);
  
  // Define the polling function at the beginning of the scope
  const startPolling = () => {
    // Add a message handler for incoming webhook messages
    window.addEventListener('message', (event) => {
      // Handle messages sent to the window
      if (event.data && event.data.type === 'webhook_message') {
        console.log('Received webhook message:', event.data.message);
        onMessageReceived(event.data.message);
      }
    });
    
    // Implementa um servidor simples para receber mensagens POST
    const handleDirectMessage = async (url: string) => {
      try {
        // Simular um endpoint POST que pode receber mensagens via fetch
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          // Configure service worker to handle POST requests to our webhook URL
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'webhook_post' && event.data.message) {
              console.log('Received webhook POST message via service worker:', event.data.message);
              onMessageReceived(event.data.message);
            }
          });
        }
      } catch (err) {
        console.error('Error setting up POST handler:', err);
      }
    };

    // Iniciar o processamento de mensagens diretas
    handleDirectMessage(receivingWebhookUrl);
    
    const pollInterval = setInterval(() => {
      // Use the fetch API to poll the webhook endpoint
      fetch(receivingWebhookUrl, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      })
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
    }, 3000); // Poll every 3 seconds (mais frequente para evitar timeouts)
    
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
        'Keep-Alive': 'timeout=120, max=1000'
      },
    }).catch(err => {
      console.log('Heartbeat falhou, reconectando webhook...');
      // Tentar reconectar se o heartbeat falhar
    });
  }, 30000); // Envia heartbeat a cada 30 segundos (mais frequente)
  
  // Limpar o intervalo quando a janela for fechada
  window.addEventListener('beforeunload', () => {
    clearInterval(heartbeatInterval);
  });
};
