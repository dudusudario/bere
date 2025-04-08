
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const EmailConfirmation: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  
  // This is a placeholder for the actual email confirmation flow
  // In a real implementation, you'd use Supabase's built-in email confirmation
  const simulateEmailConfirmation = async () => {
    try {
      setIsLoading(true);
      
      // Update the user profile to mark email as confirmed using type casting
      const { error } = await supabase
        .from('user_profiles')
        .update({ email_confirmed: true } as any)
        .eq('id', user?.id);
        
      if (error) throw error;
      
      // Refresh the profile to get the updated data
      await refreshProfile();
      
      toast({
        title: "Email confirmado",
        description: "Seu email foi confirmado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao confirmar email",
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
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight mt-4">Confirme seu Email</CardTitle>
          <CardDescription>
            Enviamos um email para {user?.email}.<br />
            Por favor confirme para continuar.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg text-sm text-center">
            <p className="mb-2 font-medium">Verifique sua caixa de entrada e spam</p>
            <p>Clique no link de confirmação no email que enviamos para você.</p>
          </div>
          
          {/* For demonstration purposes only */}
          <div className="border-t border-border pt-4 mt-4">
            <p className="text-xs text-muted-foreground text-center mb-2">
              Para fins de demonstração
            </p>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={simulateEmailConfirmation}
              disabled={isLoading || (profile?.email_confirmed ?? false)}
            >
              {profile?.email_confirmed 
                ? "Email já confirmado" 
                : isLoading 
                  ? "Confirmando..." 
                  : "Simular confirmação de email"}
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            Não recebeu o email? Verifique sua pasta de spam ou solicite um novo email.
          </p>
          <Button 
            variant="ghost" 
            className="text-primary hover:text-primary/80"
            disabled={isLoading}
          >
            Reenviar email de confirmação
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailConfirmation;
