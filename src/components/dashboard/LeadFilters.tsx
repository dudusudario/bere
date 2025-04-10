
import React from 'react';
import { SearchInput } from './SearchInput';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface LeadFiltersProps {
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
  statusOptions: { value: string; label: string }[];
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({
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
  statusOptions
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="md:w-1/3">
        <SearchInput
          placeholder="Pesquisar leads..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>
      <div className="flex flex-1 flex-col md:flex-row gap-2">
        <div className="w-full md:w-1/3">
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
                .filter(status => !statusOptions.some(opt => opt.value === status) && status)
                .map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-1/3">
          <Select value={interestFilter} onValueChange={setInterestFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Interesse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Interesses</SelectItem>
              {interests.filter(Boolean).map(interest => (
                <SelectItem key={interest} value={interest}>{interest}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-1/3">
          <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Períodos</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="60">Últimos 60 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
