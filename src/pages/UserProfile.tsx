
import React, { useState, useEffect } from 'react';
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
import { ArrowLeft, Upload, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import PasswordChangeSection from '@/components/profile/PasswordChangeSection';

const profileFormSchema = z.object({
  full_name: z.string().min(3, "Nome completo deve ter pelo menos 3 caracteres"),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  cpf_cnpj: z.string().min(11, "CPF/CNPJ deve ter pelo menos 11 caracteres"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    address: '',
    cpf_cnpj: '',
    profile_image: ''
  });
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setProfile({
            full_name: data.full_name || '',
            address: data.address || '',
            cpf_cnpj: data.cpf_cnpj || '',
            profile_image: data.profile_image || ''
          });
        }
      } catch (error: any) {
        console.error('Erro ao buscar perfil:', error);
        toast({
          title: "Erro ao carregar perfil",
          description: error.message,
          variant: "destructive",
        });
      }
    };
    
    fetchUserProfile();
  }, [user, toast]);
  
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
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: data.full_name,
          address: data.address,
          cpf_cnpj: data.cpf_cnpj,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
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
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!user || !e.target.files || !e.target.files[0]) return;
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
      
      // Upload image to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile_images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const publicUrl = urlData.publicUrl;
      
      // Update profile with new image URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ profile_image: publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      setProfile({
        ...profile,
        profile_image: publicUrl
      });
      
      toast({
        title: "Imagem atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
      
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar imagem",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!profile?.full_name) return user?.email?.charAt(0).toUpperCase() || "U";
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna 1: Perfil e Informações Básicas */}
          <Card className="col-span-1 md:col-span-2">
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
              <div className="space-y-1 border p-3 rounded-md bg-muted/50">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Email</p>
                </div>
                <p className="text-sm text-muted-foreground pl-6">{user?.email}</p>
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
          
          {/* Coluna 2: Segurança e Configurações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Segurança</CardTitle>
              <CardDescription>
                Altere sua senha e configure opções de segurança
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <PasswordChangeSection />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
