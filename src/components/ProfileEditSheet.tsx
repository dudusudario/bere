
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import ProfileImageUpload from '@/components/profile/ProfileImageUpload';
import ProfileFormFields, { ProfileFormValues } from '@/components/profile/ProfileFormFields';

interface ProfileEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileEditSheet: React.FC<ProfileEditSheetProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
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

  const handleProfileFormSubmit = async (data: ProfileFormValues) => {
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

  const handleImageUpload = async (file: File) => {
    try {
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
      }, 1500);
      
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar imagem",
        description: error.message,
        variant: "destructive",
      });
    }
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
          {/* Profile Image Section */}
          <ProfileImageUpload 
            profileImage={profile.profile_image}
            fullName={profile.full_name}
            onImageUpload={handleImageUpload}
          />
          
          <div className="border-t pt-4">
            <ProfileFormFields 
              defaultValues={{
                full_name: profile.full_name,
                address: profile.address,
                cpf_cnpj: profile.cpf_cnpj,
                phone: profile.phone
              }}
              onSubmit={handleProfileFormSubmit}
              onCancel={() => onOpenChange(false)}
              isLoading={isLoading}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileEditSheet;
