
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LeadFilters } from './LeadFilters';

interface LeadFilterContainerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  interestFilter: string;
  setInterestFilter: (interest: string) => void;
  dateRangeFilter: string;
  setDateRangeFilter: (range: string) => void;
  statuses: string[];
  interests: string[];
  children: React.ReactNode;
  isLoading: boolean;
  filteredLeads: any[];
  itemsPerPage: number;
}

export const LeadFilterContainer: React.FC<LeadFilterContainerProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  interestFilter,
  setInterestFilter,
  dateRangeFilter,
  setDateRangeFilter,
  statuses,
  interests,
  children,
  isLoading,
  filteredLeads,
  itemsPerPage
}) => {
  const statusOptions = [
    { value: "gengivoplastia", label: "Gengivoplastia" },
    { value: "implante", label: "Implante" },
    { value: "protese", label: "Prótese" },
    { value: "dentadura", label: "Dentadura" },
    { value: "canal", label: "Canal" },
    { value: "coroa", label: "Coroa" },
    { value: "lentes", label: "Lentes" },
    { value: "desqualificado", label: "Desqualificado" },
    { value: "pausado", label: "Pausado" }
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <LeadFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          interestFilter={interestFilter}
          setInterestFilter={setInterestFilter}
          dateRangeFilter={dateRangeFilter}
          setDateRangeFilter={setDateRangeFilter}
          statuses={statuses}
          interests={interests}
          statusOptions={statusOptions}
        />

        <div className="bg-white rounded-md border shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <p>Carregando leads...</p>
            </div>
          ) : (
            children
          )}
        </div>

        {filteredLeads.length > itemsPerPage && (
          <div id="lead-pagination-container" />
        )}
      </CardContent>
    </Card>
  );
};
