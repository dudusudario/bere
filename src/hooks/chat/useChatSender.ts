
import { useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { FilePreview } from './types';
import { parseResponse } from './message/formatter';

interface UseChatSenderProps {
  addMessage: (content: string, sender: 'user' | 'ai', files?: File[], userPhone?: string) => Promise<string>;
  selectedFiles: FilePreview[];
  clearFiles: () => void;
}

export const useChatSender = ({ addMessage, selectedFiles, clearFiles }: UseChatSenderProps) => {
  const abortControllerRef = useRef<AbortController | null>(null);

  // Send message with improved stability
  const sendMessage = useCallback(async (content: string, phoneNumber: string) => {
    if (!content.trim() && selectedFiles.length === 0) return;

    await addMessage(content, 'user', selectedFiles.map(f => f.file), phoneNumber);
    
    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const signal = controller.signal;
      
      console.log(`Enviando mensagem`);
      
      // Simulação de resposta - em um cenário real, isso viria de uma API
      const responseText = "Esta é uma mensagem de resposta simulada.";
      console.log('Resposta recebida:', responseText);
      
      // Parse the response to extract clean message text
      const parsedMessage = parseResponse(responseText);
      console.log('Mensagem parseada:', parsedMessage);
      
      // Add the message to the chat
      if (parsedMessage && parsedMessage.trim()) {
        await addMessage(parsedMessage, 'ai', undefined, phoneNumber);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      if ((error as Error).name === 'AbortError') {
        // This is an expected case when we abort a previous request
        console.log('Request was aborted intentionally');
      } else {
        await addMessage("Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.", 'ai', undefined, phoneNumber);
        toast.error("Erro ao enviar mensagem");
      }
    } finally {
      abortControllerRef.current = null;
      clearFiles();
    }
  }, [addMessage, selectedFiles, clearFiles]);

  return {
    sendMessage
  };
};
