
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/command";

interface Lead {
  id: number;
  name: string;
  phone: string;
  status: string;
  interest?: string;
  createdAt: string;
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Interesse</TableHead>
          <TableHead>Data</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell className="font-medium">{lead.name}</TableCell>
            <TableCell>{lead.phone}</TableCell>
            <TableCell>
              <Badge variant="outline" className={
                lead.status === 'Novo' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                lead.status === 'Em Contato' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                lead.status === 'Qualificado' ? 'bg-green-50 text-green-700 border-green-200' :
                'bg-gray-50 text-gray-700 border-gray-200'
              }>
                {lead.status}
              </Badge>
            </TableCell>
            <TableCell>{lead.interest || '-'}</TableCell>
            <TableCell>{lead.createdAt}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
