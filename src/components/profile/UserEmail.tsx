
import React from 'react';
import { Mail } from 'lucide-react';

interface UserEmailProps {
  email?: string;
}

const UserEmail: React.FC<UserEmailProps> = ({ email }) => {
  return (
    <div className="space-y-1 border p-3 rounded-md bg-muted/50">
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm font-medium">Email</p>
      </div>
      <p className="text-sm text-muted-foreground pl-6">{email}</p>
    </div>
  );
};

export default UserEmail;
