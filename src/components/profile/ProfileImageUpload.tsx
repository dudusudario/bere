
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileImageUploadProps {
  profileImage: string;
  fullName: string;
  onImageUpload: (file: File) => Promise<void>;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ 
  profileImage, 
  fullName, 
  onImageUpload 
}) => {
  const { toast } = useToast();
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!fullName) return "U";
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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
      await onImageUpload(file);
      
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
        <AvatarImage src={profileImage || ''} alt={fullName || 'Usuário'} />
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

export default ProfileImageUpload;
