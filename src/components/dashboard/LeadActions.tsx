
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface LeadActionsProps {
  onNewLead?: () => void;
}

export const LeadActions: React.FC<LeadActionsProps> = ({ onNewLead }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <h3 className="text-lg font-medium">Gestão de Leads</h3>
      <Button className="w-full md:w-auto" size="sm" onClick={onNewLead}>
        <Plus className="mr-1 h-4 w-4" /> Novo Lead
      </Button>
    </div>
  );
};
