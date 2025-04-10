
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from 'sonner';
import { Settings } from 'lucide-react';
import SendingWebhookSection from './SendingWebhookSection';
import ReceivingWebhookSection from './ReceivingWebhookSection';
import TestWebhookSection from './TestWebhookSection';

interface WebhookConfigCardProps {
  sendingWebhookUrl: string;
  setSendingWebhookUrl: (url: string) => void;
  receivingWebhookUrl: string;
  setReceivingWebhookUrl: (url: string) => void;
  saveReceivingWebhookUrl: (url: string) => void;
  generateReceivingWebhookUrl: () => string;
}

const WebhookConfigCard: React.FC<WebhookConfigCardProps> = ({
  sendingWebhookUrl,
  setSendingWebhookUrl,
  receivingWebhookUrl,
  setReceivingWebhookUrl,
  saveReceivingWebhookUrl,
  generateReceivingWebhookUrl
}) => {
  const [testingReceiving, setTestingReceiving] = useState(false);
  const [testingWebhookAccess, setTestingWebhookAccess] = useState(false);

  const handleSaveReceivingWebhook = () => {
    saveReceivingWebhookUrl(receivingWebhookUrl);
    toast.success("URL de recebimento de mensagens salva com sucesso");
  };

  const generateNewReceivingUrl = () => {
    const newUrl = generateReceivingWebhookUrl();
    setReceivingWebhookUrl(newUrl);
    saveReceivingWebhookUrl(newUrl);
    toast.success("Nova URL gerada automaticamente");
  };

  // Função para testar o recebimento de mensagens
  const testReceiveWebhook = async () => {
    setTestingReceiving(true);
    try {
      // Simular o recebimento de uma mensagem
      const testMessage = {
        message: "Esta é uma mensagem de teste do webhook. Se você está vendo isso, a configuração está funcionando corretamente!",
        sender: "ai",
        timestamp: new Date().toISOString()
      };
      
      // Usando fetch para enviar uma solicitação POST para o webhook
      const response = await fetch(receivingWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testMessage),
      });
      
      if (response.ok) {
        toast.success("Mensagem de teste POST enviada com sucesso! Verifique o chat para ver se a mensagem aparece.");
      } else {
        toast.error(`Erro ao enviar mensagem POST: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao testar webhook:", error);
      toast.error("Erro ao testar webhook de recebimento. Verifique se a URL está acessível publicamente.");
    } finally {
      setTestingReceiving(false);
    }
  };
  
  // Testar se o webhook está acessível
  const testWebhookAccessibility = async () => {
    setTestingWebhookAccess(true);
    
    try {
      // Tentar acessar o webhook para ver se está disponível publicamente
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(receivingWebhookUrl, {
        method: 'HEAD',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        toast.success("Webhook está acessível publicamente!");
      } else {
        toast.error(`Webhook não está respondendo corretamente: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao testar acessibilidade do webhook:", error);
      
      if (error instanceof DOMException && error.name === "AbortError") {
        toast.error("Tempo esgotado ao tentar acessar o webhook. O endpoint pode não estar publicamente disponível.");
      } else {
        toast.error("O webhook não parece estar acessível publicamente. Verifique se o serviço está disponível.");
      }
    } finally {
      setTestingWebhookAccess(false);
    }
  };

  return (
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
      <CardContent className="space-y-4">
        <SendingWebhookSection 
          sendingWebhookUrl={sendingWebhookUrl} 
          setSendingWebhookUrl={setSendingWebhookUrl} 
        />
        
        <ReceivingWebhookSection 
          receivingWebhookUrl={receivingWebhookUrl}
          setReceivingWebhookUrl={setReceivingWebhookUrl}
          generateNewReceivingUrl={generateNewReceivingUrl}
          testWebhookAccessibility={testWebhookAccessibility}
          testingWebhookAccess={testingWebhookAccess}
        />
      </CardContent>
      <TestWebhookSection 
        testReceiveWebhook={testReceiveWebhook}
        handleSaveReceivingWebhook={handleSaveReceivingWebhook}
        testingReceiving={testingReceiving}
        receivingWebhookUrl={receivingWebhookUrl}
      />
    </Card>
  );
};

export default WebhookConfigCard;
