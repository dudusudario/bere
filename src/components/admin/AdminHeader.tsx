
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft } from 'lucide-react';

interface AdminHeaderProps {
  profile: {
    profile_image: string;
    full_name: string;
  };
  isAdmin: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ profile, isAdmin }) => {
  const navigate = useNavigate();
  
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
  );
};

export default AdminHeader;
