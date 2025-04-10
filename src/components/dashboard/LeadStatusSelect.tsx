
import React from 'react';
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface StatusOption {
  value: string;
  label: string;
  color: string;
}

interface LeadStatusSelectProps {
  currentStatus: string;
  onStatusChange: (value: string) => void;
  statusOptions: StatusOption[];
}

export const LeadStatusSelect: React.FC<LeadStatusSelectProps> = ({
  currentStatus,
  onStatusChange,
  statusOptions
}) => {
  const getStatusColor = (status?: string) => {
    if (!status) return '';
    
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : '';
  };

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="status" className="text-right">Status</Label>
      <div className="col-span-3">
        <Select 
          value={currentStatus || ''} 
          onValueChange={onStatusChange}
        >
          <SelectTrigger>
            {currentStatus ? (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getStatusColor(currentStatus)}>
                  {currentStatus}
                </Badge>
              </div>
            ) : (
              <SelectValue placeholder="Selecione um status" />
            )}
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={option.color}>
                    {option.label}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
