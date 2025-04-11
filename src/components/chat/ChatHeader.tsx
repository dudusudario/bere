
import React from 'react';
import { Button } from '../ui/button';
import { Phone, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatHeaderProps {
  userPhone: string;
  isWhatsGWEnabled: boolean;
  onOpenProfile: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  userPhone, 
  isWhatsGWEnabled,
  onOpenProfile 
}) => {
  const navigate = useNavigate();

  const goToWebhookConfig = () => {
    navigate('/admin');
  };

  return (
    <div className="flex justify-between p-2 border-b">
      {userPhone ? (
        <div className="flex items-center text-sm text-muted-foreground">
          <Phone className="h-3 w-3 mr-1" />
          <span>{userPhone}</span>
        </div>
      ) : (
        <div className="flex items-center text-sm text-destructive">
          <Phone className="h-3 w-3 mr-1" />
          <span>Configure seu telefone no perfil</span>
        </div>
      )}
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={goToWebhookConfig}
        >
          <Settings className="h-4 w-4" />
          <span>{isWhatsGWEnabled ? "WhatsApp" : "Webhooks"}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={onOpenProfile}
        >
          <User className="h-4 w-4" />
          <span>Perfil</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
