
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Send, Webhook } from 'lucide-react';
import { toast } from 'sonner';
import { saveReceivingWebhookUrl } from '@/hooks/chat/webhook/urls';

interface WebhookUrlConfigProps {
  sendingWebhookUrl: string;
  receivingWebhookUrl: string;
  setReceivingWebhookUrl: (url: string) => void;
  onTest: () => void;
  onSave: () => void;
}

const WebhookUrlConfig: React.FC<WebhookUrlConfigProps> = ({
  sendingWebhookUrl,
  receivingWebhookUrl,
  setReceivingWebhookUrl,
  onTest,
  onSave
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(receivingWebhookUrl);
    setCopied(true);
    toast.success("URL copiada para a área de transferência");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="sendingWebhookUrl" className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          URL de Envio de Mensagens (N8N)
        </Label>
        <Input
          id="sendingWebhookUrl"
          value={sendingWebhookUrl}
          readOnly
          className="font-mono text-sm bg-muted"
        />
        <p className="text-sm text-muted-foreground">
          Este é o endereço configurado para enviar mensagens para o agente N8N.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="receivingWebhookUrl" className="flex items-center gap-2">
          <Webhook className="h-4 w-4" />
          URL para Receber Mensagens (IMPORTANTE)
        </Label>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              id="receivingWebhookUrl"
              value={receivingWebhookUrl}
              onChange={(e) => setReceivingWebhookUrl(e.target.value)}
              className="font-mono text-sm pr-10"
            />
            <Button 
              type="button"
              variant="ghost" 
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={onTest}
          >
            Testar Webhook
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-primary">IMPORTANTE:</span> Configure esta URL no N8N para receber respostas.
          A resposta será recebida imediatamente após o envio.
        </p>
      </div>
    </div>
  );
};

export default WebhookUrlConfig;
