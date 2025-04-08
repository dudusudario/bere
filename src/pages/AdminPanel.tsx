
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Users, MessageCircle, Settings, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserWithProfile {
  id: string;
  email: string;
  full_name: string | null;
  profile_image: string | null;
  created_at: string;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário é um administrador
    if (!isAdmin) {
      navigate('/chat');
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Buscar todos os perfis de usuário
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*');
          
        if (error) throw error;
        
        // Obter detalhes de autenticação para cada usuário (nota: isso requer permissões admin)
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
  }, [isAdmin, navigate, toast]);
  
  // Função para obter as iniciais do nome para o avatar
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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
        <h1 className="text-3xl font-bold mb-8">Painel de Administração</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Usuários Registrados
            </CardTitle>
            <CardDescription>Lista de todos os usuários registrados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Usuário</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Registrado em</th>
                      <th className="text-right py-3 px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.profile_image || ''} alt={user.full_name || ''} />
                              <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                            </Avatar>
                            <span>{user.full_name || 'Usuário sem nome'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{user.email || 'N/A'}</td>
                        <td className="py-3 px-4">
                          {user.created_at 
                            ? new Date(user.created_at).toLocaleDateString('pt-BR')
                            : 'N/A'
                          }
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="outline" size="sm">
                            Ver detalhes
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">Nenhum usuário encontrado.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminPanel;
