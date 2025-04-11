
import { useState } from 'react';
import { toast } from 'sonner';
import { sendWhatsAppMessage } from '../utils/whatsGwApi';
import { sendToN8n } from '../utils/sendToN8n';
import { FilePreview } from './chat/types';

interface UseMessageSenderProps {
  userPhone: string;
  isWhatsGWEnabled: boolean;
  selectedFiles: FilePreview[];
}

export const useMessageSender = ({ 
  userPhone, 
  isWhatsGWEnabled, 
  selectedFiles 
}: UseMessageSenderProps) => {
  const [sendingMessage, setSendingMessage] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!userPhone) {
      toast.error("Por favor, configure seu telefone no perfil primeiro");
      return;
    }
    
    setSendingMessage(true);
    
    try {
      console.log("Enviando mensagem:", content, "para número:", userPhone);
      
      let success = false;
      
      if (isWhatsGWEnabled) {
        success = await sendWhatsAppMessage({
          number: userPhone,
          message: content,
          files: selectedFiles.map(f => f.file)
        });
        
        if (success) {
          toast.success("Mensagem enviada com sucesso via WhatsApp");
        } else {
          toast.error("Falha ao enviar mensagem via WhatsApp");
        }
      } else {
        success = await sendToN8n({
          username: userPhone,
          numero: userPhone,
          mensagem: content
        });
        
        if (success) {
          toast.success("Mensagem enviada com sucesso");
        } else {
          toast.error("Falha ao enviar mensagem para o agente");
        }
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem para o agente");
    } finally {
      setSendingMessage(false);
    }
  };

  return {
    sendingMessage,
    handleSendMessage
  };
};
