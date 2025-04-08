
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { Settings, RefreshCw, Copy, Check } from 'lucide-react';
import { getReceivingWebhookUrl, saveReceivingWebhookUrl, generateReceivingWebhookUrl, WEBHOOK_URL } from '@/hooks/chat/utils';

const WebhookConfig: React.FC = () => {
  const [sendingWebhookUrl, setSendingWebhookUrl] = useState(WEBHOOK_URL);
  const [receivingWebhookUrl, setReceivingWebhookUrl] = useState(getReceivingWebhookUrl());
  const [testingStatus, setTestingStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

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

  const testReceivingWebhook = async () => {
    if (!receivingWebhookUrl) {
      toast.error("Por favor, configure uma URL para receber mensagens");
      return;
    }

    setTestingStatus('testing');

    try {
      // Tenta enviar uma mensagem de teste para a URL configurada
      const response = await fetch(receivingWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'test',
          message: 'Este é um teste do webhook de recebimento',
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setTestingStatus('success');
        toast.success("Teste de webhook bem-sucedido!");
      } else {
        setTestingStatus('error');
        toast.error(`Erro no teste: ${response.statusText}`);
      }
    } catch (error) {
      setTestingStatus('error');
      toast.error(`Erro ao testar webhook: ${(error as Error).message}`);
      console.error('Erro ao testar webhook:', error);
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
            <Label htmlFor="sendingWebhookUrl">URL de Envio de Mensagens (N8N)</Label>
            <Input
              id="sendingWebhookUrl"
              value={sendingWebhookUrl}
              onChange={(e) => setSendingWebhookUrl(e.target.value)}
              readOnly
              className="font-mono text-sm bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              Este é o endereço configurado para enviar mensagens para o agente N8N. 
              Esta configuração é definida no código.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="receivingWebhookUrl">URL para Receber Mensagens</Label>
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
                Gerar URL
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Configure o endereço HTTP POST que enviará mensagens para este chat.
              O sistema escutará este endpoint para receber mensagens do agente.
              Você pode usar a URL gerada automaticamente ou personalizar conforme necessário.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={testReceivingWebhook}
            disabled={testingStatus === 'testing' || !receivingWebhookUrl}
            className="flex items-center gap-2"
          >
            {testingStatus === 'testing' ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Testar Webhook
              </>
            )}
          </Button>
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
                Mensagens enviadas pelo usuário serão encaminhadas para: <code className="bg-muted px-1 rounded">{WEBHOOK_URL}</code>
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Recebimento de Mensagens</h3>
              <p className="text-sm text-muted-foreground">
                Para receber mensagens, você precisa configurar seu servidor para enviar requisições POST 
                para a URL configurada acima. A mensagem deve estar no formato:
              </p>
              <pre className="bg-muted p-2 rounded my-2 text-xs overflow-x-auto">
{`{
  "message": "Conteúdo da mensagem a ser exibida no chat",
  "sender": "ai",
  "timestamp": "2023-04-08T14:30:00Z"
}`}
              </pre>
              <p className="text-sm text-muted-foreground mt-2">
                A URL gerada automaticamente pode ser usada em ambientes de desenvolvimento. 
                Para produção, configure com a URL onde sua aplicação estará hospedada.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookConfig;
