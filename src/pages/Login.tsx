
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { LogIn, Phone, ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira seu número de telefone.",
        variant: "destructive",
      });
      return;
    }
    
    // Validação simples de formato de telefone brasileiro
    const phoneRegex = /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast({
        title: "Formato inválido",
        description: "Por favor, insira um número de telefone válido (ex: 11 99999-9999).",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simular processo de login
    setTimeout(() => {
      // Salvar o número de telefone no localStorage para uso posterior
      localStorage.setItem('userPhone', phoneNumber);
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo à Berenice!",
      });
      
      navigate('/chat');
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    
    // Simular processo de login com Google
    setTimeout(() => {
      // Para fins de demonstração, vamos atribuir um número de telefone fictício 
      // quando o usuário faz login com o Google
      const googleUserPhone = "+55 11 98765-4321";
      localStorage.setItem('userPhone', googleUserPhone);
      
      toast({
        title: "Login com Google realizado com sucesso",
        description: "Bem-vindo à Berenice!",
      });
      
      navigate('/chat');
      setIsLoading(false);
    }, 1000);
    
    // Nota: Aqui seria implementada a autenticação real com Google
    // Usando a API do Google para autenticação
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Button>
            <div></div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight mt-4">Berenice</CardTitle>
          <CardDescription>
            Sua assistente pessoal personalizada
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handlePhoneLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Número de telefone</Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Digite seu número de telefone para continuar.
              </p>
            </div>
            
            <Button className="w-full" type="submit" disabled={isLoading}>
              <Phone className="mr-2 h-4 w-4" />
              {isLoading ? "Entrando..." : "Entrar com Telefone"}
            </Button>
            
            <div className="flex items-center justify-between">
              <div className="bg-border h-[1px] flex-grow"></div>
              <span className="px-4 text-xs text-muted-foreground">OU</span>
              <div className="bg-border h-[1px] flex-grow"></div>
            </div>
            
            <Button 
              className="w-full" 
              type="button" 
              variant="outline" 
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" width="16" height="16">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              {isLoading ? "Processando..." : "Entrar com Google"}
            </Button>
            
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default Login;
