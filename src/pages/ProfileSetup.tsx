
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const profileFormSchema = z.object({
  full_name: z.string().min(3, "Nome completo deve ter pelo menos 3 caracteres"),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  cpf_cnpj: z.string().min(11, "CPF/CNPJ deve ter pelo menos 11 caracteres"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Mock user and profile since we removed auth context
  const user = { id: '1' };
  const profile = {
    full_name: '',
    address: '',
    cpf_cnpj: '',
  };
  
  const defaultValues: Partial<ProfileFormValues> = {
    full_name: profile?.full_name || "",
    address: profile?.address || "",
    cpf_cnpj: profile?.cpf_cnpj || "",
  };
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });
  
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true);
      
      // In a real app, we would save to Supabase here
      // Since auth is removed, simulate success and navigate
      
      setTimeout(() => {
        toast({
          title: "Perfil atualizado",
          description: "Seus dados foram salvos com sucesso.",
        });
        
        navigate('/chat');
      }, 1000);
      
    } catch (error: any) {
      toast({
        title: "Erro ao salvar perfil",
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
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Complete seu perfil</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para personalizar sua experiência
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu endereço completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cpf_cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF ou CNPJ</FormLabel>
                    <FormControl>
                      <Input placeholder="Apenas números" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar perfil"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ProfileSetup;
