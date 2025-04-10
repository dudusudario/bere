
import React, { useState } from 'react';
import { SearchInput } from './SearchInput';

// For Leads tab
const sampleLeads = [
  { id: 1, name: 'Maria Silva', phone: '(11) 98765-4321', status: 'Novo', interest: 'Ortodontia', createdAt: '10/04/2025' },
  { id: 2, name: 'João Pereira', phone: '(11) 91234-5678', status: 'Em Contato', interest: 'Clareamento', createdAt: '09/04/2025' },
  { id: 3, name: 'Ana Costa', phone: '(21) 99876-5432', status: 'Qualificado', interest: 'Implante', createdAt: '08/04/2025' },
  { id: 4, name: 'Carlos Santos', phone: '(31) 98765-1234', status: 'Em Contato', interest: 'Prótese', createdAt: '07/04/2025' },
  { id: 5, name: 'Fernanda Lima', phone: '(41) 99988-7766', status: 'Novo', interest: 'Avaliação', createdAt: '05/04/2025' },
];

// For Patients tab
const samplePatients = [
  { id: 1, name: 'Roberto Oliveira', phone: '(11) 97777-8888', status: 'Ativo', lastAppointment: '05/04/2025', nextAppointment: '12/05/2025' },
  { id: 2, name: 'Carla Mendes', phone: '(21) 96666-5555', status: 'Ativo', lastAppointment: '01/04/2025', nextAppointment: '30/04/2025' },
  { id: 3, name: 'Paulo Souza', phone: '(31) 95555-4444', status: 'Pendente', lastAppointment: '25/03/2025', nextAppointment: '15/04/2025' },
  { id: 4, name: 'Luciana Ferreira', phone: '(41) 94444-3333', status: 'Inativo', lastAppointment: '10/02/2025', nextAppointment: '-' },
  { id: 5, name: 'Marcelo Castro', phone: '(51) 93333-2222', status: 'Ativo', lastAppointment: '02/04/2025', nextAppointment: '02/05/2025' },
];

interface EmptyTabContentProps {
  title: string;
}

export const EmptyTabContent: React.FC<EmptyTabContentProps> = ({ title }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter data based on search query
  const filteredData = title === 'Leads' 
    ? sampleLeads.filter(lead => 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        lead.phone.includes(searchQuery) || 
        lead.status.toLowerCase().includes(searchQuery.toLowerCase()))
    : samplePatients.filter(patient => 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        patient.phone.includes(searchQuery) || 
        patient.status.toLowerCase().includes(searchQuery.toLowerCase()));
  
  // Import the appropriate table component based on the title
  const TableComponent = title === 'Leads' 
    ? require('./LeadsTable').LeadsTable 
    : require('./PatientsTable').PatientsTable;
  
  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-medium">Gestão de {title}</h3>
        <div className="w-full md:w-64">
          <SearchInput 
            placeholder={`Pesquisar ${title.toLowerCase()}...`}
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
      </div>
      
      <div className="bg-white rounded-md border shadow-sm overflow-hidden">
        <TableComponent 
          leads={title === 'Leads' ? filteredData : []} 
          patients={title === 'Pacientes' ? filteredData : []} 
        />
      </div>
    </div>
  );
};
