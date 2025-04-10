
import React, { useState } from 'react';
import { SearchInput } from './SearchInput';
import { PatientsTable } from './PatientsTable';
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Sample patients data
const allPatients = [
  { id: 1, name: 'Roberto Oliveira', phone: '(11) 97777-8888', status: 'Ativo', lastAppointment: '05/04/2025', nextAppointment: '12/05/2025' },
  { id: 2, name: 'Carla Mendes', phone: '(21) 96666-5555', status: 'Ativo', lastAppointment: '01/04/2025', nextAppointment: '30/04/2025' },
  { id: 3, name: 'Paulo Souza', phone: '(31) 95555-4444', status: 'Pendente', lastAppointment: '25/03/2025', nextAppointment: '15/04/2025' },
  { id: 4, name: 'Luciana Ferreira', phone: '(41) 94444-3333', status: 'Inativo', lastAppointment: '10/02/2025', nextAppointment: '-' },
  { id: 5, name: 'Marcelo Castro', phone: '(51) 93333-2222', status: 'Ativo', lastAppointment: '02/04/2025', nextAppointment: '02/05/2025' },
  { id: 6, name: 'Julia Ribeiro', phone: '(11) 92222-1111', status: 'Ativo', lastAppointment: '03/04/2025', nextAppointment: '17/04/2025' },
  { id: 7, name: 'Fernando Gomes', phone: '(21) 91111-0000', status: 'Pendente', lastAppointment: '27/03/2025', nextAppointment: '20/04/2025' },
  { id: 8, name: 'Camila Alves', phone: '(31) 90000-9999', status: 'Inativo', lastAppointment: '05/01/2025', nextAppointment: '-' },
  { id: 9, name: 'Ricardo Santos', phone: '(41) 99999-8888', status: 'Ativo', lastAppointment: '04/04/2025', nextAppointment: '04/05/2025' },
  { id: 10, name: 'Mariana Costa', phone: '(51) 98888-7777', status: 'Ativo', lastAppointment: '01/04/2025', nextAppointment: '15/04/2025' }
];

export const PatientsDetailedView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [appointmentFilter, setAppointmentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter patients based on search query and filters
  const filteredPatients = allPatients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      patient.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === '' || patient.status === statusFilter;
    
    const hasNextAppointment = patient.nextAppointment && patient.nextAppointment !== '-';
    const matchesAppointment = appointmentFilter === '' || 
      (appointmentFilter === 'hasAppointment' && hasNextAppointment) ||
      (appointmentFilter === 'noAppointment' && !hasNextAppointment);
    
    return matchesSearch && matchesStatus && matchesAppointment;
  });

  // Paginate results
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  // Get unique statuses for filter options
  const statuses = [...new Set(allPatients.map(patient => patient.status))];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h3 className="text-lg font-medium">Gestão de Pacientes</h3>
        <div className="flex gap-2 w-full md:w-auto">
          <Button className="w-full md:w-auto" size="sm">
            <Plus className="mr-1 h-4 w-4" /> Novo Paciente
          </Button>
          <Button variant="outline" className="w-full md:w-auto" size="sm">
            <Calendar className="mr-1 h-4 w-4" /> Agendar Consulta
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="md:w-1/3">
              <SearchInput
                placeholder="Pesquisar pacientes..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
            <div className="flex flex-col md:flex-row flex-1 gap-4">
              <div className="w-full md:w-1/2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os Status</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/2">
                <RadioGroup className="flex space-x-4" value={appointmentFilter} onValueChange={setAppointmentFilter}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="" id="all" />
                    <Label htmlFor="all">Todos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hasAppointment" id="hasAppointment" />
                    <Label htmlFor="hasAppointment">Com Consulta</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="noAppointment" id="noAppointment" />
                    <Label htmlFor="noAppointment">Sem Consulta</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md border shadow-sm overflow-hidden">
            <PatientsTable patients={currentPatients} />
          </div>

          {filteredPatients.length > itemsPerPage && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
