
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

// Import the new component files
import ProfileImage from '@/components/profile/ProfileImage';
import BasicInfoForm from '@/components/profile/BasicInfoForm';
import UserEmail from '@/components/profile/UserEmail';
import SecuritySection from '@/components/profile/SecuritySection';
import ProfileCard from '@/components/profile/ProfileCard';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  
  // Recuperar o número de telefone do localStorage
  const storedPhone = localStorage.getItem('userPhone') || '';
  
  const [profile, setProfile] = useState({
    full_name: '',
    address: '',
    cpf_cnpj: '',
    profile_image: '',
    phone: storedPhone
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
            profile_image: data.profile_image || '',
            phone: storedPhone || '' // Use phone from localStorage
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
  }, [user, toast, storedPhone]);
  
  const handleProfileUpdate = (updatedProfile: Partial<typeof profile>) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
  };
  
  const handleSignOut = async () => {
    await signOut();
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
        <div className="grid grid-cols-1 gap-6">
          <ProfileCard 
            title="Seu perfil" 
            description="Gerencie suas informações pessoais"
          >
            {/* Profile Image Section */}
            <ProfileImage 
              profile={profile} 
              userId={user?.id} 
              onProfileUpdate={(newImage) => handleProfileUpdate({ profile_image: newImage })} 
            />
            
            {/* Email Section */}
            <UserEmail email={user?.email} />
            
            {/* Profile Form */}
            <div className="border-t pt-4">
              <BasicInfoForm 
                profile={profile}
                userId={user?.id}
                onProfileUpdate={handleProfileUpdate}
              />
            </div>
            
            {/* Security Section */}
            <SecuritySection />
          </ProfileCard>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
