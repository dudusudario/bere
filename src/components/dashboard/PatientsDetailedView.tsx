
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Define the patient type to match clinicorp table structure
interface Patient {
  id: number;
  nome: string;
  whatsapp: string;
  email: string;
  status: string;
  ultima_visita?: string;
}

export const PatientsDetailedView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [appointmentFilter, setAppointmentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const itemsPerPage = 5;

  // Fetch patients from Supabase
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('clinicorp')
          .select('id, nome, whatsapp, email, status, ultima_visita');

        if (error) {
          throw error;
        }

        // Map data to Patient type and format values
        const formattedData = data.map(patient => ({
          ...patient,
          status: patient.status || 'Pendente', // Default status if not present
        }));

        setPatients(formattedData);
        setFilteredPatients(formattedData);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao buscar pacientes',
          description: 'Não foi possível carregar os dados dos pacientes.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients based on search query and filters
  useEffect(() => {
    const filtered = patients.filter(patient => {
      const matchesSearch = 
        (patient.nome?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
        (patient.whatsapp?.includes(searchQuery) || false);
      
      const matchesStatus = statusFilter === '' || patient.status === statusFilter;
      
      const hasNextAppointment = patient.ultima_visita && patient.ultima_visita !== '-';
      const matchesAppointment = appointmentFilter === '' || 
        (appointmentFilter === 'hasAppointment' && hasNextAppointment) ||
        (appointmentFilter === 'noAppointment' && !hasNextAppointment);
      
      return matchesSearch && matchesStatus && matchesAppointment;
    });

    setFilteredPatients(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchQuery, statusFilter, appointmentFilter, patients]);

  // Paginate results
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  // Get unique statuses for filter options
  const statuses = [...new Set(patients.map(patient => patient.status).filter(Boolean))];

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
            {isLoading ? (
              <div className="p-8 text-center">
                <p>Carregando pacientes...</p>
              </div>
            ) : (
              <PatientsTable patients={currentPatients} />
            )}
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
