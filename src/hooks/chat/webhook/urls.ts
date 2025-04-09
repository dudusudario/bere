
// URLs e funções relacionadas a webhooks

// URL do webhook para enviar mensagens
export const WEBHOOK_URL = 'https://en8n.berenice.ai/webhook/c0ec8656-3e32-49ab-a5a3-33053921db0e';

// Gera automaticamente a URL para receber mensagens
export const generateReceivingWebhookUrl = (): string => {
  // URL simplificada conforme pedido pelo usuário
  return `${window.location.origin}/api/webhook/berenice123`;
};

// Get the receiving webhook URL from localStorage or generate a new one
export const getReceivingWebhookUrl = (): string => {
  const savedUrl = localStorage.getItem('receivingWebhookUrl');
  if (savedUrl) {
    return savedUrl;
  }
  
  // No URL found, generate a new one
  const newUrl = generateReceivingWebhookUrl();
  localStorage.setItem('receivingWebhookUrl', newUrl);
  return newUrl;
};

// Save the receiving webhook URL to localStorage
export const saveReceivingWebhookUrl = (url: string): void => {
  localStorage.setItem('receivingWebhookUrl', url);
};
