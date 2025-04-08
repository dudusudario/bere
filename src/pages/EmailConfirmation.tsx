
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const EmailConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [email, setEmail] = React.useState<string | null>(null);
  
  // Try to get the user's email from localStorage or session
  useEffect(() => {
    const storedEmail = localStorage.getItem('pendingConfirmationEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email in storage, check if there's an active session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setEmail(session.user.email);
          setIsConfirmed(true);
        }
      });
    }
  }, []);
  
  // Checks if the user has already been redirected here by email confirmation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('confirmed') && params.get('confirmed') === 'true') {
      setIsConfirmed(true);
      toast({
        title: "Email confirmado",
        description: "Seu email foi confirmado com sucesso.",
      });
      
      // Remove from localStorage as it's no longer pending
      localStorage.removeItem('pendingConfirmationEmail');
    }
  }, [toast]);
  
  const handleContinueToApp = () => {
    navigate('/chat');
  };
  
  const handleResendEmail = async () => {
    if (!email) return;
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Email reenviado",
        description: "Verifique sua caixa de entrada e pasta de spam.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao reenviar email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full">
            {isConfirmed ? (
              <CheckCircle className="h-8 w-8 text-green-500" />
            ) : (
              <Mail className="h-8 w-8 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight mt-4">
            {isConfirmed ? "Email Confirmado" : "Confirme seu Email"}
          </CardTitle>
          <CardDescription>
            {isConfirmed 
              ? "Seu email foi verificado com sucesso."
              : `Enviamos um email para ${email || "seu endereço de email"}.\nPor favor confirme para continuar.`
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!isConfirmed && (
            <div className="bg-muted p-4 rounded-lg text-sm">
              <p className="mb-2 font-medium">Verifique sua caixa de entrada e spam</p>
              <p>Clique no link de confirmação no email que enviamos para você.</p>
              
              <Button 
                variant="outline" 
                className="w-full mt-4" 
                onClick={handleResendEmail}
                disabled={isLoading}
              >
                {isLoading ? "Reenviando..." : "Reenviar email de confirmação"}
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            variant="default" 
            className="w-full"
            onClick={handleContinueToApp}
          >
            {isConfirmed ? "Continuar para o app" : "Continuar sem confirmar"}
          </Button>
          
          {!isConfirmed && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Você pode usar o aplicativo agora, mas algumas funcionalidades podem estar limitadas até a confirmação do email.
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailConfirmation;
