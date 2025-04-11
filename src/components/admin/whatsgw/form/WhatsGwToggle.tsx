
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface WhatsGwToggleProps {
  isEnabled: boolean;
  onEnabledChange: (value: boolean) => void;
}

export const WhatsGwToggle: React.FC<WhatsGwToggleProps> = ({ isEnabled, onEnabledChange }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="enable-whatsgw">Ativar WhatsGW</Label>
        <span className="text-sm text-muted-foreground">
          Permitir envio e recebimento de mensagens via WhatsApp
        </span>
      </div>
      <Switch
        id="enable-whatsgw"
        checked={isEnabled}
        onCheckedChange={onEnabledChange}
      />
    </div>
  );
};
