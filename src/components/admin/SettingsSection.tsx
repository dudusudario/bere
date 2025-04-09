
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SettingsSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Sistema</CardTitle>
        <CardDescription>Gerenciar as configurações gerais da plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center py-8 text-muted-foreground">
          Funcionalidade em desenvolvimento.
        </p>
      </CardContent>
    </Card>
  );
};

export default SettingsSection;
