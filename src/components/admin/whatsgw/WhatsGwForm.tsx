
import React from 'react';
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, CheckCircle } from 'lucide-react';
import { ConnectionStatus } from './types';
import { WhatsGwApiKeyField } from './form/WhatsGwApiKeyField';
import { WhatsGwInstanceIdField } from './form/WhatsGwInstanceIdField';
import { WhatsGwWebhookField } from './form/WhatsGwWebhookField';
import { WhatsGwToggle } from './form/WhatsGwToggle';
import { WhatsGwConnectionTest } from './form/WhatsGwConnectionTest';

interface WhatsGwFormProps {
  apiKey: string;
  instanceId: string;
  webhookUrl: string;
  isEnabled: boolean;
  isSaving: boolean;
  isTesting: boolean;
  connectionStatus: ConnectionStatus;
  onApiKeyChange: (value: string) => void;
  onInstanceIdChange: (value: string) => void;
  onWebhookUrlChange: (value: string) => void;
  onEnabledChange: (value: boolean) => void;
  onSave: () => void;
  onTest: () => void;
}

export const WhatsGwForm: React.FC<WhatsGwFormProps> = ({
  apiKey,
  instanceId,
  webhookUrl,
  isEnabled,
  isSaving,
  isTesting,
  connectionStatus,
  onApiKeyChange,
  onInstanceIdChange,
  onWebhookUrlChange,
  onEnabledChange,
  onSave,
  onTest,
}) => {
  return (
    <>
      <CardContent className="space-y-4">
        <WhatsGwToggle isEnabled={isEnabled} onEnabledChange={onEnabledChange} />
        <WhatsGwApiKeyField value={apiKey} onChange={onApiKeyChange} />
        <WhatsGwInstanceIdField value={instanceId} onChange={onInstanceIdChange} />
        <WhatsGwWebhookField value={webhookUrl} onChange={onWebhookUrlChange} />
        <WhatsGwConnectionTest
          apiKey={apiKey}
          instanceId={instanceId}
          isTesting={isTesting}
          connectionStatus={connectionStatus}
          onTest={onTest}
        />
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onSave} 
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
    </>
  );
};
