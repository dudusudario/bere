
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface LeadDetailsActionsProps {
  onCancel: () => void;
  onSave: () => void;
  isLoading: boolean;
}

export const LeadDetailsActions: React.FC<LeadDetailsActionsProps> = ({
  onCancel,
  onSave,
  isLoading
}) => {
  return (
    <DialogFooter>
      <Button variant="outline" onClick={onCancel}>Cancelar</Button>
      <Button onClick={onSave} disabled={isLoading}>
        {isLoading ? 'Salvando...' : 'Salvar alterações'}
      </Button>
    </DialogFooter>
  );
};
