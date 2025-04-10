
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Message = {
  id: string;
  content?: string;
  mensagem?: string; // Added for compatibility
  sender: string;
  origem?: 'user' | 'agent'; // Added for compatibility
  timestamp: Date;
  read: boolean;
  username?: string; // Added for compatibility
  numero?: string; // Added for compatibility
};

export const useMessages = (phoneNumber?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Added for compatibility

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setIsLoading(true);
        
        // Filter messages by phone number if provided
        let mockMessages: Message[] = [
          {
            id: '1',
            content: 'Reunião agendada para amanhã às 10h',
            mensagem: 'Reunião agendada para amanhã às 10h',
            sender: 'Sistema',
            origem: 'agent',
            timestamp: new Date(),
            read: false,
            username: 'Sistema',
            numero: phoneNumber || '123456789'
          },
          {
            id: '2',
            content: 'Lembrete: Consulta com Dra. Ana às 14h',
            mensagem: 'Lembrete: Consulta com Dra. Ana às 14h',
            sender: 'Sistema',
            origem: 'agent',
            timestamp: new Date(Date.now() - 86400000), // 1 dia atrás
            read: true,
            username: 'Sistema',
            numero: phoneNumber || '123456789'
          },
          {
            id: '3',
            content: 'Nova mensagem de Paulo sobre o projeto',
            mensagem: 'Nova mensagem de Paulo sobre o projeto',
            sender: 'Paulo Motta',
            origem: 'user',
            timestamp: new Date(Date.now() - 172800000), // 2 dias atrás
            read: false,
            username: 'Paulo Motta',
            numero: phoneNumber || '987654321'
          }
        ];
        
        // If phone number is provided, filter messages
        if (phoneNumber) {
          mockMessages = mockMessages.filter(msg => msg.numero === phoneNumber);
        }
        
        setMessages(mockMessages);
        setError(null);
      } catch (err) {
        setError('Erro ao buscar mensagens');
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [phoneNumber]);

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

  // Added for compatibility
  const refreshMessages = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would fetch fresh messages
      // For now we just simulate a refresh
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      setError('Erro ao atualizar mensagens');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    isLoading,
    markAsRead,
    deleteMessage,
    refreshMessages
  };
};

export default useMessages;
