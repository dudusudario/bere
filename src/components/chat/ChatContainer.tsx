
import React from 'react';
import { Loader2 } from 'lucide-react';
import ChatMessage from '../ChatMessage';
import TypingIndicator from '../TypingIndicator';
import { Message } from '../../hooks/chat/types';

interface ChatContainerProps {
  chatContainerRef: React.RefObject<HTMLDivElement>;
  isLoadingHistory: boolean;
  historyLoaded: boolean;
  messages: Message[];
  isLoading: boolean;
  toggleFavorite: (messageId: string) => void;
  copyMessageToClipboard: (messageId: string) => void;
  handleDeleteMessage: (messageId: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  chatContainerRef,
  isLoadingHistory,
  historyLoaded,
  messages,
  isLoading,
  toggleFavorite,
  copyMessageToClipboard,
  handleDeleteMessage
}) => {
  return (
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
    >
      {isLoadingHistory && !historyLoaded ? (
        <div className="flex items-center justify-center h-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Carregando histórico...</span>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
          <p className="mb-2">Bem-vindo à sua assistente pessoal!</p>
          <p>Envie uma mensagem para iniciar a conversa.</p>
        </div>
      ) : (
        messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onToggleFavorite={() => toggleFavorite(message.id)}
            onCopyToClipboard={() => copyMessageToClipboard(message.id)}
            onDelete={() => handleDeleteMessage(message.id)}
          />
        ))
      )}
      {isLoading && <TypingIndicator />}
    </div>
  );
};

export default ChatContainer;
