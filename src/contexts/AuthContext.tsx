
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  address: string | null;
  cpf_cnpj: string | null;
  profile_image: string | null;
  email_confirmed: boolean;
  created_at?: string;
  updated_at?: string;
  is_admin?: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

// Lista de emails de administradores - Adicione seu email aqui para ter acesso de administrador
// Domínio do site: berenice.ai
const ADMIN_EMAILS = ['admin@berenice.ai']; // Adicione seu email para ter acesso de administrador

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { toast } = useToast();

  const refreshProfile = async () => {
    try {
      if (!user) return;
      
      // Using type casting to handle the user_profiles table that exists in the database
      // but isn't properly reflected in the generated types
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      // Cast the response to our UserProfile type
      const userProfile = data as unknown as UserProfile;
      setProfile(userProfile);
      
      // Verificar se o usuário é um administrador
      if (user.email && ADMIN_EMAILS.includes(user.email)) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const setupAuth = async () => {
      setLoading(true);
      
      // Set up auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Verificar se o usuário é um administrador
          if (session?.user?.email && ADMIN_EMAILS.includes(session.user.email)) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
          
          // Fetch user profile with setTimeout to avoid deadlock
          if (session?.user) {
            setTimeout(() => {
              refreshProfile();
            }, 0);
          } else {
            setProfile(null);
          }
          
          if (event === 'SIGNED_IN') {
            toast({
              title: "Login realizado com sucesso",
              description: "Bem-vindo à Berenice!",
            });
          } else if (event === 'SIGNED_OUT') {
            toast({
              title: "Logout realizado",
              description: "Até logo!",
            });
          }
        }
      );
      
      // THEN check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      // Verificar se o usuário é um administrador
      if (session?.user?.email && ADMIN_EMAILS.includes(session.user.email)) {
        setIsAdmin(true);
      }
      
      if (session?.user) {
        await refreshProfile();
      }
      
      setLoading(false);
      
      return () => subscription.unsubscribe();
    };
    
    setupAuth();
  }, [toast]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
    refreshProfile,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
