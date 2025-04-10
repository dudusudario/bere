
import React from 'react';
import { SearchInput } from './SearchInput';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PatientFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  appointmentFilter: string;
  setAppointmentFilter: (value: string) => void;
  statuses: string[];
}

export const PatientFilters: React.FC<PatientFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  appointmentFilter,
  setAppointmentFilter,
  statuses
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="md:w-1/3">
        <SearchInput
          placeholder="Pesquisar pacientes..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>
      <div className="flex flex-col md:flex-row flex-1 gap-4">
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
          <RadioGroup className="flex space-x-4" value={appointmentFilter} onValueChange={setAppointmentFilter}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">Todos</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hasAppointment" id="hasAppointment" />
              <Label htmlFor="hasAppointment">Com Consulta</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="noAppointment" id="noAppointment" />
              <Label htmlFor="noAppointment">Sem Consulta</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};
