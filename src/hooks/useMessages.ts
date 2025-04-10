
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Message = {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  read: boolean;
};

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        
        // Simulando busca de mensagens
        // Em um ambiente real, seria algo como:
        // const { data, error } = await supabase.from('messages').select('*').order('timestamp', { ascending: false });
        
        // Dados mockados para exemplo
        const mockMessages: Message[] = [
          {
            id: '1',
            content: 'Reunião agendada para amanhã às 10h',
            sender: 'Sistema',
            timestamp: new Date(),
            read: false
          },
          {
            id: '2',
            content: 'Lembrete: Consulta com Dra. Ana às 14h',
            sender: 'Sistema',
            timestamp: new Date(Date.now() - 86400000), // 1 dia atrás
            read: true
          },
          {
            id: '3',
            content: 'Nova mensagem de Paulo sobre o projeto',
            sender: 'Paulo Motta',
            timestamp: new Date(Date.now() - 172800000), // 2 dias atrás
            read: false
          }
        ];
        
        setMessages(mockMessages);
        setError(null);
      } catch (err) {
        setError('Erro ao buscar mensagens');
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    // Em um app real, poderíamos configurar um listener para atualizações em tempo real
    // const subscription = supabase
    //  .channel('messages')
    //  .on('INSERT', payload => {
    //    setMessages(prev => [payload.new, ...prev]);
    //  })
    //  .subscribe();
    
    // return () => {
    //   subscription.unsubscribe();
    // };
  }, []);

  const markAsRead = async (id: string) => {
    // Em um app real:
    // await supabase.from('messages').update({ read: true }).eq('id', id);
    
    // Atualização local para exemplo
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === id ? { ...msg, read: true } : msg
      )
    );
  };

  const deleteMessage = async (id: string) => {
    // Em um app real:
    // await supabase.from('messages').delete().eq('id', id);
    
    // Atualização local para exemplo
    setMessages(prevMessages => 
      prevMessages.filter(msg => msg.id !== id)
    );
  };

  return {
    messages,
    loading,
    error,
    markAsRead,
    deleteMessage
  };
};

export default useMessages;
