import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { ArrowLeft } from 'lucide-react';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/chat');
    }
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: '',
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: 'Cadastro realizado com sucesso!',
        description: 'Verifique seu email para confirmar o cadastro.',
      });
      
      // Para fins de teste, poderíamos redirecionar diretamente,
      // mas em produção, devemos esperar pela confirmação de email
      setActiveTab('login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro no cadastro',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      navigate('/chat');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro no login',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/chat`
        }
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro no login com Google',
        description: error.message,
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute top-4 left-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Bem-vindo!</CardTitle>
          <CardDescription>
            Entre ou crie sua conta para continuar
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    {/* TO-DO: Implementar recuperação de senha */}
                    <Button variant="link" className="px-0" type="button">
                      Esqueceu a senha?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Criando conta..." : "Criar conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full flex gap-2 items-center justify-center"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5453 8.12698C15.5453 7.54206 15.4975 6.96825 15.3941 6.40873H8.13965V9.35317H12.2956C12.1208 10.3038 11.5757 11.1328 10.7786 11.6587V13.5683H13.3031C14.7646 12.2143 15.5453 10.3437 15.5453 8.12698Z" fill="#4285F4"/>
              <path d="M8.13965 16C10.2563 16 12.0531 15.2851 13.3057 13.5683L10.7812 11.6587C10.0876 12.1328 9.19584 12.3969 8.14197 12.3969C6.09298 12.3969 4.35361 11.0349 3.74409 9.19841H1.14258V11.1619C2.4233 14.1233 5.23242 16 8.13965 16Z" fill="#34A853"/>
              <path d="M3.74177 9.19841C3.40222 8.24127 3.40222 7.20106 3.74177 6.24391V4.28042H1.14258C-0.10799 6.47407 -0.10799 8.96825 1.14258 11.1619L3.74177 9.19841Z" fill="#FBBC05"/>
              <path d="M8.13965 3.60314C9.26769 3.58862 10.3562 4.02469 11.183 4.81693L13.4221 2.57778C11.9886 1.23175 10.0945 0.504989 8.13965 0.523804C5.23242 0.523804 2.4233 2.40053 1.14258 5.36243L3.74177 7.32593C4.34896 5.4873 6.09066 4.12698 8.13965 4.12698V3.60314Z" fill="#EA4335"/>
            </svg>
            Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
