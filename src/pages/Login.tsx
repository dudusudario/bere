
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const Login: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
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
      
      navigate('/');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Berenice</CardTitle>
          <CardDescription>
            Sua assistente pessoal personalizada
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
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
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
