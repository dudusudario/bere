
import React, { useState } from 'react';
import { LeadFilterContainer } from './LeadFilterContainer';
import { LeadsTable } from './LeadsTable';
import { LeadPagination } from './LeadPagination';
import { LeadDetailsDialog } from './LeadDetailsDialog';
import { Lead } from './hooks/useLeads';

interface LeadTableContainerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  interestFilter: string;
  setInterestFilter: (interest: string) => void;
  dateRangeFilter: string;
  setDateRangeFilter: (range: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  isLoading: boolean;
  paginatedLeads: Lead[];
  filteredLeads: Lead[];
  totalPages: number;
  statuses: string[];
  interests: string[];
  fetchLeads: () => Promise<void>;
  itemsPerPage: number;
}

export const LeadTableContainer: React.FC<LeadTableContainerProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  interestFilter, 
  setInterestFilter,
  dateRangeFilter,
  setDateRangeFilter,
  currentPage,
  setCurrentPage,
  isLoading,
  paginatedLeads,
  filteredLeads,
  totalPages,
  statuses,
  interests,
  fetchLeads,
  itemsPerPage
}) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDialogOpen(true);
  };

  return (
    <>
      <LeadFilterContainer
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
        isLoading={isLoading}
        filteredLeads={filteredLeads}
        itemsPerPage={itemsPerPage}
      >
        <LeadsTable leads={paginatedLeads} onLeadClick={handleLeadClick} />
      </LeadFilterContainer>
      
      {filteredLeads.length > itemsPerPage && (
        <LeadPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <LeadDetailsDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        lead={selectedLead} 
        onLeadUpdated={fetchLeads}
      />
    </>
  );
};
