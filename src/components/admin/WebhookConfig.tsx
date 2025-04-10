
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from 'sonner';
import { 
  Settings, Copy, Check, Globe, Send, Webhook, ArrowRight, 
  ExternalLink, RefreshCw, Code, AlertTriangle 
} from 'lucide-react';
import { 
  getReceivingWebhookUrl, 
  saveReceivingWebhookUrl, 
  generateReceivingWebhookUrl, 
  WEBHOOK_URL 
} from '@/hooks/chat/webhook/urls';

const WebhookConfig: React.FC = () => {
  const [sendingWebhookUrl, setSendingWebhookUrl] = useState(WEBHOOK_URL);
  const [receivingWebhookUrl, setReceivingWebhookUrl] = useState(getReceivingWebhookUrl());
  const [copied, setCopied] = useState(false);
  const [testingReceiving, setTestingReceiving] = useState(false);
  const [webhookAccessible, setWebhookAccessible] = useState<boolean | null>(null);
  const [testingWebhookAccess, setTestingWebhookAccess] = useState(false);

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

  const generateNewReceivingUrl = () => {
    const newUrl = generateReceivingWebhookUrl();
    setReceivingWebhookUrl(newUrl);
    saveReceivingWebhookUrl(newUrl);
    toast.success("Nova URL gerada automaticamente");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(receivingWebhookUrl);
    setCopied(true);
    toast.success("URL copiada para a área de transferência");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
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
    setWebhookAccessible(null);
    
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
        setWebhookAccessible(true);
        toast.success("Webhook está acessível publicamente!");
      } else {
        setWebhookAccessible(false);
        toast.error(`Webhook não está respondendo corretamente: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao testar acessibilidade do webhook:", error);
      setWebhookAccessible(false);
      
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
    <div className="space-y-6">
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
          
          <div className="space-y-2">
            <Label htmlFor="receivingWebhookUrl" className="flex items-center gap-2 text-primary font-semibold">
              <Webhook className="h-4 w-4" />
              URL para Receber Mensagens (COPIE ESTA URL)
            </Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  id="receivingWebhookUrl"
                  value={receivingWebhookUrl}
                  onChange={(e) => setReceivingWebhookUrl(e.target.value)}
                  placeholder="https://seu-servidor/api/webhook"
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
                onClick={generateNewReceivingUrl}
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Gerar URL
              </Button>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-3 mt-3">
              <h4 className="font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" /> Importante: Esta URL deve estar publicamente acessível!
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                Para receber mensagens, garanta que esta URL esteja publicada e acessível na internet. Use serviços
                como Vercel, Netlify ou similares para hospedar seu endpoint de webhook.
              </p>
            </div>
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={testWebhookAccessibility}
                disabled={testingWebhookAccess}
              >
                {testingWebhookAccess ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Testando acessibilidade...
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-2" /> Verificar acessibilidade do webhook
                  </>
                )}
              </Button>
            </div>
            
            <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md p-3 mt-3">
              <h4 className="font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <ArrowRight className="h-4 w-4" /> O que fazer com esta URL:
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                <span className="font-semibold">IMPORTANTE:</span> Copie esta URL e configure-a no N8N como o endpoint 
                para onde as respostas devem ser enviadas.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-md p-3 mt-3">
              <h4 className="font-medium flex items-center gap-1">
                <Code className="h-4 w-4" /> Exemplo de código para enviar mensagens para o webhook (POST):
              </h4>
              <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 mt-2 rounded overflow-x-auto">
{`fetch("${receivingWebhookUrl}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    message: "Sua mensagem aqui",
    sender: "ai",
    timestamp: "${new Date().toISOString()}"
  })
})`}
              </pre>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between flex-col sm:flex-row gap-4">
          <Button 
            variant="outline"
            onClick={testReceiveWebhook}
            disabled={testingReceiving || !receivingWebhookUrl}
            className="w-full sm:w-auto"
          >
            {testingReceiving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Testar Recebimento (POST)
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleSaveReceivingWebhook}
            disabled={!receivingWebhookUrl}
            className="w-full sm:w-auto"
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
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Envio de Mensagens (já configurado)</h3>
              <p className="text-sm text-muted-foreground">
                O sistema já está configurado para enviar mensagens para o webhook do N8N.
                Mensagens enviadas pelo usuário são encaminhadas para: <code className="bg-muted px-1 rounded">{WEBHOOK_URL}</code>
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Recebimento de Mensagens (IMPORTANTE)</h3>
              <p className="text-sm text-muted-foreground">
                Para receber respostas do N8N, configure uma requisição HTTP POST
                para a URL acima. A mensagem deve estar no formato:
              </p>
              <pre className="bg-muted p-2 rounded my-2 text-xs overflow-x-auto">
{`{
  "message": "Conteúdo da mensagem a ser exibida no chat",
  "sender": "ai",
  "timestamp": "2025-04-10T00:12:13.187-03:00"
}`}
              </pre>
              <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md p-3 mt-3">
                <h4 className="font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1">
                  <Globe className="h-4 w-4" /> Configuração no N8N
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  No seu fluxo N8N, adicione um nó HTTP Request com estas configurações:
                </p>
                <ul className="list-disc list-inside text-xs text-amber-700 dark:text-amber-400 mt-1 space-y-1">
                  <li>Método: POST</li>
                  <li>URL: {receivingWebhookUrl || '[Gere uma URL acima]'}</li>
                  <li>Tipo de conteúdo: JSON</li>
                  <li>Envie a resposta formatada conforme o exemplo acima</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookConfig;
