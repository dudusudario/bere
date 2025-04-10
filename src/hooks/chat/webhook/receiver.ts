
import { getReceivingWebhookUrl } from './urls';

// Configura um servidor para receber mensagens via HTTP POST
export const setupMessageReceiver = (onMessageReceived: (message: string) => void): void => {
  // Como removemos o webhook de recebimento, essa função não faz nada
  console.log('Receptor de mensagens desativado. As mensagens serão recebidas diretamente do N8N.');
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
