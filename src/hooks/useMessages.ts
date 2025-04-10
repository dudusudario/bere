
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Message {
  id: number;
  username: string;
  numero: string;
  mensagem: string;
  origem: 'user' | 'agent';
  timestamp: string;
}

export function useMessages(phoneNumber?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch messages from Supabase
  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Use type assertion to handle the table not being in the TypeScript definitions
      const query = supabase
        .from('user_menssagens' as any)
        .select('*')
        .order('timestamp', { ascending: true });
      
      // Filter by phone number if provided
      if (phoneNumber) {
        query.eq('numero', phoneNumber);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Use type assertion to convert to Message[]
      setMessages(data as unknown as Message[]);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err as Error);
      toast.error('Erro ao carregar mensagens');
    } finally {
      setIsLoading(false);
    }
  }, [phoneNumber]);

  // Initialize real-time subscription
  useEffect(() => {
    fetchMessages();
    
    // Set up real-time listener for new messages
    const channel = supabase
      .channel('public:user_menssagens')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'user_menssagens',
          filter: phoneNumber ? `numero=eq.${phoneNumber}` : undefined
        },
        (payload) => {
          const newMessage = payload.new as unknown as Message;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .subscribe();
    
    // Cleanup function to remove the subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMessages, phoneNumber]);

  return {
    messages,
    isLoading,
    error,
    refreshMessages: fetchMessages
  };
}
