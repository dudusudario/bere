
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Lead {
  id: number;
  name: string;
  whatsapp: string;
  status?: string;
  interesse?: string;
  "e-mail"?: string;
  created_at?: string;
}

interface LeadsTableProps {
  leads: Lead[];
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads }) => {
  if (leads.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        Nenhum lead encontrado com os filtros atuais.
      </div>
    );
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, 'dd/MM/yyyy', { locale: ptBR });
      }
      return dateString;
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Interesse</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Data</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/80">
            <TableCell className="font-medium">{lead.name || '-'}</TableCell>
            <TableCell>{lead.whatsapp || '-'}</TableCell>
            <TableCell>
              {lead.status ? (
                <Badge variant="outline" className={
                  lead.status.toLowerCase().includes('novo') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  lead.status.toLowerCase().includes('contato') ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  lead.status.toLowerCase().includes('qualificado') ? 'bg-green-50 text-green-700 border-green-200' :
                  lead.status.toLowerCase().includes('desqualificado') ? 'bg-red-50 text-red-700 border-red-200' :
                  lead.status.toLowerCase().includes('agendado') ? 'bg-purple-50 text-purple-700 border-purple-200' :
                  lead.status.toLowerCase().includes('pausado') ? 'bg-gray-50 text-gray-700 border-gray-200' :
                  'bg-gray-50 text-gray-700 border-gray-200'
                }>
                  {lead.status}
                </Badge>
              ) : '-'}
            </TableCell>
            <TableCell>{lead.interesse || '-'}</TableCell>
            <TableCell>{lead["e-mail"] || '-'}</TableCell>
            <TableCell>{formatDate(lead.created_at)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
