
import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

export type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isFavorite: boolean;
  files?: File[];
};

export type FilePreview = {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video' | 'document';
};

const WEBHOOK_URL = 'https://en8n.berenice.ai/webhook/c0ec8656-3e32-49ab-a5a3-33053921db0e';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const generateId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  const addMessage = useCallback((content: string, sender: 'user' | 'ai', files?: File[]) => {
    const newMessage: Message = {
      id: generateId(),
      content,
      sender,
      timestamp: new Date(),
      isFavorite: false,
      files
    };

    setMessages(prev => [...prev, newMessage]);
    setTimeout(scrollToBottom, 100);
    return newMessage.id;
  }, [scrollToBottom]);

  const toggleFavorite = useCallback((messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isFavorite: !msg.isFavorite } 
          : msg
      )
    );
  }, []);

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

  const handleFileChange = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const newFiles: FilePreview[] = [];
    
    Array.from(files).forEach(file => {
      const fileType = file.type.split('/')[0];
      let type: 'image' | 'video' | 'document';
      
      if (fileType === 'image') {
        type = 'image';
      } else if (fileType === 'video') {
        type = 'video';
      } else {
        type = 'document';
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        newFiles.push({
          id: generateId(),
          file,
          preview: reader.result as string,
          type
        });
        
        if (newFiles.length === files.length) {
          setSelectedFiles(prev => [...prev, ...newFiles]);
        }
      };
      
      reader.readAsDataURL(file);
    });
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);

  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() && selectedFiles.length === 0) return;

    // Add user message
    addMessage(content, 'user', selectedFiles.map(f => f.file));
    
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('message', content);
      
      selectedFiles.forEach(filePreview => {
        formData.append('file', filePreview.file);
      });
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      
      const data = await response.text();
      addMessage(data || "Desculpe, não consegui processar sua solicitação.", 'ai');
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage("Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.", 'ai');
      toast.error("Erro ao enviar mensagem");
    } finally {
      setIsLoading(false);
      clearFiles();
    }
  }, [addMessage, selectedFiles, clearFiles]);

  return {
    messages,
    isLoading,
    selectedFiles,
    chatContainerRef,
    sendMessage,
    handleFileChange,
    removeFile,
    clearFiles,
    toggleFavorite,
    copyMessageToClipboard
  };
};

export default useChat;
