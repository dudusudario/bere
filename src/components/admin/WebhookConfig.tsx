
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { Settings } from 'lucide-react';
import { 
  getReceivingWebhookUrl, 
  saveReceivingWebhookUrl, 
  generateReceivingWebhookUrl, 
  WEBHOOK_URL 
} from '@/hooks/chat/webhook/urls';
import WebhookUrlConfig from './webhook/WebhookUrlConfig';
import IntegrationInstructions from './webhook/IntegrationInstructions';

const WebhookConfig: React.FC = () => {
  const [sendingWebhookUrl, setSendingWebhookUrl] = useState(WEBHOOK_URL);
  const [receivingWebhookUrl, setReceivingWebhookUrl] = useState(getReceivingWebhookUrl());

  // Gerar URL automaticamente se não existir
  useEffect(() => {
    if (!receivingWebhookUrl) {
      const newUrl = generateReceivingWebhookUrl();
      setReceivingWebhookUrl(newUrl);
      saveReceivingWebhookUrl(newUrl);
    }
  }, [receivingWebhookUrl]);

  const handleSaveReceivingWebhook = () => {
    saveReceivingWebhookUrl(receivingWebhookUrl);
    toast.success("URL de recebimento de mensagens salva com sucesso");
  };

  const testWebhook = () => {
    if (window.receiveWebhookMessage) {
      window.receiveWebhookMessage("Esta é uma mensagem de teste do webhook!");
      toast.success("Teste de webhook enviado com sucesso!");
    } else {
      toast.error("Receptor de webhook não está pronto. Reinicie a aplicação.");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configurações de Webhook
          </CardTitle>
          <CardDescription>
            Configure os endpoints para enviar e receber mensagens do agente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WebhookUrlConfig 
            sendingWebhookUrl={sendingWebhookUrl}
            receivingWebhookUrl={receivingWebhookUrl}
            setReceivingWebhookUrl={setReceivingWebhookUrl}
            onTest={testWebhook}
            onSave={handleSaveReceivingWebhook}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div></div> {/* Spacer */}
          <Button 
            onClick={handleSaveReceivingWebhook}
            disabled={!receivingWebhookUrl}
          >
            Salvar Configuração
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Instruções de Integração</CardTitle>
        </CardHeader>
        <CardContent>
          <IntegrationInstructions receivingWebhookUrl={receivingWebhookUrl} />
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookConfig;
