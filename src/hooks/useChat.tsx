
import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
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

  const loadMessageHistory = useCallback(async (userPhone: string) => {
    if (!userPhone) return;
    
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('message_history')
        .select('*')
        .eq('user_phone', userPhone)
        .order('timestamp', { ascending: true });
      
      if (error) {
        console.error('Error loading message history:', error);
        toast.error("Erro ao carregar histórico de mensagens");
        return;
      }
      
      if (data && data.length > 0) {
        const formattedMessages: Message[] = data.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender as 'user' | 'ai',
          timestamp: new Date(msg.timestamp),
          isFavorite: msg.is_favorite || false,
          // Files can't be restored from database as File objects, but we can indicate they existed
          files: undefined
        }));
        
        setMessages(formattedMessages);
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) {
      console.error('Error in loading message history:', err);
      toast.error("Erro ao carregar histórico de mensagens");
    } finally {
      setIsLoadingHistory(false);
    }
  }, [scrollToBottom]);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('message_history')
        .delete()
        .eq('id', messageId);
      
      if (error) {
        console.error('Error deleting message:', error);
        toast.error("Erro ao apagar mensagem");
        return;
      }
      
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success("Mensagem apagada com sucesso");
    } catch (err) {
      console.error('Error in deleting message:', err);
      toast.error("Erro ao apagar mensagem");
    }
  }, []);

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
      try {
        // Convert files to a JSON structure if they exist
        let filesJson = null;
        if (files && files.length > 0) {
          filesJson = files.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size
          }));
        }
        
        const { error } = await supabase
          .from('message_history')
          .insert({
            user_phone: userPhone,
            content,
            sender,
            is_favorite: false,
            files: filesJson
          });
        
        if (error) {
          console.error('Error saving message to history:', error);
        }
      } catch (err) {
        console.error('Error in saving message to history:', err);
      }
    }
    
    return newMessageId;
  }, [scrollToBottom]);

  const toggleFavorite = useCallback(async (messageId: string) => {
    // Find the message to toggle
    const message = messages.find(msg => msg.id === messageId);
    if (!message) return;
    
    const newFavoriteStatus = !message.isFavorite;
    
    // Update state
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isFavorite: newFavoriteStatus } 
          : msg
      )
    );
    
    // Update in Supabase if it's a UUID (database ID)
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(messageId)) {
      try {
        const { error } = await supabase
          .from('message_history')
          .update({ is_favorite: newFavoriteStatus })
          .eq('id', messageId);
        
        if (error) {
          console.error('Error updating favorite status:', error);
          toast.error("Erro ao atualizar status de favorito");
        }
      } catch (err) {
        console.error('Error in toggling favorite:', err);
      }
    }
  }, [messages]);

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

  const parseResponse = (responseText: string) => {
    try {
      // Tenta analisar a resposta como JSON
      const jsonResponse = JSON.parse(responseText);
      
      // Se for um array com objetos que têm uma propriedade 'message'
      if (Array.isArray(jsonResponse) && jsonResponse.length > 0 && jsonResponse[0].message) {
        return jsonResponse[0].message;
      }
      
      // Se for um objeto com uma propriedade 'message'
      if (jsonResponse.message) {
        return jsonResponse.message;
      }
      
      // Retorna o JSON formatado se não conseguir extrair a mensagem
      return JSON.stringify(jsonResponse, null, 2);
    } catch (e) {
      // Se não for um JSON válido, retorna o texto original
      return responseText;
    }
  };

  const sendMessage = useCallback(async (content: string, phoneNumber: string) => {
    if (!content.trim() && selectedFiles.length === 0) return;

    // Add user message
    await addMessage(content, 'user', selectedFiles.map(f => f.file), phoneNumber);
    
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      // Enviar telefone e mensagem separadamente
      formData.append('telefone', phoneNumber);
      formData.append('mensagem', content);
      
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
      
      const responseText = await response.text();
      const parsedMessage = parseResponse(responseText);
      
      await addMessage(parsedMessage, 'ai', undefined, phoneNumber);
    } catch (error) {
      console.error('Error sending message:', error);
      await addMessage("Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.", 'ai', undefined, phoneNumber);
      toast.error("Erro ao enviar mensagem");
    } finally {
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
