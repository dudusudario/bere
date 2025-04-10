import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Users, MessageCircle, Settings, User, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WebhookConfig from '@/components/admin/WebhookConfig';

interface UserWithProfile {
  id: string;
  email: string;
  full_name: string | null;
  profile_image: string | null;
  created_at: string;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('webhooks');
  const isAdmin = true;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*');
          
        if (error) throw error;
        
        setUsers(data as unknown as UserWithProfile[]);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        toast({
          title: "Erro ao carregar usuários",
          description: "Não foi possível obter a lista de usuários.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [navigate, toast]);
  
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const profile = {
    profile_image: '',
    full_name: 'Admin User'
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/chat')}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para o chat
          </Button>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button variant="outline" size="sm">
                Painel de Administração
              </Button>
            )}
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.profile_image || ''} alt={profile?.full_name || 'Admin'} />
              <AvatarFallback>{profile?.full_name ? getInitials(profile.full_name) : 'A'}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Configuração do Webhook</h1>
        
        <Tabs defaultValue="webhooks" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="webhooks" id="webhooks-tab">
            <WebhookConfig />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
