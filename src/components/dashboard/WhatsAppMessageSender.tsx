
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendWhatsAppMessage } from '@/utils/whatsGwApi';
import { toast } from '@/hooks/use-toast';
import { Send, Loader2, PaperclipIcon } from 'lucide-react';
import { useFileHandler } from '@/hooks/chat/fileHandler';

interface WhatsAppMessageSenderProps {
  phoneNumber: string;
  onSendSuccess?: () => void;
}

export const WhatsAppMessageSender: React.FC<WhatsAppMessageSenderProps> = ({ 
  phoneNumber,
  onSendSuccess 
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { selectedFiles, handleFileChange, removeFile, clearFiles } = useFileHandler();

  const handleSend = async () => {
    if (!message.trim() && selectedFiles.length === 0) {
      toast({
        title: "Mensagem vazia",
        description: "Por favor, digite uma mensagem ou selecione arquivos para enviar.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    try {
      const success = await sendWhatsAppMessage({
        number: phoneNumber,
        message: message.trim(),
        files: selectedFiles.map(f => f.file)
      });

      if (success) {
        toast({
          title: "Mensagem enviada",
          description: "Sua mensagem foi enviada com sucesso."
        });
        setMessage('');
        clearFiles();
        if (onSendSuccess) {
          onSendSuccess();
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Ocorreu um erro ao enviar sua mensagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mt-4 border rounded-md p-4">
      <h4 className="text-sm font-medium mb-2">Enviar Mensagem via WhatsApp</h4>
      
      <div className="flex flex-col gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="min-h-[100px] resize-none"
          disabled={isSending}
        />
        
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 my-2">
            {selectedFiles.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-sm"
              >
                <span className="truncate max-w-[100px]">{file.file.name}</span>
                <button 
                  onClick={() => removeFile(index)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              multiple
              disabled={isSending}
            />
            <PaperclipIcon className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </label>
          
          <Button 
            onClick={handleSend} 
            disabled={isSending} 
            className="flex items-center gap-2"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Enviar</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
