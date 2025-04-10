
import React, { useState, useEffect } from 'react';
import { SearchInput } from './SearchInput';
import { LeadsTable } from './LeadsTable';
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
import { Plus } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
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
        .order('id', { ascending: false })
        .limit(5);

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

  // Filter leads based on search query and filters
  useEffect(() => {
    const filtered = leads.filter(lead => {
      const matchesSearch = 
        (lead.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
        (lead.whatsapp?.includes(searchQuery) || false) ||
        (lead["e-mail"]?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || lead.tags === statusFilter;
      const matchesInterest = interestFilter === 'all' || lead.interesse === interestFilter;
      
      return matchesSearch && matchesStatus && matchesInterest;
    });

    setFilteredLeads(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchQuery, statusFilter, interestFilter, leads]);

  // Paginate results (although we're limiting to 5 leads from the query)
  const currentLeads = filteredLeads;
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h3 className="text-lg font-medium">Gestão de Leads</h3>
        <Button className="w-full md:w-auto" size="sm">
          <Plus className="mr-1 h-4 w-4" /> Novo Lead
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="md:w-1/3">
              <SearchInput
                placeholder="Pesquisar leads..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
            <div className="flex flex-1 gap-2">
              <div className="w-full md:w-1/2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    {statusOptions.map(status => (
                      <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                    ))}
                    {statuses
                      .filter(status => !statusOptions.some(opt => opt.value === status))
                      .map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/2">
                <Select value={interestFilter} onValueChange={setInterestFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Interesse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Interesses</SelectItem>
                    {interests.map(interest => (
                      <SelectItem key={interest} value={interest}>{interest}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md border shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <p>Carregando leads...</p>
              </div>
            ) : (
              <LeadsTable leads={currentLeads} onLeadClick={handleLeadClick} />
            )}
          </div>

          {filteredLeads.length > itemsPerPage && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
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

      <LeadDetailsDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        lead={selectedLead} 
        onLeadUpdated={fetchLeads}
      />
    </div>
  );
};
