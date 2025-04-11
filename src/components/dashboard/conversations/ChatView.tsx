
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatFeed } from '@/components/ChatFeed';
import { WhatsAppMessageSender } from '@/components/dashboard/WhatsAppMessageSender';

interface ChatViewProps {
  selectedContact: string | null;
  onMessageSent: () => void;
  formatPhoneNumber: (phone: string) => string;
}

export const ChatView: React.FC<ChatViewProps> = ({ 
  selectedContact, 
  onMessageSent,
  formatPhoneNumber
}) => {
  if (!selectedContact) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground p-4">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>Selecione uma conversa para visualizar as mensagens</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-160px)]">
      <div className="p-3 border-b flex justify-between items-center">
        <div>
          <p className="font-medium">{formatPhoneNumber(selectedContact)}</p>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="mx-3 my-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="info">Informações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 flex flex-col">
          <div className="flex-1">
            <ChatFeed phoneNumber={selectedContact} />
          </div>
          <div className="p-3 border-t">
            <WhatsAppMessageSender 
              phoneNumber={selectedContact} 
              onSendSuccess={onMessageSent}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="info" className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Número</dt>
                  <dd>{formatPhoneNumber(selectedContact)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Import missing components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from 'lucide-react';
