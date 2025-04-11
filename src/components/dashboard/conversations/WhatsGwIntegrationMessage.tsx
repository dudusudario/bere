
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WhatsGwIntegrationMessageProps {
  isWhatsGwEnabled: boolean;
}

export const WhatsGwIntegrationMessage: React.FC<WhatsGwIntegrationMessageProps> = ({ 
  isWhatsGwEnabled 
}) => {
  if (isWhatsGwEnabled) return null;
  
  return (
    <div className="container mx-auto p-4">
      <Card className="border">
        <CardHeader>
          <CardTitle>WhatsGW não configurado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Para utilizar a funcionalidade de conversas do WhatsApp, configure a integração com o WhatsGW no painel de administração.</p>
          <Button asChild>
            <a href="/admin">Ir para configurações</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
