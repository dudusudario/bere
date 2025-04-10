
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExternalLink } from 'lucide-react';

interface WebhookHeaderProps {
  webhookAccessible: boolean | null;
}

const WebhookHeader: React.FC<WebhookHeaderProps> = ({ webhookAccessible }) => {
  return (
    <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 mb-6">
      <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      <AlertTitle>Configuração de Webhook</AlertTitle>
      <AlertDescription>
        Esta página mostra a configuração do webhook para envio de mensagens ao N8N.
        As respostas são processadas internamente pelo sistema.
      </AlertDescription>
    </Alert>
  );
};

export default WebhookHeader;
