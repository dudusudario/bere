
import { Message, FilePreview } from "./types";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const WEBHOOK_URL = 'https://en8n.berenice.ai/webhook/c0ec8656-3e32-49ab-a5a3-33053921db0e';

// Gera automaticamente a URL para receber mensagens
export const generateReceivingWebhookUrl = (): string => {
  // Obtém a URL base da aplicação
  const baseUrl = window.location.origin;
  
  // Forma a URL completa para o endpoint de webhook na mesma aplicação
  return `${baseUrl}/api/webhook/receive-messages`;
};

// Get the receiving webhook URL from localStorage or generate a default one
export const getReceivingWebhookUrl = (): string => {
  const savedUrl = localStorage.getItem('receivingWebhookUrl');
  return savedUrl || generateReceivingWebhookUrl();
};

// Save the receiving webhook URL to localStorage
export const saveReceivingWebhookUrl = (url: string): void => {
  localStorage.setItem('receivingWebhookUrl', url);
};

export const generateId = (): string => {
  // Generate a proper UUID for compatibility with Supabase
  return crypto.randomUUID();
};

export const parseResponse = (responseText: string): string => {
  try {
    const jsonResponse = JSON.parse(responseText);
    
    // Handle array of messages (fractional messages)
    if (Array.isArray(jsonResponse) && jsonResponse.length > 0) {
      // Check if we have message objects with message property
      if (jsonResponse[0].message !== undefined) {
        // Join all messages, preserving formatting
        return jsonResponse
          .map(item => item.message)
          .filter(msg => msg) // Filter out any undefined/null/empty messages
          .join('\n\n');
      }
    }
    
    // Handle single message object
    if (jsonResponse.message) {
      return jsonResponse.message;
    }
    
    // If the structure doesn't match expected format, return the full JSON
    return JSON.stringify(jsonResponse, null, 2);
  } catch (e) {
    // If parsing fails, return the original text
    return responseText;
  }
};

export const saveFavoriteStatus = async (messageId: string, isFavorite: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('message_history')
      .update({ is_favorite: isFavorite } as any)
      .eq('id', messageId);
    
    if (error) {
      console.error('Error updating favorite status:', error);
      toast.error("Erro ao atualizar status de favorito");
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error in toggling favorite:', err);
    return false;
  }
};

export const saveMessage = async (message: Message, userPhone?: string): Promise<boolean> => {
  if (!userPhone) return false;
  
  try {
    // Convert files to a JSON structure if they exist
    let filesJson = null;
    if (message.files && message.files.length > 0) {
      filesJson = message.files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      }));
    }
    
    const { error } = await supabase
      .from('message_history')
      .insert({
        id: message.id,
        user_phone: userPhone,
        content: message.content,
        sender: message.sender,
        is_favorite: message.isFavorite,
        files: filesJson
      } as any);
    
    if (error) {
      console.error('Error saving message to history:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in saving message to history:', err);
    return false;
  }
};

export const deleteMessageFromDb = async (messageId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('message_history')
      .delete()
      .eq('id', messageId);
    
    if (error) {
      console.error('Error deleting message:', error);
      toast.error("Erro ao apagar mensagem");
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in deleting message:', err);
    toast.error("Erro ao apagar mensagem");
    return false;
  }
};

// Função para manter o webhook ativo
export const keepWebhookAlive = (): void => {
  // Implementa um heartbeat para manter a conexão viva
  const heartbeatInterval = setInterval(() => {
    fetch(WEBHOOK_URL, {
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

// Configura um servidor para receber mensagens via HTTP POST
export const setupMessageReceiver = (onMessageReceived: (message: string) => void): void => {
  const receivingWebhookUrl = getReceivingWebhookUrl();
  
  if (!receivingWebhookUrl) {
    console.log('Receiving webhook URL not configured');
    return;
  }
  
  // Configurar um EventSource para receber mensagens de um servidor de eventos
  // Esta é uma abordagem alternativa caso o polling não seja ideal
  const setupEventSource = () => {
    try {
      const eventSource = new EventSource(receivingWebhookUrl);
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.message) {
            onMessageReceived(data.message);
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };
      
      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        eventSource.close();
        // Reconnect after a delay
        setTimeout(setupEventSource, 5000);
      };
      
      return eventSource;
    } catch (error) {
      console.error('Error setting up EventSource:', error);
      return null;
    }
  };
  
  // Use o EventSource para receber mensagens em tempo real
  const eventSource = setupEventSource();
  
  // Limpar recursos quando a janela for fechada
  window.addEventListener('beforeunload', () => {
    if (eventSource) {
      eventSource.close();
    }
  });
};
