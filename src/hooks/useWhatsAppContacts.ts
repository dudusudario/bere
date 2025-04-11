
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Contact {
  phoneNumber: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

export const useWhatsAppContacts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      // Buscar mensagens únicas agrupadas por número
      const { data, error } = await supabase
        .from('user_menssagens')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;

      // Processar para obter contatos únicos com última mensagem
      const contactMap = new Map<string, Contact>();
      
      data?.forEach(msg => {
        if (!contactMap.has(msg.numero)) {
          contactMap.set(msg.numero, {
            phoneNumber: msg.numero,
            lastMessage: msg.mensagem,
            timestamp: new Date(msg.timestamp),
            unread: false // Implementar lógica de mensagens não lidas posteriormente
          });
        }
      });
      
      setContacts(Array.from(contactMap.values()));
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de contatos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    contacts: filteredContacts,
    loading,
    searchTerm,
    setSearchTerm,
    refreshContacts: fetchContacts
  };
};
