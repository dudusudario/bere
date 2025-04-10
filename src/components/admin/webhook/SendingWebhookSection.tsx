
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send } from 'lucide-react';

interface SendingWebhookSectionProps {
  sendingWebhookUrl: string;
  setSendingWebhookUrl: (url: string) => void;
}

const SendingWebhookSection: React.FC<SendingWebhookSectionProps> = ({ 
  sendingWebhookUrl, 
  setSendingWebhookUrl 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="sendingWebhookUrl" className="flex items-center gap-2">
        <Send className="h-4 w-4" />
        URL de Envio de Mensagens (N8N)
      </Label>
      <Input
        id="sendingWebhookUrl"
        value={sendingWebhookUrl}
        onChange={(e) => setSendingWebhookUrl(e.target.value)}
        readOnly
        className="font-mono text-sm bg-muted"
      />
      <p className="text-sm text-muted-foreground">
        Este é o endereço configurado para enviar mensagens para o agente N8N.
      </p>
    </div>
  );
};

export default SendingWebhookSection;
