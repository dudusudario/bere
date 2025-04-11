
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from 'lucide-react';
import { ConnectionStatus } from '../types';

interface WhatsGwConnectionTestProps {
  apiKey: string;
  instanceId: string;
  isTesting: boolean;
  connectionStatus: ConnectionStatus;
  onTest: () => void;
}

export const WhatsGwConnectionTest: React.FC<WhatsGwConnectionTestProps> = ({
  apiKey,
  instanceId,
  isTesting,
  connectionStatus,
  onTest,
}) => {
  return (
    <div className="pt-4">
      <Button 
        onClick={onTest} 
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
  );
};
