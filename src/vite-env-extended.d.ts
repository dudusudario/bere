
/// <reference types="vite/client" />

declare global {
  interface Window {
    receiveWebhookMessage?: (message: string | object) => { success: boolean };
  }
}

export {};
