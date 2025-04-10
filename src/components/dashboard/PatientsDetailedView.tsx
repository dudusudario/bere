
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
import { Plus, Calendar, X, Phone, Mail, CalendarIcon } from "lucide-react";
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
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

// Define the patient type to match clinicorp table structure
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

export const PatientsDetailedView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const itemsPerPage = 5;

  // Fetch patients from Supabase
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('clinicorp')
          .select('id, nome, whatsapp, email, status, ultima_visita, obs, procedimento, valor_do_orcamento, descricao');

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
      const matchesAppointment = appointmentFilter === 'all' || 
        (appointmentFilter === 'hasAppointment' && hasNextAppointment) ||
        (appointmentFilter === 'noAppointment' && !hasNextAppointment);
      
      return matchesSearch && matchesStatus && matchesAppointment;
    });

    setFilteredPatients(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchQuery, statusFilter, appointmentFilter, patients]);

  // Handle patient click
  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

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
                    <SelectItem value="all">Todos os Status</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/2">
                <RadioGroup className="flex space-x-4" value={appointmentFilter} onValueChange={setAppointmentFilter}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
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
              <PatientsTable 
                patients={currentPatients} 
                onPatientClick={handlePatientClick} 
              />
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

      {/* Patient Details Dialog */}
      <Dialog open={showPatientDetails} onOpenChange={setShowPatientDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedPatient?.nome || 'Detalhes do Paciente'}</DialogTitle>
            <DialogDescription>
              Informações do paciente
            </DialogDescription>
          </DialogHeader>
          
          {selectedPatient && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">WhatsApp: {selectedPatient.whatsapp || '-'}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Email: {selectedPatient.email || '-'}</p>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Última Visita: {selectedPatient.ultima_visita || '-'}</p>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-semibold mb-1">Status</h4>
                  <Badge variant="outline" className={getStatusStyle(selectedPatient.status)}>
                    {selectedPatient.status || 'Pendente'}
                  </Badge>
                </div>

                {selectedPatient.procedimento && (
                  <div className="pt-2">
                    <h4 className="text-sm font-semibold mb-1">Procedimento</h4>
                    <p className="text-sm">{selectedPatient.procedimento}</p>
                  </div>
                )}

                {selectedPatient.valor_do_orcamento && (
                  <div className="pt-2">
                    <h4 className="text-sm font-semibold mb-1">Valor do Orçamento</h4>
                    <p className="text-sm">{selectedPatient.valor_do_orcamento}</p>
                  </div>
                )}

                {selectedPatient.obs && (
                  <div className="pt-2">
                    <h4 className="text-sm font-semibold mb-1">Observações</h4>
                    <p className="text-sm">{selectedPatient.obs}</p>
                  </div>
                )}

                {selectedPatient.descricao && (
                  <div className="pt-2">
                    <h4 className="text-sm font-semibold mb-1">Descrição</h4>
                    <p className="text-sm">{selectedPatient.descricao}</p>
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
    </div>
  );
};

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
