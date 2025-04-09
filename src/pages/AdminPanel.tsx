
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardCards from '@/components/admin/DashboardCards';
import UsersTable from '@/components/admin/UsersTable';
import MessagesSection from '@/components/admin/MessagesSection';
import SettingsSection from '@/components/admin/SettingsSection';
import WebhookConfig from '@/components/admin/WebhookConfig';

interface UserWithProfile {
  id: string;
  email: string;
  full_name: string | null;
  profile_image: string | null;
  created_at: string;
}

const AdminPanel: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  // Instead of using isAdmin from AuthContext, let's simplify for now
  const isAdmin = true; // Simplified since we removed authentication

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Buscar todos os perfis de usuário
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*');
          
        if (error) throw error;
        
        // Obter detalhes de autenticação para cada usuário
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
  }, [toast]);

  // Mock profile for display purposes since we removed auth
  const profile = {
    profile_image: '',
    full_name: 'Admin User'
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader profile={profile} isAdmin={isAdmin} />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Painel de Administração</h1>
        
        <Tabs defaultValue="dashboard" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <DashboardCards />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersTable users={users} loading={loading} />
          </TabsContent>
          
          <TabsContent value="messages">
            <MessagesSection />
          </TabsContent>
          
          <TabsContent value="settings">
            <SettingsSection />
          </TabsContent>
          
          <TabsContent value="webhooks" id="webhooks-tab">
            <WebhookConfig />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
