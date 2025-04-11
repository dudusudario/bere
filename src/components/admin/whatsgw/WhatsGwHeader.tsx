
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const WhatsGwHeader: React.FC = () => {
  return (
    <CardHeader>
      <CardTitle>Configuração WhatsGW</CardTitle>
      <CardDescription>
        Configure a integração com a API WhatsGW para enviar e receber mensagens via WhatsApp.
      </CardDescription>
    </CardHeader>
  );
};
