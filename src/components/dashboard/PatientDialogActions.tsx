
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";

interface PatientDialogActionsProps {
  isUpdating?: boolean;
}

export const PatientDialogActions: React.FC<PatientDialogActionsProps> = ({
  isUpdating = false
}) => {
  return (
    <>
      <DialogClose asChild>
        <Button type="button" variant="secondary" disabled={isUpdating}>
          Fechar
        </Button>
      </DialogClose>
      <Button type="button" disabled={isUpdating}>
        <Calendar className="mr-2 h-4 w-4" />
        Agendar Consulta
      </Button>
    </>
  );
};
