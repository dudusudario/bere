
import React, { useEffect } from 'react';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import useChat from '@/hooks/useChat';

const ChatInterface: React.FC = () => {
  const {
    messages,
    isLoading,
    selectedFiles,
    chatContainerRef,
    sendMessage,
    handleFileChange,
    removeFile,
    toggleFavorite,
    copyMessageToClipboard
  } = useChat();
  
  useEffect(() => {
    // Add welcome message if no messages exist
    if (messages.length === 0) {
      setTimeout(() => {
        sendMessage("Olá! Sou sua assistente de carreira pessoal. Como posso ajudar com sua trajetória profissional hoje? Compartilhe suas metas, dúvidas ou desafios.");
      }, 500);
    }
  }, []);
  
  return (
    <div className="chat-container">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col"
      >
        {messages.map((message, index) => (
          <ChatMessage 
            key={message.id}
            message={message}
            toggleFavorite={toggleFavorite}
            copyMessage={copyMessageToClipboard}
            // Only show typing animation for AI messages that are not the welcome message
            showTypingAnimation={message.sender === 'ai' && index !== 0}
          />
        ))}
        
        {isLoading && <TypingIndicator />}
      </div>
      
      <MessageInput 
        onSendMessage={sendMessage}
        isLoading={isLoading}
        selectedFiles={selectedFiles}
        handleFileChange={handleFileChange}
        removeFile={removeFile}
      />
    </div>
  );
};

export default ChatInterface;
