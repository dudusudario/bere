
import React, { useState } from 'react';
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
import { Filter, Plus } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

// Sample leads data
const allLeads = [
  { id: 1, name: 'Maria Silva', phone: '(11) 98765-4321', status: 'Novo', interest: 'Ortodontia', createdAt: '10/04/2025' },
  { id: 2, name: 'João Pereira', phone: '(11) 91234-5678', status: 'Em Contato', interest: 'Clareamento', createdAt: '09/04/2025' },
  { id: 3, name: 'Ana Costa', phone: '(21) 99876-5432', status: 'Qualificado', interest: 'Implante', createdAt: '08/04/2025' },
  { id: 4, name: 'Carlos Santos', phone: '(31) 98765-1234', status: 'Em Contato', interest: 'Prótese', createdAt: '07/04/2025' },
  { id: 5, name: 'Fernanda Lima', phone: '(41) 99988-7766', status: 'Novo', interest: 'Avaliação', createdAt: '05/04/2025' },
  { id: 6, name: 'Roberto Campos', phone: '(11) 97777-8888', status: 'Qualificado', interest: 'Implante', createdAt: '04/04/2025' },
  { id: 7, name: 'Mariana Souza', phone: '(21) 96666-5555', status: 'Novo', interest: 'Clareamento', createdAt: '03/04/2025' },
  { id: 8, name: 'Paulo Oliveira', phone: '(31) 95555-4444', status: 'Em Contato', interest: 'Ortodontia', createdAt: '02/04/2025' },
  { id: 9, name: 'Luciana Mendes', phone: '(41) 94444-3333', status: 'Qualificado', interest: 'Prótese', createdAt: '01/04/2025' },
  { id: 10, name: 'Ricardo Ferreira', phone: '(51) 93333-2222', status: 'Em Contato', interest: 'Avaliação', createdAt: '30/03/2025' }
];

export const LeadsDetailedView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [interestFilter, setInterestFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter leads based on search query and filters
  const filteredLeads = allLeads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      lead.phone.includes(searchQuery) || 
      (lead.interest && lead.interest.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === '' || lead.status === statusFilter;
    const matchesInterest = interestFilter === '' || lead.interest === interestFilter;
    
    return matchesSearch && matchesStatus && matchesInterest;
  });

  // Paginate results
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  // Get unique statuses and interests for filter options
  const statuses = [...new Set(allLeads.map(lead => lead.status))];
  const interests = [...new Set(allLeads.map(lead => lead.interest).filter(Boolean))] as string[];

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
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
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
            <LeadsTable leads={currentLeads} />
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
