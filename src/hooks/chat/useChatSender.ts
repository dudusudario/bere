
import { useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { FilePreview } from './types';
import { WEBHOOK_URL } from './webhook/urls';
import { parseResponse } from './message/formatter';

interface UseChatSenderProps {
  addMessage: (content: string, sender: 'user' | 'ai', files?: File[], userPhone?: string) => Promise<string>;
  selectedFiles: FilePreview[];
  clearFiles: () => void;
}

export const useChatSender = ({ addMessage, selectedFiles, clearFiles }: UseChatSenderProps) => {
  const abortControllerRef = useRef<AbortController | null>(null);

  // Send message to webhook with improved stability
  const sendMessage = useCallback(async (content: string, phoneNumber: string) => {
    if (!content.trim() && selectedFiles.length === 0) return;

    try {
      // Add user message to chat immediately
      await addMessage(content, 'user', selectedFiles.map(f => f.file), phoneNumber);
      
      // Cancel any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const signal = controller.signal;
      
      const formData = new FormData();
      formData.append('telefone', phoneNumber);
      formData.append('mensagem', content);
      
      selectedFiles.forEach(filePreview => {
        formData.append('file', filePreview.file);
      });
      
      console.log(`Enviando mensagem para webhook ${WEBHOOK_URL}`);
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
        signal
      });
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      
      // First try to get response as text
      const responseText = await response.text();
      console.log('Resposta recebida:', responseText);
      
      // Parse the response to extract clean message text
      const parsedMessage = parseResponse(responseText);
      console.log('Mensagem parseada:', parsedMessage);
      
      // Add AI response to chat
      if (parsedMessage) {
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
