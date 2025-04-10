
// Re-export all components from their new locations

// Message types
export * from './types';

// Main chat hook
export * from './useChat';
export { default } from './useChat';

// Message utilities
export { generateId } from './message/utils';
export { parseResponse } from './message/formatter';

// Database operations
export { 
  saveMessage, 
  saveFavoriteStatus, 
  deleteMessageFromDb 
} from './storage/database';

// Webhook utilities
export { 
  WEBHOOK_URL, 
  getReceivingWebhookUrl, 
  saveReceivingWebhookUrl, 
  generateReceivingWebhookUrl 
} from './webhook/urls';
export { 
  setupMessageReceiver, 
  keepWebhookAlive 
} from './webhook/receiver';
