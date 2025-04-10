
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
    if (!phoneNumber) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Buscando mensagens para:', phoneNumber);
      
      // Use type assertion to handle the table not being in the TypeScript definitions
      const { data, error } = await supabase
        .from('user_menssagens')
        .select('*')
        .eq('numero', phoneNumber)
        .order('timestamp', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar mensagens:', error);
        throw error;
      }
      
      console.log(`Encontradas ${data?.length || 0} mensagens para o número ${phoneNumber}`);
      
      // Use type assertion to convert to Message[]
      setMessages(data as unknown as Message[]);
    } catch (err) {
      console.error('Erro ao buscar mensagens:', err);
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
    if (!phoneNumber) return;
    
    console.log('Configurando listener para mensagens em tempo real:', phoneNumber);
    
    const channel = supabase
      .channel('public:user_menssagens')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'user_menssagens',
          filter: `numero=eq.${phoneNumber}`
        },
        (payload) => {
          console.log('Nova mensagem recebida em tempo real:', payload);
          const newMessage = payload.new as unknown as Message;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .subscribe();
    
    // Cleanup function to remove the subscription
    return () => {
      console.log('Removendo subscription para:', phoneNumber);
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
