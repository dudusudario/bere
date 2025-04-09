
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { Settings, RefreshCw, Copy, Check, Globe, Send, Webhook } from 'lucide-react';
import { 
  getReceivingWebhookUrl, 
  saveReceivingWebhookUrl, 
  generateReceivingWebhookUrl, 
  WEBHOOK_URL 
} from '@/hooks/chat/webhook/urls';

const WebhookConfig: React.FC = () => {
  const [sendingWebhookUrl, setSendingWebhookUrl] = useState(WEBHOOK_URL);
  const [receivingWebhookUrl, setReceivingWebhookUrl] = useState(getReceivingWebhookUrl());
  const [testingStatus, setTestingStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Este é um teste do webhook de recebimento",
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
              Esta configuração é definida no código.
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
              <span className="font-semibold text-primary">IMPORTANTE:</span> Esta é a URL que você deve configurar no N8N para enviar as respostas.
              Use uma requisição HTTP POST para esta URL para que as mensagens retornem ao chat.
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
              <h3 className="font-semibold mb-1">Recebimento de Mensagens (IMPORTANTE)</h3>
              <p className="text-sm text-muted-foreground">
                Para receber respostas do N8N, você deve configurar uma requisição HTTP POST
                para a URL acima. A mensagem deve estar no formato:
              </p>
              <pre className="bg-muted p-2 rounded my-2 text-xs overflow-x-auto">
{`{
  "message": "Conteúdo da mensagem a ser exibida no chat",
  "sender": "ai",
  "timestamp": "2023-04-08T14:30:00Z"
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
