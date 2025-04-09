
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MessagesSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Mensagens</CardTitle>
        <CardDescription>Visualize todas as mensagens trocadas no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center py-8 text-muted-foreground">
          Funcionalidade em desenvolvimento.
        </p>
      </CardContent>
    </Card>
  );
};

export default MessagesSection;
