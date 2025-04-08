
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import FileUpload from './FileUpload';
import TypingIndicator from './TypingIndicator';
import { useChat, type Message, type FilePreview } from '../hooks/useChat';

const ChatInterface: React.FC = () => {
  const userPhone = localStorage.getItem('userPhone') || '';
  
  const {
    messages,
    isLoading,
    selectedFiles,
    chatContainerRef,
    sendMessage,
    handleFileChange,
    removeFile,
    clearFiles,
    toggleFavorite,
    copyMessageToClipboard
  } = useChat();

  // Função para enviar mensagem com o número de telefone
  const handleSendMessage = async (content: string) => {
    // Adicionar o número de telefone ao conteúdo ou como metadado
    // Você pode adaptar isso conforme a necessidade do seu backend
    await sendMessage(`[Telefone: ${userPhone}] ${content}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onToggleFavorite={() => toggleFavorite(message.id)}
            onCopyToClipboard={() => copyMessageToClipboard(message.id)}
          />
        ))}
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
