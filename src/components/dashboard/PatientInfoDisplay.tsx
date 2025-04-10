
import React from 'react';
import { Phone, Mail, CalendarIcon } from "lucide-react";

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

interface PatientInfoDisplayProps {
  patient: Patient;
}

export const PatientInfoDisplay: React.FC<PatientInfoDisplayProps> = ({ patient }) => {
  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-1 gap-3">
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
  );
};
