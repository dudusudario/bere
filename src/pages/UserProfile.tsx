
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Upload } from 'lucide-react';

const profileFormSchema = z.object({
  full_name: z.string().min(3, "Nome completo deve ter pelo menos 3 caracteres"),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  cpf_cnpj: z.string().min(11, "CPF/CNPJ deve ter pelo menos 11 caracteres"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Mock user and profile data since we removed auth
  const user = { 
    id: '1',
    email: 'user@example.com' 
  };
  
  const [profile, setProfile] = useState({
    full_name: 'Demo User',
    address: 'Sample Address',
    cpf_cnpj: '12345678901',
    profile_image: ''
  });
  
  // Mock refresh profile function
  const refreshProfile = async () => {
    // This would fetch the latest profile data in a real app
    console.log('Profile refreshed');
  };
  
  // Mock sign out function
  const signOut = async () => {
    navigate('/');
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
  
  // Update form when profile data changes
  React.useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || "",
        address: profile.address || "",
        cpf_cnpj: profile.cpf_cnpj || "",
      });
    }
  }, [profile, form]);
  
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true);
      
      // Simulate saving profile data
      setTimeout(() => {
        setProfile({
          ...profile,
          full_name: data.full_name,
          address: data.address,
          cpf_cnpj: data.cpf_cnpj
        });
        
        toast({
          title: "Perfil atualizado",
          description: "Seus dados foram salvos com sucesso.",
        });
        
        setIsLoading(false);
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
  
  const handleSignOut = async () => {
    navigate('/');
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
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/chat')}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para o chat
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
          >
            Sair
          </Button>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Seu perfil</CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
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
            
            {/* Email display */}
            <div className="space-y-1">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
