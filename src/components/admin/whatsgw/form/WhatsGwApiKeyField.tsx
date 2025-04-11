
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface WhatsGwApiKeyFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const WhatsGwApiKeyField: React.FC<WhatsGwApiKeyFieldProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="api-key">API Key</Label>
      <Input
        id="api-key"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Insira sua API Key do WhatsGW"
        type="password"
      />
    </div>
  );
};
