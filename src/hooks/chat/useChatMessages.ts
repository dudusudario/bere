
import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Message } from './types';
import { 
  generateId 
} from './message/utils';
import { 
  saveMessage, 
  saveFavoriteStatus, 
  deleteMessageFromDb 
} from './storage/database';
import {
  WEBHOOK_URL,
} from './webhook/urls';
import {
  keepWebhookAlive,
} from './webhook/receiver';

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const webhookInitializedRef = useRef<boolean>(false);

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  // Start the webhook heartbeat when the component mounts
  useEffect(() => {
    // Evitar inicialização múltipla do webhook (corrige problema de carregamentos intermitentes)
    if (webhookInitializedRef.current) {
      return;
    }
    
    webhookInitializedRef.current = true;
    console.log('Inicializando webhook apenas para envio de mensagens');
    
    // Manter apenas o webhook de envio ativo
    keepWebhookAlive(WEBHOOK_URL);
    
    return () => {
      // Cleanup logic if needed
    };
  }, []);

  // Delete message
  const deleteMessage = useCallback(async (messageId: string) => {
    const success = await deleteMessageFromDb(messageId);
    
    if (success) {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success("Mensagem apagada com sucesso");
    }
  }, []);

  // Add message
  const addMessage = useCallback(async (content: string, sender: 'user' | 'ai', files?: File[], userPhone?: string) => {
    const newMessageId = generateId();
    const timestamp = new Date();
    
    const newMessage: Message = {
      id: newMessageId,
      content,
      sender,
      timestamp,
      isFavorite: false,
      files
    };

    setMessages(prev => [...prev, newMessage]);
    setTimeout(scrollToBottom, 100);
    
    // Store message in Supabase if userPhone is provided
    if (userPhone) {
      await saveMessage(newMessage, userPhone);
    }
    
    return newMessageId;
  }, [scrollToBottom]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (!message) return;
    
    const newFavoriteStatus = !message.isFavorite;
    
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isFavorite: newFavoriteStatus } 
          : msg
      )
    );
    
    await saveFavoriteStatus(messageId, newFavoriteStatus);
  }, [messages]);

  // Copy message to clipboard
  const copyMessageToClipboard = useCallback((messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      navigator.clipboard.writeText(message.content)
        .then(() => {
          toast.success("Mensagem copiada para a área de transferência");
        })
        .catch(err => {
          toast.error("Erro ao copiar mensagem");
          console.error('Failed to copy: ', err);
        });
    }
  }, [messages]);

  return {
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    chatContainerRef,
    addMessage,
    toggleFavorite,
    copyMessageToClipboard,
    deleteMessage
  };
};
