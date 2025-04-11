
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ProfileDetails } from './ProfileDetails';
import { LeadChatHistorySection } from './LeadChatHistorySection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WhatsAppMessageSender } from './WhatsAppMessageSender';

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
  const [activeTab, setActiveTab] = useState('profile');

  const handleSubmit = async (formData: Record<string, string>) => {
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

  // Map lead data to fields for the profile component
  const getLeadFields = () => {
    if (!lead) return [];
    
    return [
      { name: 'name', label: 'Nombres', value: lead.name || '', required: true },
      { name: 'last_name', label: 'Apellidos', value: '', required: true }, // Assuming last name is not available in current data
      { name: 'user_id', label: 'Usuario', value: lead.whatsapp || '', required: true },
      { name: 'e-mail', label: 'Correo electrónico', value: lead["e-mail"] || '', required: true },
      { name: 'country', label: 'País de residencia', value: 'Brasil', required: true },
      { name: 'whatsapp', label: 'Número telefónico', value: lead.whatsapp || '', required: true },
      { name: 'interesse', label: 'Interesse', value: lead.interesse || '' },
      { name: 'tags', label: 'Status', value: lead.tags || '' },
    ];
  };

  // Handler for when a message is successfully sent
  const handleMessageSent = () => {
    // Refresh the chat history if on chat tab
    if (activeTab === 'chat' && lead) {
      // The LeadChatHistorySection will re-fetch data when it mounts
      setActiveTab('chat');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl overflow-y-auto max-h-[90vh]" hideCloseButton>
        {lead && (
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="chat">Histórico de Chat</TabsTrigger>
              <TabsTrigger value="send">Enviar Mensagem</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="m-0">
              <ProfileDetails
                title="Perfil do Lead"
                fields={getLeadFields()}
                onSave={handleSubmit}
                onCancel={onClose}
                isLoading={loading}
              />
            </TabsContent>
            
            <TabsContent value="chat" className="m-0">
              <LeadChatHistorySection whatsapp={lead.whatsapp} />
            </TabsContent>
            
            <TabsContent value="send" className="m-0">
              <WhatsAppMessageSender 
                phoneNumber={lead.whatsapp} 
                onSendSuccess={handleMessageSent}
              />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};
