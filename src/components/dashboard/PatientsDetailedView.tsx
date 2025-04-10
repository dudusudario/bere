
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { PatientsTable } from './PatientsTable';
import { PatientFilters } from './PatientFilters';
import { PatientPagination } from './PatientPagination';
import { PatientDetailsDialog } from './PatientDetailsDialog';
import { PatientActions } from './PatientActions';

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
          .select('id, nome, whatsapp, email, status, ultima_visita, obs, procedimento, valor_do_orcamento, descricao')
          .order('id', { ascending: false })
          .limit(5);

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

  // Always show all filtered patients (up to 5)
  const currentPatients = filteredPatients;
  // Keep totalPages calculation for pagination arrows functionality
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  // Get unique statuses for filter options
  const statuses = [...new Set(patients.map(patient => patient.status).filter(Boolean))];

  // Handle dialog close and patient update
  const handleDialogClose = (open: boolean) => {
    setShowPatientDetails(open);
    
    // If dialog is closing, refresh patient data to reflect status changes
    if (!open) {
      const fetchPatients = async () => {
        try {
          const { data, error } = await supabase
            .from('clinicorp')
            .select('id, nome, whatsapp, email, status, ultima_visita, obs, procedimento, valor_do_orcamento, descricao')
            .order('id', { ascending: false })
            .limit(5);

          if (error) {
            throw error;
          }

          // Update patient data to reflect changes
          const formattedData = data.map(patient => ({
            ...patient,
            status: patient.status || 'Pendente',
          }));

          setPatients(formattedData);
        } catch (error) {
          console.error('Error refreshing patient data:', error);
        }
      };

      fetchPatients();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h3 className="text-lg font-medium">Gestão de Pacientes</h3>
        <PatientActions />
      </div>

      <Card>
        <CardContent className="p-4">
          <PatientFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            appointmentFilter={appointmentFilter}
            setAppointmentFilter={setAppointmentFilter}
            statuses={statuses}
          />

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
            <PatientPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          )}
        </CardContent>
      </Card>

      <PatientDetailsDialog 
        patient={selectedPatient}
        open={showPatientDetails}
        onOpenChange={handleDialogClose}
      />
    </div>
  );
};
