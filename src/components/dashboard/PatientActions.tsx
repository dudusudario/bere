
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";

export const PatientActions: React.FC = () => {
  return (
    <div className="flex gap-2 w-full md:w-auto">
      <Button className="w-full md:w-auto" size="sm">
        <Plus className="mr-1 h-4 w-4" /> Novo Paciente
      </Button>
      <Button variant="outline" className="w-full md:w-auto" size="sm">
        <Calendar className="mr-1 h-4 w-4" /> Agendar Consulta
      </Button>
    </div>
  );
};
