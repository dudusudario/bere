
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExternalLink, AlertTriangle } from 'lucide-react';

interface WebhookHeaderProps {
  webhookAccessible: boolean | null;
}

const WebhookHeader: React.FC<WebhookHeaderProps> = ({ webhookAccessible }) => {
  return (
    <>
      <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 mb-6">
        <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <AlertTitle>Configuração de Webhook</AlertTitle>
        <AlertDescription>
          Configure esta página para permitir que o N8N envie respostas de volta para o seu chat. 
          Você precisará copiar a URL de recebimento e configurá-la no N8N.
        </AlertDescription>
      </Alert>
      
      {webhookAccessible === false && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Webhook não acessível</AlertTitle>
          <AlertDescription>
            O webhook não parece estar acessível publicamente. Para receber mensagens, você precisa:
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Publicar a API em um serviço como Vercel, Netlify, ou similar</li>
              <li>Garantir que a URL seja acessível publicamente</li>
              <li>Configurar o endpoint para aceitar solicitações POST</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default WebhookHeader;
