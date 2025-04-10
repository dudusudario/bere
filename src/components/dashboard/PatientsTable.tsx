
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Patient {
  id: number;
  nome: string;
  whatsapp: string;
  email: string;
  status: string;
  ultima_visita?: string;
}

interface PatientsTableProps {
  patients: Patient[];
}

export const PatientsTable: React.FC<PatientsTableProps> = ({ patients }) => {
  if (patients.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        Nenhum paciente encontrado com os filtros atuais.
      </div>
    );
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Última Visita</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell className="font-medium">{patient.nome || '-'}</TableCell>
            <TableCell>{patient.whatsapp || '-'}</TableCell>
            <TableCell>{patient.email || '-'}</TableCell>
            <TableCell>
              <Badge variant="outline" className={getStatusStyle(patient.status)}>
                {patient.status || 'Pendente'}
              </Badge>
            </TableCell>
            <TableCell>{patient.ultima_visita || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
