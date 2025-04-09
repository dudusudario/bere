
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Settings, Globe } from 'lucide-react';

const DashboardCards: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Usuários
          </CardTitle>
          <CardDescription>Gerenciar usuários do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/admin/users')} className="w-full">
            Ver Usuários
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Mensagens
          </CardTitle>
          <CardDescription>Visualizar histórico de mensagens</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/admin/messages')} className="w-full">
            Ver Mensagens
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configurações
          </CardTitle>
          <CardDescription>Configurações do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/admin/settings')} className="w-full">
            Ver Configurações
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Webhooks
          </CardTitle>
          <CardDescription>Configurações de Webhooks</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => document.getElementById('webhooks-tab')?.click()} className="w-full">
            Configurar Webhooks
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;
