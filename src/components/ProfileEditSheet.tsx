
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Upload, Phone } from 'lucide-react';

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

interface ProfileEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileEditSheet: React.FC<ProfileEditSheetProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Recupera o número de telefone do localStorage para inicializar o perfil
  const storedPhone = localStorage.getItem('userPhone') || '';
  
  // Para demonstração, usaremos dados mock
  const [profile, setProfile] = useState({
    full_name: 'Demo User',
    address: 'Sample Address',
    cpf_cnpj: '12345678901',
    profile_image: '',
    phone: storedPhone,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile.full_name || "",
      address: profile.address || "",
      cpf_cnpj: profile.cpf_cnpj || "",
      phone: profile.phone || "",
    },
  });

  // Atualiza o formulário quando os dados do perfil mudam
  useEffect(() => {
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
    try {
      setIsLoading(true);
      
      // Salva o número de telefone no localStorage
      localStorage.setItem('userPhone', data.phone);
      
      // Simula salvar os dados do perfil
      setTimeout(() => {
        setProfile({
          ...profile,
          full_name: data.full_name,
          address: data.address,
          cpf_cnpj: data.cpf_cnpj,
          phone: data.phone
        });
        
        toast({
          title: "Perfil atualizado",
          description: "Seus dados foram salvos com sucesso.",
        });
        
        setIsLoading(false);
        
        // Fecha o painel após atualização bem-sucedida
        onOpenChange(false);
      }, 1000);
      
    } catch (error: any) {
      toast({
        title: "Erro ao salvar perfil",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || !e.target.files[0]) return;
      const file = e.target.files[0];
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione uma imagem.');
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('A imagem deve ter menos de 5MB.');
      }
      
      setUploadingImage(true);
      
      // Simulate file upload
      setTimeout(() => {
        // Create a fake URL for demo purposes
        const fakeUrl = URL.createObjectURL(file);
        
        setProfile({
          ...profile,
          profile_image: fakeUrl
        });
        
        toast({
          title: "Imagem atualizada",
          description: "Sua foto de perfil foi atualizada com sucesso.",
        });
        
        setUploadingImage(false);
      }, 1500);
      
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar imagem",
        description: error.message,
        variant: "destructive",
      });
      setUploadingImage(false);
    }
  };
  
  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!profile?.full_name) return "U";
    return profile.full_name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar Perfil</SheetTitle>
          <SheetDescription>
            Atualize suas informações pessoais
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 py-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile?.profile_image || ''} alt={profile?.full_name || 'Usuário'} />
              <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
            </Avatar>
            
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2" 
                disabled={uploadingImage}
              >
                <Upload className="h-4 w-4" />
                {uploadingImage ? "Enviando..." : "Mudar foto"}
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={handleImageUpload}
                  accept="image/*"
                  disabled={uploadingImage}
                />
              </Button>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Seu número de telefone" 
                            {...field} 
                            className="pl-8"
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
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileEditSheet;
