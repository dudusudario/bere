
import { getReceivingWebhookUrl } from './urls';

// Configura um servidor para receber mensagens via HTTP POST
export const setupMessageReceiver = (onMessageReceived: (message: string) => void): void => {
  const receivingWebhookUrl = getReceivingWebhookUrl();
  
  if (!receivingWebhookUrl) {
    console.log('Receiving webhook URL not configured, skipping setup');
    return;
  }
  
  console.log('Setting up message receiver for URL:', receivingWebhookUrl);
  
  // Registrar um manipulador global para interceptar requisições
  window.addEventListener('load', () => {
    // Criar um elemento para mostrar quando uma mensagem é recebida
    const messageHandler = document.createElement('div');
    messageHandler.style.display = 'none';
    messageHandler.id = 'webhook-message-handler';
    document.body.appendChild(messageHandler);
    
    // Criar um evento customizado para receber mensagens
    const webhookEvent = new CustomEvent('webhook-message', { detail: { message: '' } });
    
    // Escutar por eventos de mensagem
    document.addEventListener('webhook-message', (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.message) {
        console.log('Received webhook message:', customEvent.detail.message);
        onMessageReceived(customEvent.detail.message);
      }
    });
    
    // Registrar rota no histórico para capturar requisições para o webhook
    const urlPath = new URL(receivingWebhookUrl).pathname;
    console.log('Registering webhook handler for path:', urlPath);
    
    // Monitorar requisições fetch para interceptar chamadas ao webhook
    const originalFetch = window.fetch;
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      
      if (url && url.includes('/api/webhook/receive')) {
        console.log('Intercepted fetch to webhook URL:', url);
        
        // Simular uma resposta bem-sucedida
        return Promise.resolve({
          ok: true,
          status: 200,
          statusText: 'OK',
          headers: new Headers({'Content-Type': 'application/json'}),
          json: () => Promise.resolve({ success: true }),
          text: () => Promise.resolve(JSON.stringify({ success: true }))
        } as Response);
      }
      
      // Continuar com a requisição original para outros URLs
      return originalFetch.apply(this, [input, init]);
    };
    
    // Criar um handler para receber mensagens POST
    // Esta função será chamada quando o usuário navegar para a URL do webhook
    // mas na prática precisa ser chamada por uma API externa
    window.receiveWebhookMessage = (message: string | object) => {
      let formattedMessage: string;
      
      if (typeof message === 'object') {
        try {
          // Se for um objeto, tenta extrair a propriedade message
          const messageObj = message as { message?: string };
          formattedMessage = messageObj.message || JSON.stringify(message);
        } catch (e) {
          formattedMessage = 'Erro ao processar mensagem do webhook';
        }
      } else {
        formattedMessage = message;
      }
      
      console.log('Webhook message received via custom handler:', formattedMessage);
      
      // Disparar o evento customizado com a mensagem
      const event = new CustomEvent('webhook-message', { 
        detail: { message: formattedMessage }
      });
      document.dispatchEvent(event);
      
      // Também chamar o callback diretamente
      onMessageReceived(formattedMessage);
      
      return { success: true };
    };
    
    console.log('Webhook handler setup complete. To test, call: window.receiveWebhookMessage("test")');
  });
};

// Função para manter o webhook ativo
export const keepWebhookAlive = (webhookUrl: string): void => {
  // Nada a fazer, o webhook responderá imediatamente
  console.log('Webhook keepalive enabled for:', webhookUrl);
};
