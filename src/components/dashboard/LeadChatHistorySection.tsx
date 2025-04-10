
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { LeadChatHistory } from './LeadChatHistory';

interface LeadChatHistorySectionProps {
  whatsapp: string;
}

export const LeadChatHistorySection: React.FC<LeadChatHistorySectionProps> = ({ whatsapp }) => {
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (whatsapp) {
      fetchChatHistory(whatsapp);
    }
  }, [whatsapp]);

  const fetchChatHistory = async (whatsapp: string) => {
    if (!whatsapp) return;
    
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('n8n_chat_histories')
        .select('*')
        .eq('session_id', whatsapp)
        .order('id', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      setChatHistory(data || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar histórico de chat",
        description: "Não foi possível carregar as conversas recentes.",
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  return (
    <div className="border-t pt-4 mt-2">
      <h3 className="font-medium mb-3">Histórico de Conversas Recentes</h3>
      <LeadChatHistory 
        chatHistory={chatHistory} 
        isLoading={isLoadingHistory} 
      />
    </div>
  );
};
