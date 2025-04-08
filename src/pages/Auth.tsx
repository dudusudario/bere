
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
});

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check for existing session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate('/chat');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth event:", event);
        console.log("Session:", session);
        setSession(session);
        if (session) {
          navigate('/chat');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      console.log("Attempting login with email:", values.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error('Login error:', error);
        let errorMessage = 'Ocorreu um erro. Tente novamente.';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos. Verifique suas credenciais.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Por favor, verifique sua caixa de entrada.';
        }
        
        toast({
          variant: 'destructive',
          title: 'Erro no login',
          description: errorMessage,
        });
        throw error;
      }

      console.log("Login successful:", data);
      toast({
        title: 'Login bem-sucedido',
        description: 'Bem-vindo de volta!',
      });
      
      // Navegação é feita automaticamente pelo listener de autenticação
    } catch (error) {
      console.error('Login error:', error);
      // Mensagem de erro já exibida no bloco de tratamento acima
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      setIsLoading(true);
      console.log("Attempting registration with email:", values.email);
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.name,
          },
        }
      });

      if (error) {
        console.error('Registration error:', error);
        let errorMessage = 'Ocorreu um erro. Tente novamente.';
        
        if (error.message.includes('User already registered')) {
          errorMessage = 'Este email já está registrado. Tente fazer login.';
          setActiveTab('login');
        } else if (error.message.includes('password')) {
          errorMessage = 'A senha não atende aos requisitos mínimos de segurança.';
        } else if (error.message.includes('validation')) {
          errorMessage = 'Formato de email inválido.';
        }
        
        toast({
          variant: 'destructive',
          title: 'Erro no registro',
          description: errorMessage,
        });
        throw error;
      }

      console.log("Registration response:", data);
      
      if (data.user?.identities?.length === 0) {
        toast({
          title: 'Email já cadastrado',
          description: 'Você já tem uma conta. Tente fazer login.',
        });
        setActiveTab('login');
      } else {
        toast({
          title: 'Registro bem-sucedido',
          description: 'Sua conta foi criada! Verifique seu email para confirmar o cadastro.',
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Mensagem de erro já exibida no bloco de tratamento acima
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      console.log("Iniciando processo de login com Google...");
      
      // Usar a URL atual para determinar o redirecionamento
      const redirectTo = new URL('/chat', window.location.origin).toString();
      console.log("URL de redirecionamento:", redirectTo);
      
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
        console.error('Google login error:', error);
        toast({
          variant: 'destructive',
          title: 'Erro no login com Google',
          description: error.message || 'Ocorreu um erro. Tente novamente.',
        });
        throw error;
      }
      
      console.log("Google login initiated:", data);
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        variant: 'destructive',
        title: 'Erro no login com Google',
        description: 'Ocorreu um erro ao conectar com o Google. Verifique sua conexão ou tente novamente mais tarde.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 flex items-center" 
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Berenice</h1>
          <p className="text-muted-foreground">Sua assistente pessoal inteligente</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo(a)</CardTitle>
            <CardDescription>Faça login ou crie sua conta para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGoogleLogin} 
                disabled={isLoading} 
                className="w-full flex items-center justify-center"
              >
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                {isLoading ? 'Conectando...' : 'Continuar com Google'}
              </Button>
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            <Tabs 
              defaultValue="login" 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastro</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-4">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="******" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register" className="mt-4">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="******" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Criando conta...' : 'Criar conta'}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
