
import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface ChatHeaderProps {
  userPhone: string;
  onOpenProfile: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ userPhone, onOpenProfile }) => {
  return (
    <div className="border-b p-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold">Chat Assistant</h1>
        {userPhone ? (
          <div className="text-sm text-muted-foreground">Connected as: {userPhone}</div>
        ) : (
          <div className="text-sm text-red-500">
            No phone number set. Please update your profile.
          </div>
        )}
      </div>
      <Button variant="ghost" size="icon" onClick={onOpenProfile} title="Edit Profile">
        <User className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatHeader;
