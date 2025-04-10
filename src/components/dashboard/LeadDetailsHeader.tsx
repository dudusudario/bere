
import React from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

interface LeadDetailsHeaderProps {
  createdAt?: string;
}

export const LeadDetailsHeader: React.FC<LeadDetailsHeaderProps> = ({ createdAt }) => {
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

  return (
    <DialogHeader>
      <DialogTitle>Detalhes do Lead</DialogTitle>
      {createdAt && (
        <div className="text-sm text-muted-foreground">
          Data de criação: {formatDate(createdAt)}
        </div>
      )}
    </DialogHeader>
  );
};
