import React, { useRef, useEffect } from 'react';
import { useMessages, Message } from '@/hooks/useMessages';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { formatDisplayTimestamp } from '@/utils/dateFormatter';

interface ChatFeedProps {
  phoneNumber?: string;
}

export const ChatFeed: React.FC<ChatFeedProps> = ({ phoneNumber }) => {
  const { messages, isLoading, error } = useMessages(phoneNumber);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      toast.error("Erro ao carregar mensagens");
    }
  }, [error]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const renderMessage = (message: Message) => {
    const isUser = message.origem === 'user';
    
    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-[80%] rounded-lg p-3 ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          <div className="text-xs font-medium mb-1">
            {isUser ? 'Você' : 'Agente'}:
          </div>
          <div className="text-sm mb-1 whitespace-pre-wrap">{message.mensagem}</div>
          <div className="text-xs opacity-70 text-right">
            {formatDisplayTimestamp(message.timestamp)}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-12 w-2/3 ml-auto" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-12 w-2/3 ml-auto" />
      </div>
    );
  }

  if (!phoneNumber) {
    return (
      <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>Você precisa configurar seu número de telefone para conversar com o agente.</p>
          <p className="text-sm mt-2">Clique no botão "Perfil" acima para configurar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-center text-muted-foreground">
          <p>Nenhuma mensagem encontrada. Envie uma mensagem para iniciar a conversa.</p>
        </div>
      ) : (
        <>
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default ChatFeed;
