
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { LeadFormFields } from './LeadFormFields';
import { LeadStatusSelect } from './LeadStatusSelect';
import { LeadChatHistory } from './LeadChatHistory';
import { format, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Lead {
  id: number;
  name: string;
  whatsapp: string;
  tags?: string;
  interesse?: string;
  "e-mail"?: string;
  created_at?: string;
}

interface LeadDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onLeadUpdated: () => void;
}

export const LeadDetailsDialog: React.FC<LeadDetailsDialogProps> = ({ 
  isOpen, 
  onClose, 
  lead,
  onLeadUpdated
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        whatsapp: lead.whatsapp,
        tags: lead.tags,
        interesse: lead.interesse,
        "e-mail": lead["e-mail"],
        created_at: lead.created_at
      });

      // Fetch chat history when lead is selected
      fetchChatHistory(lead.whatsapp);
    }
  }, [lead]);

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

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStatusChange = (value: string) => {
    handleChange('tags', value);
  };

  const handleSubmit = async () => {
    if (!lead) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('leads')
        .update(formData)
        .eq('id', lead.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Lead atualizado",
        description: "As informações do lead foram atualizadas com sucesso.",
      });
      onLeadUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar lead",
        description: "Não foi possível atualizar as informações do lead.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
      }
      return dateString;
    } catch (error) {
      return dateString;
    }
  };

  const statusOptions = [
    { value: "gengivoplastia", label: "Gengivoplastia", color: "bg-green-50 text-green-700 border-green-200" },
    { value: "implante", label: "Implante", color: "bg-orange-50 text-orange-700 border-orange-200" },
    { value: "protese", label: "Prótese", color: "bg-pink-50 text-pink-700 border-pink-200" },
    { value: "dentadura", label: "Dentadura", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    { value: "canal", label: "Canal", color: "bg-purple-50 text-purple-700 border-purple-200" },
    { value: "coroa", label: "Coroa", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { value: "lentes", label: "Lentes", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { value: "desqualificado", label: "Desqualificado", color: "bg-red-50 text-red-700 border-red-200" },
    { value: "pausado", label: "Pausado", color: "bg-gray-50 text-gray-700 border-gray-200" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Lead</DialogTitle>
          {lead?.created_at && (
            <div className="text-sm text-muted-foreground">
              Data de criação: {formatDate(lead.created_at)}
            </div>
          )}
        </DialogHeader>
        
        {lead && (
          <div className="grid gap-4 py-4">
            <LeadFormFields 
              formData={formData} 
              onFieldChange={handleChange}
            />
            
            <LeadStatusSelect 
              currentStatus={formData.tags || ''}
              onStatusChange={handleStatusChange}
              statusOptions={statusOptions}
            />

            <div className="border-t pt-4 mt-2">
              <h3 className="font-medium mb-3">Histórico de Conversas Recentes</h3>
              <LeadChatHistory 
                chatHistory={chatHistory} 
                isLoading={isLoadingHistory} 
              />
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
