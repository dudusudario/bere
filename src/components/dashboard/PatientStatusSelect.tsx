
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PatientStatusSelectProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
  isUpdating: boolean;
}

// Helper function to get status icon
const getStatusIcon = (status: string) => {
  switch(status?.toLowerCase()) {
    case 'ativo':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'pendente':
      return <Clock className="h-4 w-4 text-amber-600" />;
    case 'inativo':
      return <AlertCircle className="h-4 w-4 text-gray-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-600" />;
  }
};

// Helper function to get badge style based on status
const getStatusStyle = (status: string) => {
  switch(status?.toLowerCase()) {
    case 'ativo':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'pendente':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'inativo':
      return 'bg-gray-50 text-gray-700 border-gray-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export const PatientStatusSelect: React.FC<PatientStatusSelectProps> = ({
  currentStatus,
  onStatusChange,
  isUpdating
}) => {
  return (
    <div className="pt-2">
      <h4 className="text-sm font-semibold mb-2">Status</h4>
      <div className="flex items-center gap-3">
        <Badge variant="outline" className={getStatusStyle(currentStatus)}>
          {getStatusIcon(currentStatus)} <span className="ml-1">{currentStatus || 'Pendente'}</span>
        </Badge>
        <div>
          <Select value={currentStatus} onValueChange={onStatusChange} disabled={isUpdating}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Alterar status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
