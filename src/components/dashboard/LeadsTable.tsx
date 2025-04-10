
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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

interface LeadsTableProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onLeadClick }) => {
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

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-50 text-gray-700 border-gray-200';
    
    const status_lower = status.toLowerCase();
    
    if (status_lower.includes('gengivoplastia')) return 'bg-green-50 text-green-700 border-green-200';
    if (status_lower.includes('implante')) return 'bg-orange-50 text-orange-700 border-orange-200';
    if (status_lower.includes('protese')) return 'bg-pink-50 text-pink-700 border-pink-200';
    if (status_lower.includes('dentadura')) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    if (status_lower.includes('canal')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (status_lower.includes('coroa')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (status_lower.includes('lentes')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (status_lower.includes('desqualificado')) return 'bg-red-50 text-red-700 border-red-200';
    if (status_lower.includes('pausado')) return 'bg-gray-50 text-gray-700 border-gray-200';
    
    return 'bg-gray-50 text-gray-700 border-gray-200';
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
          <TableRow 
            key={lead.id} 
            className="cursor-pointer hover:bg-muted/80"
            onClick={() => onLeadClick(lead)}
          >
            <TableCell className="font-medium">{lead.name || '-'}</TableCell>
            <TableCell>{lead.whatsapp || '-'}</TableCell>
            <TableCell>
              {lead.tags ? (
                <Badge variant="outline" className={getStatusColor(lead.tags)}>
                  {lead.tags}
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
