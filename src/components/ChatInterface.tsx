
import React, { useState, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import FileUpload from './FileUpload';
import TypingIndicator from './TypingIndicator';
import ProfileEditSheet from './ProfileEditSheet';
import { useChat } from '../hooks/chat';
import { Loader2, User, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { sendToN8n } from '../utils/sendToN8n';
import ChatFeed from './ChatFeed';
import { toast } from 'sonner';

const ChatInterface: React.FC = () => {
  const userPhone = localStorage.getItem('userPhone') || '';
  const [profileOpen, setProfileOpen] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  // Define a constant for webhook enabled status
  const isWebhookEnabled = true; // Set to true to enable webhook functionality
  
  const {
    messages,
    isLoading,
    isLoadingHistory,
    selectedFiles,
    chatContainerRef,
    sendMessage: originalSendMessage,
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
        setHistoryLoaded(true); // Mark as loaded even without a phone number
      }
    };
    
    loadHistory();
  }, [userPhone, loadMessageHistory]);

  // Function to send message with phone number
  const handleSendMessage = async (content: string) => {
    if (!userPhone) {
      toast.error("Por favor, configure seu telefone no perfil primeiro");
      return;
    }
    
    // Set loading state
    setSendingMessage(true);
    
    try {
      // First register the message in the original system for compatibility
      await originalSendMessage(content, userPhone);
      
      // Then send to n8n via webhook
      await sendToN8n({
        username: userPhone, // Use phone as user identifier
        numero: userPhone,
        mensagem: content
      });
      
      // Message sent successfully
      toast.success("Mensagem enviada com sucesso");
    } catch (error) {
      console.error("Error sending message to n8n:", error);
      toast.error("Erro ao enviar mensagem para o agente");
    } finally {
      setSendingMessage(false);
    }
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

      {isWebhookEnabled ? (
        /* New feed of messages via webhook */
        <ChatFeed phoneNumber={userPhone} />
      ) : (
        /* Feed de mensagens original */
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
      )}

      <div className="border-t p-4 bg-background">
        <FileUpload
          selectedFiles={selectedFiles}
          onFileChange={handleFileChange}
          onRemove={removeFile}
          onClear={clearFiles}
        />
        <MessageInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading || sendingMessage}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
