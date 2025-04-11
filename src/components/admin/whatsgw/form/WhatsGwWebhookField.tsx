
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WhatsGwWebhookFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const WhatsGwWebhookField: React.FC<WhatsGwWebhookFieldProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="webhook-url">URL de Webhook</Label>
      <div className="flex gap-2">
        <Input
          id="webhook-url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://seu-site.com/api/whatsgw-webhook"
          className="flex-1"
        />
        <Button 
          variant="outline" 
          onClick={() => {
            const url = `${window.location.origin}/api/whatsgw-webhook`;
            onChange(url);
          }}
        >
          Gerar URL
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Configure esta URL no painel do WhatsGW para receber mensagens.
      </p>
    </div>
  );
};
