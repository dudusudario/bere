
import React, { useState, useEffect } from 'react';
import { format, subDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { LeadsTable } from './LeadsTable';
import { LeadFilters } from './LeadFilters';
import { LeadPagination } from './LeadPagination';
import { LeadActions } from './LeadActions';
import { LeadDetailsDialog } from './LeadDetailsDialog';

// Define the lead type to match supabase table structure
interface Lead {
  id: number;
  name: string;
  whatsapp: string;
  tags?: string;
  interesse?: string;
  "e-mail"?: string;
  created_at?: string;
}

export const LeadsDetailedView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [interestFilter, setInterestFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const itemsPerPage = 5;

  // Fetch leads from Supabase
  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('id, name, whatsapp, tags, interesse, "e-mail", created_at')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log('Fetched leads data:', data);
      setLeads(data || []);
      setFilteredLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar leads',
        description: 'Não foi possível carregar os dados dos leads.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Filter leads based on search query, status filter, and date range
  useEffect(() => {
    if (!leads) return;

    // Get current date
    const currentDate = new Date();
    
    // Calculate date ranges
    let dateFilter: Date | null = null;
    if (dateRangeFilter === '30') {
      dateFilter = subDays(currentDate, 30);
    } else if (dateRangeFilter === '60') {
      dateFilter = subDays(currentDate, 60);
    } else if (dateRangeFilter === '90') {
      dateFilter = subDays(currentDate, 90);
    }

    const filtered = leads.filter(lead => {
      // Filter by search query (name, whatsapp, or email)
      const matchesSearch = 
        (lead.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
        (lead.whatsapp?.includes(searchQuery) || false) ||
        (lead["e-mail"]?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = statusFilter === 'all' || lead.tags === statusFilter;
      
      // Filter by interest
      const matchesInterest = interestFilter === 'all' || lead.interesse === interestFilter;
      
      // Filter by date range
      let matchesDateRange = true;
      if (dateFilter && lead.created_at) {
        const leadDate = parseISO(lead.created_at);
        matchesDateRange = leadDate >= dateFilter;
      }
      
      return matchesSearch && matchesStatus && matchesInterest && matchesDateRange;
    });

    setFilteredLeads(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchQuery, statusFilter, interestFilter, dateRangeFilter, leads]);

  // Paginate results
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  // Get unique statuses and interests for filter options
  const statuses = [...new Set(leads.map(lead => lead.tags).filter(Boolean))] as string[];
  const interests = [...new Set(leads.map(lead => lead.interesse).filter(Boolean))] as string[];

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDialogOpen(true);
  };

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
    <div className="space-y-4">
      <LeadActions />

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
              <LeadsTable leads={paginatedLeads} onLeadClick={handleLeadClick} />
            )}
          </div>

          {filteredLeads.length > itemsPerPage && (
            <LeadPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </CardContent>
      </Card>

      <LeadDetailsDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        lead={selectedLead} 
        onLeadUpdated={fetchLeads}
      />
    </div>
  );
};
