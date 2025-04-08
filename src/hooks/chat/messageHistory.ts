
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Message, DbMessage } from './types';

export const useMessageHistory = (scrollToBottomFn?: () => void) => {
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  const loadMessageHistory = useCallback(async (userPhone: string): Promise<Message[]> => {
    if (!userPhone) {
      console.log('No user phone provided, skipping message history load');
      return [];
    }
    
    setIsLoadingHistory(true);
    console.log('Loading message history for:', userPhone);
    
    try {
      const { data, error } = await supabase
        .from('message_history')
        .select('*')
        .eq('user_phone', userPhone)
        .order('timestamp', { ascending: true }) as { data: DbMessage[] | null, error: any };
      
      if (error) {
        console.error('Error loading message history:', error);
        toast.error("Erro ao carregar histórico de mensagens");
        setIsLoadingHistory(false);
        return [];
      }
      
      if (data && data.length > 0) {
        console.log(`Loaded ${data.length} messages from history`);
        
        const formattedMessages: Message[] = data.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender as 'user' | 'ai',
          timestamp: new Date(msg.timestamp),
          isFavorite: msg.is_favorite || false,
          // Files can't be restored from database as File objects, but we can indicate they existed
          files: undefined
        }));
        
        // Adicionar um pequeno atraso antes de chamar scrollToBottom para garantir que o DOM foi atualizado
        if (scrollToBottomFn) {
          setTimeout(scrollToBottomFn, 300);
        }
        
        setIsLoadingHistory(false);
        return formattedMessages;
      } else {
        console.log('No message history found');
        setIsLoadingHistory(false);
        return [];
      }
    } catch (err) {
      console.error('Error in loading message history:', err);
      toast.error("Erro ao carregar histórico de mensagens");
      setIsLoadingHistory(false);
      return [];
    }
  }, [scrollToBottomFn]);
  
  return {
    isLoadingHistory,
    loadMessageHistory
  };
};
