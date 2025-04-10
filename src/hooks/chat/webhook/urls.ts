
// URLs e funções relacionadas a webhooks

// URL do webhook para enviar mensagens
export const WEBHOOK_URL = 'https://en8n.berenice.ai/webhook/c0ec8656-3e32-49ab-a5a3-33053921db0e';

// Funções vazias para manter compatibilidade com código existente
// Estas funções não fazem nada já que removemos o webhook de recebimento
export const getReceivingWebhookUrl = (): string => {
  return '';
};

export const saveReceivingWebhookUrl = (url: string): void => {
  // Função vazia para compatibilidade
};

export const generateReceivingWebhookUrl = (): string => {
  return '';
};
