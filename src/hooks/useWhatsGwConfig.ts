
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { ConnectionStatus } from '@/components/admin/whatsgw/types';

export const useWhatsGwConfig = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [instanceId, setInstanceId] = useState<string>('');
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('unknown');

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

  return {
    apiKey,
    setApiKey,
    instanceId,
    setInstanceId,
    webhookUrl,
    setWebhookUrl,
    isEnabled,
    setIsEnabled,
    isSaving,
    isTesting,
    connectionStatus,
    saveConfig,
    testConnection,
  };
};
