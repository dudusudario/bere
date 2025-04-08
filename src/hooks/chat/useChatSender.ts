
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
  const webhookTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Send message to webhook with improved stability
  const sendMessage = useCallback(async (content: string, phoneNumber: string) => {
    if (!content.trim() && selectedFiles.length === 0) return;

    await addMessage(content, 'user', selectedFiles.map(f => f.file), phoneNumber);
    
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
      
      console.log(`Enviando mensagem para webhook ${WEBHOOK_URL}`);
      
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
      
      // First try to get response as text
      const responseText = await response.text();
      console.log('Resposta recebida:', responseText);
      
      // Parse the response to extract clean message text
      const parsedMessage = parseResponse(responseText);
      console.log('Mensagem parseada:', parsedMessage);
      
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
      
      clearFiles();
    }
  }, [addMessage, selectedFiles, clearFiles]);

  return {
    sendMessage
  };
};
