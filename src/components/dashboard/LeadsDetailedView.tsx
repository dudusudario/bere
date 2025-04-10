
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { LeadActions } from './LeadActions';
import { LeadTableContainer } from './LeadTableContainer';
import { useLeads } from './hooks/useLeads';

export const LeadsDetailedView: React.FC = () => {
  const {
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
    fetchLeads,
    statuses,
    interests,
    itemsPerPage
  } = useLeads();

  // Load leads on component mount
  React.useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleNewLead = () => {
    // Placeholder for adding new lead functionality
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A criação de novos leads será implementada em breve.",
    });
  };

  return (
    <div className="space-y-4">
      <LeadActions onNewLead={handleNewLead} />
      
      <LeadTableContainer
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        interestFilter={interestFilter}
        setInterestFilter={setInterestFilter}
        dateRangeFilter={dateRangeFilter}
        setDateRangeFilter={setDateRangeFilter}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoading={isLoading}
        paginatedLeads={paginatedLeads}
        filteredLeads={filteredLeads}
        totalPages={totalPages}
        statuses={statuses}
        interests={interests}
        fetchLeads={fetchLeads}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};
