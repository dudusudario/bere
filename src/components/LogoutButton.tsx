
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from './AuthProvider';

const LogoutButton = () => {
  const { signOut, isLoading } = useAuth();
  
  return (
    <Button 
      variant="ghost"
      size="sm"
      onClick={signOut}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden md:inline">Sair</span>
    </Button>
  );
};

export default LogoutButton;
