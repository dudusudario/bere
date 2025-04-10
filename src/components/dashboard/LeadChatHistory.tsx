
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

  const renderMessageContent = (message: any) => {
    if (!message) return null;
    
    try {
      // Parse message content based on different message structures
      if (typeof message === 'string') {
        return message;
      } 
      
      if (Array.isArray(message)) {
        return message.map((m: any, i: number) => (
          <div key={i} className="mb-2">
            {m.content || (typeof m === 'string' ? m : JSON.stringify(m))}
          </div>
        ));
      }
      
      if (typeof message === 'object') {
        // Extract the role and content for OpenAI-style messages
        if (message.role && message.content) {
          return `${message.content}`;
        }
        
        // For object with content property
        if (message.content) {
          return message.content;
        }
        
        // For other objects, stringify them
        return JSON.stringify(message);
      }
      
      return String(message);
    } catch (error) {
      console.error('Error parsing message:', error);
      return 'Formato de mensagem não suportado';
    }
  };

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {chatHistory.map((chat, index) => {
          // Check if the message property exists and contains data
          if (!chat.message) {
            return null;
          }
          
          const messages = Array.isArray(chat.message) ? chat.message : [chat.message];
          
          return (
            <Card key={index} className="border">
              <CardContent className="p-4">
                <div className="mb-2">
                  <span className="text-sm font-medium">Conversa: </span>
                  <span className="text-sm text-muted-foreground">{chat.session_id}</span>
                </div>
                
                <div className="space-y-3">
                  {messages.map((msg: any, msgIndex: number) => {
                    const role = msg.role || (msg.sender === 'user' ? 'user' : 'assistant');
                    const isUser = role === 'user';
                    const content = renderMessageContent(isUser ? msg : msg.content);
                    
                    return (
                      <div 
                        key={msgIndex} 
                        className={`p-3 rounded-lg ${
                          isUser 
                            ? 'bg-blue-50 text-blue-800 ml-4' 
                            : 'bg-gray-50 text-gray-800 mr-4'
                        }`}
                      >
                        <div className="text-xs font-medium mb-1">
                          {isUser ? 'Lead' : 'Assistente'}:
                        </div>
                        <div className="whitespace-pre-wrap text-sm">{content}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
};
