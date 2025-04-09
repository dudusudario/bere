
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { Settings, Copy, Check, Globe, Send, Webhook } from 'lucide-react';
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(receivingWebhookUrl);
    setCopied(true);
    toast.success("URL copiada para a área de transferência");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
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
                onClick={testWebhook}
              >
                Testar Webhook
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">IMPORTANTE:</span> Configure esta URL no N8N para receber respostas.
              A resposta será recebida imediatamente após o envio.
            </p>
          </div>
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
                para a URL abaixo. A mensagem deve estar no formato:
              </p>
              <pre className="bg-muted p-2 rounded my-2 text-xs overflow-x-auto">
{`POST ${receivingWebhookUrl}
Content-Type: application/json

{
  "message": "Conteúdo da mensagem a ser exibida no chat"
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
                  <li>URL: {receivingWebhookUrl}</li>
                  <li>Tipo de conteúdo: JSON</li>
                  <li>Corpo: {"{ \"message\": \"Sua resposta aqui\" }"}</li>
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
