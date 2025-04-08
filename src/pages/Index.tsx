
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!profile?.full_name) return "U";
    return profile.full_name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-primary">Berenice</h1>
            <p className="text-sm text-muted-foreground">Sua assistente pessoal personalizada</p>
          </div>
          <div className="flex items-center gap-2">
            <div onClick={() => navigate('/profile')} className="cursor-pointer flex items-center gap-2">
              <Avatar>
                <AvatarImage src={profile?.profile_image || ''} alt={profile?.full_name || 'Usuário'} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-sm">
                <p className="font-medium">{profile?.full_name || user?.user_metadata?.full_name || 'Usuário'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} title="Configurações">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto">
        <ChatInterface />
      </main>
    </div>
  );
};

export default Index;
