
import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ProfileDetails } from './ProfileDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Patient {
  id: number;
  nome: string;
  whatsapp: string;
  email: string;
  status: string;
  ultima_visita?: string;
  obs?: string;
  procedimento?: string;
  valor_do_orcamento?: string;
  descricao?: string;
}

interface PatientDetailsDialogProps {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PatientDetailsDialog: React.FC<PatientDetailsDialogProps> = ({ 
  patient, 
  open, 
  onOpenChange 
}) => {
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Set current status when patient data changes
  useEffect(() => {
    if (patient) {
      setCurrentStatus(patient.status || 'Pendente');
    }
  }, [patient]);

  // Handle patient data update
  const handleSave = async (formData: Record<string, string>) => {
    if (!patient) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('clinicorp')
        .update(formData)
        .eq('id', patient.id);

      if (error) {
        throw error;
      }
      
      toast({
        title: "Paciente atualizado",
        description: "As informações do paciente foram atualizadas com sucesso.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating patient:', error);
      toast({
        variant: 'destructive',
        title: "Erro ao atualizar paciente",
        description: "Não foi possível alterar os dados do paciente.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Map patient data to fields for the profile component
  const getPatientFields = () => {
    if (!patient) return [];
    
    return [
      { name: 'nome', label: 'Nombres', value: patient.nome || '', required: true },
      { name: 'sobrenome', label: 'Apellidos', value: '', required: true }, // Assuming last name is not available in current data
      { name: 'user_id', label: 'Usuario', value: patient.whatsapp || '', required: true },
      { name: 'email', label: 'Correo electrónico', value: patient.email || '', required: true },
      { name: 'country', label: 'País de residencia', value: 'Brasil', required: true },
      { name: 'whatsapp', label: 'Número telefónico', value: patient.whatsapp || '', required: true },
      { name: 'procedimento', label: 'Procedimento', value: patient.procedimento || '' },
      { name: 'status', label: 'Status', value: patient.status || '' },
      { name: 'valor_do_orcamento', label: 'Valor do orçamento', value: patient.valor_do_orcamento || '' },
    ];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto" hideCloseButton>
        {patient && (
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="history">Histórico de Consultas</TabsTrigger>
              <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="m-0">
              <ProfileDetails
                title="Perfil do Paciente"
                fields={getPatientFields()}
                onSave={handleSave}
                onCancel={() => onOpenChange(false)}
                isLoading={isUpdating}
              />
            </TabsContent>
            
            <TabsContent value="history" className="m-0">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Histórico de Consultas</h3>
                
                {patient.obs ? (
                  <div className="border rounded-md p-4">
                    <p className="font-medium mb-2">Observações:</p>
                    <p>{patient.obs}</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Não há histórico de consultas disponível.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="appointments" className="m-0">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Agendamentos</h3>
                  <Button className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Agendar Nova Consulta
                  </Button>
                </div>
                
                {patient.ultima_visita ? (
                  <div className="border rounded-md p-4">
                    <p className="font-medium">Última visita: {patient.ultima_visita}</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Não há agendamentos disponíveis.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};
