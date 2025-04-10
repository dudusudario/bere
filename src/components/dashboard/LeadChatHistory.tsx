
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LeadChatHistoryProps {
  chatHistory: any[];
  isLoading: boolean;
}

export const LeadChatHistory: React.FC<LeadChatHistoryProps> = ({
  chatHistory,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span>Carregando histórico...</span>
      </div>
    );
  }

  if (chatHistory.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma conversa encontrada para este lead.
      </div>
    );
  }

  const renderMessage = (message: any) => {
    if (!message || !message.message) return null;
    
    try {
      // Extract the content based on the message structure
      const messageContent = Array.isArray(message.message) 
        ? message.message.map((m: any) => m.content || '').join('\n') 
        : typeof message.message === 'object' && message.message.content 
          ? message.message.content 
          : JSON.stringify(message.message);

      return messageContent;
    } catch (error) {
      console.error('Error parsing message:', error);
      return 'Formato de mensagem não suportado';
    }
  };

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {chatHistory.map((chat, index) => (
          <Card key={index} className="border">
            <CardContent className="p-4">
              <div className="mb-2">
                <span className="text-sm font-medium">Sessão: </span>
                <span className="text-sm text-muted-foreground">{chat.session_id}</span>
              </div>
              <div className="whitespace-pre-wrap text-sm">
                {renderMessage(chat)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
