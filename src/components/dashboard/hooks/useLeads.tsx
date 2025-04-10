
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { format, subDays, parseISO } from 'date-fns';

// Define the lead type to match supabase table structure
export interface Lead {
  id: number;
  name: string;
  whatsapp: string;
  tags?: string;
  interesse?: string;
  "e-mail"?: string;
  created_at?: string;
}

export const useLeads = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [interestFilter, setInterestFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const itemsPerPage = 5;

  // Fetch leads from Supabase
  const fetchLeads = useCallback(async () => {
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

  // Get unique statuses and interests for filter options
  const statuses = [...new Set(leads.map(lead => lead.tags).filter(Boolean))] as string[];
  const interests = [...new Set(leads.map(lead => lead.interesse).filter(Boolean))] as string[];

  // Paginate results
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  return {
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
    leads,
    filteredLeads,
    paginatedLeads,
    totalPages,
    fetchLeads,
    statuses,
    interests,
    itemsPerPage
  };
};
