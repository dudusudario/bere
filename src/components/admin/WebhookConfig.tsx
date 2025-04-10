
import React, { useState } from 'react';
import { WEBHOOK_URL } from '@/hooks/chat/webhook/urls';
import WebhookHeader from './webhook/WebhookHeader';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Settings } from 'lucide-react';
import SendingWebhookSection from './webhook/SendingWebhookSection';

const WebhookConfig: React.FC = () => {
  const [sendingWebhookUrl, setSendingWebhookUrl] = useState(WEBHOOK_URL);
  const [webhookAccessible, setWebhookAccessible] = useState<boolean | null>(null);

  return (
    <div className="space-y-6">
      <WebhookHeader webhookAccessible={webhookAccessible} />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configurações de Webhook
          </CardTitle>
          <CardDescription>
            Configure o endpoint para enviar mensagens ao agente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SendingWebhookSection 
            sendingWebhookUrl={sendingWebhookUrl} 
            setSendingWebhookUrl={setSendingWebhookUrl} 
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Instruções de Integração</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Envio de Mensagens (já configurado)</h3>
              <p className="text-sm text-muted-foreground">
                O sistema já está configurado para enviar mensagens para o webhook do N8N.
                Mensagens enviadas pelo usuário são encaminhadas para: <code className="bg-muted px-1 rounded">{sendingWebhookUrl}</code>
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Recebimento de Respostas</h3>
              <p className="text-sm text-muted-foreground">
                As respostas do N8N são recebidas diretamente pelo mecanismo interno do aplicativo.
                Não é necessário configurar um webhook de recebimento.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookConfig;
