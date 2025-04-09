
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  full_name: string | null;
  address: string | null;
  cpf_cnpj: string | null;
  profile_image: string | null;
  email_confirmed: boolean | null;
}

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Função para carregar o perfil do usuário
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }
      
      return data as UserProfile;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth event:', event);
      setSession(currentSession);
      
      if (currentSession?.user) {
        setUser(currentSession.user);
        
        // Buscar perfil do usuário depois de um pequeno atraso para evitar problemas de concorrência
        setTimeout(async () => {
          const userProfile = await fetchUserProfile(currentSession.user.id);
          setProfile(userProfile);
        }, 0);
      } else {
        setUser(null);
        setProfile(null);
      }
      
      if (event === 'SIGNED_IN') {
        toast({
          title: 'Login realizado com sucesso',
          description: 'Bem-vindo de volta!',
        });
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: 'Desconectado',
          description: 'Você saiu da sua conta',
        });
      }
    });

    // Then check for existing session
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      if (currentSession?.user) {
        setUser(currentSession.user);
        const userProfile = await fetchUserProfile(currentSession.user.id);
        setProfile(userProfile);
      }
      
      setIsLoading(false);
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao desconectar',
        description: 'Não foi possível sair da sua conta. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
