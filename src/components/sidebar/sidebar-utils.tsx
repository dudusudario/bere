
import { NavigateFunction } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const handleLogout = async (navigate: NavigateFunction) => {
  try {
    await supabase.auth.signOut();
    toast({
      title: 'Logout realizado',
      description: 'Você foi desconectado com sucesso.',
    });
    navigate('/');
  } catch (error) {
    console.error('Logout error:', error);
    toast({
      variant: 'destructive',
      title: 'Erro ao fazer logout',
      description: 'Ocorreu um erro. Tente novamente.',
    });
  }
};
