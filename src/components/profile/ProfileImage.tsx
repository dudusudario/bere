
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProfileImageProps {
  profile: {
    full_name?: string;
    profile_image?: string;
  };
  userId?: string;
  onProfileUpdate: (newImage: string) => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ profile, userId, onProfileUpdate }) => {
  const { toast } = useToast();
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!userId || !e.target.files || !e.target.files[0]) return;
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
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
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
        .eq('id', userId);
        
      if (updateError) throw updateError;
      
      // Call callback to update parent component state
      onProfileUpdate(publicUrl);
      
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

  return (
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
  );
};

export default ProfileImage;
