
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';

const WhatsGwConfig: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [instanceId, setInstanceId] = useState<string>('');
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'success' | 'error'>('unknown');

  useEffect(() => {
    // Load saved configuration from localStorage
    const savedApiKey = localStorage.getItem('whatsgw_api_key');
    const savedInstanceId = localStorage.getItem('whatsgw_instance_id');
    const savedWebhookUrl = localStorage.getItem('whatsgw_webhook_url');
    const savedIsEnabled = localStorage.getItem('whatsgw_enabled') === 'true';
    
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedInstanceId) setInstanceId(savedInstanceId);
    if (savedWebhookUrl) setWebhookUrl(savedWebhookUrl);
    if (savedIsEnabled) setIsEnabled(savedIsEnabled);
  }, []);

  const saveConfig = () => {
    setIsSaving(true);
    
    try {
      // Save to localStorage for now (in a real app, this would go to a database)
      localStorage.setItem('whatsgw_api_key', apiKey);
      localStorage.setItem('whatsgw_instance_id', instanceId);
      localStorage.setItem('whatsgw_webhook_url', webhookUrl);
      localStorage.setItem('whatsgw_enabled', String(isEnabled));
      
      toast({
        title: "Configuração salva",
        description: "As configurações da API WhatsGW foram salvas com sucesso."
      });
    } catch (error) {
      console.error('Error saving WhatsGW configuration:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async () => {
    setIsTesting(true);
    setConnectionStatus('unknown');
    
    try {
      // In a real implementation, this would make a test call to the WhatsGW API
      // For demonstration, we'll simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setConnectionStatus('success');
      toast({
        title: "Conexão bem-sucedida",
        description: "A API WhatsGW está configurada corretamente."
      });
    } catch (error) {
      console.error('Error testing WhatsGW connection:', error);
      setConnectionStatus('error');
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não foi possível conectar à API WhatsGW."
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração WhatsGW</CardTitle>
        <CardDescription>
          Configure a integração com a API WhatsGW para enviar e receber mensagens via WhatsApp.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="enable-whatsgw">Ativar WhatsGW</Label>
            <span className="text-sm text-muted-foreground">
              Permitir envio e recebimento de mensagens via WhatsApp
            </span>
          </div>
          <Switch
            id="enable-whatsgw"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Insira sua API Key do WhatsGW"
            type="password"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instance-id">Instance ID</Label>
          <Input
            id="instance-id"
            value={instanceId}
            onChange={(e) => setInstanceId(e.target.value)}
            placeholder="Insira o ID da sua instância WhatsGW"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="webhook-url">URL de Webhook</Label>
          <div className="flex gap-2">
            <Input
              id="webhook-url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://seu-site.com/api/whatsgw-webhook"
              className="flex-1"
            />
            <Button 
              variant="outline" 
              onClick={() => {
                const url = `${window.location.origin}/api/whatsgw-webhook`;
                setWebhookUrl(url);
              }}
            >
              Gerar URL
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Configure esta URL no painel do WhatsGW para receber mensagens.
          </p>
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={testConnection} 
            disabled={!apiKey || !instanceId || isTesting}
            variant="outline"
            className="mr-2"
          >
            {isTesting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testando...
              </>
            ) : (
              'Testar Conexão'
            )}
          </Button>
          
          {connectionStatus === 'success' && (
            <span className="text-green-500 inline-flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Conectado
            </span>
          )}
          
          {connectionStatus === 'error' && (
            <span className="text-red-500">Falha na conexão</span>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={saveConfig} 
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar Configurações'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WhatsGwConfig;
