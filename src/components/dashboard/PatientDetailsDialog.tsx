
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Phone, Mail, CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

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

// Helper function to get badge style based on status
const getStatusStyle = (status: string) => {
  switch(status?.toLowerCase()) {
    case 'ativo':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'pendente':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'inativo':
      return 'bg-gray-50 text-gray-700 border-gray-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export const PatientDetailsDialog: React.FC<PatientDetailsDialogProps> = ({ 
  patient, 
  open, 
  onOpenChange 
}) => {
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
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">WhatsApp: {patient.whatsapp || '-'}</p>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Email: {patient.email || '-'}</p>
              </div>

              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Última Visita: {patient.ultima_visita || '-'}</p>
              </div>

              <div className="pt-2">
                <h4 className="text-sm font-semibold mb-1">Status</h4>
                <Badge variant="outline" className={getStatusStyle(patient.status)}>
                  {patient.status || 'Pendente'}
                </Badge>
              </div>

              {patient.procedimento && (
                <div className="pt-2">
                  <h4 className="text-sm font-semibold mb-1">Procedimento</h4>
                  <p className="text-sm">{patient.procedimento}</p>
                </div>
              )}

              {patient.valor_do_orcamento && (
                <div className="pt-2">
                  <h4 className="text-sm font-semibold mb-1">Valor do Orçamento</h4>
                  <p className="text-sm">{patient.valor_do_orcamento}</p>
                </div>
              )}

              {patient.obs && (
                <div className="pt-2">
                  <h4 className="text-sm font-semibold mb-1">Observações</h4>
                  <p className="text-sm">{patient.obs}</p>
                </div>
              )}

              {patient.descricao && (
                <div className="pt-2">
                  <h4 className="text-sm font-semibold mb-1">Descrição</h4>
                  <p className="text-sm">{patient.descricao}</p>
                </div>
              )}
            </div>
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
