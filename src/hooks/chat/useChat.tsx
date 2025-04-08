
import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Message } from './types';
import { useMessageHistory } from './messageHistory';
import { useFileHandler } from './fileHandler';
import { WEBHOOK_URL, generateId, parseResponse, saveMessage, saveFavoriteStatus, deleteMessageFromDb, keepWebhookAlive } from './utils';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const webhookTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  // Import sub-hooks with their functionality
  const { selectedFiles, handleFileChange, removeFile, clearFiles } = useFileHandler();
  const { isLoadingHistory, loadMessageHistory: loadHistory } = useMessageHistory(scrollToBottom);

  // Start the webhook heartbeat when the component mounts
  useEffect(() => {
    keepWebhookAlive();
  }, []);

  // Load message history wrapper
  const loadMessageHistory = useCallback(async (userPhone: string) => {
    if (!userPhone) return;
    const loadedMessages = await loadHistory(userPhone);
    setMessages(loadedMessages);
  }, [loadHistory]);

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

  // Send message to webhook with improved stability
  const sendMessage = useCallback(async (content: string, phoneNumber: string) => {
    if (!content.trim() && selectedFiles.length === 0) return;

    await addMessage(content, 'user', selectedFiles.map(f => f.file), phoneNumber);
    
    setIsLoading(true);
    
    // Limpar qualquer timeout anterior
    if (webhookTimeoutRef.current) {
      clearTimeout(webhookTimeoutRef.current);
    }
    
    try {
      const controller = new AbortController();
      const signal = controller.signal;
      
      // Definir um timeout para a requisição
      webhookTimeoutRef.current = setTimeout(() => {
        controller.abort();
      }, 30000); // 30 segundos de timeout
      
      const formData = new FormData();
      formData.append('telefone', phoneNumber);
      formData.append('mensagem', content);
      
      selectedFiles.forEach(filePreview => {
        formData.append('file', filePreview.file);
      });
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
        signal,
        headers: {
          'Connection': 'keep-alive',
          'Keep-Alive': 'timeout=60, max=1000'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      
      const responseText = await response.text();
      const parsedMessage = parseResponse(responseText);
      
      await addMessage(parsedMessage, 'ai', undefined, phoneNumber);
    } catch (error) {
      console.error('Error sending message:', error);
      
      if ((error as Error).name === 'AbortError') {
        await addMessage("A solicitação demorou muito tempo. Por favor, tente novamente.", 'ai', undefined, phoneNumber);
        toast.error("Tempo limite excedido na solicitação");
      } else {
        await addMessage("Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.", 'ai', undefined, phoneNumber);
        toast.error("Erro ao enviar mensagem");
      }
    } finally {
      if (webhookTimeoutRef.current) {
        clearTimeout(webhookTimeoutRef.current);
        webhookTimeoutRef.current = null;
      }
      
      setIsLoading(false);
      clearFiles();
    }
  }, [addMessage, selectedFiles, clearFiles]);

  return {
    messages,
    isLoading,
    isLoadingHistory,
    selectedFiles,
    chatContainerRef,
    sendMessage,
    loadMessageHistory,
    handleFileChange,
    removeFile,
    clearFiles,
    toggleFavorite,
    copyMessageToClipboard,
    deleteMessage
  };
};

export default useChat;
