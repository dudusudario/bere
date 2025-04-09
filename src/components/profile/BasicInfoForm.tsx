
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { User, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const profileFormSchema = z.object({
  full_name: z.string().min(3, "Nome completo deve ter pelo menos 3 caracteres"),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  cpf_cnpj: z.string().min(11, "CPF/CNPJ deve ter pelo menos 11 caracteres"),
  phone: z.string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .refine((val) => /^\d+$/.test(val), {
      message: "O telefone deve conter apenas números",
    }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface BasicInfoFormProps {
  profile: {
    full_name?: string;
    address?: string;
    cpf_cnpj?: string;
    phone?: string;
  };
  userId?: string;
  onProfileUpdate: (updatedProfile: Partial<ProfileFormValues>) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ profile, userId, onProfileUpdate }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      address: profile?.address || "",
      cpf_cnpj: profile?.cpf_cnpj || "",
      phone: profile?.phone || "",
    },
  });
  
  // Update form when profile data changes
  React.useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || "",
        address: profile.address || "",
        cpf_cnpj: profile.cpf_cnpj || "",
        phone: profile.phone || "",
      });
    }
  }, [profile, form]);
  
  const onSubmit = async (data: ProfileFormValues) => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      
      // Salvar o número de telefone no localStorage
      localStorage.setItem('userPhone', data.phone);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: data.full_name,
          address: data.address,
          cpf_cnpj: data.cpf_cnpj,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update parent component state
      onProfileUpdate({
        full_name: data.full_name,
        address: data.address,
        cpf_cnpj: data.cpf_cnpj,
        phone: data.phone
      });
      
      toast({
        title: "Perfil atualizado",
        description: "Seus dados foram salvos com sucesso.",
      });
      
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Seu nome completo" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Seu número de telefone" 
                    className="pl-10" 
                    {...field}
                    type="tel"
                  />
                </div>
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
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </Form>
  );
};

export default BasicInfoForm;
