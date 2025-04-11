
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MessageSquare } from 'lucide-react';

interface Contact {
  phoneNumber: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

interface ContactListProps {
  contacts: Contact[];
  loading: boolean;
  searchTerm: string;
  selectedContact: string | null;
  onSearchChange: (value: string) => void;
  onContactSelect: (phoneNumber: string) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  loading,
  searchTerm,
  selectedContact,
  onSearchChange,
  onContactSelect
}) => {
  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
    }
    return phone;
  };

  const formatMessagePreview = (message: string) => {
    return message.length > 35 ? message.substring(0, 35) + '...' : message;
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Hoje: mostrar hora
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      // Dias da semana
      const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      return days[timestamp.getDay()];
    } else {
      // Data completa para mensagens mais antigas
      return timestamp.toLocaleDateString();
    }
  };

  return (
    <div className="col-span-1 border rounded-md overflow-hidden">
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar contato..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-y-auto h-[calc(100vh-250px)]">
        {loading ? (
          <div className="p-4 text-center">Carregando contatos...</div>
        ) : contacts.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            Nenhum contato encontrado
          </div>
        ) : (
          contacts.map(contact => (
            <div
              key={contact.phoneNumber}
              className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50 ${
                selectedContact === contact.phoneNumber ? 'bg-muted' : ''
              }`}
              onClick={() => onContactSelect(contact.phoneNumber)}
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <p className="font-medium truncate">{formatPhoneNumber(contact.phoneNumber)}</p>
                  <span className="text-xs text-muted-foreground">{formatTimestamp(contact.timestamp)}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {formatMessagePreview(contact.lastMessage)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
