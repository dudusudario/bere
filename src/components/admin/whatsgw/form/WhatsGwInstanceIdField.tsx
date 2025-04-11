
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface WhatsGwInstanceIdFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const WhatsGwInstanceIdField: React.FC<WhatsGwInstanceIdFieldProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="instance-id">Instance ID</Label>
      <Input
        id="instance-id"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Insira o ID da sua instância WhatsGW"
      />
    </div>
  );
};
