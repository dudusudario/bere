
import React from 'react';
import { Card } from "@/components/ui/card";
import { WhatsGwHeader } from './WhatsGwHeader';
import { WhatsGwForm } from './WhatsGwForm';
import { useWhatsGwConfig } from '@/hooks/useWhatsGwConfig';

const WhatsGwConfig: React.FC = () => {
  const {
    apiKey,
    instanceId,
    webhookUrl,
    isEnabled,
    isSaving,
    isTesting,
    connectionStatus,
    setApiKey,
    setInstanceId,
    setWebhookUrl,
    setIsEnabled,
    saveConfig,
    testConnection,
  } = useWhatsGwConfig();

  return (
    <Card>
      <WhatsGwHeader />
      <WhatsGwForm
        apiKey={apiKey}
        instanceId={instanceId}
        webhookUrl={webhookUrl}
        isEnabled={isEnabled}
        isSaving={isSaving}
        isTesting={isTesting}
        connectionStatus={connectionStatus}
        onApiKeyChange={setApiKey}
        onInstanceIdChange={setInstanceId}
        onWebhookUrlChange={setWebhookUrl}
        onEnabledChange={setIsEnabled}
        onSave={saveConfig}
        onTest={testConnection}
      />
    </Card>
  );
};

export default WhatsGwConfig;
