
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Patient {
  id: number;
  name: string;
  phone: string;
  status: string;
  lastAppointment?: string;
  nextAppointment?: string;
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Última Consulta</TableHead>
          <TableHead>Próxima Consulta</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell className="font-medium">{patient.name}</TableCell>
            <TableCell>{patient.phone}</TableCell>
            <TableCell>
              <Badge variant="outline" className={
                patient.status === 'Ativo' ? 'bg-green-50 text-green-700 border-green-200' :
                patient.status === 'Pendente' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                patient.status === 'Inativo' ? 'bg-gray-50 text-gray-700 border-gray-200' :
                'bg-gray-50 text-gray-700 border-gray-200'
              }>
                {patient.status}
              </Badge>
            </TableCell>
            <TableCell>{patient.lastAppointment || '-'}</TableCell>
            <TableCell>{patient.nextAppointment || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
