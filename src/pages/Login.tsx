
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/use-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar se o usuário já está autenticado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log("Usuário já autenticado, redirecionando para o chat");
        navigate('/chat');
      }
    }).catch(error => {
      console.error("Erro ao verificar sessão:", error);
    });

    // Monitorar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Evento de mudança de estado de autenticação:", event);
      if (session) {
        console.log("Sessão de usuário detectada, redirecionando para o chat");
        navigate('/chat');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      console.log("Iniciando processo de login com Google...");
      
      // Usar exatamente a URL que você configurou no Google Console
      const redirectTo = 'https://www.berenice.ai/chat';
      console.log("URL de redirecionamento configurada:", redirectTo);
      console.log("URL atual:", window.location.href);
      console.log("Origem:", window.location.origin);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error('Erro no login com Google:', error);
        toast({
          variant: 'destructive',
          title: 'Erro no login com Google',
          description: error.message || 'Ocorreu um erro. Tente novamente.',
        });
        throw error;
      }
      
      console.log("Login com Google iniciado com sucesso:", data);
    } catch (error) {
      console.error('Erro no login com Google:', error);
      toast({
        variant: 'destructive',
        title: 'Erro no login com Google',
        description: error.message || 'Ocorreu um erro. Tente novamente.',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Berenice</h1>
        <p className="text-muted-foreground mb-8">Sua assistente pessoal inteligente</p>
        
        <Button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center mb-4 shadow-lg"
          variant="outline"
        >
          <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg>
          Entrar com Google
        </Button>
        
        <Button 
          onClick={() => navigate('/auth')}
          variant="default"
          className="w-full"
        >
          Entrar com Email
        </Button>
        
        <Button 
          variant="ghost" 
          className="mt-4" 
          onClick={() => navigate('/')}
        >
          Voltar à Página Inicial
        </Button>
      </div>
    </div>
  );
};

export default Login;
