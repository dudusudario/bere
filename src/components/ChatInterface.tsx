
import React, { useState, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import FileUpload from './FileUpload';
import TypingIndicator from './TypingIndicator';
import ProfileEditSheet from './ProfileEditSheet';
import { useChat } from '../hooks/chat';
import { Loader2, User, Phone } from 'lucide-react';
import { Button } from './ui/button';

const ChatInterface: React.FC = () => {
  const userPhone = localStorage.getItem('userPhone') || '';
  const [profileOpen, setProfileOpen] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  
  const {
    messages,
    isLoading,
    isLoadingHistory,
    selectedFiles,
    chatContainerRef,
    sendMessage,
    loadMessageHistory,
    handleFileChange,
    removeFile,
    clearFiles,
    toggleFavorite,
    copyMessageToClipboard,
    deleteMessage
  } = useChat();

  useEffect(() => {
    const loadHistory = async () => {
      if (userPhone) {
        await loadMessageHistory(userPhone);
        setHistoryLoaded(true);
      } else {
        setHistoryLoaded(true); // Marca como carregado mesmo sem telefone
      }
    };
    
    loadHistory();
  }, [userPhone, loadMessageHistory]);

  // Função para enviar mensagem com o número de telefone
  const handleSendMessage = async (content: string) => {
    // Enviamos o número de telefone e o conteúdo separadamente
    await sendMessage(content, userPhone);
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Profile button */}
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
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => setProfileOpen(true)}
        >
          <User className="h-4 w-4" />
          <span>Perfil</span>
        </Button>
        <ProfileEditSheet open={profileOpen} onOpenChange={setProfileOpen} />
      </div>

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

      <div className="border-t p-4 bg-background">
        <FileUpload
          selectedFiles={selectedFiles}
          onFileChange={handleFileChange}
          onRemove={removeFile}
          onClear={clearFiles}
        />
        <MessageInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
