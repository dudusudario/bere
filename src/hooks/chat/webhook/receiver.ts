
import { getReceivingWebhookUrl } from './urls';

// Configura um servidor para receber mensagens via HTTP POST
export const setupMessageReceiver = (onMessageReceived: (message: string) => void): void => {
  const receivingWebhookUrl = getReceivingWebhookUrl();
  
  if (!receivingWebhookUrl) {
    console.error('Erro: URL de recebimento de webhook não configurada');
    return;
  }
  
  console.log('Configurando receptor de mensagens para URL:', receivingWebhookUrl);

  // Define a polling function that will check for new messages
  const pollForMessages = () => {
    // Simular recebimento de mensagens via polling (apenas para desenvolvimento)
    console.log('Verificando por novas mensagens em:', receivingWebhookUrl);
    
    try {
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
          if (response.status !== 404) { // Ignorar 404 já que é esperado quando não há mensagens
            console.debug(`Erro HTTP ao verificar mensagens: ${response.status}`);
          }
          return null;
        }
        return response.text();
      })
      .then(data => {
        if (data && typeof data === 'string' && data.trim()) {
          try {
            // Tentar analisar como JSON
            const jsonData = JSON.parse(data);
            if (jsonData && jsonData.message) {
              console.log('Mensagem recebida via polling:', jsonData.message);
              onMessageReceived(jsonData.message);
            }
          } catch (e) {
            // Se não for JSON válido, tratar como mensagem direta
            console.log('Mensagem de texto recebida:', data);
            onMessageReceived(data);
          }
        }
      })
      .catch(error => {
        // Log o erro, mas não spam o console
        console.debug('Erro de polling (normal se o endpoint ainda não estiver disponível):', error);
      });
    } catch (err) {
      console.error('Erro ao fazer polling para novas mensagens:', err);
    }
  };

  // Create a WebSocket connection if supported
  const setupWebSocket = () => {
    try {
      // Tentativa de criar WebSocket (se a URL for compatível)
      if (receivingWebhookUrl.startsWith('ws://') || receivingWebhookUrl.startsWith('wss://')) {
        const ws = new WebSocket(receivingWebhookUrl);
        
        ws.onopen = () => {
          console.log('Conexão WebSocket estabelecida');
        };
        
        ws.onmessage = (event) => {
          console.log('Mensagem recebida via WebSocket:', event.data);
          try {
            const data = JSON.parse(event.data);
            if (data && data.message) {
              onMessageReceived(data.message);
            } else {
              onMessageReceived(event.data);
            }
          } catch (e) {
            onMessageReceived(event.data);
          }
        };
        
        ws.onerror = (error) => {
          console.error('Erro na conexão WebSocket:', error);
          // Fallback para polling
          setInterval(pollForMessages, 3000);
        };
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao configurar WebSocket:', error);
      return false;
    }
  };
  
  // Setup a message listener for window events from postMessage
  window.addEventListener('message', (event) => {
    // Handle messages sent to the window
    if (event.data && event.data.type === 'webhook_message') {
      console.log('Mensagem de webhook recebida via postMessage:', event.data.message);
      onMessageReceived(event.data.message);
    }
  });

  // Processo principal para receber mensagens
  const setupReceiver = async () => {
    // Tenta configurar WebSocket primeiro
    const wsSuccess = setupWebSocket();
    
    if (!wsSuccess) {
      console.log('WebSocket não disponível, usando polling HTTP');
      
      // Usar polling como fallback
      const pollingInterval = setInterval(pollForMessages, 3000);
      
      // Limpar intervalo quando a página for fechada
      window.addEventListener('beforeunload', () => {
        clearInterval(pollingInterval);
      });
    }
  };
  
  // Iniciar o receptor
  setupReceiver();
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
  }, 30000); // Envia heartbeat a cada 30 segundos
  
  // Limpar o intervalo quando a janela for fechada
  window.addEventListener('beforeunload', () => {
    clearInterval(heartbeatInterval);
  });
};
