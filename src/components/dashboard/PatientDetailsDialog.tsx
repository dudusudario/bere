
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { PatientStatusSelect } from './PatientStatusSelect';
import { PatientInfoDisplay } from './PatientInfoDisplay';

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
  // Add state for managing status changes
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Set current status when patient data changes
  useEffect(() => {
    if (patient) {
      setCurrentStatus(patient.status || 'Pendente');
    }
  }, [patient]);

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    if (!patient || newStatus === currentStatus) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('clinicorp')
        .update({ status: newStatus })
        .eq('id', patient.id);

      if (error) {
        throw error;
      }
      
      setCurrentStatus(newStatus);
      toast({
        title: "Status atualizado",
        description: `O status do paciente foi alterado para "${newStatus}"`,
      });
    } catch (error) {
      console.error('Error updating patient status:', error);
      toast({
        variant: 'destructive',
        title: "Erro ao atualizar status",
        description: "Não foi possível alterar o status do paciente.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{patient?.nome || 'Detalhes do Paciente'}</DialogTitle>
          <DialogDescription>
            Informações do paciente
          </DialogDescription>
        </DialogHeader>
        
        {patient && (
          <div className="space-y-4">
            <PatientInfoDisplay patient={patient} />
            
            <PatientStatusSelect 
              currentStatus={currentStatus}
              onStatusChange={handleStatusChange}
              isUpdating={isUpdating}
            />
          </div>
        )}

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Fechar
            </Button>
          </DialogClose>
          <Button type="button">
            <Calendar className="mr-2 h-4 w-4" />
            Agendar Consulta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
