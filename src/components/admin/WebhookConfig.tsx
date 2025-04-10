
import React, { useState, useEffect } from 'react';
import { 
  getReceivingWebhookUrl, 
  saveReceivingWebhookUrl, 
  generateReceivingWebhookUrl, 
  WEBHOOK_URL 
} from '@/hooks/chat/webhook/urls';
import WebhookHeader from './webhook/WebhookHeader';
import WebhookConfigCard from './webhook/WebhookConfigCard';
import IntegrationInstructionsCard from './webhook/IntegrationInstructionsCard';

const WebhookConfig: React.FC = () => {
  const [sendingWebhookUrl, setSendingWebhookUrl] = useState(WEBHOOK_URL);
  const [receivingWebhookUrl, setReceivingWebhookUrl] = useState(getReceivingWebhookUrl());
  const [webhookAccessible, setWebhookAccessible] = useState<boolean | null>(null);

  // Gerar URL automaticamente se não existir
  useEffect(() => {
    if (!receivingWebhookUrl) {
      const newUrl = generateReceivingWebhookUrl();
      setReceivingWebhookUrl(newUrl);
      saveReceivingWebhookUrl(newUrl);
    }
  }, [receivingWebhookUrl]);

  return (
    <div className="space-y-6">
      <WebhookHeader webhookAccessible={webhookAccessible} />
      
      <WebhookConfigCard
        sendingWebhookUrl={sendingWebhookUrl}
        setSendingWebhookUrl={setSendingWebhookUrl}
        receivingWebhookUrl={receivingWebhookUrl}
        setReceivingWebhookUrl={setReceivingWebhookUrl}
        saveReceivingWebhookUrl={saveReceivingWebhookUrl}
        generateReceivingWebhookUrl={generateReceivingWebhookUrl}
      />
      
      <IntegrationInstructionsCard
        sendingWebhookUrl={sendingWebhookUrl}
        receivingWebhookUrl={receivingWebhookUrl}
      />
    </div>
  );
};

export default WebhookConfig;
