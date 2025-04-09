
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from 'lucide-react';

const WebhookConfig: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configurações de Integração
          </CardTitle>
          <CardDescription>
            As funcionalidades de integração foram removidas desta versão
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            A funcionalidade de integração via webhook foi desativada.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookConfig;
