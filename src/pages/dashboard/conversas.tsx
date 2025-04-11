
import React, { useState } from 'react';
import { ContactList } from '@/components/dashboard/conversations/ContactList';
import { ChatView } from '@/components/dashboard/conversations/ChatView';
import { WhatsGwIntegrationMessage } from '@/components/dashboard/conversations/WhatsGwIntegrationMessage';
import { useWhatsAppContacts } from '@/hooks/useWhatsAppContacts';
import { useWhatsGwStatus } from '@/hooks/useWhatsGwStatus';
import { formatPhoneNumber } from '@/utils/formatters';

const ConversasPage = () => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const { contacts, loading, searchTerm, setSearchTerm, refreshContacts } = useWhatsAppContacts();
  const { isWhatsGwEnabled } = useWhatsGwStatus();

  const handleContactSelect = (phoneNumber: string) => {
    setSelectedContact(phoneNumber);
  };

  const handleMessageSent = () => {
    // Recarregar contatos após envio de mensagem
    refreshContacts();
  };

  if (!isWhatsGwEnabled) {
    return <WhatsGwIntegrationMessage isWhatsGwEnabled={isWhatsGwEnabled} />;
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">Conversas WhatsApp</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ContactList
          contacts={contacts}
          loading={loading}
          searchTerm={searchTerm}
          selectedContact={selectedContact}
          onSearchChange={setSearchTerm}
          onContactSelect={handleContactSelect}
        />

        <div className="col-span-2 border rounded-md overflow-hidden">
          <ChatView 
            selectedContact={selectedContact} 
            onMessageSent={handleMessageSent}
            formatPhoneNumber={formatPhoneNumber}
          />
        </div>
      </div>
    </div>
  );
};

export default ConversasPage;
